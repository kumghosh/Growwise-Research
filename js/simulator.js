/**
 * Growwise Research - Unit Economics & CAC Margin Stress-Tester
 * Real-time dynamic modeling for executive unit economic analysis
 */

window.SimulatorEngine = {
  presets: {
    ecommerce: {
      name: "D2C & Consumer Goods",
      defaultAov: 280,
      cpcMultiplier: 1.0,
      baselineCvr: 3.2,
      grossMarginPct: 65
    },
    saas: {
      name: "B2B SaaS / Software",
      defaultAov: 480,
      cpcMultiplier: 1.4,
      baselineCvr: 2.5,
      grossMarginPct: 80
    },
    fintech: {
      name: "FinTech & Neobanking",
      defaultAov: 360,
      cpcMultiplier: 1.6,
      baselineCvr: 2.8,
      grossMarginPct: 70
    },
    services: {
      name: "Professional & Local Services",
      defaultAov: 750,
      cpcMultiplier: 1.9,
      baselineCvr: 3.5,
      grossMarginPct: 55
    }
  },

  calculate(industryKey, customerValue, targetYear, customCvr) {
    const preset = this.presets[industryKey] || this.presets.ecommerce;
    
    // Baseline search CPC formula scaled from 2015 baseline to 2026
    const yearIndex = Math.max(0, Math.min(11, targetYear - 2015));
    const baselineCpcCurve = [1.52, 1.74, 2.05, 2.41, 2.76, 3.12, 3.68, 3.95, 4.22, 4.54, 4.79, 4.98];
    const baseCpc = baselineCpcCurve[yearIndex] * preset.cpcMultiplier;

    // Conversion rate
    const cvr = (customCvr || preset.baselineCvr) / 100;
    
    // Calculated CAC = CPC / CVR
    const calculatedCac = baseCpc / cvr;

    // Gross Profit = Customer Value * Gross Margin %
    const grossProfit = customerValue * (preset.grossMarginPct / 100);

    // Net Contribution = Gross Profit - CAC
    const netContribution = grossProfit - calculatedCac;
    const netMarginPct = (netContribution / customerValue) * 100;
    const cacRatioPct = (calculatedCac / customerValue) * 100;

    // Qualitative Health Status
    let status = 'healthy';
    let statusLabel = 'Capital Efficient';
    let statusColor = '#059669';
    let recommendation = 'Unit economics absorb search auction inflation with positive net contribution. Maintain focus on high-intent query harvesting and first-party customer retention.';

    if (netMarginPct <= 0) {
      status = 'critical';
      statusLabel = 'Deficit Arbitrage';
      statusColor = '#E11D48';
      recommendation = 'Customer acquisition cost exceeds unit gross profit. Mandate strict negative keyword exclusions, prune non-converting search terms, and shift focus to organic retention loops.';
    } else if (netMarginPct < 12 || cacRatioPct > 55) {
      status = 'warning';
      statusLabel = 'Compressed Margin';
      statusColor = '#D97706';
      recommendation = 'Auction inflation is compressing operating margin. Restructure pricing or implement first-order cross-sell packages to lift average basket size.';
    }

    return {
      baseCpc: baseCpc.toFixed(2),
      calculatedCac: calculatedCac.toFixed(2),
      cacRatioPct: cacRatioPct.toFixed(1),
      netMarginPct: netMarginPct.toFixed(1),
      netContribution: netContribution.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      status,
      statusLabel,
      statusColor,
      recommendation
    };
  }
};
