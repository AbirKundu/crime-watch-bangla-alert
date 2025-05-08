
import React from 'react';
import TeamMember from './TeamMember';

// Import local images
import member1 from '@/components/picture/member1.jpg';
import member2 from '@/components/picture/member2.jpg';
import member3 from '@/components/picture/member3.jpg';

const Team = () => {
  const teamMembers = [
    { name: 'Abir Kundu', role: 'Project Manager', image: member1 },
    { name: 'Mizanur Rahman Tazim', role: 'Frontend Developer', image: member2 },
    { name: 'MT Ekleel', role: 'UI/UX Designer', image: member3 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {teamMembers.map((member, index) => (
        <TeamMember key={index} {...member} />
      ))}
    </div>
  );
};

export default Team;
