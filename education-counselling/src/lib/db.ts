import fs from "fs";
import path from "path";
import { dummyUniversities } from "@/data/universities";

export interface ScholarshipDetail {
  name: string;
  eligibility: string;
  gpa: string;
  ielts: string;
  coverage: string;
  procedure: string;
  deadline: string;
}

export interface UniversityAdmissionRequirements {
  qualification: string;
  gradesGpa: string;
  english: string;
  satAct: string;
  documents: string[];
  statement: string;
  recommendations: string;
  portfolioInterview: string;
}

export interface UniversityGraduateRequirements {
  qualification: string;
  gradesGpa: string;
  greGmat: string;
  english: string;
  statementPurpose: string;
  recommendations: string;
  resumeCv: string;
  researchProposal: string;
}

export interface UniversityApplicationInfo {
  openDate: string;
  priorityDeadline: string;
  finalDeadline: string;
  appFee: string;
  platform: string;
  estTuition: string;
  estLiving: string;
  scholarships: string;
}

export interface UniversityOfficialLinks {
  undergradRequirements: string;
  gradRequirements: string;
  internationalStudents: string;
  tuitionFees: string;
  scholarshipInfo: string;
  applyWebsite: string;
}

export interface ExtendedUniversity {
  slug: string;
  name: string;
  country: string;
  logo: string;
  banner: string;
  ranking: { qs: string; world: string };
  scholarships: { available: boolean; details: ScholarshipDetail[] };
  overview: { about: string; campusLife: string; population: string; internationalStudents: string };
  programs: { undergraduate: string[]; masters: string[]; phd: string[] };
  admission: { entryRequirements: string; englishRequirements: string; documents: string[]; process: string; processingTime: string };
  fees: { tuition: string; accommodation: string; livingExpenses: string; visaCost: string };
  gallery: string[];
  faq: { q: string; a: string }[];
  intakes: string[];
  
  // Extended CMS Fields
  featured: boolean;
  lastUpdated: string;
  officialLinks: UniversityOfficialLinks;
  undergradRequirements: UniversityAdmissionRequirements;
  gradRequirements: UniversityGraduateRequirements;
  applicationInfo: UniversityApplicationInfo;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  program: string;
  expertise: string;
  countries: string;
  bio: string;
  linkedin: string;
  image: string;
}

export interface TutoringCourse {
  id: string;
  name: string; // IELTS, OET, SAT
  description: string;
  duration: string;
  schedule: string;
  fee: string;
  format: string; // Online, In-Person
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  published: boolean;
}

export interface Booking {
  id: string;
  type: "consultation" | "course" | "private" | "inquiry";
  studentName: string;
  parentName?: string;
  email: string;
  phone: string;
  currentSchool?: string;
  currentQualification?: string;
  intendedDegree?: string;
  preferredField?: string;
  preferredCountries?: string;
  preferredDate?: string;
  preferredTime?: string;
  description?: string;
  expectedIntake?: string;
  scholarshipRequired?: boolean;
  academicGrades?: string;
  englishTestStatus?: string;
  preferredBatchTiming?: string;
  requiredService?: string;
  sessionDuration?: string;
  documents?: string[];
  createdAt: string;
}

export interface DbStore {
  universities: ExtendedUniversity[];
  mentors: Mentor[];
  tutoring: TutoringCourse[];
  articles: Announcement[];
  bookings: Booking[];
}

const STORE_PATH = path.join(process.cwd(), "src/data/db_store.json");

// Helper to determine the path when called from the main app workspace
function getStorePath(): string {
  if (fs.existsSync(STORE_PATH)) {
    return STORE_PATH;
  }
  // Try parent folder lookups if running from main admin workspace
  const alternativePath = path.join(process.cwd(), "education-counselling/src/data/db_store.json");
  if (fs.existsSync(alternativePath) || process.cwd().endsWith("paksarzameen")) {
    return alternativePath;
  }
  return STORE_PATH;
}

