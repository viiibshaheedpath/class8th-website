export interface Article {
  id: string;
  sourceId: string;
  title: string;
  author: string;
  articleUrl: string;
  imageUrl: string;
  summary: string;
  publishedAt: string;
  sourceName: 'IEEE Spectrum' | 'Aeon' | 'Psyche' | 'TechCrunch AI';
  category: string;
  readTime: string;
  content: string;
}

export const mockArticles: Article[] = [
  // IEEE SPECTRUM ARTICLES
  {
    id: 'ieee-1',
    sourceId: 'ieee-spectrum',
    title: 'Inside the Next-Generation Fusion Reactors Breaking Energy Records',
    author: 'Stephen Cass',
    articleUrl: 'https://spectrum.ieee.org/fusion-energy-breakthrough-2026',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    summary: 'Engineers have achieved a net energy gain breakthrough using high-temperature superconducting magnets, accelerating the path toward commercial zero-carbon fusion power.',
    publishedAt: '2026-07-20T10:00:00Z',
    sourceName: 'IEEE Spectrum',
    category: 'Robotics & Physics',
    readTime: '6 min read',
    content: `For decades, nuclear fusion has promised an endless supply of clean, safe, and abundant energy. Today, a new generation of compact magnetic confinement tokamaks powered by REBCO high-temperature superconducting tapes is turning that dream into reality.

By operating magnetic fields at over 20 Tesla, researchers at major international laboratories have contained plasma temperatures exceeding 100 million degrees Celsius without consuming more power than the fusion reaction generates. This breakthrough reduces reactor volume by a factor of 40 while paving the way for commercial grid delivery within the decade.`
  },
  {
    id: 'ieee-2',
    sourceId: 'ieee-spectrum',
    title: 'Humanoid Robots Are Entering the Factory Floor: Here is What Happens Next',
    author: 'Evan Ackerman',
    articleUrl: 'https://spectrum.ieee.org/humanoid-robotics-manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop',
    summary: 'Autonomous bipedal robots equipped with visual transformers and tactile feedback are performing complex assembly tasks alongside human workers.',
    publishedAt: '2026-07-18T14:30:00Z',
    sourceName: 'IEEE Spectrum',
    category: 'Robotics & Automation',
    readTime: '8 min read',
    content: `The automotive and electronics assembly lines are undergoing a fundamental transformation. Rather than rigid industrial arms bolted inside safety cages, autonomous bipedal humanoids are walking freely through warehouses, lifting crates, and wiring components with sub-millimeter precision.

Driven by vision-language-action (VLA) neural architectures trained on millions of simulation hours, these robots learn new physical dexterity tasks in real-time. Engineers can demonstrate a tool manipulation sequence once, and the robot generalizes the motion across varying object shapes and weights.`
  },
  {
    id: 'ieee-3',
    sourceId: 'ieee-spectrum',
    title: 'Quantum Computing Steps Out of the Lab and Into Real-World Materials Science',
    author: 'Samuel K. Moore',
    articleUrl: 'https://spectrum.ieee.org/quantum-computing-materials',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    summary: 'Fault-tolerant quantum processors are simulating complex molecular bonds to discover next-generation room-temperature superconductors and high-density batteries.',
    publishedAt: '2026-07-15T09:15:00Z',
    sourceName: 'IEEE Spectrum',
    category: 'Quantum Tech',
    readTime: '7 min read',
    content: `Simulating even a modest molecule like caffeine requires classical supercomputers to track billions of electronic interactions — a task that quickly hits a computational wall. Logical qubits with active surface-code error correction are changing the equation.

Recent experiments combining neutral-atom quantum processors with solid-state chemistry algorithms have successfully modeled iron-sulfur catalytic clusters. This breakthrough promises to revolutionize battery electrode design, fertilizer production, and carbon capture materials.`
  },

  // AEON ESSAYS
  {
    id: 'aeon-1',
    sourceId: 'aeon',
    title: 'The Great Cosmic Web: How Gravity and Dark Matter Weave the Universe',
    author: 'Dr. Katie Mack',
    articleUrl: 'https://aeon.co/essays/how-dark-matter-and-gravity-weave-the-cosmic-web',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    summary: 'Billions of light-years across, filamentary structures connect galaxies across space. Exploring how invisible dark matter scaffolding built the cosmos we observe.',
    publishedAt: '2026-07-19T11:00:00Z',
    sourceName: 'Aeon',
    category: 'Cosmology & Philosophy',
    readTime: '12 min read',
    content: `When we look out into the deep sky through gravitational lensing maps and cosmological computer simulations, the cosmos does not resemble a random scatter of stars. Instead, it forms a vast, organic network of glowing filaments — the Cosmic Web.

Galaxies sit like luminous dew drops at the intersections of invisible dark matter threads. This article explores how quantum fluctuations in the micro-seconds following the Big Bang were stretched across billions of light-years, carving out supervoids and giant galaxy clusters.`
  },
  {
    id: 'aeon-2',
    sourceId: 'aeon',
    title: 'The Architecture of Curiosity: Why Human Minds Ask "Why"',
    author: 'Philip Ball',
    articleUrl: 'https://aeon.co/essays/the-evolutionary-architecture-of-human-curiosity',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
    summary: 'Curiosity isn\'t just an emotion — it is an evolutionary survival engine that transforms random environmental signals into structured scientific discoveries.',
    publishedAt: '2026-07-16T16:00:00Z',
    sourceName: 'Aeon',
    category: 'Philosophy of Science',
    readTime: '10 min read',
    content: `Why are human beings driven to explore things that have no immediate survival benefit? Why do we stare into microscopes, calculate prime numbers, or send probes to distant moons?

Curiosity operates as an intrinsic information-seeking drive. Unlike passive pattern matching, curiosity prompts organisms to actively generate hypotheses, test boundaries, and update mental models of the world. It is the foundational spark of mathematics, art, and philosophy.`
  },
  {
    id: 'aeon-3',
    sourceId: 'aeon',
    title: 'What Mathematics Reveals About the Limits of Human Knowledge',
    author: 'Rebecca Goldstein',
    articleUrl: 'https://aeon.co/essays/godel-turing-and-the-mathematical-limits-of-certainty',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
    summary: 'From Gödel\'s incompleteness theorems to Turing\'s halting problem, mathematical logic teaches us that truth is vastly larger than what can be proven by code.',
    publishedAt: '2026-07-12T08:45:00Z',
    sourceName: 'Aeon',
    category: 'Mathematics',
    readTime: '14 min read',
    content: `In 1931, a 25-year-old Austrian mathematician named Kurt Gödel shattered the belief that all mathematical truths could be derived from a single set of self-consistent axioms.

Gödel proved that in any rigorous logical system, there will always be true mathematical statements that cannot be proven within the system itself. This essay explores the profound philosophical boundary between provability and truth, and why human intuition transcends simple algorithmic calculation.`
  },

  // PSYCHE GUIDES
  {
    id: 'psyche-1',
    sourceId: 'psyche',
    title: 'How Deep Focus and Flow States Reorganize the Learning Brain',
    author: 'Christian Jarrett',
    articleUrl: 'https://psyche.co/guides/how-deep-focus-and-flow-states-transform-learning',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    summary: 'Neuroimaging shows that entering effortless concentration quiets the default mode network and strengthens synaptic plasticity, doubling memory retention.',
    publishedAt: '2026-07-21T07:30:00Z',
    sourceName: 'Psyche',
    category: 'Cognitive Psychology',
    readTime: '9 min read',
    content: `Have you ever been so immersed in solving a difficult problem or reading a captivating chapter that hours passed like minutes? Neuroscientists refer to this optimal mental operating condition as a flow state.

When you achieve deep focus, your brain dampens activity in the Default Mode Network (DMN) — the region responsible for self-critical chatter and distractions. In its place, the executive control network releases dopamine and noradrenaline, triggering rapid myelination along key neural pathways.`
  },
  {
    id: 'psyche-2',
    sourceId: 'psyche',
    title: 'The Art of Active Recall: Why Testing Yourself Beats Re-Reading',
    author: 'Dr. Barbara Oakley',
    articleUrl: 'https://psyche.co/guides/how-to-use-active-recall-to-master-any-subject',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    summary: 'Cognitive science proves that retrieving information from memory creates durable neural pathways far faster than passive highlighting or review.',
    publishedAt: '2026-07-17T13:20:00Z',
    sourceName: 'Psyche',
    category: 'Learning & Memory',
    readTime: '7 min read',
    content: `Most students spend hours re-reading notes or highlighting textbook pages. Yet cognitive experiments consistently demonstrate that passive re-reading creates an "illusion of competence" without long-term retention.

Active recall — closing your book and forcing your mind to reconstruct concepts, solve practice problems, or explain topics in your own words — creates powerful retrieval hooks in memory. Combined with spaced repetition, active recall makes exam prep effortless.`
  },
  {
    id: 'psyche-3',
    sourceId: 'psyche',
    title: 'Building Resilience: How Mindset Shifts Help Students Master Tough Subjects',
    author: 'Sam Woolfe',
    articleUrl: 'https://psyche.co/guides/building-academic-resilience-and-a-growth-mindset',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    summary: 'Reframing difficulty as a brain-building workout transforms anxiety into curiosity and sustained academic performance.',
    publishedAt: '2026-07-14T15:00:00Z',
    sourceName: 'Psyche',
    category: 'Mindset & Growth',
    readTime: '8 min read',
    content: `When encountering a difficult physics equation or complex grammar rule, it is easy to assume "I'm just not good at this." But neuroplasticity research shows that struggle is the precise biological signal that triggers brain growth.

By adopting a growth mindset — viewing confusion not as a failure, but as a workout for your synaptic connections — students build academic resilience. Learn practical strategies for overcoming frustration, pacing study sessions, and developing unshakeable confidence.`
  }
];
