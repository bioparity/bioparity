import { SANCTIONING_BODIES } from '../../lib/sanctioning-bodies.js';
import { SignatureDot, SectionRule } from '../../components/Brand.js';

export const metadata = {
  title: 'Methodology — Bioparity',
  description: 'How parity is defined, what counts as compliant, and why the ledger is bipedal-only.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 prose prose-invert">
      <h1 className="font-bold tracking-tight text-4xl md:text-h1 inline-flex items-baseline gap-[0.08em]">
        Methodology<SignatureDot />
      </h1>
      <p className="text-muted text-lg mt-3">
        How Bioparity decides what counts as parity, what counts as a valid robot performance, and what the ledger refuses to score at all.
      </p>

      <SectionRule className="mt-10" />

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Why bipedal?</h2>
        <p className="text-muted leading-relaxed mt-3">
          Parity is a biological question, not a performance question. We are not tracking the
          fastest mechanism — wheels will beat legs at flat-ground speed indefinitely. We are
          tracking whether robots can match humans <em className="text-paper not-italic">under human biomechanical constraints</em>.
          The question we exist to answer is: <span className="text-paper">"Can a machine built like us outperform us at what we do?"</span>{' '}
          A wheeled robot winning a 100m sprint tells us nothing about that question. A bipedal
          robot running 9.57 seconds does.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Scope: Why World Athletics–Ratified Records</h2>
        <p className="text-muted leading-relaxed mt-3">
          Bioparity anchors on the current <span className="text-paper">World Athletics</span>–ratified world records because that list is the highest sanctioned human performance ceiling we have. Those records also come with codified eligibility rules — wind thresholds, track surface standards, equipment compliance, anti-doping verification — that translate cleanly onto a robot attempt. A robot that beats Cheptegei's 12:35.36 over 5000 metres, on a standardized 400 m track, under legal conditions, has cleared the same bar a human did. The rules give us something rigorous to test against.
        </p>
        <p className="text-muted leading-relaxed mt-3">
          The ratified list also covers the full range of individual bipedal locomotion events — sprints, middle distance, long distance, hurdles, steeplechase, high jump, long jump — rather than the IOC's quadrennial, television-selected subset. The Games are a window into a subset of these records every four years; the records themselves are the continuous ceiling. We anchor on the ceiling.
        </p>
        <p className="text-muted leading-relaxed mt-3">
          Winter events and equipment-mediated events (pole vault, throws, wheeled disciplines) stay out of scope for the same reason as before: non-bipedal or equipment-dominant locomotion is outside the biological parity question. A robot that beats a speed skater is beating a human on steel blades, not on human legs. A robot that throws a javelin further than Zelezny is beating a human with a spear, not a human body. Neither tells us what this ledger is here to measure. Archery is the one exception already seeded — it is shoulder-and-eye biomechanics, not locomotion, but the test stays bipedal-only.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Scope: What's Tracked</h2>
        <p className="text-muted leading-relaxed mt-3">
          Twenty-five events, split by discipline and gender:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Running — Men's</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>100 metres</li>
              <li>200 metres</li>
              <li>400 metres</li>
              <li>800 metres</li>
              <li>1500 metres</li>
              <li>5000 metres</li>
              <li>10,000 metres</li>
              <li>3000 metres steeplechase</li>
              <li>Half Marathon</li>
              <li>Marathon</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Running — Women's</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>100 metres</li>
              <li>200 metres</li>
              <li>5000 metres</li>
              <li>10,000 metres</li>
              <li>3000 metres steeplechase</li>
              <li>Half Marathon</li>
              <li>Marathon</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Field — Men's</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>High Jump</li>
              <li>Long Jump</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Field — Women's</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>High Jump</li>
              <li>Long Jump</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Hurdles</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>Men's 110 metres Hurdles</li>
              <li>Women's 100 metres Hurdles</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-dim mb-2">Archery (70m, 72-arrow)</div>
            <ul className="list-disc pl-5 text-muted space-y-0.5">
              <li>Men's Recurve</li>
              <li>Women's Recurve</li>
            </ul>
          </div>
        </div>
        <p className="text-muted leading-relaxed mt-5 text-sm">
          Throws (shot put, javelin, hammer, discus), pole vault, and swimming are excluded because either no current humanoid bipedal robot platform has demonstrated capability in the modality, or the event is equipment-dominant rather than locomotion-dominant. When a real bipedal humanoid throws a real regulation implement, clears a regulation pole vault, or swims a sanctioned 50 m freestyle, the event will be added.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">What Counts as an Attempt</h2>
        <p className="text-muted leading-relaxed mt-3">
          Bioparity tracks capability parity, not head-to-head competition. A robot does not have to race a human to set a verified parity attempt. It has to perform the event, under sanctioned conditions, to the measurement standards of the event's governing body. Solo runs count. Timed trials count. Head-to-head races count. What does not count: simulation, wind-aided results outside legal thresholds, shortened distances, assisted propulsion, or any result where the robot's locomotion was substantially provided by a human or a wheeled platform.
        </p>
        <p className="text-muted leading-relaxed mt-4">
          The parity meter measures against World Athletics world records. An attempt that would beat the record but fails sanctioning rules (wind, surface, equipment, handler intervention) is recorded as ineligible and does not move the meter.
        </p>
        <p className="text-muted leading-relaxed mt-4">
          Every performance in Bioparity is also tagged with an autonomy level — autonomous, assisted, teleoperated, or unknown. Autonomy does not determine eligibility, but it does determine what a result means. A teleoperated robot finishing a half marathon is a very different result from an autonomous one. Both are tracked. Neither is hidden.
        </p>
        <p className="text-muted leading-relaxed mt-4">
          Three recording rules govern how large-field events, teleoperated entries, and approximate-format events are handled. See <span className="text-paper">Recording Rules</span> below.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Recording Rules</h2>
        <h3 className="text-h3 font-semibold tracking-tight mt-6">Teleoperation is automatically ineligible.</h3>
        <p className="text-muted leading-relaxed mt-3">
          Any performance where autonomy is classified as teleoperated is automatically ineligible for parity meter purposes. Teleoperation does not represent humanoid capability parity because the locomotion decisions are being made by a human pilot, not the robot. Teleoperated entries are recorded for completeness — they document what machines and pilots can do together — but they do not move the parity meter.
        </p>
        <h3 className="text-h3 font-semibold tracking-tight mt-6">Large-field events are capped at five entries per autonomy tier.</h3>
        <p className="text-muted leading-relaxed mt-3">
          For sanctioned events with more than ten completing performances, Bioparity records the top 5 finishers per autonomy tier (autonomous, assisted, teleoperated, unknown) where verifiable times exist. The full field count is noted on the event detail page. This curation keeps the ledger usable without suppressing the shape of the field.
        </p>
        <h3 className="text-h3 font-semibold tracking-tight mt-6">Approximate or category-mismatched events are not treated as parity attempts.</h3>
        <p className="text-muted leading-relaxed mt-3">
          Humanoid competitions sometimes feature events that approximate but do not match sanctioned human events — for example, a &ldquo;100m hurdles&rdquo; event where the barrier specifications, gender category, or other sanctioning details do not align with World Athletics' ratified version. Bioparity may record such performances for completeness, but they are marked ineligible with the specific mismatch documented in the eligibility reason. The parity meter is computed only from performances that meet full sanctioned-conformance on the World Athletics version of the event.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Verified vs. experimental performances</h2>
        <p className="text-muted leading-relaxed mt-3">
          Every <em className="text-paper not-italic">human</em> world record in the ledger is real and cited to its sanctioning body. Every <em className="text-paper not-italic">robot</em> performance is a real, documented attempt — no illustrative placeholders. The engine distinguishes status cases regardless:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted space-y-1">
          <li><span className="text-paper">Parity</span> — a robot within the metric-type epsilon, even if numerically better</li>
          <li><span className="text-paper">Robot Lead</span> — outside epsilon and beating the human</li>
          <li><span className="text-paper">Fallback</span> — best experimental row when no eligible+validated row exists</li>
          <li><span className="text-paper">Eligibility fail</span> — a wind, surface, or equipment violation that would otherwise win</li>
          <li><span className="text-paper">Hard fail</span> — non-bipedal, tethered, or terrain-mismatched submissions that never enter the ledger at all</li>
        </ul>
        <p className="text-muted leading-relaxed mt-4">
          A row graduates from <span className="text-warn">experimental</span> or <span className="text-orange-500">unverified</span> to <span className="text-robot">verified</span> when a contributor supplies a <code className="text-paper">source_url</code> from one of the recognized sanctioning bodies listed below. Real performances are welcome via PR; see <a href="/submit" className="underline hover:text-paper">/submit</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Hard fail constraints</h2>
        <p className="text-muted leading-relaxed mt-3">
          A robot performance is rejected outright — never enters the ledger — if any of:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted space-y-1">
          <li><code className="text-paper">locomotion_type</code> is not <code className="text-paper">bipedal</code></li>
          <li><code className="text-paper">energy_source</code> is not <code className="text-paper">integrated</code> (tethered power and external pneumatics fail)</li>
          <li><code className="text-paper">terrain_match</code> is not <code className="text-paper">true</code> (must compete on the regulation surface for the event)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Eligibility (independent of validation)</h2>
        <p className="text-muted leading-relaxed mt-3">
          A performance that passes hard-fail can still be ineligible for record purposes. Each
          condition below independently sets <code className="text-paper">eligible = false</code>; the rejection reason lists every failing condition, not just the first:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted space-y-1">
          <li><code className="text-paper">wind_speed_mps &gt; 2.0</code> (null is allowed for indoor events — null does not fail)</li>
          <li><code className="text-paper">wind_legal == false</code></li>
          <li><code className="text-paper">surface_standardized == false</code></li>
          <li><code className="text-paper">equipment_compliant == false</code></li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Validation status</h2>
        <p className="text-muted leading-relaxed mt-3">
          A separate axis from eligibility. Three values:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted space-y-1">
          <li><span className="text-robot">verified</span> — citation from a recognized sanctioning body. Required for primary ledger status.</li>
          <li><span className="text-warn">experimental</span> — real but unsanctioned performances (e.g., exhibition events, lab demos). Surfaces with a "Fallback: experimental" flag when no verified+eligible row exists.</li>
          <li><span className="text-dim">unverified</span> — pending or unsourced. Never selected for status.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Status precedence</h2>
        <p className="text-muted leading-relaxed mt-3">
          Computed at read time. Stored values are inputs only — derived fields are never persisted to disk.
        </p>
        <ol className="list-decimal pl-6 mt-3 text-muted space-y-1">
          <li>If no selectable robot performance exists, status is <span className="text-paper">Human Lead (no robot attempts)</span> or <span className="text-paper">Human Lead (no eligible robot performance)</span>.</li>
          <li>If <code className="text-paper">|robot − human| / human ≤ ε</code> for the event's metric type, status is <span className="text-parity">Parity</span> — even when the robot is numerically better.</li>
          <li>If outside ε and the robot beats the human in the right direction, status is <span className="text-robot">Robot Lead</span>.</li>
          <li>Otherwise, status is <span className="text-human">Human Lead</span>.</li>
        </ol>
        <div className="mt-4 text-xs font-mono text-dim border border-rule rounded p-3 bg-panel">
          ε(time_sprint) = 1e-4 · ε(time_endurance) = 1e-3 · ε(distance) = 1e-3 · ε(score) = 1e-2
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Two parity meters</h2>
        <p className="text-muted leading-relaxed mt-3">
          The homepage shows two denominators side by side, never one without the other:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted space-y-1">
          <li><span className="text-paper">Primary:</span> share of <em className="text-paper not-italic">events robots have actually attempted</em> that are at Parity or Robot Lead.</li>
          <li><span className="text-paper">Secondary:</span> share of <em className="text-paper not-italic">all tracked events</em> at Parity or Robot Lead.</li>
        </ul>
        <p className="text-muted leading-relaxed mt-3">
          The primary alone overstates progress; the secondary alone understates it. Both are true; together they are honest.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Recognized sanctioning bodies</h2>
        <p className="text-muted leading-relaxed mt-3">
          A robot performance is treated as <span className="text-robot">verified</span> only when cited from one of these bodies:
        </p>
        <ul className="list-disc pl-6 mt-3 text-muted columns-1 md:columns-2 space-y-1">
          {SANCTIONING_BODIES.map(b => (
            <li key={b.code}>
              <span className="text-paper">{b.code}</span> — <span className="text-dim">{b.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 font-semibold tracking-tight">Projections</h2>
        <p className="text-muted leading-relaxed mt-3">
          Linear least-squares regression on compliance-valid + eligible performances. Requires at least 3 points. Suppressed when r² &lt; 0.3, the trend regresses, projection lands in the past, projection lands beyond 2100, or status is already Parity / Robot Lead.
        </p>
        <p className="text-muted leading-relaxed mt-3 text-sm">
          Confidence is reported as <span className="text-paper">high</span> (n ≥ 6, r² ≥ 0.7), <span className="text-paper">medium</span> (n ≥ 4, r² ≥ 0.5), or <span className="text-paper">low</span>. A projection is a curve through past data — not a prediction.
        </p>
      </section>
    </div>
  );
}
