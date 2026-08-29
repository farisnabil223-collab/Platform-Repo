import * as React from 'react';
import { cn } from '../../index';
import { Avatar } from '../Avatar/Avatar';

export interface ProfileMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email: string;
  role: string;
  onSignOut?: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  className,
  name,
  email,
  role,
  onSignOut,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left', className)} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        <Avatar fallback={name} alt={name} size="sm" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30 animate-fadeIn"
        >
          {/* Header Info */}
          <div className="px-4 py-3 border-b border-border/50 select-none">
            <p className="text-sm font-semibold text-foreground font-heading leading-none">{name}</p>
            <p className="text-xs text-muted-foreground truncate mt-1 leading-none">{email}</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary select-none">
              {role}
            </span>
          </div>

          {/* Links */}
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 text-xs hover:bg-muted/50 text-foreground/80 hover:text-foreground font-medium transition-colors"
              role="menuitem"
            >
              Account Settings
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 text-xs hover:bg-muted/50 text-foreground/80 hover:text-foreground font-medium transition-colors"
              role="menuitem"
            >
              Syllabus Guidelines
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-border/50 py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut?.();
              }}
              className="w-full text-left px-4 py-2 text-xs hover:bg-red-500/10 text-red-500 font-semibold transition-colors"
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileMenu;
