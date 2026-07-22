'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';
import { Spinner } from '@/components/ui/Spinner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Toast, ToastItem } from '@/components/ui/Toast';

export default function DesignSystemPreview() {
  // State for interactive components
  const [activeTab, setActiveTab] = useState('tab-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(65);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastItem = {
      id: Math.random().toString(),
      message,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const tabs = [
    { id: 'tab-1', label: 'General Info' },
    { id: 'tab-2', label: 'Security Settings' },
    { id: 'tab-3', label: 'Notifications' }
  ];

  const selectOptions = [
    { value: 'maths', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' }
  ];

  const dropdownItems = [
    { label: 'View Profile', onClick: () => addToast('info', 'Profile view clicked') },
    { label: 'Settings', onClick: () => addToast('info', 'Settings clicked') },
    { label: 'Sign Out', onClick: () => addToast('error', 'Signing out...') }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1>Design System Preview</h1>
        <p>A sandbox displaying all custom Vanilla CSS design tokens and premium UI components.</p>
      </header>

      {/* Grid of components */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* Section: Typography */}
        <Card title="Typography">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <h1>Header 1 (h1)</h1>
              <p>Page Title style</p>
            </div>
            <div>
              <h2>Header 2 (h2)</h2>
              <p>Section Title style</p>
            </div>
            <div>
              <h3>Header 3 (h3)</h3>
              <p>Card Title style</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-main)' }}>Body text. Standard paragraph copy used across the application. Readability is key.</p>
            </div>
            <div>
              <p className="form-helper-text">Small helper text or footnote copy. Muted and clean.</p>
            </div>
          </div>
        </Card>

        {/* Section: Buttons */}
        <Card title="Buttons">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" isLoading>Loading</Button>
              <Button variant="outline" isLoading>Loading Outline</Button>
            </div>
          </div>
        </Card>

        {/* Section: Form Fields */}
        <Card title="Form Elements">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <Input 
              label="Full Name" 
              placeholder="John Doe" 
              helperText="Enter your legal full name."
            />
            <PasswordInput 
              label="Password" 
              placeholder="Min 6 characters" 
              error={undefined}
            />
            <PasswordInput 
              label="Confirm Password" 
              placeholder="Re-enter password" 
              error="Passwords do not match."
            />
            <Select 
              label="Select Subject" 
              options={selectOptions}
              defaultValue="maths"
            />
            <Textarea 
              label="Short Bio" 
              placeholder="Tell us about your learning goals..."
            />
          </div>
        </Card>

        {/* Section: Feedback & Notifications */}
        <Card title="Feedback & Alerts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Alert type="success" title="Success Alert">
              Your profile has been updated successfully.
            </Alert>
            <Alert type="info" title="Info Alert">
              New simulation files have been added recently. Check them out!
            </Alert>
            <Alert type="warning" title="Warning Alert">
              You are running low on study schedule completion this week.
            </Alert>
            <Alert type="error" title="Error Alert">
              Unable to reach database connection. Please try again.
            </Alert>
          </div>
        </Card>

        {/* Section: Badges & Avatars */}
        <Card title="Badges, Avatars & Dropdowns">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Badge variant="primary">Primary Tag</Badge>
              <Badge variant="secondary">Secondary Tag</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="warning">In Progress</Badge>
              <Badge variant="danger">High Risk</Badge>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Avatar fallbackText="Student User" />
              <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" fallbackText="AI Assistant" />
              
              <DropdownMenu 
                trigger={<Button variant="outline">Trigger Dropdown ▾</Button>} 
                items={dropdownItems}
              />
            </div>
          </div>
        </Card>

        {/* Section: Dynamic States */}
        <Card title="Dynamic Interactivity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Tabs Switcher:</p>
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
              <div style={{ padding: '10px 0', fontSize: '0.95rem' }}>
                Active Tab Content: <strong style={{ color: 'var(--primary-start)' }}>{activeTab}</strong>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Progress Bar Controls:</p>
              <ProgressBar value={progress} showText />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button variant="secondary" onClick={() => setProgress(Math.max(0, progress - 10))}>-10%</Button>
                <Button variant="secondary" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Modal & Toast Triggers:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Button variant="secondary" onClick={() => addToast('success', 'Operation completed!')}>Trigger Success Toast</Button>
                <Button variant="outline" onClick={() => addToast('error', 'Operation failed.')}>Trigger Error Toast</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Section: Loading Indicators */}
        <Card title="Loading States">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <Spinner />
              <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Spinner</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader />
              <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Page Loader</p>
            </div>
          </div>
        </Card>

        {/* Section: Empty State */}
        <Card title="Empty State Pattern" style={{ gridColumn: 'span 2' }}>
          <EmptyState 
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            title="No simulations available"
            description="There are currently no simulations uploaded to your class catalog. Please check back later or ask your administrator."
            actionLabel="Request Simulation"
            onAction={() => addToast('info', 'Simulation request submitted')}
          />
        </Card>

      </div>

      {/* Modal Demo */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Interactive Modal Header">
        <p style={{ marginBottom: '15px' }}>
          This modal transition runs with a scale scaling transition and is fully accessible.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => {
            setIsModalOpen(false);
            addToast('success', 'Saved changes from modal');
          }}>Save Changes</Button>
        </div>
      </Modal>

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}
