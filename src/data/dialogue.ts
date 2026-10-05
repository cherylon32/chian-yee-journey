// What the emcee says outside of individual projects
// (per-project lines live in projects.ts as `emceeLine`).

export const dialogue = {
  heroBubble: "Hi, I'm Chian Yee! Welcome to my journey 👋",
  tutorial: "Use the arrow keys or the joystick to walk around!",
  tree: "My Skills Tree! Everything that falls out of it is a tool I use. Want the full list?",
  console: "You found my retro console! I'm into retro gaming history. Fancy a round of Snake?",
  // Byte, the AI teammate, cycles through these
  byte: [
    "Beep! I'm Byte, Cheryl's AI teammate. I'm refactoring her portfolio. Again.",
    "Fun fact: this whole campus downloads in about 20 KB. I'm very proud.",
    "Cheryl writes the user stories, I write the code, and she still reviews my pull requests.",
  ],
  rooms: {
    2024: "Year 2024! My study-abroad year and my first internship.",
    2025: "Year 2025, the big one! My Final Year Project and my Ipsos internship live here.",
    2026: "Year 2026: where I found product management. Come see!",
  },
} as const;
