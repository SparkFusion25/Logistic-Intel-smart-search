import { Book, MessageCircle, Mail, Phone, FileText, Video } from 'lucide-react';

export default function Help() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Get help with Logistic Intel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Documentation</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Comprehensive guides and tutorials to help you get started
          </p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            View Docs
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Video className="h-6 w-6 text-green-500" />
            <h2 className="text-lg font-semibold">Video Tutorials</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Watch step-by-step video guides for common tasks
          </p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Watch Videos
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold">Live Chat</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Chat with our support team for immediate assistance
          </p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
            Start Chat
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-semibold">Email Support</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Send us an email and we'll get back to you within 24 hours
          </p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Email Us
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-6 w-6 text-orange-500" />
            <h2 className="text-lg font-semibold">Phone Support</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Call our support line for urgent issues
          </p>
          <div className="text-sm text-muted-foreground mb-4">
            +1 (555) 123-4567<br />
            Mon-Fri 9AM-6PM EST
          </div>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            Call Now
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-indigo-500" />
            <h2 className="text-lg font-semibold">FAQ</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Find answers to frequently asked questions
          </p>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
            Browse FAQ
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h3 className="font-medium">Search for Companies</h3>
              <p className="text-sm text-muted-foreground">Use the Search Intelligence to find importers and exporters</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h3 className="font-medium">Add to CRM</h3>
              <p className="text-sm text-muted-foreground">Save promising contacts to your CRM for follow-up</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h3 className="font-medium">Create Campaigns</h3>
              <p className="text-sm text-muted-foreground">Build targeted email campaigns to reach your prospects</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <h3 className="font-medium">Track Performance</h3>
              <p className="text-sm text-muted-foreground">Monitor campaign analytics and optimize your outreach</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}