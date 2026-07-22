import { supabase } from '@/lib/supabaseClient';
import { mockDocuments, Document } from '@/data/mockDocuments';

const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

const DELETED_IDS_KEY = 'c8_deleted_doc_ids';
const LOCAL_DOCS_KEY = 'c8_admin_documents';

// Helper to get deleted document IDs from localStorage
function getDeletedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

// Helper to save deleted document IDs
function saveDeletedId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedIds();
    set.add(id);
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error(e);
  }
}

// Initialize mockStore from localStorage if present
let mockStore: Document[] = (() => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_DOCS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [...mockDocuments];
})();

function saveMockStore(store: Document[]) {
  mockStore = store;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(store));
    } catch (e) {
      console.error(e);
    }
  }
}

function rowToDocument(row: Record<string, any>): Document {
  return {
    id: row.id,
    title: row.title || 'Untitled Document',
    description: row.description || '',
    category: row.category || 'General',
    subject: row.subject || 'General',
    filePath: row.file_path || '',
    fileType: row.file_type ?? 'pdf',
    thumbnailUrl: row.thumbnail_url ?? '/icons/pdf.png',
    allowView: row.allow_view !== false,
    allowDownload: row.allow_download !== false,
    status: row.status ?? 'published'
  };
}

// ─── READ ──────────────────────────────────────────────────────────────────

export async function getDocuments(): Promise<Document[]> {
  const deletedIds = getDeletedIds();
  let list: Document[] = [...mockStore];

  if (!isMockMode) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const fetched = data.map(rowToDocument);
        const existingIds = new Set(fetched.map((d) => d.id));
        const customMocks = mockStore.filter((d) => !existingIds.has(d.id));
        list = [...fetched, ...customMocks];
      }
    } catch (e) {
      console.warn('Supabase fetch documents notice:', e);
    }
  }

  // Filter out deleted IDs
  return list.filter((d) => !deletedIds.has(d.id) && d.status === 'published');
}

export async function getAllDocuments(): Promise<Document[]> {
  const deletedIds = getDeletedIds();
  let list: Document[] = [...mockStore];

  if (!isMockMode) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const fetched = data.map(rowToDocument);
        const existingIds = new Set(fetched.map((d) => d.id));
        const customMocks = mockStore.filter((d) => !existingIds.has(d.id));
        list = [...fetched, ...customMocks];
      }
    } catch (e) {
      console.warn('Supabase fetch documents notice:', e);
    }
  }

  return list.filter((d) => !deletedIds.has(d.id));
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const deletedIds = getDeletedIds();
  if (deletedIds.has(id)) return null;

  if (isMockMode) {
    return mockStore.find((d) => d.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return mockStore.find((d) => d.id === id) ?? null;
  }
  return rowToDocument(data);
}

// ─── CREATE ────────────────────────────────────────────────────────────────

export interface DocumentInput {
  title: string;
  description?: string;
  category: string;
  subject: string;
  filePath: string;
  fileType?: string;
  thumbnailUrl?: string;
  allowView?: boolean;
  allowDownload?: boolean;
  status: 'draft' | 'published' | 'archived';
}

