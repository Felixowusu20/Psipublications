import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

type SeedJournal = {
  slug: string;
  oldSlugs: string[];
  title: string;
  /** Abbreviation for spines, manuscript IDs, and compact UI */
  shortTitle: string;
  issn: string;
  eIssn: string;
  doiPrefix: string;
  frequency: string;
  reviewType: "DOUBLE_BLIND" | "SINGLE_BLIND" | "OPEN_REVIEW";
  description: string;
  aims: string;
  subjects: string[];
  impactFactor: string | null;
  acceptanceRate: string;
  avgReviewDays: number;
  openAccess: boolean;
  apc: string;
  editorInChief: string;
  coverColor: string;
  indexedIn: string[];
  foundedYear: number;
  sortOrder: number;
};

/** Official PSI Publications journal portfolio. */
const JOURNALS: SeedJournal[] = [
  {
    slug: "applied-sciences-engineering-review",
    oldSlugs: [
      "psi-journal-of-science-and-technology",
      "psi-journal-of-science",
      "atlas-journal-of-science",
    ],
    title: "Applied Sciences & Engineering Review",
    shortTitle: "ASER",
    issn: "2456-1120",
    eIssn: "2456-1139",
    doiPrefix: "10.58000/aser",
    frequency: "Monthly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Applied research in engineering, materials, and practical scientific methods.",
    aims: "To publish clear, reproducible work that advances applied science and engineering practice.",
    subjects: ["Engineering", "Applied Science", "Materials", "Technology"],
    impactFactor: "3.42",
    acceptanceRate: "22%",
    avgReviewDays: 28,
    openAccess: true,
    apc: "$1,200",
    editorInChief: "Prof. Helen Markovic",
    coverColor: "#0B3A53",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "OpenAlex"],
    foundedYear: 2014,
    sortOrder: 1,
  },
  {
    slug: "computational-science-quantitative-modeling",
    oldSlugs: [],
    title: "Computational Science & Quantitative Modeling",
    shortTitle: "CSQM",
    issn: "2461-3309",
    eIssn: "2461-3317",
    doiPrefix: "10.58000/csqm",
    frequency: "Bimonthly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Computation, data methods, simulation, and quantitative modeling across domains.",
    aims: "To advance rigorous computational methods and transparent quantitative research.",
    subjects: ["Computation", "Modeling", "Data Science", "Simulation"],
    impactFactor: "2.90",
    acceptanceRate: "21%",
    avgReviewDays: 27,
    openAccess: true,
    apc: "$1,150",
    editorInChief: "Prof. Daniel Okoro",
    coverColor: "#1E3A5F",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "Dimensions"],
    foundedYear: 2017,
    sortOrder: 2,
  },
  {
    slug: "biomedical-public-health-perspectives",
    oldSlugs: [
      "psi-journal-of-health-and-biomedical-research",
      "psi-african-health-systems-review",
      "african-health-systems-review",
    ],
    title: "Biomedical & Public Health Perspectives",
    shortTitle: "BPHP",
    issn: "2789-4412",
    eIssn: "2789-4420",
    doiPrefix: "10.58000/bphp",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Biomedicine, clinical insight, and public health research with practical relevance.",
    aims: "To strengthen evidence that improves health systems, care, and population outcomes.",
    subjects: ["Biomedicine", "Public Health", "Clinical Research", "Health Systems"],
    impactFactor: "2.18",
    acceptanceRate: "28%",
    avgReviewDays: 32,
    openAccess: true,
    apc: "$1,000",
    editorInChief: "Prof. Kwame Mensah",
    coverColor: "#1A5F4A",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "BASE"],
    foundedYear: 2018,
    sortOrder: 3,
  },
  {
    slug: "sustainable-agri-food-environmental-systems",
    oldSlugs: ["psi-journal-of-agriculture-food-and-sustainability"],
    title: "Sustainable Agri-Food & Environmental Systems",
    shortTitle: "SAFES",
    issn: "2810-2201",
    eIssn: "2810-221X",
    doiPrefix: "10.58000/safes",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Agriculture, food systems, environment, and sustainability research.",
    aims: "To share solutions for resilient food production and environmental stewardship.",
    subjects: ["Agriculture", "Food Systems", "Environment", "Sustainability"],
    impactFactor: null,
    acceptanceRate: "30%",
    avgReviewDays: 30,
    openAccess: true,
    apc: "$900",
    editorInChief: "Prof. Amina Diallo",
    coverColor: "#3D5A3D",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef"],
    foundedYear: 2020,
    sortOrder: 4,
  },
  {
    slug: "advances-pedagogy-learning-sciences",
    oldSlugs: [
      "psi-journal-of-education-learning-and-development",
      "psi-education-and-society",
      "education-and-society",
    ],
    title: "Advances in Pedagogy & Learning Sciences",
    shortTitle: "APLS",
    issn: "2398-0044",
    eIssn: "2398-0052",
    doiPrefix: "10.58000/apls",
    frequency: "Continuous",
    reviewType: "OPEN_REVIEW",
    description:
      "Teaching, learning sciences, curriculum, and education research.",
    aims: "To connect learning research with classroom practice and institutional improvement.",
    subjects: ["Pedagogy", "Learning Sciences", "Curriculum", "Education"],
    impactFactor: null,
    acceptanceRate: "27%",
    avgReviewDays: 30,
    openAccess: true,
    apc: "$600",
    editorInChief: "Dr. Priya Natarajan",
    coverColor: "#6B2D5B",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "ERIC"],
    foundedYear: 2021,
    sortOrder: 5,
  },
  {
    slug: "global-commerce-economics-strategy",
    oldSlugs: ["psi-journal-of-business-economics-and-innovation"],
    title: "Global Commerce, Economics & Strategy",
    shortTitle: "GCES",
    issn: "2822-1104",
    eIssn: "2822-1112",
    doiPrefix: "10.58000/gces",
    frequency: "Bimonthly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Commerce, economics, markets, and strategy for organizations and policy.",
    aims: "To advance research that informs trade, enterprise, and economic decision-making.",
    subjects: ["Commerce", "Economics", "Strategy", "Management"],
    impactFactor: "2.65",
    acceptanceRate: "24%",
    avgReviewDays: 28,
    openAccess: true,
    apc: "$1,100",
    editorInChief: "Prof. Elena Vargas",
    coverColor: "#8B3A2A",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "Dimensions"],
    foundedYear: 2016,
    sortOrder: 6,
  },
  {
    slug: "studies-society-culture-humanities",
    oldSlugs: ["psi-journal-of-social-sciences-and-humanities"],
    title: "Studies in Society, Culture & Humanities",
    shortTitle: "SSCH",
    issn: "2831-4408",
    eIssn: "2831-4416",
    doiPrefix: "10.58000/ssch",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Society, culture, history, language, and humanities scholarship.",
    aims: "To foster careful inquiry into social life, culture, and the human record.",
    subjects: ["Society", "Culture", "Humanities", "History"],
    impactFactor: null,
    acceptanceRate: "29%",
    avgReviewDays: 35,
    openAccess: true,
    apc: "$800",
    editorInChief: "Prof. Samuel Okeke",
    coverColor: "#5C4A1F",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef"],
    foundedYear: 2019,
    sortOrder: 7,
  },
  {
    slug: "nexus-cross-disciplinary-inquiry",
    oldSlugs: [
      "psi-journal-of-interdisciplinary-research",
      "psi-journal-of-computational-methods",
      "journal-of-computational-methods",
    ],
    title: "Nexus: Cross-Disciplinary Inquiry",
    shortTitle: "NCDI",
    issn: "2610-8893",
    eIssn: "2610-8907",
    doiPrefix: "10.58000/ncdi",
    frequency: "Continuous",
    reviewType: "DOUBLE_BLIND",
    description:
      "Cross-disciplinary research that links methods, fields, and applied problems.",
    aims: "To publish work that bridges disciplines with clear methods and real-world relevance.",
    subjects: [
      "Interdisciplinary Studies",
      "Methods",
      "Applied Research",
      "Innovation",
    ],
    impactFactor: "3.10",
    acceptanceRate: "20%",
    avgReviewDays: 26,
    openAccess: true,
    apc: "$1,200",
    editorInChief: "Prof. Sofia Almeida",
    coverColor: "#2F4F6F",
    indexedIn: ["Scopus", "Google Scholar", "CrossRef", "Dimensions"],
    foundedYear: 2007,
    sortOrder: 8,
  },
];

