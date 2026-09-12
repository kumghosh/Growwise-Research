/**
 * Growwise Research Publication Engine - Standardized Schema & Uploader Guide
 * 
 * To add or format a new 500-word research brief, supply an object adhering to this specification.
 */

window.RESEARCH_SCHEMA_SPEC = {
  version: "1.2.0",
  fields: {
    meta: {
      id: "String (kebab-case identifier)",
      title: "String (Editorial headline)",
      deck: "String (Sub-headline / core hypothesis)",
      category: "String (e.g., Macroeconomics, FinTech, E-Commerce)",
      volume: "String (e.g., Vol. IX, Issue 4)",
      doi: "String (Digital Object Identifier or reference URI)",
      publishDate: "String (Month Year)",
      readTime: "String (e.g. 3 min read / 512 words)",
      wordCount: "Number (Target ~500 words)",
      authors: "Array of { name, role }"
    },
    kpis: "Array of 4 objects: { id, title, value, change, trend ('up'|'down'), note, badgeType ('teal'|'amber'|'rose'|'gray'), sparkline: [numbers] }",
    executiveSummary: {
      quote: "String (Editorial pull-quote)",
      bullets: "Array of 3 summary takeaways"
    },
    narrative: "Array of 4 Acts: { act: 'Act I', title: '...', text: '...' } total ~500 words",
    timeline: "Array of time series objects: { year, cpc, cac, roas, milestone }",
    channelComparison: "Array of comparative channel objects",
    strategicImperatives: "Array of 3 actionable guidance cards { num, title, desc }"
  }
};

