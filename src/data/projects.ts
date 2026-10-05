// ─────────────────────────────────────────────────────────────
//  All projects & experiences. The Journey Map AND Explore Mode
//  both read from this file. To add a project, copy one entry,
//  give it a unique `id`, and set `year` to the classroom it
//  belongs in. Images go in /public/media/projects/<id>/.
// ─────────────────────────────────────────────────────────────

export type Year = 2024 | 2025 | 2026;

export interface ProjectLink {
  label: string;
  url: string;
}

/** A screenshot (.png/.jpg/.webp), GIF, or short video (.mp4/.webm). */
export interface ProjectImage {
  /** e.g. "/media/projects/<project-id>/demo.mp4". Leave out to show a "coming soon" placeholder. */
  src?: string;
  /** Describe what it shows (read aloud by screen readers, also the caption). */
  alt: string;
  /** Videos only: an image shown before the video plays. */
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  /** Short name for map nodes and room labels. */
  shortTitle: string;
  /** Which classroom it lives in. */
  year: Year;
  /** "YYYY-MM". Used to sort the journey. */
  start: string;
  dateLabel: string;
  location?: string;
  org?: string;
  role: string;
  /** 1–2 lines for hover cards. */
  summary: string;
  keyResult?: string;
  /** Full "what I did" bullets for the detail panel. */
  details: string[];
  tags: string[];
  links?: ProjectLink[];
  images?: ProjectImage[];
  /** Line icon name (see components/icons.tsx): puzzle, scale, blocks, clipboard,
   *  dna, chat, trophy, clock, cloud, route, network, plus, star, chart, … */
  icon: string;
  featured?: boolean;
  comingSoon?: boolean;
  /** What the emcee says when you walk up to this project. */
  emceeLine: string;
}

export const classrooms: Record<Year, { name: string; blurb: string; /** desk order inside the room (project ids); unlisted ones follow by date */ order?: string[] }> = {
  2024: { name: "Year 2024", blurb: "Going global: consulting & blockchain" },
  2025: { name: "Year 2025", blurb: "Deep learning, research, hackathons & leadership" },
  2026: {
    name: "Year 2026",
    blurb: "Product management, machine learning & optimisation",
    order: ["timewise-engine", "fit5222-train-scheduling", "fit5201-ml-from-scratch", "coming-soon"],
  },
};