export function getDbStore(): DbStore {
  const storeFile = getStorePath();
  
  // Make sure directory exists
  const dir = path.dirname(storeFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(storeFile)) {
    try {
      const content = fs.readFileSync(storeFile, "utf-8");
      return JSON.parse(content) as DbStore;
    } catch (e) {
      console.error("Failed to read JSON DB store, using fallback", e);
    }
  }

  // Generate and return initial default DB store
  const store = generateDefaultStore();
  saveDbStore(store);
  return store;
}

export function saveDbStore(store: DbStore): void {
  const storeFile = getStorePath();
  const dir = path.dirname(storeFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(storeFile, JSON.stringify(store, null, 2), "utf-8");
}

function generateDefaultStore(): DbStore {
  // Map dummyUniversities to ExtendedUniversity format
  const extendedUniversities: ExtendedUniversity[] = dummyUniversities.map((uni, idx) => {
    // Feature first 3 by default
    const featured = idx < 3;
    
    return {
      ...uni,
      featured,
      lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      officialLinks: {
        undergradRequirements: `https://www.${uni.slug}.edu/admissions/undergraduate`,
        gradRequirements: `https://www.${uni.slug}.edu/admissions/graduate`,
        internationalStudents: `https://www.${uni.slug}.edu/admissions/international`,
        tuitionFees: `https://www.${uni.slug}.edu/financial-aid/tuition`,
        scholarshipInfo: `https://www.${uni.slug}.edu/financial-aid/scholarships`,
        applyWebsite: `https://www.${uni.slug}.edu/apply`,
      },
      undergradRequirements: {
        qualification: "Higher Secondary School Certificate (HSSC), A-Levels, or equivalent standard secondary school credential.",
        gradesGpa: uni.ranking.qs === "4" ? "3.8+ GPA / A Grades" : "3.0+ GPA / B Grades",
        english: "IELTS 7.0+ or TOEFL 95+ (no subscore below 6.5)",
        satAct: uni.ranking.qs === "4" ? "SAT 1450+ or ACT 32+ (Optional but highly recommended)" : "SAT/ACT optional",
        documents: [
          "Secondary School Profile & Transcripts",
          "School Counsellor Recommendation Letter",
          "Two Core Academic Teacher Recommendations",
          "Mid-Year High School Report",
          "Official English Language Test Score Card"
        ],
        statement: "Undergraduate Common Application Essay or Coalition Statement (650 words max).",
        recommendations: "Two teacher letters of recommendation and one counselor evaluation letter.",
        portfolioInterview: "Required only for Architecture, Fine Arts, and Music majors. Virtual alumni interviews are optional."
      },
      gradRequirements: {
        qualification: "Accredited Bachelor's degree (4-year duration) or equivalent from a recognized institution.",
        gradesGpa: uni.ranking.qs === "4" ? "3.7+ GPA on a 4.0 scale" : "3.0+ GPA on a 4.0 scale",
        greGmat: "GRE/GMAT required for most STEM, Business, and Finance courses. Test-optional for humanities.",
        english: "IELTS 7.5+ or TOEFL 100+ (with minimal subscores)",
        statementPurpose: "Comprehensive Statement of Purpose outlining research goals, motivation, and career trajectory (1000 words max).",
        recommendations: "Three professional or academic recommendation letters detailing candidate's research capabilities.",
        resumeCv: "An up-to-date Academic CV highlighting publications, projects, internships, and research papers.",
        researchProposal: "A detailed 2-3 page research proposal required for Ph.D. positions and research-track Masters."
      },
      applicationInfo: {
        openDate: "September 1, 2026",
        priorityDeadline: "November 1, 2026 (Early Action / Early Decision)",
        finalDeadline: "January 15, 2027 (Regular Decision)",
        appFee: "$75 - $90 USD",
        platform: "Common Application / Coalition App / Direct University Portal",
        estTuition: uni.fees.tuition,
        estLiving: `${uni.fees.accommodation} (Accomodation) + ${uni.fees.livingExpenses} (Living Expenses)`,
        scholarships: uni.scholarships.available 
          ? `Available: ${uni.scholarships.details.map(d => d.name).join(", ")}`
          : "Limited need-based support for international candidates."
      }
    };
  });

  const mentors: Mentor[] = [
    {
      id: "m-1",
      name: "Muhammad Usama",
      role: "Head Counsellor & Founder",
      organization: "PakSarZameen",
      program: "Education Counselling Director",
      expertise: "Academic Pathways, Personal Statements, Ivy League & Group of Eight Admissions",
      countries: "United States, United Kingdom, Canada, Australia",
      bio: "Usama has helped over 500+ Pakistani students secure placements at Ivy League colleges and top global institutions. He specializes in building profile strengths and storytelling in essays.",
      linkedin: "https://www.linkedin.com/in/usamanworld",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "m-2",
      name: "Sarah Ahmed",
      role: "Senior Graduate Advisor",
      organization: "LUMS Alumna",
      program: "Master's & PhD Pathways",
      expertise: "Research Proposal Drafts, STEM Programs, DAAD & Fulbright Applications",
      countries: "Germany, Sweden, Netherlands, United States",
      bio: "Sarah holds a Master's degree in Biotechnology. She helps graduate aspirants formulate compelling research proposals and secure fully-funded lab placements.",
      linkedin: "https://www.linkedin.com/in/sarah-ahmed-counsel",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "m-3",
      name: "Dr. Faisal Khan",
      role: "Medical Pathways Consultant",
      organization: "King Edward Medical University",
      program: "MD / MBBS & OET Advisor",
      expertise: "Medical Residency matching, USMLE Step prep, OET Exam Structure",
      countries: "United Kingdom, United States, Ireland",
      bio: "Dr. Faisal advises medical graduates on clinical licensing procedures, medical school transfers, and residency pathways in NHS UK and US hospital environments.",
      linkedin: "https://www.linkedin.com/in/dr-faisal-khan-med",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop"
    }
  ];

  const tutoring: TutoringCourse[] = [
    {
      id: "t-1",
      name: "IELTS Preparation",
      description: "Comprehensive training covering Reading, Writing, Speaking, and Listening modules with weekly mock exams and feedback evaluations.",
      duration: "8 Weeks",
      schedule: "Mon & Wed, 6:00 PM - 8:00 PM (Online & Physical)",
      fee: "PKR 18,000",
      format: "Hybrid (Online / Physical)"
    },
    {
      id: "t-2",
      name: "OET Preparation",
      description: "Specialized language preparation for healthcare professionals. Tailored modules mimicking medical workplace scenarios, letters, and dialogues.",
      duration: "6 Weeks",
      schedule: "Tue & Thu, 7:00 PM - 9:00 PM (Online Only)",
      fee: "PKR 25,000",
      format: "Online"
    },
    {
      id: "t-3",
      name: "SAT Preparation",
      description: "Rigorous syllabus alignment for Digital SAT. Master high-scoring tactics in Reading & Writing and Math. Access to 10 full-length practice tests.",
      duration: "10 Weeks",
      schedule: "Sat & Sun, 11:00 AM - 1:30 PM (Physical Only)",
      fee: "PKR 30,000",
      format: "In-Person"
    }
  ];

  const articles: Announcement[] = [
    {
      id: "a-1",
      title: "Fall 2027 Admissions Cycle Kick-off Webinar",
      content: "Join us on Sunday, August 10th, 2026, for a free webinar explaining application timelines, letters of recommendation, and personal statements.",
      category: "Event",
      date: "July 18, 2026",
      published: true
    },
    {
      id: "a-2",
      title: "Commonwealth Scholarship Applications Now Open",
      content: "The Commonwealth Scholarship Commission has opened applications for Master's and PhD programs for candidates from low and middle-income nations.",
      category: "Scholarship News",
      date: "July 15, 2026",
      published: true
    }
  ];

  return {
    universities: extendedUniversities,
    mentors,
    tutoring,
    articles,
    bookings: []
  };
}
