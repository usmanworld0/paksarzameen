export interface Scholarship {
  name: string;
  eligibility: string;
  gpa: string;
  ielts: string;
  coverage: string;
  procedure: string;
  deadline: string;
}

export interface UniversityOverview {
  about: string;
  campusLife: string;
  population: string;
  internationalStudents: string;
}

export interface UniversityPrograms {
  undergraduate: string[];
  masters: string[];
  phd: string[];
}

export interface UniversityAdmission {
  entryRequirements: string;
  englishRequirements: string;
  documents: string[];
  process: string;
  processingTime: string;
}

export interface UniversityFees {
  tuition: string;
  accommodation: string;
  livingExpenses: string;
  visaCost: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface University {
  slug: string;
  name: string;
  country: string;
  logo: string; // Gradient fallback color or custom emoji/symbol indicator
  banner: string;
  ranking: {
    qs: string;
    world: string;
  };
  scholarships: {
    available: boolean;
    details: Scholarship[];
  };
  overview: UniversityOverview;
  programs: UniversityPrograms;
  admission: UniversityAdmission;
  fees: UniversityFees;
  gallery: string[];
  faq: FAQItem[];
  intakes: string[];
}

export const dummyUniversities: University[] = [
  {
    slug: "harvard-university",
    name: "Harvard University",
    country: "United States",
    logo: "linear-gradient(135deg, #a51c30 0%, #ed1b2f 100%)",
    banner: "/images/universities/harvard-banner.webp",
    ranking: { qs: "4", world: "4" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Harvard College Financial Aid",
          eligibility: "Demonstrated financial need, open to all nationalities.",
          gpa: "3.8+",
          ielts: "7.5 (or TOEFL equivalent)",
          coverage: "100% of demonstrated financial need (tuition, fees, room, and board)",
          procedure: "Submit CSS Profile and supporting family tax returns via IDOC.",
          deadline: "January 1"
        }
      ]
    },
    overview: {
      about: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher learning in the United States and is ranked among the most prestigious universities in the world.",
      campusLife: "With 12 historic undergraduate residential Houses, Harvard offers a close-knit, supportive residential environment. Students have access to over 400 student organizations, elite athletic clubs, and world-class libraries.",
      population: "21,000+",
      internationalStudents: "23%"
    },
    programs: {
      undergraduate: [
        "Computer Science (A.B.)",
        "Economics (A.B.)",
        "Applied Mathematics (A.B.)",
        "Government & Political Science (A.B.)"
      ],
      masters: [
        "Master of Business Administration (MBA)",
        "Master of Science in Computational Science",
        "Master of Public Policy (MPP)"
      ],
      phd: [
        "Ph.D. in Computer Science",
        "Ph.D. in Business Economics",
        "Ph.D. in Physics"
      ]
    },
    admission: {
      entryRequirements: "Exceptional high school transcript, 2 teacher evaluations, mid-year school report, Common Application essay, SAT/ACT scores (test-optional depending on application year).",
      englishRequirements: "IELTS 7.5+ or TOEFL 100+ (highly recommended, though no hard minimum score is strictly enforced).",
      documents: [
        "Official Transcripts",
        "Two Teacher Recommendations",
        "Common Application Essay",
        "Proof of English Language Proficiency",
        "CSS Financial Profile (if applying for aid)"
      ],
      process: "Apply online via the Common Application. Submit all secondary school credentials. Shortlisted applicants are contacted for a virtual alumni interview.",
      processingTime: "8 to 12 weeks"
    },
    fees: {
      tuition: "$54,269 / year",
      accommodation: "$12,424 / year",
      livingExpenses: "$6,500 / year",
      visaCost: "$510 (SEVIS + F1 Visa Fee)"
    },
    intakes: ["Fall (September)"],
    gallery: [
      "/images/universities/harvard-banner.webp",
      "/images/universities/gallery-harvard-2.webp",
      "/images/universities/ubc-banner.webp"
    ],
    faq: [
      {
        q: "Does Harvard offer athletic scholarships?",
        a: "No. As an Ivy League institution, Harvard does not offer athletic or merit-based scholarships. All financial aid is strictly need-based."
      },
      {
        q: "Are international applicants judged differently for financial aid?",
        a: "No. Harvard is need-blind for all applicants, including international students, meaning your financial need will not affect your admission chances."
      }
    ]
  },
  {
    slug: "university-of-toronto",
    name: "University of Toronto",
    country: "Canada",
    logo: "linear-gradient(135deg, #002a5c 0%, #004b87 100%)",
    banner: "/images/universities/toronto-banner.webp",
    ranking: { qs: "21", world: "21" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Lester B. Pearson International Scholarship",
          eligibility: "Outstanding international students nominated by their high schools.",
          gpa: "3.9+",
          ielts: "7.0 (no band below 6.5)",
          coverage: "Full tuition, books, incidental fees, and full residence support for four years",
          procedure: "Secure nomination from school counsellor; complete the online Lester B. Pearson application.",
          deadline: "November 30"
        }
      ]
    },
    overview: {
      about: "The University of Toronto is a public research university in Toronto, Ontario, Canada, surrounding Queen's Park. It is known for influential movements and curricula in literary criticism and communication theory, and is the birthplace of insulin and stem cell research.",
      campusLife: "U of T operates on a collegiate system similar to Oxford. It features historic gothic-style architecture, a lively downtown setting, and hundreds of academic, cultural, and recreational clubs.",
      population: "97,000+",
      internationalStudents: "28%"
    },
    programs: {
      undergraduate: [
        "Computer Science (B.Sc.)",
        "Rotman Commerce (B.Com.)",
        "Civil Engineering (B.A.Sc.)",
        "Psychology (B.Sc.)"
      ],
      masters: [
        "Master of Applied Science in Computer Science",
        "Rotman Full-Time MBA",
        "Master of Engineering (M.Eng.)"
      ],
      phd: [
        "Ph.D. in Computer Science",
        "Ph.D. in Mechanical & Industrial Engineering",
        "Ph.D. in English Literature"
      ]
    },
    admission: {
      entryRequirements: "High school diploma with pre-requisite courses, personal statements for competitive majors, English test scores.",
      englishRequirements: "IELTS 6.5+ (no band below 6.0) or TOEFL 100+ (writing 22+).",
      documents: [
        "High School Transcripts",
        "English Language Test Scores",
        "Rotman Supplementary Application (for business applicants)",
        "Letters of Reference (for graduate applicants)"
      ],
      process: "Apply online via the OUAC (Ontario Universities' Application Centre) portal, upload required documents on U of T's JOIN portal, and track status.",
      processingTime: "6 to 10 weeks"
    },
    fees: {
      tuition: "$45,000 - $60,000 / year",
      accommodation: "$11,500 - $15,000 / year",
      livingExpenses: "$5,000 / year",
      visaCost: "$150 CAD (Study Permit)"
    },
    intakes: ["Fall (September)", "Winter (January)"],
    gallery: [
      "/images/universities/toronto-banner.webp",
      "/images/universities/monash-banner.webp",
      "/images/universities/gallery-toronto-3.webp"
    ],
    faq: [
      {
        q: "What is the OUAC portal?",
        a: "OUAC is the Ontario Universities' Application Centre. All students applying to universities in Ontario must apply through this centralized platform."
      },
      {
        q: "Can I work off-campus on a Canadian Study Permit?",
        a: "Yes. International students with valid study permits can typically work up to 20 or 24 hours per week off-campus during academic semesters and full-time during holidays."
      }
    ]
  },
  {
    slug: "university-of-melbourne",
    name: "University of Melbourne",
    country: "Australia",
    logo: "linear-gradient(135deg, #092e6e 0%, #1c499c 100%)",
    banner: "/images/universities/melbourne-banner.webp",
    ranking: { qs: "14", world: "14" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Melbourne International Undergraduate Scholarship",
          eligibility: "High-achieving international students enrolled in undergraduate degrees.",
          gpa: "3.75+ (95%+ equivalent)",
          ielts: "6.5 (no band below 6.0)",
          coverage: "Up to $10,000 tuition fee remission, or 50% to 100% fee remission for the duration of course",
          procedure: "No separate application required. All eligible students are automatically considered.",
          deadline: "Automatic"
        }
      ]
    },
    overview: {
      about: "The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is Australia's second oldest university and the oldest in Victoria. It ranks consistently as one of the leading higher education hubs in the Asia-Pacific.",
      campusLife: "Located on the edge of downtown Melbourne, the Parkville campus features stunning sandstone buildings alongside modern laboratories. Students enjoy rich cultural activities, coffee hubs, and active sports clubs.",
      population: "54,000+",
      internationalStudents: "41%"
    },
    programs: {
      undergraduate: [
        "Bachelor of Science (Computing & Software Systems)",
        "Bachelor of Commerce (Finance/Marketing)",
        "Bachelor of Design",
        "Bachelor of Biomedicine"
      ],
      masters: [
        "Master of Information Technology",
        "Master of Finance",
        "Master of Engineering (Chemical/Mechanical)"
      ],
      phd: [
        "Ph.D. in Science & Engineering",
        "Ph.D. in Medicine & Health Sciences",
        "Ph.D. in Humanities & Social Sciences"
      ]
    },
    admission: {
      entryRequirements: "Australian Year 12 equivalent with specific score cutoffs, pre-requisite subjects, and meeting English language requirements.",
      englishRequirements: "IELTS 6.5+ (no subscore below 6.0) or PTE Academic 58+ (no communicative skill below 50).",
      documents: [
        "Academic Transcripts",
        "Graduation Certificates",
        "Syllabus descriptions (for credit transfer requests)",
        "Passport Photo Page"
      ],
      process: "Apply directly via the university's online application system or use an authorized overseas agent representative.",
      processingTime: "4 to 8 weeks"
    },
    fees: {
      tuition: "$38,000 - $48,000 AUD / year",
      accommodation: "$14,000 - $22,000 AUD / year",
      livingExpenses: "$10,000 AUD / year",
      visaCost: "$1,600 AUD (Subclass 500 Visa)"
    },
    intakes: ["Semester 1 (Feb/March)", "Semester 2 (July)"],
    gallery: [
      "/images/universities/melbourne-banner.webp",
      "/images/universities/gallery-melbourne-2.webp",
      "/images/universities/gallery-melbourne-3.webp"
    ],
    faq: [
      {
        q: "What is the difference between Semester 1 and Semester 2 intake?",
        a: "Semester 1 starts in late February and is Australia's primary academic intake. Semester 2 starts in July and is the mid-year intake. Most programs are open to both, but some course sequences are only available in Semester 1."
      },
      {
        q: "Does Melbourne accept the PTE test?",
        a: "Yes, the Pearson Test of English (PTE) Academic is fully accepted for admissions."
      }
    ]
  },
  {
    slug: "university-of-manchester",
    name: "University of Manchester",
    country: "United Kingdom",
    logo: "linear-gradient(135deg, #660099 0%, #8b00b7 100%)",
    banner: "/images/universities/manchester-banner.webp",
    ranking: { qs: "32", world: "32" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Global Futures Scholarship",
          eligibility: "International students holding offer letters for undergraduate or master's degrees.",
          gpa: "3.5+ equivalent",
          ielts: "6.5 - 7.0 depending on program",
          coverage: "Award values of £5,000 to £10,000 per year towards tuition fees",
          procedure: "Apply via the online scholarship application form after receiving an academic study offer.",
          deadline: "May 20"
        }
      ]
    },
    overview: {
      about: "The University of Manchester is a public research university in Manchester, England. It is a member of the prestigious Russell Group and was formed in 2004 by the merger of the University of Manchester Institute of Science and Technology (UMIST) and the Victoria University of Manchester.",
      campusLife: "Manchester is famously known as the ultimate student city. The campus is integrated into the heart of the city's Oxford Road corridor, surrounded by music venues, theaters, art galleries, and modern student hubs.",
      population: "40,000+",
      internationalStudents: "38%"
    },
    programs: {
      undergraduate: [
        "B.Sc. in Computer Science",
        "B.Sc. in Economics & Finance",
        "B.Eng. in Aerospace Engineering",
        "B.Sc. in Biomedical Sciences"
      ],
      masters: [
        "M.Sc. in Advanced Computer Science",
        "M.Sc. in International Business",
        "M.Sc. in Public Health"
      ],
      phd: [
        "Ph.D. in Computer Science",
        "Ph.D. in Materials Science",
        "Ph.D. in Business & Management"
      ]
    },
    admission: {
      entryRequirements: "A-Levels, International Baccalaureate (IB), or recognized international foundation program certificate with high academic scores. Personal statement required.",
      englishRequirements: "IELTS 6.5+ (no subscore below 6.0) or TOEFL 90+ (no subscore below 20).",
      documents: [
        "Academic Transcripts",
        "UCAS Personal Statement (for undergraduate)",
        "Two Academic Reference Letters",
        "CV/Resume (for postgraduate)"
      ],
      process: "Undergraduate applicants apply via UCAS (Universities and Colleges Admissions Service). Postgraduate applicants apply directly via the university website.",
      processingTime: "4 to 12 weeks"
    },
    fees: {
      tuition: "£22,000 - £30,000 / year",
      accommodation: "£6,500 - £9,000 / year",
      livingExpenses: "£7,000 / year",
      visaCost: "£490 (Student Visa) + NHS Health Surcharge"
    },
    intakes: ["Fall (September)"],
    gallery: [
      "/images/universities/manchester-banner.webp",
      "/images/universities/sydney-banner.webp",
      "/images/universities/gallery-manchester-3.webp"
    ],
    faq: [
      {
        q: "What is UCAS?",
        a: "UCAS is the Universities and Colleges Admissions Service. It manages all undergraduate applications for higher education institutions in the UK."
      },
      {
        q: "What is the NHS Health Surcharge?",
        a: "It is a mandatory payment that international students make when applying for a UK visa to get access to the National Health Service (NHS) during their stay in the UK."
      }
    ]
  },
  {
    slug: "monash-university",
    name: "Monash University",
    country: "Australia",
    logo: "linear-gradient(135deg, #006dae 0%, #0087cb 100%)",
    banner: "/images/universities/monash-banner.webp",
    ranking: { qs: "42", world: "42" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Monash International Leadership Scholarship",
          eligibility: "High-achieving international students enrolled in undergraduate or postgraduate coursework.",
          gpa: "3.8+ equivalent",
          ielts: "6.5 (no sub-band below 6.0)",
          coverage: "100% of course tuition fees paid until course completion",
          procedure: "Complete separate scholarship application form after receiving a Monash study offer.",
          deadline: "October 15"
        }
      ]
    },
    overview: {
      about: "Monash University is a public research university based in Melbourne, Australia. Named after general Sir John Monash, it was founded in 1958 and is the second oldest university in the state of Victoria. It hosts several research networks and centers of innovation.",
      campusLife: "Monash is famous for its spacious Clayton and Caulfield campuses. Students have access to top-notch student recreation centers, extensive scientific research parks, and a welcoming international atmosphere.",
      population: "86,000+",
      internationalStudents: "35%"
    },
    programs: {
      undergraduate: [
        "Bachelor of Computer Science",
        "Bachelor of Business Administration",
        "Bachelor of Pharmaceutical Sciences",
        "Bachelor of Engineering (Honours)"
      ],
      masters: [
        "Master of Data Science",
        "Master of Business",
        "Master of Professional Engineering"
      ],
      phd: [
        "Ph.D. in Medicine & Pharmacology",
        "Ph.D. in Information Technology",
        "Ph.D. in Engineering Science"
      ]
    },
    admission: {
      entryRequirements: "Successful completion of high school with strong results, relevant subject pre-requisites (especially Math for IT/Engineering), and English score sheets.",
      englishRequirements: "IELTS 6.5+ (writing 6.0, speaking 6.0, reading 6.0, listening 6.0) or TOEFL 79+.",
      documents: [
        "Academic Records",
        "Certificate of English Competency",
        "Copy of Passport Information Page",
        "Relevant work experience letters (if applying for PG courses with gaps)"
      ],
      process: "Apply online directly via the Monash portal or using an approved recruitment agent.",
      processingTime: "3 to 6 weeks"
    },
    fees: {
      tuition: "$39,500 - $46,000 AUD / year",
      accommodation: "$13,000 - $18,000 AUD / year",
      livingExpenses: "$9,500 AUD / year",
      visaCost: "$1,600 AUD (Subclass 500 Visa)"
    },
    intakes: ["Semester 1 (February)", "Semester 2 (July)"],
    gallery: [
      "/images/universities/monash-banner.webp",
      "/images/universities/gallery-manchester-3.webp",
      "/images/universities/gallery-monash-3.webp"
    ],
    faq: [
      {
        q: "Where is the Monash Clayton campus located?",
        a: "Clayton is located about 20 km southeast of the center of Melbourne, and is Monash's largest campus."
      },
      {
        q: "What is Monash's ranking for pharmacy?",
        a: "Monash is world-famous for Pharmacy and Pharmacology, consistently ranking in the top 2 universities globally for this subject."
      }
    ]
  },
  {
    slug: "university-of-sydney",
    name: "University of Sydney",
    country: "Australia",
    logo: "linear-gradient(135deg, #e3001b 0%, #ff5c73 100%)",
    banner: "/images/universities/sydney-banner.webp",
    ranking: { qs: "19", world: "19" },
    scholarships: {
      available: true,
      details: [
        {
          name: "Vice-Chancellor's International Scholarships Scheme",
          eligibility: "All outstanding international students holding an offer of admission.",
          gpa: "3.7+ equivalent",
          ielts: "6.5+ (depending on course requirements)",
          coverage: "Awards up to $40,000 AUD toward tuition fees for the first year of study",
          procedure: "Automatically considered based on academic performance; no separate application is required.",
          deadline: "Automatic"
        }
      ]
    },
    overview: {
      about: "The University of Sydney is a public research university in Sydney, Australia. Founded in 1850, it is Australia's oldest university and is regarded as one of the world's leading universities. It is member of the Group of Eight research hub.",
      campusLife: "Featuring the quadrangle building, widely considered a neo-gothic architectural masterpiece, the Camperdown campus offers beautiful heritage sites. Students enjoy active student unions, sports clubs, and coastal beaches close by.",
      population: "60,000+",
      internationalStudents: "43%"
    },
    programs: {
      undergraduate: [
        "Bachelor of Advanced Computing",
        "Bachelor of Commerce (Professional)",
        "Bachelor of Applied Science (Exercise Physiology)",
        "Bachelor of Arts (Media & Communications)"
      ],
      masters: [
        "Master of Data Science",
        "Master of Commerce",
        "Master of Professional Engineering (Civil)"
      ],
      phd: [
        "Ph.D. in Computer Science & Robotics",
        "Ph.D. in Social Sciences & Policy",
        "Ph.D. in Clinical Medicine"
      ]
    },
    admission: {
      entryRequirements: "Secondary high school certificate with top-tier marks (e.g. IB score of 32+, high A-level grades, or top ATAR marks) and English language proof.",
      englishRequirements: "IELTS 6.5+ (no subscore below 6.0) or TOEFL 85+ (writing 19+). Note: Business and Law programs require IELTS 7.0+.",
      documents: [
        "Academic Records and Graduation Proof",
        "English Language Test Certification",
        "Copy of Passport Bio Page",
        "Credit exemption documents (if applicable)"
      ],
      process: "Apply online directly through the university website or choose an accredited educational consultant.",
      processingTime: "4 to 8 weeks"
    },
    fees: {
      tuition: "$42,000 - $51,000 AUD / year",
      accommodation: "$15,000 - $24,000 AUD / year",
      livingExpenses: "$11,000 AUD / year",
      visaCost: "$1,600 AUD (Subclass 500 Visa)"
    },
    intakes: ["Semester 1 (February/March)", "Semester 2 (July)"],
    gallery: [
      "/images/universities/sydney-banner.webp",
      "/images/universities/monash-banner.webp",
      "/images/universities/gallery-toronto-3.webp"
    ],
    faq: [
      {
        q: "What GPA is needed for the Vice-Chancellor scholarship?",
        a: "While there is no strict cutoff, awards are highly competitive and are generally granted to students in the top 5% of their graduating high school class."
      },
      {
        q: "Does the University of Sydney offer airport pickups?",
        a: "Yes. The university provides a free airport reception service for newly arriving international students during the orientation week."
      }
    ]
  },
  {
    slug: "university-of-british-columbia",
    name: "University of British Columbia",
    country: "Canada",
    logo: "linear-gradient(135deg, #002145 0%, #00509d 100%)",
    banner: "/images/universities/ubc-banner.webp",
    ranking: { qs: "34", world: "34" },
    scholarships: {
      available: true,
      details: [
        {
          name: "International Major Entrance Scholarship (IMES)",
          eligibility: "Exceptional international students entering undergraduate programs.",
          gpa: "3.85+",
          ielts: "6.5 (no component below 6.0)",
          coverage: "Partially covers tuition fees, renewable for up to three additional years of study",
          procedure: "Apply to UBC by January 15. All admitted students are automatically considered.",
          deadline: "January 15"
        }
      ]
    },
    overview: {
      about: "The University of British Columbia is a public research university with campuses in Vancouver and Kelowna, British Columbia. Established in 1908, UBC is British Columbia's oldest university and is consistently ranked among the top three universities in Canada.",
      campusLife: "UBC's Vancouver campus is surrounded by coastal forests, beaches, and the Pacific Ocean. It features world-famous museums, performing arts centers, and extensive fitness and outdoor sports recreation networks.",
      population: "70,000+",
      internationalStudents: "27%"
    },
    programs: {
      undergraduate: [
        "Bachelor of Science (Computer Science)",
        "Bachelor of Commerce (Finance/Accounting)",
        "Bachelor of Applied Science (Electrical Engineering)",
        "Bachelor of Media Studies"
      ],
      masters: [
        "Master of Science in Computer Science",
        "Master of Business Administration (Sauder School)",
        "Master of Applied Science in Civil Engineering"
      ],
      phd: [
        "Ph.D. in Computer Science",
        "Ph.D. in Forestry & Environment",
        "Ph.D. in Economics"
      ]
    },
    admission: {
      entryRequirements: "Top secondary academic grades, personal profile responses, English language proof, specific subject course prerequisites (Math/Science).",
      englishRequirements: "IELTS 6.5+ (no band below 6.0) or TOEFL 90+ (R: 22, L: 22, W: 21, S: 21).",
      documents: [
        "High School Transcripts",
        "English Test Score Certificates",
        "UBC Personal Profile responses",
        "Academic Reference Letters (for Graduate level)"
      ],
      process: "Apply online via the EducationPlannerBC portal, complete the UBC application forms, submit documents on the Student Service Centre (SSC) and wait for evaluation.",
      processingTime: "8 to 12 weeks"
    },
    fees: {
      tuition: "$42,000 - $54,000 / year",
      accommodation: "$11,000 - $14,000 / year",
      livingExpenses: "$5,500 / year",
      visaCost: "$150 CAD (Canadian Study Permit)"
    },
    intakes: ["Fall (September)"],
    gallery: [
      "/images/universities/ubc-banner.webp",
      "/images/universities/gallery-toronto-3.webp",
      "/images/universities/gallery-melbourne-3.webp"
    ],
    faq: [
      {
        q: "What is the UBC Personal Profile?",
        a: "It is a section of the UBC application containing short essay prompts designed to understand your extracurricular activities, leadership experience, and personal growth."
      },
      {
        q: "Where is Sauder School of Business?",
        a: "Sauder School is located inside the main Vancouver campus of UBC and is one of Canada's leading business education providers."
      }
    ]
  },
  {
    slug: "national-university-of-singapore",
    name: "National University of Singapore",
    country: "Singapore",
    logo: "linear-gradient(135deg, #ef7c00 0%, #003d7c 100%)",
    banner: "/images/universities/nus-banner.webp",
    ranking: { qs: "8", world: "8" },
    scholarships: {
      available: false,
      details: []
    },
    overview: {
      about: "The National University of Singapore is a national public research university in Queenstown, Singapore. Founded in 1905, it is the oldest autonomous university in Singapore. It is consistently ranked among the top 10 universities in the world.",
      campusLife: "NUS offers a modern, high-tech campus environment in Kent Ridge. Students reside in historic Halls of Residence or modern residential colleges, featuring state-of-the-art academic libraries, sports facilities, and cultural theaters.",
      population: "42,000+",
      internationalStudents: "30%"
    },
    programs: {
      undergraduate: [
        "Bachelor of Computing (Computer Science)",
        "Bachelor of Business Administration",
        "Bachelor of Engineering (Mechanical)",
        "Bachelor of Science (Data Science)"
      ],
      masters: [
        "Master of Computing in Computer Science",
        "NUS MBA",
        "Master of Science in Quantitative Finance"
      ],
      phd: [
        "Ph.D. in Computer Science",
        "Ph.D. in Biochemistry",
        "Ph.D. in Business & Management"
      ]
    },
    admission: {
      entryRequirements: "High secondary school diploma with stellar academic achievements (e.g. GPA 3.9+, top A-level/IB grades), SAT/ACT + SAT Subject Tests (optional/required depending on qualification group).",
      englishRequirements: "IELTS 6.5+ (reading and writing 6.5) or TOEFL 92+.",
      documents: [
        "Secondary School Examination Transcripts",
        "English Language Test Scores",
        "Copy of Passport",
        "Academic certificates and awards (if any)"
      ],
      process: "Apply online via the central NUS Admissions Portal. Select up to 3 preferred courses, upload supporting documents, and pay the application fee.",
      processingTime: "12 to 16 weeks"
    },
    fees: {
      tuition: "$32,000 - $41,500 / year (with Tuition Grant)",
      accommodation: "$6,500 - $9,000 / year",
      livingExpenses: "$5,000 / year",
      visaCost: "$90 SGD (Singapore Student Pass)"
    },
    intakes: ["August (Semester 1)", "January (Semester 2)"],
    gallery: [
      "/images/universities/gallery-melbourne-2.webp",
      "/images/universities/gallery-toronto-3.webp",
      "/images/universities/monash-banner.webp"
    ],
    faq: [
      {
        q: "What is the MOE Tuition Grant?",
        a: "It is a grant provided by the Ministry of Education (MOE) in Singapore that substantially subsidizes tuition fees for international students in exchange for a bond to work in a Singapore-registered company for 3 years upon graduation."
      },
      {
        q: "Is it difficult to get into NUS?",
        a: "Yes. NUS is highly competitive, and admissions are extremely selective. Successful applicants typically present top-tier scores globally."
      }
    ]
  }
];
