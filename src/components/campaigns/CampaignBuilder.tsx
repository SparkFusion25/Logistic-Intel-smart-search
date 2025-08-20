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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your campaign"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Step {index + 1}: {step.type}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeStep(index)}
                >
                  Remove
                </Button>
              </div>
              
              {step.type === 'email' && (
                <>
                  <Input
                    placeholder="Email subject"
                    value={step.subject}
                    onChange={(e) => updateStep(index, 'subject', e.target.value)}
                  />
                  <Textarea
                    placeholder="Email template"
                    value={step.template}
                    onChange={(e) => updateStep(index, 'template', e.target.value)}
                  />
                </>
              )}
              
              {step.type === 'linkedin' && (
                <Textarea
                  placeholder="LinkedIn message"
                  value={step.template}
                  onChange={(e) => updateStep(index, 'template', e.target.value)}
                />
              )}
              
              {step.type === 'wait' && (
                <Input
                  type="number"
                  placeholder="Wait days"
                  value={step.delay}
                  onChange={(e) => updateStep(index, 'delay', Number(e.target.value))}
                />
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => addStep('email')}>
              + Email Step
            </Button>
            <Button variant="outline" onClick={() => addStep('linkedin')}>
              + LinkedIn Step
            </Button>
            <Button variant="outline" onClick={() => addStep('wait')}>
              + Wait Step
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!name.trim()}>
          Save Campaign
        </Button>
      </div>
    </div>
  );
}