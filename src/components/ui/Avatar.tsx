import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallbackText: string;
  className?: string;
}

export function Avatar({ src, alt, fallbackText, className = '' }: AvatarProps) {
  const initials = fallbackText
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`avatar ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || 'Avatar'} className="avatar-image" />
      ) : (
        <span className="avatar-fallback">{initials}</span>
      )}
    </div>
  );
}