export const projects: Project[] = [
  // ── 🏫 Year 2024 ─────────────────────────────────────────────
  {
    id: "teamwork-ai-ethics",
    title: "TeaMWork Virtual Internship: Ethical Implementation of AI",
    shortTitle: "TeaMWork: AI Ethics",
    year: 2024,
    start: "2024-06",
    dateLabel: "Jun – Jul 2024",
    location: "Remote",
    org: "Green Proposition Consulting (UAE), via the Monash–Warwick Alliance",
    role: "Virtual Consulting Intern",
    summary:
      "Cross-border consulting team advising an AI-ethics consultancy on how the EU AI Act affects real businesses.",
    keyResult: "Final report & recommendations for manufacturing, retail and pharma",
    details: [
      "Worked in a cross-border team of 6–8 students, mentored by the client.",
      "Analysed AI trends across the IT industry.",
      "Deep-dived into how the EU AI Act affects businesses in the Netherlands.",
      "Contributed to the final report and recommendations for the manufacturing, retail and pharma sectors.",
    ],
    tags: ["Market research", "AI ethics", "Regulation", "Consulting"],
    links: [{ label: "GitHub", url: "https://github.com/chianyee32/TeaMWork---Ethical-Implementation-of-AI" }],
    icon: "scale",
    emceeLine: "My first consulting gig! We studied how the EU AI Act hits real businesses.",
  },
  {
    id: "hackfest-solana",
    title: "Monash Hackfest x Solana: MechaHolo, AR Beasts Unleashed",
    shortTitle: "Hackfest: MechaHolo",
    year: 2024,
    start: "2024-08",
    dateLabel: "Aug 2024",
    org: "Monash Blockchain Club × Superteam (Solana)",
    role: "Marketing & Community Engagement Specialist (team of 5)",
    summary:
      "Pitched MechaHolo: a real-world AR, location-based game on Solana where players capture, train and trade mechanical beasts, with a stablecoin-backed economy.",
    keyResult: "A full product pitch in 3 days: problem, competitors, token & NFT design, go-to-market and a 5-quarter roadmap",
    details: [
      "Ideated and pitched MechaHolo with a 5-person team (Team Manmon) in a 3-day blockchain ideathon on Solana.",
      "Owned marketing and community engagement: a go-to-market plan with conference demos, a closed beta that rewards testers with exclusive NFTs, university workshops, influencer partnerships and a localised international launch.",
      "Built the market case: GameFi players projected to grow from 20M (2023) to 50M+, and a competitor review of Axie Infinity, Avakin Life and My Crypto Heroes on entry cost, complexity, true NFT ownership and AR support.",
      "Product concept: capture 'Mechas' in the real world through AR (5 types, 3 combat classes), a stablecoin-backed in-game currency to avoid speculative token crashes, and location-based NFTs for Mechas, buildings and legal AR graffiti.",
      "Targeted three problems in Web3 gaming: grind-heavy play-to-earn, gaming NFTs with no lasting value, and fragile token economies.",
      "Planned a 5-quarter roadmap: beta gameplay, token release, AR-hardware integration and a launch campaign.",
    ],
    tags: ["Product ideation", "Go-to-market", "Community", "Competitor analysis", "Web3 / Solana", "AR"],
    icon: "blocks",
    emceeLine: "An AR game where you catch mechanical beasts in the real world, on Solana! I led our marketing and community plan.",
  },
  {
    id: "ipsos-cx",
    title: "Research Intern, Customer Experience: Ipsos Malaysia",
    shortTitle: "Ipsos Research Intern",
    year: 2025,
    start: "2024-11",
    dateLabel: "Nov 2024 – Feb 2025",
    location: "Kuala Lumpur (Hybrid)",
    org: "Ipsos Malaysia",
    role: "Research Intern, Customer Experience",
    summary: "Supported CX research end to end: data collection, quality checks and client-ready reporting.",
    keyResult: "Survey analysis & visual reports for CX projects",
    details: [
      "Supported customer-experience research projects from data collection through quality checks to reporting.",
      "Analysed survey data in Excel.",
      "Built PowerPoint reports and visualisations.",
      "Gained exposure to SPSS.",
    ],
    tags: ["Market research", "Data quality", "Excel", "PowerPoint"],
    icon: "clipboard",
    emceeLine: "At Ipsos I learned how real customer research goes from survey to slide deck.",
  },

  // ── 🏫 Year 2025 ─────────────────────────────────────────────
  {
    id: "fyp-chemoresistance",
    title: "Final Year Project: Multi-Omics Deep Learning for Predicting Chemoresistance",
    shortTitle: "FYP: Chemoresistance AI",
    year: 2025,
    start: "2024-08",
    dateLabel: "Aug 2024 – Jun 2025",
    org: "Monash University Malaysia",
    role: "Technical Lead (team of 4)",
    summary:
      "A deep neural network that predicts cancer drug response from multi-omics data, shipped as a web app for researchers.",
    keyResult: "R² = 0.804 (RMSE 1.22) vs 0.029 for the single-omics baseline",
    details: [
      "Led architecture design, model integration and deployment for a team of 4.",
      "Built a deep neural network (TensorFlow/Keras) combining gene-expression (19K+ features), protein and drug-structure (RDKit / isoSMILES) data across 224 cancer cell lines.",
      "Reached R² = 0.804 (RMSE 1.22), versus 0.029 for the single-omics baseline.",
      "Made a data-driven call: experiments showed genomics data reduced accuracy, so we removed it.",
      "Shipped a Flask web app (Docker, Heroku): researchers upload a CSV and get real-time drug-response predictions, top-10 drug charts, filtering and download.",
    ],
    tags: ["Deep learning", "Python", "TensorFlow", "Flask", "Docker", "Healthcare"],
    links: [{ label: "GitHub", url: "https://github.com/chianyee32/Final-Year-Project" }],
    images: [
      {
        src: "/media/projects/fyp-chemoresistance/fyp-website-intro-page.png",
        alt: "The live web app's introduction page: a multi-omics model that predicts cancer cell lines' resistance to chemotherapy drugs",
      },
      {
        src: "/media/projects/fyp-chemoresistance/fyp-data-pre-processing.png",
        alt: "Training data pre-processing: CCLE gene expression and other omics, GDSC drug responses (LN_IC50) and PubChem structures converted to 256-bit fingerprints, merged into one training table",
      },
      {
        src: "/media/projects/fyp-chemoresistance/fyp-experiment-results.png",
        alt: "Experiment results: transcriptomics + proteomics + GDSC2 + isoSMILES reached R² 0.804 (RMSE 1.22), while adding genomics lowered accuracy",
      },
      {
        src: "/media/projects/fyp-chemoresistance/fyp-website-home-page.png",
        alt: "Upload page: researchers upload a multi-omics CSV with the required columns",
      },
      {
        src: "/media/projects/fyp-chemoresistance/fyp-website-prediction-results-generated-for-download.png",
        alt: "After uploading: download the prediction file and filter results by cancer type",
      },
      {
        src: "/media/projects/fyp-chemoresistance/fyp-top-10-sensitive-drugs-by-COLON.png",
        alt: "Chart of the most sensitive drugs for colon cancer (lower predicted LN IC50 means more sensitive)",
      },
    ],
    icon: "dna",
    featured: true,
    emceeLine: "This is my Final Year Project! I was the Technical Lead, and we turned a model into a tool researchers can use.",
  },
  {
    id: "umhackathon-grab",
    title: "UMHackathon 2025: MEX Assistant, an AI Assistant for Grab Merchants",
    shortTitle: "UMHackathon: MEX Assistant",
    year: 2025,
    start: "2025-04",
    dateLabel: "Apr 2025",
    org: "UMHackathon 2025 · Team 502 Bad Gateway",
    role: "UI/UX & Pitch (team of 5)",
    summary:
      "Designed MEX Assistant: a chat-based AI assistant in the Grab merchant app that turns sales data into proactive, multilingual business advice.",
    keyResult: "Conversational UI, RAG-based backend design and a roadmap to pilot with Grab merchant-partners",
    details: [
      "Cross-university team of 5 tackling Grab's merchant-assistant challenge.",
      "Defined merchant needs: real-time insights, personalised recommendations, automated sales and inventory reports, and alerts on critical issues, tailored to merchant type, region and size.",
      "Designed the UI/UX: a clean conversational assistant with quick-access buttons (Sales & Earnings, Business Tips, Inventory Status), card-style answers (today's sales vs yesterday, top item, quiet and peak hours) and a bottom chat box.",
      "Shaped the features: AI-powered sales insights and marketing advice, recommendations for nearby delivery partners, and multilingual, colloquial conversation in regional languages.",
      "Backend design: retrieval-augmented generation (RAG), where prompts and merchant documents in a vector database give an LLM the right context, with platform API integrations and safety policies before each response.",
      "Delivered the pitch, with a roadmap from demo-ready prototype to pilot testing with Grab merchant-partners and launch inside the GrabMerchant app.",
    ],
    tags: ["Product ideation", "UI/UX", "Conversational AI", "RAG / LLMs", "Merchant analytics", "Pitching"],
    images: [
      {
        src: "/media/projects/umhackathon-grab/assistant-ui.png",
        alt: "MEX Assistant mock-ups: a sales summary card, and quick-access buttons with the question 'Why my sales drop today?'",
      },
    ],
    icon: "chat",
    emceeLine: "MEX Assistant! I designed a chat assistant that tells Grab merchants why their sales dropped today, in their own language.",
  },
  {
    id: "monash-cup-2025",
    title: "Treasurer & Pool Captain: Manticore House, Monash Cup 2025",
    shortTitle: "Monash Cup: Treasurer",
    year: 2025,
    start: "2025-03",
    dateLabel: "Mar – Sep 2025",
    org: "Manticore House, Monash Cup",
    role: "Treasurer & Pool Captain",
    summary: "Managed the house's finances and led the pool team's training.",
    details: ["Managed house finances.", "Led the pool team's training.", "TODO(Cheryl): any results or numbers?"],
    tags: ["Leadership", "Finance"],
    icon: "trophy",
    emceeLine: "Budgets by day, pool cue by night. I was Treasurer and Pool Captain!",
  },

  // ── 🏫 Year 2026 ─────────────────────────────────────────────
  {
    id: "timewise-engine",
    title: "TimeWise Engine: Study Planning Platform",
    shortTitle: "TimeWise Engine",
    year: 2026,
    start: "2026-03",
    dateLabel: "Mar – May 2026",
    org: "FIT5057 Project Management, Monash University",
    role: "Project Manager (team of 4)",
    summary:
      "A platform concept that turns Moodle deadlines and students' availability into personalised, conflict-aware study schedules.",
    keyResult: "Full RTM, Gantt plan, prioritised backlog & Scrum board, owned by me",
    details: [
      "Led a 4-person team as Project Manager.",
      "Wrote the Requirements Traceability Matrix and the scope statement.",
      "Built the full project Gantt chart and milestone plan in TeamGantt.",
      "Wrote epics & user stories, prioritised the backlog and kept the traceability table.",
      "Set up and ran the team's Scrum board in ClickUp.",
    ],
    tags: ["Product management", "Agile/Scrum", "Backlog", "Gantt", "Stakeholders"],
    // Own artefacts only: no reports, and teammates' avatars are hidden on the Scrum board.
    images: [
      {
        src: "/media/projects/timewise-engine/requirements-traceability-matrix.png",
        alt: "The Requirements Traceability Matrix I wrote: functional and non-functional requirements with category, source, status and assumptions",
      },
      {
        src: "/media/projects/timewise-engine/part-of-gantt-chatt.png",
        alt: "Part of my TeamGantt plan: work packages broken into sprints with dependencies and milestones",
      },
      {
        src: "/media/projects/timewise-engine/scrum-board.png",
        alt: "The team's ClickUp Scrum board in Sprint 2: epics in the product backlog, then to do, in progress, blocked and done (assignees hidden)",
      },
    ],
    icon: "clock",
    featured: true,
    emceeLine: "TimeWise Engine! As Project Manager I owned the scope, the backlog and the whole plan.",
  },
  {
    id: "fit5201-ml-from-scratch",
    title: "Machine Learning Algorithms from Scratch",
    shortTitle: "ML from Scratch",
    year: 2026,
    start: "2026-05",
    dateLabel: "May 2026",
    org: "FIT5201 Machine Learning, Monash University",
    role: "Individual project",
    summary:
      "Derived and coded core ML algorithms myself (EM clustering, Perceptrons, neural networks, autoencoders) instead of calling libraries.",
    keyResult: "Clustered news articles over a 30K-word vocabulary with my own EM implementation",
    details: [
      "Derived and implemented soft- and hard-EM for multinomial mixture models in NumPy (log-space) to cluster news articles over a 30K-word vocabulary. Soft-EM found better solutions, while hard-EM converged ~9× faster (≈6 vs 51 iterations).",
      "Compared L2-regularised Perceptrons (with and without early stopping) against 3-layer neural networks on non-linearly separable data, visualising their decision boundaries.",
      "Built a PyTorch autoencoder for self-taught learning on handwritten digits with only 40 labelled samples, and analysed when unlabelled data helps (and when it doesn't).",
    ],
    tags: ["Python", "NumPy", "PyTorch", "Unsupervised learning", "Neural networks", "Maths behind ML"],
    // Coursework: no links to notebooks or code. Own plots only.
    images: [
      {
        src: "/media/projects/fit5201-ml-from-scratch/perceptron-vs-neural-network.png",
        alt: "Best Perceptron (test error 0.123) vs best 3-layer neural network (0.0445) on non-linearly separable data, with test errors compared",
      },
      {
        src: "/media/projects/fit5201-ml-from-scratch/perceptron-decision-boundaries.png",
        alt: "Perceptron decision boundaries with and without early stopping: a straight line can't separate the two classes",
      },
      {
        src: "/media/projects/fit5201-ml-from-scratch/neural-network-decision-boundaries.png",
        alt: "Neural network boundaries: light regularisation (λ=0.001) bends around the data, heavy regularisation (λ=1.0) flattens into a near-straight line",
      },
    ],
    icon: "network",
    emceeLine: "Here I opened the black box: no shortcuts, I wrote the maths and the code myself!",
  },
  {
    id: "fit5222-train-scheduling",
    title: "Multi-Agent Train Scheduling under Malfunctions",
    shortTitle: "Multi-Agent Trains",
    year: 2026,
    start: "2026-09",
    dateLabel: "Sep 2026",
    org: "FIT5222 Planning & Automated Reasoning, Monash University",
    role: "Individual project",
    summary:
      "Conflict-free route planning for up to 150 trains on a simulated railway, with live replanning when trains break down.",
    keyResult: "Delivered 99.9% of 2,800+ trains and met 93.5% of deadlines across 56 benchmark instances",
    details: [
      "Built conflict-free route planners in Python for the Flatland railway simulator, progressing from single-train A* search to multi-agent planning with space-time reservation tables.",
      "Implemented Safe Interval Path Planning (SIPP), prioritised planning and Large Neighbourhood Search (MAPF-LNS) with malfunction-aware replanning.",
      "Sped up search with cached reverse-Dijkstra heuristics per map.",
      "Refined the solution over 25+ Git-tracked experiments (e.g. deadlock rerouting, search budgets near the time limit, slack-based agent ordering).",
      "Results: 99.9% of 2,800+ trains delivered and 93.5% of deadlines met, across 56 test instances of up to 150 trains each.",
    ],
    tags: ["Python", "A* search", "Multi-agent pathfinding", "Optimisation", "Scheduling", "Operations"],
    // Coursework: no link to the (private) repository. Own media only.
    images: [
      {
        src: "/media/projects/fit5222-train-scheduling/flatland-multi-agent-level1.mp4",
        alt: "Screen recording of the Flatland visualiser: multiple trains following conflict-free routes planned by my solver",
      },
    ],
    icon: "route",
    featured: true,
    emceeLine:
      "Ever wondered how to get 150 trains home on time when some of them break down? This one's my favourite puzzle!",
  },
  {
    id: "coming-soon",
    title: "Coming soon…",
    shortTitle: "Under construction",
    year: 2026,
    start: "2026-12",
    dateLabel: "Next up",
    role: "Future Master's projects",
    summary: "This desk is saved for what I build next.",
    details: ["Master's projects are on the way. Check back soon!"],
    tags: ["Stay tuned"],
    icon: "plus",
    comingSoon: true,
    emceeLine: "This desk is waiting for my next project. Watch this space!",
  },
];

export const years: Year[] = [2024, 2025, 2026];

/** Projects for one year, in date order (Journey Map, lists). */
export function projectsByYear(year: Year): Project[] {
  return projects.filter((p) => p.year === year).sort((a, b) => a.start.localeCompare(b.start));
}

/** Desks inside a classroom: `classrooms[year].order` first, then the rest by date. */
export function stationsByYear(year: Year): Project[] {
  const order = classrooms[year].order ?? [];
  const rank = (p: Project) => (order.includes(p.id) ? order.indexOf(p.id) : order.length);
  return projectsByYear(year).sort((a, b) => rank(a) - rank(b));
}
