type Step = {
  numeral: string;
  label: string;
  title: string;
  body?: string;
  highlight?: boolean;
  duo?: {
    leftTitle: string;
    leftBody: string;
    rightTitle: string;
    rightBody: string;
    footnote: string;
  };
};

const STEPS: readonly Step[] = [
  {
    numeral: "01",
    label: "First",
    title: "Travel everywhere.",
    body: "To travel and experience everything — every airport, every coast, every city I haven't seen yet. Pin every map until the pins are the map.",
  },
  {
    numeral: "02",
    label: "The big one",
    title: "Wings or waves.",
    highlight: true,
    duo: {
      leftTitle: "Wings · Flight attendant",
      leftBody:
        "Cabin crew, layovers in cities I've only seen on a map. The aisle is the office, the window is the view.",
      rightTitle: "Waves · Cruise ship",
      rightBody:
        "Months at sea, ports every other morning, a different sky every week. A small cabin, a big horizon.",
      footnote: "Either way — passport stamps and stories.",
    },
  },
  {
    numeral: "03",
    label: "And then",
    title: "Turn it all into content.",
    body: "Document the chase. Edit the moments. Build a feed that feels like a travel diary you can scroll — quiet enough to be honest, edited enough to keep.",
  },
] as const;

export default function Dreams() {
  return (
    <section id="dreams" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            III
          </span>
          <span className="eyebrow__label">Dreams &amp; Goals</span>
          <span className="eyebrow__meta">In three parts</span>
        </div>

        <h2 className="mt-10 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1] tracking-[-0.02em] text-emerald-950">
          What I'm{" "}
          <span className="italic text-gold-500">chasing.</span>
        </h2>

        <ol className="mt-20 space-y-16">
          {STEPS.map((step) => (
            <li
              key={step.numeral}
              className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-12"
            >
              <div className="lg:col-span-3">
                <div className="flex items-baseline gap-3 border-b border-emerald-950/15 pb-3">
                  <span
                    className={`font-display text-3xl italic leading-none ${
                      step.highlight ? "text-gold-500" : "text-emerald-950"
                    }`}
                  >
                    {step.numeral}
                  </span>
                  <span className="label-caps text-emerald-950/65">
                    {step.label}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-9">
                {step.highlight ? (
                  <div className="border-y border-gold-500/40 bg-gold-300/10 px-6 py-10 md:px-10 md:py-12">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="font-display text-2xl text-gold-500"
                      >
                        ✦
                      </span>
                      <span className="label-caps text-gold-600">
                        The big one
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-display text-2xl text-gold-500"
                      >
                        ✦
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-3xl leading-tight text-emerald-950 md:text-5xl">
                      {step.title}
                    </h3>
                    {step.duo && (
                      <>
                        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
                          <div className="border-l-2 border-gold-500 pl-5">
                            <div className="label-caps text-gold-600">
                              {step.duo.leftTitle.split(" · ")[0]}
                            </div>
                            <div className="mt-1 font-serif text-base italic text-emerald-950 md:text-lg">
                              {step.duo.leftTitle.split(" · ")[1]}
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-emerald-950/80">
                              {step.duo.leftBody}
                            </p>
                          </div>
                          <div className="border-l-2 border-emerald-500 pl-5">
                            <div className="label-caps text-emerald-600">
                              {step.duo.rightTitle.split(" · ")[0]}
                            </div>
                            <div className="mt-1 font-serif text-base italic text-emerald-950 md:text-lg">
                              {step.duo.rightTitle.split(" · ")[1]}
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-emerald-950/80">
                              {step.duo.rightBody}
                            </p>
                          </div>
                        </div>
                        <p className="mt-10 border-t border-gold-500/40 pt-6 font-serif text-base italic text-emerald-950/85 md:text-lg">
                          {step.duo.footnote}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-3xl leading-tight text-emerald-950 md:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-950/75">
                      {step.body}
                    </p>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