export async function createDocument(input: DocumentInput): Promise<Document> {
  let createdDoc: Document;

  if (!isMockMode) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: input.title,
          description: input.description,
          category: input.category,
          subject: input.subject,
          file_path: input.filePath,
          file_type: input.fileType ?? 'pdf',
          thumbnail_url: input.thumbnailUrl ?? '/icons/pdf.png',
          allow_view: input.allowView ?? true,
          allow_download: input.allowDownload ?? true,
          status: input.status,
          created_by: user?.id
        })
        .select()
        .single();

      if (!error && data) {
        createdDoc = rowToDocument(data);
        saveMockStore([createdDoc, ...mockStore]);
        return createdDoc;
      }
    } catch (err) {
      console.warn('Supabase document insert fallback notice:', err);
    }
  }

  createdDoc = {
    id: `doc-${Date.now()}`,
    title: input.title,
    description: input.description ?? '',
    category: input.category,
    subject: input.subject,
    filePath: input.filePath,
    fileType: input.fileType ?? 'pdf',
    thumbnailUrl: input.thumbnailUrl ?? '/icons/pdf.png',
    allowView: input.allowView ?? true,
    allowDownload: input.allowDownload ?? true,
    status: input.status
  };

  saveMockStore([createdDoc, ...mockStore]);
  return createdDoc;
}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateDocument(id: string, input: Partial<DocumentInput>): Promise<Document> {
  const updatedStore = mockStore.map((d) =>
    d.id === id
      ? {
          ...d,
          title: input.title ?? d.title,
          description: input.description ?? d.description,
          category: input.category ?? d.category,
          subject: input.subject ?? d.subject,
          filePath: input.filePath ?? d.filePath,
          fileType: input.fileType ?? d.fileType,
          thumbnailUrl: input.thumbnailUrl ?? d.thumbnailUrl,
          allowView: input.allowView !== undefined ? input.allowView : d.allowView,
          allowDownload: input.allowDownload !== undefined ? input.allowDownload : d.allowDownload,
          status: input.status ?? d.status
        }
      : d
  );
  saveMockStore(updatedStore);

  if (!isMockMode) {
    try {
      const patchData: Record<string, any> = {};
      if (input.title !== undefined) patchData.title = input.title;
      if (input.description !== undefined) patchData.description = input.description;
      if (input.category !== undefined) patchData.category = input.category;
      if (input.subject !== undefined) patchData.subject = input.subject;
      if (input.filePath !== undefined) patchData.file_path = input.filePath;
      if (input.fileType !== undefined) patchData.file_type = input.fileType;
      if (input.thumbnailUrl !== undefined) patchData.thumbnail_url = input.thumbnailUrl;
      if (input.allowView !== undefined) patchData.allow_view = input.allowView;
      if (input.allowDownload !== undefined) patchData.allow_download = input.allowDownload;
      if (input.status !== undefined) patchData.status = input.status;

      const { data } = await supabase
        .from('documents')
        .update(patchData)
        .eq('id', id)
        .select()
        .single();

      if (data) return rowToDocument(data);
    } catch (e) {
      console.warn('Supabase update document notice:', e);
    }
  }

  return updatedStore.find((d) => d.id === id)!;
}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function deleteDocument(id: string): Promise<void> {
  // 1. Save deleted ID to localStorage set
  saveDeletedId(id);

  // 2. Remove from mockStore in memory and localStorage
  const filtered = mockStore.filter((d) => d.id !== id);
  saveMockStore(filtered);

  // 3. Delete from Supabase database if active
  if (!isMockMode) {
    try {
      await supabase.from('documents').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete document notice:', e);
    }
  }
}

// ─── STORAGE: SIGNED & VIEW URLS ─────────────────────────────────────────

export async function getViewUrl(filePath: string, expiresIn = 3600): Promise<string> {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('blob:')) {
    return filePath;
  }
  if (filePath.startsWith('/')) return filePath;

  if (!isMockMode) {
    try {
      const { data: pubData } = supabase.storage.from('documents').getPublicUrl(filePath);
      if (pubData?.publicUrl) return pubData.publicUrl;

      const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, expiresIn);
      if (!error && data?.signedUrl) return data.signedUrl;
    } catch (e) {
      console.warn('Supabase getViewUrl notice:', e);
    }
  }

  return `/${filePath.replace(/^\/+/, '')}`;
}

export async function getDownloadUrl(filePath: string, expiresIn = 3600): Promise<string> {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('blob:')) {
    return filePath;
  }
  if (filePath.startsWith('/')) return filePath;

  if (!isMockMode) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, expiresIn, { download: true });
      if (!error && data?.signedUrl) return data.signedUrl;

      const { data: pubData } = supabase.storage.from('documents').getPublicUrl(filePath);
      if (pubData?.publicUrl) return pubData.publicUrl;
    } catch (e) {
      console.warn('Supabase getDownloadUrl notice:', e);
    }
  }

  return `/${filePath.replace(/^\/+/, '')}`;
}

// ─── FILE UPLOAD HELPER ───────────────────────────────────────────────────

export async function uploadDocumentFile(file: File): Promise<{ filePath: string; fileType: string; thumbnailUrl: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  let fileType = 'pdf';
  let thumbnailUrl = '/icons/pdf.png';

  if (['doc', 'docx'].includes(ext)) {
    fileType = ext;
    thumbnailUrl = '/icons/word.png';
  } else if (['ppt', 'pptx'].includes(ext)) {
    fileType = ext;
    thumbnailUrl = '/icons/ppt.png';
  } else if (ext === 'pdf') {
    fileType = 'pdf';
    thumbnailUrl = '/icons/pdf.png';
  } else {
    fileType = ext;
  }

  if (!isMockMode) {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (!error && data?.path) {
        return { filePath: data.path, fileType, thumbnailUrl };
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback notice:', err);
    }
  }

  const localUrl = URL.createObjectURL(file);
  return { filePath: localUrl, fileType, thumbnailUrl };
}
