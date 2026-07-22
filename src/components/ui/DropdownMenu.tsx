import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function DropdownMenu({ trigger, items, className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="dropdown-trigger" style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <button
              key={index}
              className="dropdown-item"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
