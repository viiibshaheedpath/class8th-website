'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Simulation } from '@/data/mockSimulations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SliderParam {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
}

interface SimulationViewerProps {
  simulation: Simulation;
}

const DEFAULT_PARAMS: SliderParam[] = [
  { label: 'Simulation Speed', min: 0.25, max: 4, step: 0.25, value: 1, unit: 'x' },
  { label: 'Applied Force', min: 0, max: 100, step: 5, value: 50, unit: 'N' },
  { label: 'Friction Coefficient', min: 0, max: 1, step: 0.05, value: 0.3, unit: '' }
];

export function SimulationViewer({ simulation }: SimulationViewerProps) {
  const [params, setParams] = useState<SliderParam[]>(DEFAULT_PARAMS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showObjectives, setShowObjectives] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy': return <Badge variant="success">Easy</Badge>;
      case 'Medium': return <Badge variant="warning">Medium</Badge>;
      case 'Hard': return <Badge variant="danger">Hard</Badge>;
      default: return <Badge variant="secondary">{diff}</Badge>;
    }
  };

  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS.map(p => ({ ...p })));
    setIframeKey(k => k + 1);
  }, []);

  const handleParamChange = (index: number, value: number) => {
    setParams(prev => prev.map((p, i) => i === index ? { ...p, value } : p));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="sim-viewer-shell">
      {/* Header Info Bar */}
      <div className="sim-viewer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{simulation.title}</span>
          <Badge variant="primary">{simulation.subject}</Badge>
          {getDifficultyBadge(simulation.difficulty)}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline" onClick={handleReset} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            🔄 Reset
          </Button>
          <Button variant="secondary" onClick={handleFullscreen} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            {isFullscreen ? '⊡ Exit Fullscreen' : '⛶ Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Main Content: iframe + sidebar */}
      <div className="sim-viewer-body" ref={containerRef}>

        {/* Simulation Frame */}
        <div className="sim-iframe-wrapper">
          {simulation.embedUrl ? (
            <iframe
              key={iframeKey}
              src={simulation.embedUrl}
              title={simulation.title}
              className="sim-iframe"
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
            />
          ) : (
            <div className="sim-placeholder">
              <span style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>⚡</span>
              <h3>Simulation File Loading</h3>
              <p style={{ marginTop: '8px' }}>File path: <code>{simulation.filePath}</code></p>
              <p style={{ marginTop: '4px', fontSize: '0.85rem' }}>Z Code simulation packages will render here.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Controls + Objectives */}
        <div className="sim-sidebar">
          {/* Parameter Controls Panel */}
          <div className="sim-controls-panel">
            <h4 className="sim-panel-title">⚙️ Simulation Parameters</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {params.map((param, idx) => (
                <div key={param.label} className="sim-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 500 }}>{param.label}</span>
                    <strong style={{ color: 'var(--primary-start)' }}>
                      {param.value}{param.unit}
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => handleParamChange(idx, parseFloat(e.target.value))}
                    className="sim-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{param.min}{param.unit}</span>
                    <span>{param.max}{param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives Collapsible Panel */}
          <div className="sim-controls-panel">
            <button
              className="sim-panel-title sim-panel-toggle"
              onClick={() => setShowObjectives(v => !v)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
              📖 Learning Objectives {showObjectives ? '▲' : '▼'}
            </button>
            {showObjectives && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Understand cause-and-effect relationships between applied forces and motion.',
                  'Explore how friction affects velocity and acceleration.',
                  'Visualize Newton\'s Second Law using interactive parameters.'
                ].map((obj, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.875rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'var(--text-muted)' }}>{obj}</span>
                  </div>
                ))}
                {simulation.description && (
                  <p style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    {simulation.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
