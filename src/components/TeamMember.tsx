
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export interface TeamMemberProps {
  name: string;
  role: string;
  image?: string;
  initials?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, initials }) => {
  const derivedInitials = initials || name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className="flex flex-col items-center p-4 cursor-pointer transition-transform duration-300 hover:scale-105">
          <div className="w-40 h-40 mb-4 rounded-md overflow-hidden border-4 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-primary/30">
            {image ? (
              <AspectRatio ratio={1} className="bg-muted">
                <img 
                  src={image} 
                  alt={name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={1} className="bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-3xl font-bold">{derivedInitials}</span>
              </AspectRatio>
            )}
          </div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-card/90 backdrop-blur-sm border-border/50 p-4">
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-xl">{name}</h4>
          <p className="text-primary font-medium">{role}</p>
          <div className="border-t border-border/40 my-1 pt-2">
            <p className="text-muted-foreground text-sm">
              Team member at CrimeWatch Bangladesh, working to make our communities safer.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TeamMember;
