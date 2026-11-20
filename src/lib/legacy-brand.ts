/**
 * Replace legacy Nahda Publications copy with PSI branding (DB/CMS or HTML bodies).
 */
export function scrubLegacyPublisherText(input: string): string {
  if (!input || !/nahda/i.test(input)) return input;

  let s = input;
  s = s.replace(/Nahda\s+Publications/gi, "PSI Publications");
  s = s.replace(/NahdaPublications/gi, "PSI Publications");
  s = s.replace(/nahdapublications\.com/gi, "psipublications@gmail.com");
  s = s.replace(/nahdapublications\.org/gi, "psipublications.com");
  s = s.replace(/editor@nahdapublications\.com/gi, "psipublications@gmail.com");
  s = s.replace(/\bnahda\/([\w-]+)/gi, "psi/$1");
  return s;
}

function scrubIfNeeded(value: string | null | undefined): string | null | undefined {
  if (value == null) return value;
  const next = scrubLegacyPublisherText(value);
  return next === value ? value : next;
}

let rebrandStarted = false;

/** One-time per server process: persist PSI wording in stored CMS/home rows. */
export async function rebrandLegacyPublisherContentOnce() {
  if (rebrandStarted) return;
  rebrandStarted = true;

  const { prisma } = await import("@/lib/db");

  const cmsPages = await prisma.cmsPage.findMany();
  for (const row of cmsPages) {
    const title = scrubIfNeeded(row.title)!;
    const subtitle = scrubIfNeeded(row.subtitle);
    const body = scrubIfNeeded(row.body)!;
    if (
      title !== row.title ||
      subtitle !== row.subtitle ||
      body !== row.body
    ) {
      await prisma.cmsPage.update({
        where: { id: row.id },
        data: { title, subtitle, body },
      });
    }
  }

  const faqs = await prisma.faqItem.findMany();
  for (const row of faqs) {
    const question = scrubIfNeeded(row.question)!;
    const answer = scrubIfNeeded(row.answer)!;
    if (question !== row.question || answer !== row.answer) {
      await prisma.faqItem.update({
        where: { id: row.id },
        data: { question, answer },
      });
    }
  }

  const announcements = await prisma.announcement.findMany();
  for (const row of announcements) {
    const title = scrubIfNeeded(row.title)!;
    const summary = scrubIfNeeded(row.summary)!;
    if (title !== row.title || summary !== row.summary) {
      await prisma.announcement.update({
        where: { id: row.id },
        data: { title, summary },
      });
    }
  }

  const sections = await prisma.homeSection.findMany();
  for (const row of sections) {
    const eyebrow = scrubIfNeeded(row.eyebrow);
    const title = scrubIfNeeded(row.title)!;
    const body = scrubIfNeeded(row.body);
    if (
      eyebrow !== row.eyebrow ||
      title !== row.title ||
      body !== row.body
    ) {
      await prisma.homeSection.update({
        where: { id: row.id },
        data: { eyebrow, title, body },
      });
    }
  }

  const spotlights = await prisma.researchSpotlight.findMany();
  for (const row of spotlights) {
    const title = scrubIfNeeded(row.title)!;
    const summary = scrubIfNeeded(row.summary);
    if (title !== row.title || summary !== row.summary) {
      await prisma.researchSpotlight.update({
        where: { id: row.id },
        data: { title, summary },
      });
    }
  }

  const platforms = await prisma.indexedPlatform.findMany();
  for (const row of platforms) {
    const name = scrubIfNeeded(row.name)!;
    const blurb = scrubIfNeeded(row.blurb)!;
    if (name !== row.name || blurb !== row.blurb) {
      await prisma.indexedPlatform.update({
        where: { id: row.id },
        data: { name, blurb },
      });
    }
  }

  const slides = await prisma.heroSlide.findMany();
  for (const row of slides) {
    const title = scrubIfNeeded(row.title)!;
    const body = scrubIfNeeded(row.body)!;
    if (title !== row.title || body !== row.body) {
      await prisma.heroSlide.update({
        where: { id: row.id },
        data: { title, body },
      });
    }
  }

  const doi = await prisma.doiSettings.findUnique({ where: { id: "default" } });
  if (doi) {
    const publisherName = scrubIfNeeded(doi.publisherName)!;
    const notes = scrubIfNeeded(doi.notes);
    if (publisherName !== doi.publisherName || notes !== doi.notes) {
      await prisma.doiSettings.update({
        where: { id: doi.id },
        data: { publisherName, notes },
      });
    }
  }

  const journals = await prisma.journal.findMany();
  for (const row of journals) {
    const title = scrubIfNeeded(row.title)!;
    const description = scrubIfNeeded(row.description)!;
    const aims = scrubIfNeeded(row.aims);
    if (
      title !== row.title ||
      description !== row.description ||
      aims !== row.aims
    ) {
      await prisma.journal.update({
        where: { id: row.id },
        data: { title, description, aims },
      });
    }
  }
}
