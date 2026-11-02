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
    slug: "psi-journal-of-science-and-technology",
    oldSlugs: ["psi-journal-of-science", "atlas-journal-of-science"],
    title: "PSI Journal of Science and Technology",
    shortTitle: "PJST",
    issn: "2456-1120",
    eIssn: "2456-1139",
    doiPrefix: "10.58000/pjst",
    frequency: "Monthly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Original research across the natural sciences, engineering, and emerging technologies.",
    aims: "To advance rigorous scientific and technological discovery with open scholarly communication.",
    subjects: ["Science", "Engineering", "Technology", "Applied Research"],
    impactFactor: "3.42",
    acceptanceRate: "22%",
    avgReviewDays: 28,
    openAccess: true,
    apc: "$1,200",
    editorInChief: "Prof. Helen Markovic",
    coverColor: "#6E1F3A",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "OpenAlex"],
    foundedYear: 2014,
    sortOrder: 1,
  },
  {
    slug: "psi-journal-of-health-and-biomedical-research",
    oldSlugs: [
      "psi-african-health-systems-review",
      "african-health-systems-review",
    ],
    title: "PSI Journal of Health and Biomedical Research",
    shortTitle: "PJHBR",
    issn: "2789-4412",
    eIssn: "2789-4420",
    doiPrefix: "10.58000/pjhbr",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Peer-reviewed work in clinical science, public health, biomedicine, and health systems.",
    aims: "To strengthen evidence-based health research and biomedical innovation.",
    subjects: [
      "Public Health",
      "Biomedicine",
      "Clinical Research",
      "Health Systems",
    ],
    impactFactor: "2.18",
    acceptanceRate: "28%",
    avgReviewDays: 32,
    openAccess: true,
    apc: "$1,000",
    editorInChief: "Prof. Kwame Mensah",
    coverColor: "#7A2848",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "BASE"],
    foundedYear: 2018,
    sortOrder: 2,
  },
  {
    slug: "psi-journal-of-agriculture-food-and-sustainability",
    oldSlugs: [],
    title: "PSI Journal of Agriculture, Food and Sustainability",
    shortTitle: "PJAFS",
    issn: "2810-2201",
    eIssn: "2810-221X",
    doiPrefix: "10.58000/pjafs",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Research on agriculture, food systems, nutrition, climate-smart practice, and sustainability.",
    aims: "To publish solutions that strengthen food security and sustainable agriculture.",
    subjects: ["Agriculture", "Food Science", "Sustainability", "Environment"],
    impactFactor: null,
    acceptanceRate: "30%",
    avgReviewDays: 30,
    openAccess: true,
    apc: "$900",
    editorInChief: "Prof. Amina Diallo",
    coverColor: "#5C1A32",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef"],
    foundedYear: 2020,
    sortOrder: 3,
  },
  {
    slug: "psi-journal-of-education-learning-and-development",
    oldSlugs: ["psi-education-and-society", "education-and-society"],
    title: "PSI Journal of Education, Learning and Development",
    shortTitle: "PJELD",
    issn: "2398-0044",
    eIssn: "2398-0052",
    doiPrefix: "10.58000/pjeld",
    frequency: "Continuous",
    reviewType: "OPEN_REVIEW",
    description:
      "Research on pedagogy, higher education, curriculum design, learning technologies, and human development.",
    aims: "To connect educational research with classroom practice and institutional policy.",
    subjects: ["Education", "Pedagogy", "EdTech", "Development"],
    impactFactor: null,
    acceptanceRate: "27%",
    avgReviewDays: 30,
    openAccess: true,
    apc: "$600",
    editorInChief: "Dr. Priya Natarajan",
    coverColor: "#8B3A55",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "ERIC"],
    foundedYear: 2021,
    sortOrder: 4,
  },
  {
    slug: "psi-journal-of-business-economics-and-innovation",
    oldSlugs: [],
    title: "PSI Journal of Business, Economics and Innovation",
    shortTitle: "PJBEI",
    issn: "2822-1104",
    eIssn: "2822-1112",
    doiPrefix: "10.58000/pjbei",
    frequency: "Bimonthly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Scholarship in management, economics, entrepreneurship, finance, and innovation studies.",
    aims: "To advance research that informs markets, policy, and entrepreneurial practice.",
    subjects: ["Business", "Economics", "Innovation", "Management"],
    impactFactor: "2.65",
    acceptanceRate: "24%",
    avgReviewDays: 28,
    openAccess: true,
    apc: "$1,100",
    editorInChief: "Prof. Elena Vargas",
    coverColor: "#4A1830",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef", "Dimensions"],
    foundedYear: 2016,
    sortOrder: 5,
  },
  {
    slug: "psi-journal-of-social-sciences-and-humanities",
    oldSlugs: [],
    title: "PSI Journal of Social Sciences and Humanities",
    shortTitle: "PJSSH",
    issn: "2831-4408",
    eIssn: "2831-4416",
    doiPrefix: "10.58000/pjssh",
    frequency: "Quarterly",
    reviewType: "DOUBLE_BLIND",
    description:
      "Research across sociology, anthropology, history, languages, culture, and the humanities.",
    aims: "To foster critical inquiry into society, culture, and the human experience.",
    subjects: ["Sociology", "Humanities", "Culture", "History"],
    impactFactor: null,
    acceptanceRate: "29%",
    avgReviewDays: 35,
    openAccess: true,
    apc: "$800",
    editorInChief: "Prof. Samuel Okeke",
    coverColor: "#9A3D55",
    indexedIn: ["DOAJ", "Google Scholar", "CrossRef"],
    foundedYear: 2019,
    sortOrder: 6,
  },
  {
    slug: "psi-journal-of-interdisciplinary-research",
    oldSlugs: [
      "psi-journal-of-computational-methods",
      "journal-of-computational-methods",
    ],
    title: "PSI Journal of Interdisciplinary Research",
    shortTitle: "PJIR",
    issn: "2610-8893",
    eIssn: "2610-8907",
    doiPrefix: "10.58000/pjir",
    frequency: "Continuous",
    reviewType: "DOUBLE_BLIND",
    description:
      "Cross-cutting research that bridges disciplines, methods, and applied problem spaces.",
    aims: "To publish high-quality interdisciplinary work with clear methods and societal relevance.",
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
    coverColor: "#3A1524",
    indexedIn: ["Scopus", "Google Scholar", "CrossRef", "Dimensions"],
    foundedYear: 2007,
    sortOrder: 7,
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
