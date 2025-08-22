import EmailComposer from '@/components/email/EmailComposer';

export default function Email() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Email Center</h1>
        <p className="text-muted-foreground">Compose and manage email campaigns</p>
      </div>
      <EmailComposer />
    </div>
  );
}