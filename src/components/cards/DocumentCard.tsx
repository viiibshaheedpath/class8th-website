import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Document } from '@/data/mockDocuments';

interface DocumentCardProps {
  document: Document;
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
}

export function DocumentCard({ document, onView, onDownload }: DocumentCardProps) {
  return (
    <Card className="document-card">
      <div className="document-card-header">
        <span className="doc-type-icon">📄</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Badge variant="primary">{document.category}</Badge>
          <Badge variant="secondary">{document.fileType.toUpperCase()}</Badge>
        </div>
      </div>
      <div className="document-card-body">
        <span className="subject-tag">{document.subject}</span>
        <h3 className="doc-title">{document.title}</h3>
        <p className="doc-desc">{document.description}</p>
        
        <div className="doc-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <Button 
            variant="outline" 
            style={{ flex: 1 }}
            onClick={() => onView && onView(document)}
          >
            View Document
          </Button>

          {/* Conditional Download Button */}
          {document.allowDownload && (
            <Button 
              variant="primary" 
              style={{ flex: 1 }}
              onClick={() => onDownload && onDownload(document)}
            >
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
