import Link from 'next/link';
import { SignatureDot, SectionRule } from '../../components/Brand.js';

export const metadata = {
  title: 'About — Bioparity',
  description: "About the Bioparity project, how it was built, and what it's asking for.",
  openGraph: {
    type: 'website',
    url: 'https://bioparity.io/about',
    siteName: 'Bioparity',
    title: 'About — Bioparity',
    description: "About the Bioparity project, how it was built, and what it's asking for.",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Bioparity — Tracking when humanoid robots match human track and field world records',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Bioparity',
    description: "About the Bioparity project, how it was built, and what it's asking for.",
    images: ['/og.png'],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16">
      <h1 className="font-bold tracking-tight text-4xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        About<SignatureDot />
      </h1>
      <p className="text-body text-ink-muted leading-relaxed mt-4">
        A public ledger tracking when humanoid robots match human track and field world records, and the person who built it.
      </p>

      <SectionRule className="mt-10" />

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Who</h2>
        <p className="text-body text-muted leading-relaxed mt-4">
          I'm Brandon. I'm a nurse by training, a healthcare operations leader by career, and for the last two months, a solo developer.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          I spent 22 years in the U.S. Navy, first enlisted and then as an officer, working primarily in Emergency and Trauma Nursing. I was in Fallujah, Iraq for most of 2004, including the Second Battle of Fallujah, the heaviest urban combat American forces had seen since Vietnam. I served aboard the USNS Mercy during humanitarian missions. Toward the end of my Navy career my job changed. I was made Director of Process Improvement, running Lean Six Sigma across a Navy hospital's inpatient and outpatient services. That last assignment turned out to be the one that shaped how I think about everything else I've built since.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          After retiring I worked a year as a VA clinic manager, then quit the day my son graduated high school in 2013 and spent the next eight years farming eleven acres in Washington state. I left Washington in late 2021 and eventually returned to nursing. Today I work in a cardiology clinic in Missouri.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Why Bioparity exists</h2>
        <p className="text-body text-muted leading-relaxed mt-4">
          In April 2026 a robot crossed the finish line of a half marathon in Beijing with a clock reading 50:26. That's about seven minutes faster than the human world record. Almost every headline said some version of &ldquo;robots are beating us.&rdquo; The result was not eligible under any recognized standard. Handlers intervened, batteries were swapped mid-run, the course was corrected. None of that made the headlines.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          I started looking for a site that tracked humanoid robot parity against human athletic records the way World Athletics tracks human records, with eligibility rules, sanctioning bodies, validation tiers, and honest disqualifications. I couldn't find one. The information existed in press releases, research papers, and scattered results pages, but nobody was maintaining a ledger that treated the question seriously.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          Bioparity is that ledger. Every performance is tagged with its autonomy level, its sanctioning body, and an eligibility decision with a reason attached. Ineligible results stay on the record with their reasons documented. The parity meter currently reads zero percent, because under rigorous criteria that is the honest number today.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">How it was built</h2>
        <p className="text-body text-muted leading-relaxed mt-4">
          My Navy role as Director of Process Improvement was the same shape as this project. The job was to go into a department, observe how work actually happened for several weeks, figure out what was broken in the process itself, and build a fix that held up after I left. I did it in emergency departments, labor and delivery wards, specialty clinics, and medical services across a hospital of more than a hundred clinicians.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          Bioparity is the same work in a different domain. I watched how humanoid robotics results were being reported for several weeks, and saw a specific broken process. Results were being reported without any shared standard for what counted. So I built the infrastructure that applies the kind of rigor the sport governing bodies already apply to human records. A schema, a methodology, a test suite, a public audit trail.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          The piece that made it possible for someone outside software to build a site like this is AI tooling. Sixty days ago I couldn't write a for loop. I learned enough syntax to be dangerous in a weekend, and then I spent nine weeks building. Not just Bioparity, but eight other applications across healthcare workflow, personal finance, and family life. Everything on this site was written by me in collaboration with Anthropic's Claude, reviewed line by line, tested, and shipped. The architecture decisions, the eligibility criteria, the methodology language, the decision to include the ineligible Beijing result on the record with its reason attached, those are mine. The code is something I directed.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">What I'm looking for</h2>
        <p className="text-body text-muted leading-relaxed mt-4">
          I'm not looking for a job.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          I'm looking for researchers, roboticists, sports scientists, and practitioners who care about the question this site is asking, and who want to improve the answer. People who would contribute research briefs, challenge the methodology, submit verified performances, or point me at harder problems worth building infrastructure around.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          I'm also open to mentorship. I spent 25 years in environments where experienced people took time to teach younger people how to do the work. I'm past the age where I'm a young person, but I'm new to this world, and I'd like to spend the next decade of my working life building things that matter with people who know more than I do about where to point the tools.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          If that's you, or you know someone, I'd like to hear from you.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Contact</h2>
        <p className="text-body text-muted leading-relaxed mt-4">
          The best way to reach me is{' '}
          <a href="mailto:hello@bioparity.io" className="underline hover:text-paper">
            hello@bioparity.io
          </a>
          .
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          For contributions, corrections, or factual disputes, open an issue or pull request at{' '}
          <a
            href="https://github.com/bioparity/bioparity"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-paper"
          >
            github.com/bioparity/bioparity
          </a>
          . Contribution guidelines are in CONTRIBUTING.md. The methodology is at{' '}
          <Link href="/methodology" className="underline hover:text-paper">/methodology</Link>.
        </p>
        <p className="text-body text-muted leading-relaxed mt-4">
          Replies may take a week. This site is built in the margins of a nursing career.
        </p>
      </section>
    </div>
  );
}
