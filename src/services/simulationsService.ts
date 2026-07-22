import { supabase } from '@/lib/supabaseClient';
import { mockSimulations, Simulation } from '@/data/mockSimulations';

const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

// ─── In-memory mock store (client-side only) ──────────────────────────────
// This lets the admin CRUD work in mock mode without a database.
let mockStore: Simulation[] = [...mockSimulations];

function rowToSimulation(row: Record<string, any>): Simulation {
  return {
    id: row.id,
    title: row.title || 'Untitled Simulation',
    description: row.description || '',
    subject: row.subject || 'Physics',
    thumbnailUrl: row.thumbnail_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    difficulty: row.difficulty || 'Medium',
    status: row.status || 'published',
    embedUrl: row.embed_url,
    filePath: row.file_path,
    openInNewTab: row.embed_url ? (row.embed_url.includes('.html') || row.embed_url.startsWith('/')) : false
  };
}

// ─── READ ──────────────────────────────────────────────────────────────────

export async function getSimulations(): Promise<Simulation[]> {
  let list: Simulation[] = [...mockStore];
  if (!isMockMode) {
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const fetched = data.map(rowToSimulation);
        const existingIds = new Set(fetched.map((s) => s.id));
        const customMocks = mockStore.filter((s) => !existingIds.has(s.id));
        list = [...fetched, ...customMocks];
      }
    } catch (e) {
      console.warn('Supabase fetch simulations notice:', e);
    }
  }
  return list;
}

export async function getAllSimulations(): Promise<Simulation[]> {
  return getSimulations();
}

export async function getSimulationById(id: string): Promise<Simulation | null> {
  if (isMockMode) {
    return mockStore.find((s) => s.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return mockStore.find((s) => s.id === id) ?? null;
  }
  return rowToSimulation(data);
}

// ─── CREATE ────────────────────────────────────────────────────────────────

export interface SimulationInput {
  title: string;
  subject: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'draft' | 'published' | 'archived';
  embedUrl?: string;
  filePath?: string;
}

export async function createSimulation(input: SimulationInput): Promise<Simulation> {
  if (isMockMode) {
    const newSim: Simulation = {
      id: `sim-${Date.now()}`,
      title: input.title,
      subject: input.subject,
      description: input.description ?? '',
      thumbnailUrl: '/simulations/default.png',
      difficulty: input.difficulty,
      status: input.status,
      embedUrl: input.embedUrl,
      filePath: input.filePath
    };
    mockStore = [newSim, ...mockStore];
    return newSim;
  }

  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('simulations')
    .insert({
      title: input.title,
      subject: input.subject,
      description: input.description,
      difficulty: input.difficulty,
      status: input.status,
      embed_url: input.embedUrl,
      file_path: input.filePath,
      created_by: user?.id
    })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create simulation: ${error?.message}`);
  return rowToSimulation(data);
}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateSimulation(id: string, input: Partial<SimulationInput>): Promise<Simulation> {
  if (isMockMode) {
    mockStore = mockStore.map((s) =>
      s.id === id
        ? {
            ...s,
            title: input.title ?? s.title,
            subject: input.subject ?? s.subject,
            description: input.description ?? s.description,
            difficulty: input.difficulty ?? s.difficulty,
            status: input.status ?? s.status,
            embedUrl: input.embedUrl ?? s.embedUrl,
            filePath: input.filePath ?? s.filePath
          }
        : s
    );
    return mockStore.find((s) => s.id === id)!;
  }

  const patchData: Record<string, any> = {};
  if (input.title !== undefined) patchData.title = input.title;
  if (input.subject !== undefined) patchData.subject = input.subject;
  if (input.description !== undefined) patchData.description = input.description;
  if (input.difficulty !== undefined) patchData.difficulty = input.difficulty;
  if (input.status !== undefined) patchData.status = input.status;
  if (input.embedUrl !== undefined) patchData.embed_url = input.embedUrl;
  if (input.filePath !== undefined) patchData.file_path = input.filePath;

  const { data, error } = await supabase
    .from('simulations')
    .update(patchData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to update simulation: ${error?.message}`);
  return rowToSimulation(data);
}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function deleteSimulation(id: string): Promise<void> {
  if (isMockMode) {
    mockStore = mockStore.filter((s) => s.id !== id);
    return;
  }

  const { error } = await supabase.from('simulations').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete simulation: ${error.message}`);
}

// ─── STORAGE: SIGNED URL ───────────────────────────────────────────────────

/**
 * Returns a signed URL for a private simulation file stored in Supabase Storage.
 * In mock mode, returns the raw filePath string.
 * expiresIn defaults to 1 hour (3600 seconds).
 */
export async function getSignedUrl(filePath: string, expiresIn = 3600): Promise<string> {
  if (isMockMode || !filePath) return filePath;

  const { data, error } = await supabase.storage
    .from('simulations')
    .createSignedUrl(filePath, expiresIn);

  if (error || !data?.signedUrl) return filePath;
  return data.signedUrl;
}
