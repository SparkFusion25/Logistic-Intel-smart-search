import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type CompanyAvatarProps = {
  companyName: string;
  website?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onLogoUpload?: (file: File) => void;
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10', 
  lg: 'h-16 w-16'
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6'
};

export function CompanyAvatar({ 
  companyName, 
  website, 
  className = '', 
  size = 'md',
  editable = false,
  onLogoUpload
}: CompanyAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onLogoUpload) {
      setUploading(true);
      try {
        await onLogoUpload(file);
      } finally {
        setUploading(false);
      }
    }
  };

  // Generate logo URL from website domain
  const logoUrl = website && !imageError ? 
    `https://logo.clearbit.com/${new URL(website).hostname}` : 
    undefined;

  // Get company initials
  const initials = companyName
    ?.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="relative group">
      <Avatar className={`${sizeClasses[size]} border-2 border-primary/20 ${className}`}>
        <AvatarImage 
          src={logoUrl} 
          alt={`${companyName} logo`}
          onError={() => setImageError(true)}
        />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
          {logoUrl && !imageError ? (
            <div className="animate-pulse">
              <Building2 className={iconSizes[size]} />
            </div>
          ) : initials.length > 1 ? (
            initials
          ) : (
            <Building2 className={iconSizes[size]} />
          )}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Upload className="h-3 w-3 text-white" />
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}