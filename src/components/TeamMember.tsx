
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export interface TeamMemberProps {
  name: string;
  role: string;
  image?: string;
  initials?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, initials }) => {
  // Get initials from name if not provided
  const derivedInitials = initials || name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-col items-center p-4">
      <Avatar className="w-32 h-32 border-4 border-card mb-4">
        {image ? (
          <AvatarImage src={image} alt={name} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {derivedInitials}
          </AvatarFallback>
        )}
      </Avatar>
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-muted-foreground text-sm">{role}</p>
    </div>
  );
};

export default TeamMember;