// Second sample dataset to prove multi-research plug-and-play capability:
window.RESEARCH_DATABASE["b2b-saas-ltv-cac-2026"] = {
  meta: {
    id: "b2b-saas-ltv-cac-2026",
    title: "The B2B SaaS Growth Paradigm: LTV/CAC Squeeze in the High-Rate Era",
    deck: "How the collapse of zero-interest-rate policy and elongated enterprise sales cycles forced software leaders to replace net-new ARR with gross margin retention.",
    category: "Software Capital & Enterprise Benchmarks",
    volume: "Vol. IX, Issue 5",
    doi: "doi.org/10.growwise.res/2026.05.saas",
    publishDate: "August 2026",
    readTime: "3 min read (498 words)",
    wordCount: 498,
    authors: [
      { name: "Daniel Whitmore", role: "Senior Research Analyst", initials: "DW" },
      { name: "Kumarjit Ghosh", role: "Founder & CTO", initials: "KG" }
    ]
  },
  kpis: [
    {
      id: "cac-payback",
      title: "CAC Payback Period",
      value: "21.4 mo",
      change: "+78.3%",
      trend: "up",
      note: "vs. 12.0 mo in 2021",
      badgeType: "rose",
      icon: "calendar",
      sparkline: [12, 13, 14, 16, 18, 20, 21]
    },
    {
      id: "magic-number",
      title: "Median Magic Number",
      value: "0.68",
      change: "-39.2%",
      trend: "down",
      note: "Sales efficiency baseline > 1.0",
      badgeType: "amber",
      icon: "zap",
      sparkline: [1.12, 1.05, 0.94, 0.82, 0.74, 0.70, 0.68]
    },
    {
      id: "expansion-arr",
      title: "Expansion ARR %",
      value: "64.2%",
      change: "+28.1% pts",
      trend: "up",
      note: "Of total new annualized revenue",
      badgeType: "teal",
      icon: "arrow-up-right",
      sparkline: [36, 39, 44, 51, 58, 62, 64]
    },
    {
      id: "enterprise-cycles",
      title: "Sales Cycle Length",
      value: "148 days",
      change: "+42.3%",
      trend: "up",
      note: "CFO scrutiny on ACV > $50k",
      badgeType: "amber",
      icon: "clock",
      sparkline: [104, 110, 118, 130, 142, 146, 148]
    }
  ],
  executiveSummary: {
    quote: "The era of burning $2.50 to generate $1.00 of recurring software revenue has concluded. Capital discipline is no longer an option; it is the sole surviving valuation metric.",
    bullets: [
      "Payback Deterioration: Average enterprise payback times expanded past 21 months, turning customer acquisition into a capital-intensive endurance trial.",
      "Net Expansion Mandate: Winning firms now derive nearly two-thirds of annual growth from account expansion rather than net-new logos.",
      "The CFO Gatekeeper: Multi-stakeholder security and finance approvals lengthened closing cycles from 104 to 148 days."
    ]
  },
  narrative: [
    {
      act: "Act I",
      title: "The ZIRP Hallucination (2020–2021)",
      text: "During the height of zero-interest-rate policy, SaaS multiples peaked above 20x forward revenue. Software executives operated under the assumption of frictionless capital, deploying astronomical customer acquisition spend across outbound SDR fleets and indiscriminate programmatic ads. In 2021, an enterprise CAC of $14,000 was easily amortized against projected net retention rates exceeding 130%, blinding organizations to underlying churn vulnerabilities."
    },
    {
      act: "Act II",
      title: "The Valuation Shock & Procurement Freeze (2022–2023)",
      text: "As central banks hiked rates, software multiples plummeted back to historical norms of 6x. Enterprise CFOs initiated aggressive vendor consolidation audits, cutting software licenses by up to 35%. Outbound cold outbound response rates collapsed by 72% as AI-generated spam overwhelmed inboxes. Consequently, sales cycles lengthened from 104 to over 130 days, stranding mid-market pipeline in prolonged procurement limbo."
    },
    {
      act: "Act III",
      title: "The Rise of Product-Led Expansion (2024–2025)",
      text: "Faced with soaring customer acquisition friction, top-performing SaaS organizations restructured their go-to-market architecture around usage-based pricing and product-led telemetry. Rather than hunting cold logos, engineering and customer success teams prioritized net revenue retention (NRR). Existing accounts were systematically nurtured, driving expansion ARR to account for 64% of all revenue additions by late 2025."
    },
    {
      act: "Act IV",
      title: "The 2026 Mandate: Hyper-Efficient Capital Deployment",
      text: "In 2026, the benchmark for exceptional software growth is defined not by top-line velocity, but by Rule of 40 resilience and payback velocity under 14 months. Teams deploying autonomous AI sales agents to qualify inbound intent have achieved 38% lower acquisition costs, separating themselves from legacy sales heavy competitors."
    }
  ],
  timeline: [
    { year: 2020, cpc: 1.80, cac: 54.00, roas: 3.8, milestone: "Remote Work Software Surge" },
    { year: 2021, cpc: 2.20, cac: 68.00, roas: 3.5, milestone: "ZIRP Valuation Peak" },
    { year: 2022, cpc: 2.90, cac: 85.00, roas: 2.9, milestone: "Tech Layoffs & Vendor Audits" },
    { year: 2023, cpc: 3.60, cac: 108.00, roas: 2.4, milestone: "CFO Procurement Gatekeeping" },
    { year: 2024, cpc: 4.10, cac: 122.00, roas: 2.1, milestone: "Usage-Based Model Migration" },
    { year: 2025, cpc: 4.50, cac: 138.00, roas: 1.9, milestone: "Autonomous Agent Qualification" },
    { year: 2026, cpc: 4.85, cac: 152.00, roas: 1.8, milestone: "High-Yield Margin Equilibrium" }
  ],
  channelComparison: [
    { channel: "Product-Led Onboarding", cac2018: 32.0, cac2026: 46.0, efficiencyIndex: 92, color: "#0D9488" },
    { channel: "Customer Expansion / Upsell", cac2018: 24.0, cac2026: 38.0, efficiencyIndex: 96, color: "#10B981" },
    { channel: "Targeted Account ABM", cac2018: 95.0, cac2026: 185.0, efficiencyIndex: 65, color: "#2563EB" },
    { channel: "Cold Email & SDR Outbound", cac2018: 85.0, cac2026: 220.0, efficiencyIndex: 42, color: "#E11D48" },
    { channel: "Paid Search & Review Sites", cac2018: 72.0, cac2026: 164.0, efficiencyIndex: 58, color: "#D97706" }
  ],
  strategicImperatives: [
    {
      num: "01",
      title: "Deprecate Low-Yield Outbound Cadences",
      desc: "Retire volume-based cold outbound and reallocate 40% of sales capacity toward high-signal intent triggers and customer health monitoring."
    },
    {
      num: "02",
      title: "Institutionalize Consumption Expansion",
      desc: "Re-engineer pricing tiers so customer contract values scale automatically with seat consumption, API calls, or workflow throughput."
    },
    {
      num: "03",
      title: "Implement Payback Guardrails",
      desc: "Enforce strict discounting policies requiring maximum 15-month cash payback for any custom multi-year enterprise agreement."
    }
  ]
};

// Register the new Insurance AI report if the data script is loaded
if (window.INSURANCE_AI_DATA) {
  window.RESEARCH_DATABASE["insurance-acquisition-ai-cac"] = window.INSURANCE_AI_DATA;
}
