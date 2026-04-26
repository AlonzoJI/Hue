import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showProfileIcon?: boolean;
  onProfileClick?: () => void;
}

const ProfileIcon: React.FC<{onClick?: ()=>void}> = ({onClick}) => (
    <button onClick={onClick} className="text-hue-text-secondary hover:text-hue-blue transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </button>
);


const Header: React.FC<HeaderProps> = ({ title, onBack, showProfileIcon, onProfileClick }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border-gray relative h-16 flex-shrink-0">
      <div className="absolute left-4">
        {onBack && (
          <button onClick={onBack} className="text-hue-text-secondary hover:text-hue-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
      </div>

      <h1 className="text-lg font-bold text-hue-text text-center w-full">{title}</h1>
      
      <div className="absolute right-4 flex items-center space-x-4">
        {showProfileIcon && <ProfileIcon onClick={onProfileClick} />}
        {!showProfileIcon && <div className="text-lg font-bold text-hue-blue tracking-wider">HUE</div>}
      </div>
    </div>
  );
};

export default Header;