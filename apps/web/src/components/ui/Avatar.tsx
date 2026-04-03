interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export function Avatar({ src, name, size = 'md', showOnline, className = '' }: AvatarProps) {
  return (
    <div className={`relative inline-flex ${className}`} title={name}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            bg-primary/10 text-primary font-medium
            flex items-center justify-center
            ring-2 ring-white
          `}
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      )}
      {showOnline && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-completed rounded-full ring-2 ring-white"
          aria-label="Online"
        />
      )}
    </div>
  );
}

interface AvatarStackProps {
  users: { name: string; avatarUrl?: string | null }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarStack({ users, max = 4, size = 'sm' }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2" aria-label={`${users.length} colaboradores`}>
      {visible.map((user, i) => (
        <Avatar key={i} src={user.avatarUrl} name={user.name} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            bg-bg-secondary text-text-secondary text-xs font-medium
            flex items-center justify-center
            ring-2 ring-white
          `}
          title={`+${remaining} mais`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
