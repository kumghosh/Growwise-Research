window.INSURANCE_AI_DATA = {
  id: "insurance-acquisition-ai-cac",
  meta: {
    title: "Insurance Acquisition Squeeze & The AI Frontier",
    deck: "Surging CPCs, form friction, and demographic churn are driving policy acquisition costs to historic highs. How conversational AI is reversing the trend.",
    category: "Artificial Intelligence",
    volume: "Vol. X",
    publishDate: "October 2026",
    readTime: "9 Min Read",
    authors: [window.GROWWISE_AUTHORS[2], window.GROWWISE_AUTHORS[5]] // Daniel & Moly
  },

  // Executive Summary Card Data
  executiveSummary: {
    quote: "Traditional digital channels for policyholder acquisition are reaching structural saturation. Generative AI fundamentally shifts acquisition from reactive bidding to interactive advisory funneling.",
    bullets: [
      "Search intent acquisition costs have surged +313% from 2016 to 2026.",
      "Static quote forms see extreme drop-offs, with mobile converting at just 1.81%.",
      "Replacing 20+ field static lead forms with natural language Q&A interfaces reduces mid-funnel abandonment by 42%."
    ]
  },

  // Narrative Acts
  narrative: [
    {
      act: "Act I",
      title: "The Acquisition Cost Trajectory",
      text: "Traditional digital channels for policyholder acquisition are reaching structural saturation. Over the past decade, surging cost-per-click (CPC) rates, privacy-driven signal degradation, and severe form-friction have combined to drive Customer Acquisition Costs (CAC) to historic highs across auto, home, and life segments. Paid search and paid social have experienced steep inflation. While traditional platforms continue to command the largest share of ad spend, return on ad spend (ROAS) has steadily declined."
    },
    {
      act: "Act II",
      title: "Demographic Alignment & LTV",
      text: "Acquisition economics vary dramatically across buyer cohorts. Ages 18–28 show extreme price sensitivity with a short average tenure of 1.8 years. In contrast, the peak profitability cohort (Ages 29–42) boasts a 68% multi-policy bundling rate and a 9.4-year average tenure. The ultra-low churn demographic (Ages 43–58) represents the highest lifetime value with a 14.2-year average tenure, driving the industry's retention rate to 84%."
    },
    {
      act: "Act III",
      title: "The Form Drop-Off Crisis",
      text: "Quote form completion rates across major carrier portals dropped from 13.6% in 2018 to 4.2% in 2026. This attrition is driven by Field Fatigue (requesting 20+ fields upfront), Outbound Contact Phobia (fearing immediate automated agent calls), and Data Privacy Hesitancy. Static quote forms see extreme drop-offs on mobile, converting at just 1.81% compared to desktop's 3.93%."
    },
    {
      act: "Act IV",
      title: "The Conversational AI Frontier",
      text: "As consumers migrate discovery behaviors from traditional keyword search to generative AI assistants (like ChatGPT and Gemini), the acquisition model is shifting to interactive advisory funneling. AI engines extract risk parameters naturally through dialogue, yielding up to a 42% reduction in drop-off. Carriers reallocating just 20% of legacy search ad spend into conversational AI networks are seeing a blended CAC reduction of 35%."
    }
  ],

  // 4-Block KPI Grid
  kpis: [
    {
      id: "cac-surge",
      title: "Google Ads CAC",
      value: "$215",
      change: "+313%",
      trend: "up",
      note: "From $52 baseline (2016)",
      badgeType: "rose",
      icon: "trending-up",
      sparkline: [52, 60, 75, 95, 110, 128, 150, 175, 190, 205, 215]
    },
    {
      id: "meta-cac",
      title: "Meta Ads CAC",
      value: "$170",
      change: "+390%",
      trend: "up",
      note: "From $31 baseline (2016)",
      badgeType: "rose",
      icon: "dollar-sign",
      sparkline: [31, 40, 55, 70, 85, 94, 115, 135, 150, 160, 170]
    },
    {
      id: "ai-cac",
      title: "AI Ad CAC",
      value: "$64",
      change: "-70%",
      trend: "down",
      note: "vs Traditional Search",
      badgeType: "teal",
      icon: "cpu",
      sparkline: [150, 140, 120, 100, 90, 80, 75, 70, 68, 65, 64]
    },
    {
      id: "form-friction",
      title: "Mobile Form CVR",
      value: "1.81%",
      change: "-42%",
      trend: "down",
      note: "Quote abandonment crisis",
      badgeType: "amber",
      icon: "alert-circle",
      sparkline: [12, 10, 8, 7, 5, 4.5, 4, 3.5, 2.8, 2.0, 1.8]
    }
  ],

  // Timeline for Interactive Lab
  timeline: [
    { year: 2016, cpc: 2.10, cac: 52.00, roas: 4.80, milestone: "Baseline Quote Aggregators" },
    { year: 2017, cpc: 2.45, cac: 60.00, roas: 4.20, milestone: "Smart Bidding Scaling" },
    { year: 2018, cpc: 2.90, cac: 75.00, roas: 3.90, milestone: "Form Completion: 13.6%" },
    { year: 2019, cpc: 3.50, cac: 95.00, roas: 3.40, milestone: "Broad Match Shift" },
    { year: 2020, cpc: 4.10, cac: 110.00, roas: 3.10, milestone: "Digital Quote Surge (COVID)" },
    { year: 2021, cpc: 4.80, cac: 128.00, roas: 2.70, milestone: "iOS 14.5 ATT Impact" },
    { year: 2022, cpc: 5.60, cac: 150.00, roas: 2.30, milestone: "PMax Adoption" },
    { year: 2023, cpc: 6.50, cac: 175.00, roas: 2.00, milestone: "Data Privacy Hesitancy Peak" },
    { year: 2024, cpc: 7.20, cac: 190.00, roas: 1.80, milestone: "Gen AI Assistants Launch" },
    { year: 2025, cpc: 7.90, cac: 205.00, roas: 1.60, milestone: "AI Interactive Advisors" },
    { year: 2026, cpc: 8.50, cac: 215.00, roas: 1.40, milestone: "Form Completion: 4.2%" }
  ],

  // Channel Comparison
  channelComparison: [
    { channel: "Google Ads (Search Intent)", cac2018: 52.00, cac2026: 215.00, efficiencyIndex: 65, color: "#0F141A" },
    { channel: "Meta Ads (Paid Social)", cac2018: 31.00, cac2026: 170.00, efficiencyIndex: 68, color: "#0A1E36" },
    { channel: "Conversational AI Ads", cac2018: 52.00, cac2026: 64.00, efficiencyIndex: 92, color: "#0D9488" }
  ],

  // Strategic Imperatives
  strategicImperatives: [
    {
      num: "01",
      title: "Reallocate to AI Networks",
      desc: "Shift 15-20% of performance marketing budgets toward conversational ad units to achieve a 35-45% lower blended CAC."
    },
    {
      num: "02",
      title: "Eliminate Static Form Friction",
      desc: "Replace 20+ field static lead forms with natural language Q&A interfaces to reduce mid-funnel abandonment by 42%."
    },
    {
      num: "03",
      title: "Target Low-Churn Demographics",
      desc: "Align acquisition spend heavily toward the 29-42 and 43-58 cohorts to maximize the 9.4 to 14.2 year average tenures and bundling rates."
    }
  ]
};
