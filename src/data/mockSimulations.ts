export interface Simulation {
  id: string;
  title: string;
  subject: string;
  description: string;
  thumbnailUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'draft' | 'published' | 'archived';
  embedUrl?: string;
  filePath?: string;
  openInNewTab?: boolean;
}

export const mockSimulations: Simulation[] = [
  {
    id: 'sim-pulley',
    title: 'Pulley Mechanical System Simulator',
    subject: 'Physics',
    description: 'Interactive Mechanics Simulator: Experiment with single fixed, movable, and compound pulley systems, effort force, and mechanical advantage.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    difficulty: 'Medium',
    status: 'published',
    embedUrl: '/pulley-simulator-fixed.html',
    openInNewTab: true
  },
  {
    id: 'sim-tir',
    title: 'Total Internal Reflection & Optics Simulator',
    subject: 'Physics',
    description: 'Interactive Optics Lab: Ray tracing, Snell law, critical angles, refraction index, and total internal reflection in glass prisms.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    difficulty: 'Hard',
    status: 'published',
    embedUrl: '/total-internal-reflection.html',
    openInNewTab: true
  },
  {
    id: 'sim-prism',
    title: 'Prism Light Dispersion Simulator',
    subject: 'Physics',
    description: 'Interactive Optics Simulator: Observe white light splitting into rainbow spectrum wavelengths through triangular glass prisms.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    difficulty: 'Easy',
    status: 'published',
    embedUrl: 'https://explerify.com/prism-simulator/'
  },
  {
    id: 'sim-1',
    title: 'PhET Forces and Motion',
    subject: 'Physics',
    description: 'Explore the forces at work when pulling against a cart, and pushing a refrigerator, crate, or person.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    difficulty: 'Easy',
    status: 'published',
    embedUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html'
  },
  {
    id: 'sim-2',
    title: 'Acid-Base Solutions',
    subject: 'Chemistry',
    description: 'How do strong and weak acids differ? Use lab tools on your computer to find out!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
    difficulty: 'Medium',
    status: 'published',
    embedUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_all.html'
  }
];
