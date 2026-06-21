export const PROFILE = {
  name: "Riddhi Pachehara",
  shortName: "Riddhi",
  titles: ["Full-Stack Developer", "Software Engineer", "Problem Solver"],
  tagline:
    "Computer Science undergraduate with hands-on experience building scalable full-stack applications using React.js, Node.js, REST APIs, SQL, and cloud platforms.",
  phone: "+91 80771 89209",
  location: "India",
  socials: {
    github: "https://github.com/Riddhi8077",
    linkedin: "https://www.linkedin.com/in/riddhi-pachehara/",
    leetcode: "https://leetcode.com/u/Riddhi8077/",
  },
  leetcodeUsername: "Riddhi8077",
  resumePath: "/assets/Riddhi_Pachehara_Resume.pdf",
};

export const EXPERIENCES = [
  {
    id: "exp-1",
    company: "Market Creators",
    role: "Web Development Intern",
    period: "Internship",
    bullets: [
      "Designed and deployed Node.js REST APIs serving 1k+ users, improving system reliability and reducing manual operations.",
      "Improved mobile performance by ~30% through responsive UI refactoring and cross-device testing.",
    ],
    stack: ["Node.js", "REST APIs", "Responsive UI"],
  },
  {
    id: "exp-2",
    company: "NullClass",
    role: "Web Development Intern",
    period: "Internship",
    bullets: [
      "Built a full-stack ticket booking system using Node.js and SQL, implementing booking, cancellation, and refund workflows.",
      "Developed modular front-end components for scalable and maintainable UI architecture.",
    ],
    stack: ["Node.js", "SQL", "React"],
  },
  {
    id: "exp-3",
    company: "Lensshine",
    role: "Technical Lead • E-commerce Platform",
    period: "Full-stack ownership",
    bullets: [
      "Built a full-stack optical store management software using React, Node.js, Express, and MongoDB.",
      "Implemented billing, dashboard analytics, customer history, and invoice generation with Netlify + Render deployment.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
  },
];

export const PROJECT_CATEGORIES = [
  {
    id: "hackathons",
    title: "Hackathon Projects",
    subtitle: "Award-winning innovation builds",
    projects: [
      {
        id: "medoveda",
        title: "MedoVeda",
        award: "Google Cloud Winner",
        description:
          "AI-powered food analysis platform using OCR, nutrition APIs, and risk detection systems to identify harmful ingredients and provide real-time health insights.",
        stack: ["React", "Node.js", "OCR", "AI", "Nutrition APIs"],
        mockup: "/assets/projects/medoveda.png",
        link: "https://medo-veda.netlify.app/",
      },
      {
        id: "SynGov",
        title: "SynGov",
        award: "Google Hack Days in Delhi tOP 5 Finalist",
        description:
          "SynGov gives your club the structure to make decisions together - fairly, transparently, and without drama. AI simplifies proposals. Your contributions shape your influence.",
        stack: ["React", "Node.js", "OCR", "AI", "Gemini APIs"],
        mockup: "/assets/projects/SynGov.png",
        link: "https://syn-gov.vercel.app/",
      },
      {
        id: "Preecode",
        title: "Preecode",
        award: "NeuroX hackathon Winner",
        description:
          "Preecode helps developers practice consistently, review code with AI assistance, and improve problem-solving skills without leaving their editor. It combines coding workflows, guidance, and progress-oriented tooling in one extension.",
          stack: ["TypeScript", "Node.js", "MongoDB", "Express.js", "OpenAI API", "Model Context Protocol (MCP)"],
        mockup: "/assets/projects/Preecode.png",
        link: "https://preecode.vercel.app/",
      },
    ],
  },

  {
    id: "freelancing",
    title: "Freelancing Projects",
    subtitle: "Production-ready client solutions",
    projects: [
      {
        id: "upshotx",
        title: "UpShotX",
        award: "Client Project",
        description:
          "Developed and deployed a modern business website for a real-world client with responsive UI, optimized performance, and production deployment.",
        stack: ["React", "Tailwind", "Responsive UI", "Deployment"],
        mockup: "/assets/projects/upshotx.png",
        link: "https://upshotx.com/",
      },
    ],
  },

  {
    id: "internships",
    title: "Internship Projects",
    subtitle: "Industry-level internship work",
    projects: [
      {
        id: "amazon-microsite",
        title: "Amazon Microsite",
        award: "Internship Project",
        description:
          "Built a responsive microsite focused on bulk gift card solutions with optimized UI structure and user-focused navigation.",
        stack: ["React", "Tailwind", "Frontend"],
        mockup: "/assets/projects/amazon.png",
        link: "https://marketcreators.in/bulkgiftcards",
      },

      {
        id: "ticket-booking",
        title: "Ticket Booking System",
        award: "Internship Project",
        description:
          "Developed a modern ticket booking platform with responsive design, smooth interactions, and optimized frontend architecture.",
        stack: ["React", "JavaScript", "Responsive Design"],
        mockup: "/assets/projects/ticketbooking.png",
        link: "https://riddhiinternshipproject.netlify.app/",
      },

      {
        id: "lensshine-software",
        title: "Lensshine Billing Software",
        award: "Business Software",
        description:
          "Custom customer billing and management software designed for Lensshine optical operations with invoice and customer handling workflows.",
        stack: ["React", "Business Logic", "Billing System"],
        mockup: "/assets/projects/lensshine.png",
        link: "https://lensshinesoftware.netlify.app/",
      },
    ],
  },
];

export const SKILLS = [
  {
    category: "Languages",
    icon: "Code2",
    items: ["Java", "JavaScript", "Python", "C++", "SQL"],
  },
  {
    category: "Frontend",
    icon: "Layout",
    items: ["React.js", "HTML", "CSS", "Responsive Design"],
  },
  {
    category: "Backend",
    icon: "Server",
    items: ["Node.js", "REST APIs", "Authentication"],
  },
  {
    category: "Cloud & Tools",
    icon: "Cloud",
    items: ["AWS", "Google Cloud", "Git", "Linux", "API Testing"],
  },
  {
    category: "Core CS",
    icon: "Cpu",
    items: ["DSA", "OOP", "DBMS", "Operating Systems"],
  },
];

export const EDUCATION = [
  {
    degree: "B.Tech in Computer Science and Technology",
    school: "Sanskriti University, Mathura",
    period: "2023 – 2027",
  },
  {
    degree: "Senior Secondary School",
    school: "Romex International School, Mathura",
    period: "2020 – 2022",
  },
];

export const CERTIFICATIONS = [
  {
    title: "AWS: Solutions Architecture Virtual Experience",
    issuer: "Amazon (Forage)",
  },
  {
    title: "Google Cloud: Create and Manage Cloud Resources",
    issuer: "Skill Boost",
  },
  {
    title: "Infosys Springboard: Virtual Internship 6.0",
    issuer: "AI Track • 17 courses",
  },
  {
    title: "Career Essentials in Data Analysis",
    issuer: "Microsoft & LinkedIn",
  },
];
