// ─────────────────────────────────────────────────────────────
//  Everything about YOU lives here. Edit freely; the site updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "On Chian Yee",
  nickname: "Cheryl",
  greeting: "Hi, I'm Chian Yee!",
  tagline: "Data Science → Product. I turn data and user needs into products people actually use.",
  location: "Subang Jaya, Selangor, Malaysia",
  email: "cherylon32@gmail.com",

  links: {
    linkedin: "https://www.linkedin.com/in/chian-yee-on-326680222/",
    github: "https://github.com/chianyee32",
    // Drop these two PDFs into /public with exactly these names.
    resumePM: "/On_Chian_Yee_Resume_Product_Management.pdf",
    resumeData: "/On_Chian_Yee_Resume_Data_Science.pdf",
  },

  // Draft: edit this paragraph to sound like you.
  about: [
    "I'm a Master of Data Science student at Monash University Malaysia. I started out building models, and slowly realised the part I enjoy most is the question around them: why are we building this, and for whom?",
    "As Technical Lead on my Final Year Project, I helped turn a chemoresistance prediction model into a web tool researchers could actually use. Then, as Project Manager of TimeWise Engine, I owned the scope, the backlog and the plan end to end, and found the work I want to keep doing.",
    "Now I'm looking to bring data-driven product thinking to fintech and IT teams.",
  ],

  // Shown as a status badge at the top of the hero.
  availability: "Open to Product Management internships",
  headline: "Aspiring Product Manager with a data science background",

  // The "Quick profile" card in the hero. icon: pin | cap | user | globe | leaf | sparkle
  personal: [
    { icon: "pin", label: "Based in", value: "Subang Jaya, Selangor, Malaysia" },
    { icon: "cap", label: "Studying", value: "Master of Data Science, Monash University Malaysia (to Jun 2027)" },
    { icon: "user", label: "Personality", value: "ENTJ" },
    { icon: "globe", label: "Languages", value: "English, Mandarin, Bahasa Malaysia, Cantonese, Hakka" },
    { icon: "leaf", label: "Interests", value: "Learning, Earning, Travelling" },
  ],

  lookingFor: {
    first: "Product Management internships in IT or fintech",
    also: ["Machine Learning", "Artificial Intelligence", "Data Science", "Data Analytics", "Business Analytics"],
  },

  skills: [
    {
      group: "Product",
      icon: "compass",
      items: [
        "Agile / Scrum",
        "Backlog prioritisation",
        "User stories",
        "Requirements traceability",
        "Scope & schedule planning",
        "Market & user research",
        "UI/UX design",
      ],
    },
    {
      group: "Data & ML",
      icon: "chart",
      items: [
        "Python (pandas, NumPy, scikit-learn)",
        "TensorFlow / Keras",
        "SQL",
        "R",
        "Tableau",
        "Excel",
        "Spark",
        "Kafka",
        "MongoDB",
        "SAS Viya",
        "SPSS (basic)",
      ],
    },
    {
      group: "Tools",
      icon: "tools",
      items: ["ClickUp", "TeamGantt", "Flask", "Docker", "Heroku", "Git / GitHub", "AWS (fundamentals)"],
    },
  ],

  // Badges that hang on (and fall from) the Skills Tree in Explore Mode.
  // Keep it to about 10. short: the tag shown on the hanging fruit.
  // group: "Product" | "Data & ML" | "Tools"
  treeSkills: [
    { label: "Python", short: "Py", group: "Data & ML" },
    { label: "SQL", short: "SQL", group: "Data & ML" },
    { label: "TensorFlow", short: "TF", group: "Data & ML" },
    { label: "Tableau", short: "Tb", group: "Data & ML" },
    { label: "Agile / Scrum", short: "Ag", group: "Product" },
    { label: "User stories", short: "US", group: "Product" },
    { label: "UI/UX", short: "UX", group: "Product" },
    { label: "Docker", short: "Dk", group: "Tools" },
    { label: "Git", short: "Git", group: "Tools" },
    { label: "AWS", short: "AWS", group: "Tools" },
  ],

  education: [
    {
      degree: "Master of Data Science",
      school: "Monash University Malaysia",
      dates: "Mar 2026 – Jun 2027 (expected)",
      note: "CGPA 3.63 · Project Management, Machine Learning, Deep Learning, AI, Statistical Modelling, Data Wrangling",
    },
    {
      degree: "Bachelor of Computer Science (Data Science)",
      school: "Monash University Malaysia",
      dates: "Oct 2022 – Nov 2025",
    },
    {
      degree: "Study abroad semester",
      school: "Monash University Clayton, Melbourne",
      dates: "Feb – Jun 2024",
    },
  ],

  certifications: [
    "Understanding Digital Transformation (MyDIGITAL, 2026)",
    "TeaMWork Virtual Internship Certificate (Monash–Warwick)",
  ],

  languages: ["English", "Mandarin", "Bahasa Malaysia", "Cantonese", "Hakka"],

  // TODO(Cheryl): add more fun facts
  funFacts: [

  ],
} as const;

export type Profile = typeof profile;
