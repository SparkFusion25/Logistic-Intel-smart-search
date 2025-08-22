import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </div>
          <p className="text-muted-foreground mb-4">Update your personal information and preferences</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Edit Profile
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <p className="text-muted-foreground mb-4">Configure email and push notifications</p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Manage Notifications
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <p className="text-muted-foreground mb-4">Password and two-factor authentication</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Security Settings
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <p className="text-muted-foreground mb-4">Theme and display preferences</p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
            Customize Theme
          </button>
        </div>
      </div>
    </div>
  );
}