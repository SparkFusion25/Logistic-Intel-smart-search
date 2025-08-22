-- Create New Shipper Alert System Tables

-- User settings for alert preferences
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  new_shipper_threshold_days integer DEFAULT 180,
  email_alerts boolean DEFAULT true,
  inapp_alerts boolean DEFAULT true,
  daily_digest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- New shipper alerts table
CREATE TABLE IF NOT EXISTS new_shipper_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  detected_at timestamptz DEFAULT now(),
  window_months integer DEFAULT 6,
  emailed boolean DEFAULT false,
  viewed boolean DEFAULT false,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Company activity table for materialized snapshots
CREATE TABLE IF NOT EXISTS company_activity (
  company_id uuid PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  last_shipment_at date,
  total_shipments_12m integer DEFAULT 0,
  trade_value_12m numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enhanced alerts table for all notification types
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  type text CHECK (type IN ('new_shipper', 'trade_lane_change', 'volume_spike')) NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  emailed_at timestamptz
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_new_shipper_alerts_user_detected ON new_shipper_alerts(user_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_activity_last_shipment ON company_activity(last_shipment_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_user_created ON alerts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type_created ON alerts(type, created_at DESC);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_shipper_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own alerts" ON new_shipper_alerts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Company activity is publicly readable" ON company_activity
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage company activity" ON company_activity
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own alerts" ON alerts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_activity_updated_at
  BEFORE UPDATE ON company_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();