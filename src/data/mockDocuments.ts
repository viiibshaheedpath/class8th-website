export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  filePath: string;
  fileType: string;
  thumbnailUrl: string;
  allowView: boolean;
  allowDownload: boolean;
  status: 'draft' | 'published' | 'archived';
}

export const mockDocuments: Document[] = [
  {
    id: 'doc-spectrum',
    title: 'Spectrum Class 10 Detailed Notes with CBQ and Numericals',
    description: 'Comprehensive study guide featuring Competency Based Questions (CBQ) and solved numericals for Science.',
    category: 'Notes',
    subject: 'Science',
    filePath: '/Spectrum Class10 detailed Notes with CBQ and Numerricals.pdf',
    fileType: 'pdf',
    thumbnailUrl: '/icons/pdf.png',
    allowView: true,
    allowDownload: true,
    status: 'published'
  },
  {
    id: 'doc-1',
    title: 'Class 8 Science Syllabus',
    description: 'Complete academic syllabus and mark distribution for Science.',
    category: 'Syllabus',
    subject: 'Science',
    filePath: '/Spectrum Class10 detailed Notes with CBQ and Numerricals.pdf',
    fileType: 'pdf',
    thumbnailUrl: '/icons/pdf.png',
    allowView: true,
    allowDownload: true,
    status: 'published'
  },
  {
    id: 'doc-2',
    title: 'Maths Chapter 1 Notes',
    description: 'Revision notes on Rational Numbers and algebraic expressions.',
    category: 'Notes',
    subject: 'Mathematics',
    filePath: '/Spectrum Class10 detailed Notes with CBQ and Numerricals.pdf',
    fileType: 'pdf',
    thumbnailUrl: '/icons/pdf.png',
    allowView: true,
    allowDownload: true,
    status: 'published'
  }
];