async function main() {
  const keepSlugs = new Set(JOURNALS.map((j) => j.slug));

  for (const j of JOURNALS) {
    const existing =
      (await prisma.journal.findUnique({ where: { slug: j.slug } })) ||
      (await prisma.journal.findFirst({
        where: { slug: { in: j.oldSlugs } },
      }));

    const data = {
      title: j.title,
      shortTitle: j.shortTitle,
      issn: j.issn,
      eIssn: j.eIssn,
      doiPrefix: j.doiPrefix,
      frequency: j.frequency,
      reviewType: j.reviewType,
      description: j.description,
      aims: j.aims,
      subjects: j.subjects,
      impactFactor: j.impactFactor,
      acceptanceRate: j.acceptanceRate,
      avgReviewDays: j.avgReviewDays,
      openAccess: j.openAccess,
      apc: j.apc,
      editorInChief: j.editorInChief,
      coverColor: j.coverColor,
      indexedIn: j.indexedIn,
      foundedYear: j.foundedYear,
      isActive: true,
      sortOrder: j.sortOrder,
      slug: j.slug,
    };

    if (existing) {
      const updated = await prisma.journal.update({
        where: { id: existing.id },
        data,
      });
      console.log(`Updated: ${updated.shortTitle} — ${updated.title}`);
    } else {
      const created = await prisma.journal.create({ data });
      console.log(`Created: ${created.shortTitle} — ${created.title}`);
    }
  }

  // Hide older titles that are not in the official portfolio
  const deactivated = await prisma.journal.updateMany({
    where: {
      slug: { notIn: [...keepSlugs] },
      isActive: true,
    },
    data: { isActive: false },
  });
  if (deactivated.count) {
    console.log(`Deactivated ${deactivated.count} legacy journal(s)`);
  }

  const active = await prisma.journal.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { sortOrder: true, shortTitle: true, title: true, slug: true },
  });
  console.log("\nActive portfolio:");
  for (const j of active) {
    console.log(
      `  ${String(j.sortOrder).padStart(2, "0")}  ${j.shortTitle.padEnd(6)}  ${j.title}`,
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
