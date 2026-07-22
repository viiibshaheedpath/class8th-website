import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-trigger ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && <span className="tab-indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
}
