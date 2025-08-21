import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CampaignBuilderProps {
  onSave: (campaign: any) => void;
}

export default function CampaignBuilder({ onSave }: CampaignBuilderProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [steps, setSteps] = React.useState([
    { type: 'email', subject: '', template: '', delay: 0 }
  ]);

  const addStep = (type: 'email' | 'linkedin' | 'wait') => {
    setSteps(prev => [...prev, { type, subject: '', template: '', delay: 0 }]);
  };

  const updateStep = (index: number, field: string, value: any) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const campaign = {
      name,
      description,
      steps,
      status: 'draft',
      created_at: new Date().toISOString()
    };
    onSave(campaign);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
              className="min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your campaign"
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Campaign Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="border border-border rounded-xl p-4 space-y-4 bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h4 className="font-semibold text-foreground">Step {index + 1}: {step.type.charAt(0).toUpperCase() + step.type.slice(1)}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeStep(index)}
                  className="self-start sm:self-auto min-h-[44px] px-4"
                >
                  Remove
                </Button>
              </div>
              
              {step.type === 'email' && (
                <div className="space-y-3">
                  <Input
                    placeholder="Email subject"
                    value={step.subject}
                    onChange={(e) => updateStep(index, 'subject', e.target.value)}
                    className="min-h-[44px]"
                  />
                  <Textarea
                    placeholder="Email template"
                    value={step.template}
                    onChange={(e) => updateStep(index, 'template', e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              )}
              
              {step.type === 'linkedin' && (
                <Textarea
                  placeholder="LinkedIn message"
                  value={step.template}
                  onChange={(e) => updateStep(index, 'template', e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              )}
              
              {step.type === 'wait' && (
                <Input
                  type="number"
                  placeholder="Wait days"
                  value={step.delay}
                  onChange={(e) => updateStep(index, 'delay', Number(e.target.value))}
                  className="min-h-[44px]"
                />
              )}
            </div>
          ))}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => addStep('email')}
              className="min-h-[44px] touch-manipulation"
            >
              + Email Step
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addStep('linkedin')}
              className="min-h-[44px] touch-manipulation"
            >
              + LinkedIn Step
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addStep('wait')}
              className="min-h-[44px] touch-manipulation"
            >
              + Wait Step
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center sm:justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!name.trim()}
          className="w-full sm:w-auto min-h-[44px] px-8 touch-manipulation"
        >
          Save Campaign
        </Button>
      </div>
    </div>
  );
}