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

export interface ProjectImage {
  src?: string; // leave empty to show a placeholder
  alt: string;
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
   *  dna, chat, trophy, clock, cloud, plus, star, code, chart, … */
  icon: string;
  featured?: boolean;
  comingSoon?: boolean;
  /** What the emcee says when you walk up to this project. */
  emceeLine: string;
}

export const classrooms: Record<Year, { name: string; blurb: string }> = {
  2024: { name: "Year 2024", blurb: "Going global: consulting, blockchain & algorithms" },
  2025: { name: "Year 2025", blurb: "Deep learning, research, hackathons & leadership" },
  2026: { name: "Year 2026", blurb: "Product management & what's next" },
};

export const projects: Project[] = [
  // ── 🏫 Year 2024 ─────────────────────────────────────────────
  {
    id: "algorithmic-adventures",
    title: "Algorithmic Adventures: From Fusion Logic to Forest Escapes",
    shortTitle: "Algorithmic Adventures",
    year: 2024,
    start: "2024-04",
    dateLabel: "Apr 2024",
    org: "Monash University",
    role: "Developer", // TODO(Cheryl): confirm role
    summary: "An algorithms & data structures project solving puzzle-style problems.", // TODO(Cheryl): 1–2 line summary
    details: [
      "TODO(Cheryl): what problems did you solve, and which algorithms / data structures did you use?",
    ],
    tags: ["Algorithms", "Data structures", "Python"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/chianyee32/Algorithmic-Adventures-From-Fusion-Logic-to-Forest-Escapes",
      },
    ],
    icon: "puzzle",
    emceeLine: "Algorithms homework, but make it an adventure! Fusion logic and forest escapes.",
  },
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
    title: "Monash Hackfest x Solana",
    shortTitle: "Hackfest x Solana",
    year: 2024,
    start: "2024-08",
    dateLabel: "Aug 2024",
    org: "Monash Blockchain Club",
    role: "Participant", // TODO(Cheryl): confirm role
    summary: "A 3-day blockchain ideathon with the Monash Blockchain Club.",
    details: [
      "3-day ideathon exploring product ideas on Solana.",
      "TODO(Cheryl): what idea did your team pitch, and what did you work on?",
    ],
    tags: ["Blockchain", "Ideation"],
    icon: "blocks",
    emceeLine: "Three days, one blockchain idea, a lot of coffee.",
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
      { alt: "FYP web app: CSV upload and prediction results" },
      { alt: "Top-10 drug response chart" },
    ],
    icon: "dna",
    featured: true,
    emceeLine: "This is my Final Year Project! I was the Technical Lead, and we turned a model into a tool researchers can use.",
  },
  {
    id: "umhackathon-grab",
    title: "UMHackathon 2025: AI Assistant for Grab Merchants",
    shortTitle: "UMHackathon: Grab AI",
    year: 2025,
    start: "2025-04",
    dateLabel: "Apr 2025",
    org: "UMHackathon 2025",
    role: "UI/UX & Pitch (team of 5)",
    summary:
      "Proposed a chat-based AI assistant giving Grab merchants real-time insights, personalised tips and multilingual support.",
    details: [
      "Cross-university team of 5.",
      "Identified merchant pain points and shaped the product concept.",
      "Proposed a chat-based AI assistant with real-time business insights, personalised recommendations and multilingual support.",
      "Designed the UI/UX and delivered the pitch.",
    ],
    tags: ["Product ideation", "UI/UX", "AI", "Pitching"],
    icon: "chat",
    emceeLine: "A hackathon where I got to design and pitch a product for Grab merchants. So fun!",
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
    images: [
      { alt: "My TeamGantt project plan with milestones" },
      { alt: "The team's Scrum board in ClickUp" },
    ],
    icon: "clock",
    featured: true,
    emceeLine: "TimeWise Engine! As Project Manager I owned the scope, the backlog and the whole plan.",
  },
  {
    id: "aws-workshop",
    title: "AWS Cloud Practitioners Workshop",
    shortTitle: "AWS Workshop",
    year: 2026,
    start: "2026-08",
    dateLabel: "Aug 2026 – present",
    org: "Monash AWS Student Builder Group",
    role: "Participant", // TODO(Cheryl): confirm role
    summary: "Learning cloud fundamentals with the Monash AWS Student Builder Group.",
    details: ["TODO(Cheryl): what are you building or learning here?"],
    tags: ["Cloud", "AWS"],
    icon: "cloud",
    emceeLine: "Currently leveling up my cloud skills with AWS. Still in progress!",
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

/** Projects for one classroom, in date order. */
export function projectsByYear(year: Year): Project[] {
  return projects.filter((p) => p.year === year).sort((a, b) => a.start.localeCompare(b.start));
}
