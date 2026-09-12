/**
 * Growwise Research - Zero-Dependency Interactive SVG Chart Engine
 * Lightweight, Touch-Optimized, Retina-Crisp
 */

window.ChartEngine = {
  /**
   * Renders a lightweight SVG sparkline inside a small container
   */
  renderSparkline(element, data, strokeColor = 'var(--color-ink-primary)') {
    if (!element || !data || data.length < 2) return;

    const width = element.clientWidth || 75;
    const height = element.clientHeight || 24;
    const padding = 3;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;

    element.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sparkline-path" />
        <circle cx="${points[points.length - 1].split(',')[0]}" cy="${points[points.length - 1].split(',')[1]}" r="3" fill="${strokeColor}" />
      </svg>
    `;
  },

  /**
   * Renders the flagship interactive dual-axis longitudinal timeline chart
   */
  renderTimelineChart(container, timelineData, activeMetric = 'cac', activeIndex = null) {
    if (!container || !timelineData || !timelineData.length) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width || 680, 320);
    const height = width < 600 ? 270 : 340;
    const padding = {
      top: 24,
      right: width < 600 ? 20 : 35,
      bottom: 40,
      left: width < 600 ? 45 : 60
    };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    // Determine metric values & formatting
    let values, unitPrefix = '', unitSuffix = '', metricLabel = 'Blended CAC';
    if (activeMetric === 'cpc') {
      values = timelineData.map(d => d.cpc);
      unitPrefix = '$';
      metricLabel = 'Search CPC';
    } else if (activeMetric === 'roas') {
      values = timelineData.map(d => d.roas);
      unitSuffix = 'x';
      metricLabel = 'Return on Ad Spend';
    } else {
      values = timelineData.map(d => d.cac);
      unitPrefix = '$';
      metricLabel = 'Blended CAC';
    }

    const minVal = Math.floor(Math.min(...values) * 0.85);
    const maxVal = Math.ceil(Math.max(...values) * 1.08);
    const valRange = maxVal - minVal || 1;

    // Coordinate helpers
    const getX = (i) => padding.left + (i / (timelineData.length - 1)) * innerWidth;
    const getY = (val) => padding.top + innerHeight - ((val - minVal) / valRange) * innerHeight;

    // Build SVG Path (smooth Catmull-Rom or cubic Bezier)
    const pts = timelineData.map((d, i) => ({
      x: getX(i),
      y: getY(values[i]),
      data: d,
      val: values[i],
      index: i
    }));

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    // Area Fill under the curve
    const areaD = `${pathD} L ${pts[pts.length - 1].x} ${padding.top + innerHeight} L ${pts[0].x} ${padding.top + innerHeight} Z`;

    // Generate Y-axis grid ticks (4 steps)
    let yTicksHtml = '';
    const tickCount = 4;
    for (let t = 0; t <= tickCount; t++) {
      const tickVal = minVal + (valRange / tickCount) * t;
      const tickY = getY(tickVal);
      yTicksHtml += `
        <line x1="${padding.left}" y1="${tickY}" x2="${width - padding.right}" y2="${tickY}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
        <text x="${padding.left - 10}" y="${tickY + 4}" font-size="11" fill="var(--color-ink-muted)" text-anchor="end" font-family="var(--font-sans)" font-weight="500">
          ${unitPrefix}${tickVal.toFixed(activeMetric === 'cpc' ? 2 : 0)}${unitSuffix}
        </text>
      `;
    }

    // Generate X-axis labels
    let xLabelsHtml = '';
    timelineData.forEach((d, i) => {
      const x = getX(i);
      // Skip some on mobile to avoid overlap
      if (width < 500 && i % 2 !== 0 && i !== timelineData.length - 1) return;
      xLabelsHtml += `
        <text x="${x}" y="${padding.top + innerHeight + 22}" font-size="11" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)" font-weight="500">
          ${d.year}
        </text>
      `;
    });

    // Milestone pins & dots
    let dotsHtml = '';
    pts.forEach((p) => {
      const isSelected = activeIndex === p.index;
      const hasMilestone = !!p.data.milestone;
      const r = isSelected ? 7 : (hasMilestone ? 5 : 3.5);
      const strokeW = isSelected ? 3 : 2;
      const fill = isSelected ? '#FFFFFF' : (hasMilestone ? 'var(--color-brand-amber)' : 'var(--color-brand-teal)');
      const stroke = isSelected ? 'var(--color-brand-teal)' : '#FFFFFF';

      dotsHtml += `
        <g class="chart-point-marker" data-index="${p.index}" style="cursor:pointer;">
          <circle cx="${p.x}" cy="${p.y}" r="${r + 5}" fill="transparent" />
          <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />
        </g>
      `;
    });

    // Crosshair line if active
    let crosshairHtml = '';
    if (activeIndex !== null && pts[activeIndex]) {
      const activePt = pts[activeIndex];
      crosshairHtml = `
        <line x1="${activePt.x}" y1="${padding.top}" x2="${activePt.x}" y2="${padding.top + innerHeight}" stroke="var(--color-brand-teal)" stroke-width="1.5" stroke-dasharray="4,4" />
      `;
    }

    // Render SVG
    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0D9488" stop-opacity="0.22" />
            <stop offset="90%" stop-color="#0D9488" stop-opacity="0.01" />
          </linearGradient>
        </defs>
        ${yTicksHtml}
        ${xLabelsHtml}
        <path d="${areaD}" fill="url(#areaGradient)" />
        <path d="${pathD}" fill="none" stroke="var(--color-brand-teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-animated-path" />
        ${crosshairHtml}
        ${dotsHtml}
      </svg>
      <div class="chart-tooltip" id="chart-tooltip"></div>
    `;

    // Attach mouse & touch interactivity
    this.attachChartInteractions(container, pts, unitPrefix, unitSuffix, metricLabel);
  },

  /**
   * Hover & touch crosshair binding
   */
  attachChartInteractions(container, pts, unitPrefix, unitSuffix, metricLabel) {
    const tooltip = container.querySelector('#chart-tooltip');
    if (!tooltip) return;

    const findClosestPoint = (clientX) => {
      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left;
      let closest = pts[0];
      let minDiff = Infinity;
      pts.forEach(pt => {
        const diff = Math.abs(pt.x - relX);
        if (diff < minDiff) {
          minDiff = diff;
          closest = pt;
        }
      });
      return closest;
    };

    const updateTooltip = (pt) => {
      if (!pt) {
        tooltip.classList.remove('visible');
        return;
      }

      tooltip.innerHTML = `
        <div class="tooltip-year">${pt.data.year} Briefing</div>
        <div class="tooltip-metric-row">
          <span>${metricLabel}:</span>
          <strong style="color:#2DD4BF;">${unitPrefix}${pt.val}${unitSuffix}</strong>
        </div>
        ${pt.data.cpc ? `
          <div class="tooltip-metric-row" style="opacity:0.8;font-size:0.7rem;">
            <span>Search CPC:</span>
            <span>$${pt.data.cpc}</span>
          </div>
        ` : ''}
        ${pt.data.milestone ? `<div class="tooltip-milestone">— ${pt.data.milestone}</div>` : ''}
      `;

      tooltip.style.left = `${pt.x}px`;
      tooltip.style.top = `${pt.y - 12}px`;
      tooltip.classList.add('visible');

      // Sync slider if present
      const slider = document.getElementById('timeline-slider');
      if (slider && parseInt(slider.value) !== pt.index) {
        slider.value = pt.index;
        const callout = document.getElementById('scrubber-milestone-text');
        if (callout) {
          callout.innerHTML = `<strong>${pt.data.year} Catalyst:</strong> ${pt.data.milestone || 'Steady auction expansion'}`;
        }
      }
    };

    const handlePointer = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pt = findClosestPoint(clientX);
      updateTooltip(pt);
    };

    container.onmousemove = handlePointer;
    container.ontouchmove = handlePointer;
    container.onmouseleave = () => tooltip.classList.remove('visible');
    container.ontouchend = () => setTimeout(() => tooltip.classList.remove('visible'), 2000);
  },

  /**
   * Renders the channel comparative efficiency matrix bars
   */
  renderChannelComparison(container, channelData) {
    if (!container || !channelData) return;

    let html = '';
    channelData.forEach(item => {
      const delta = ((item.cac2026 - item.cac2018) / item.cac2018 * 100).toFixed(0);
      html += `
        <div class="channel-row">
          <div class="channel-name">
            ${item.channel}
          </div>
          <div class="channel-bar-wrap">
            <div class="channel-bar-fill" style="width: ${item.efficiencyIndex}%; background: ${item.color || 'var(--color-brand-teal)'};"></div>
          </div>
          <div class="channel-stat">
            $${item.cac2026.toFixed(2)}
            <span style="display:block;font-size:0.7rem;color:var(--color-ink-muted);font-weight:500;">+${delta}%</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  /**
   * EXHIBIT 1: Demographic LTV & Retention Horizontal SVG Bar Chart
   */
  renderCohortBarChart(container, activeMetric = 'tenure') {
    if (!container) return;

    const cohorts = [
      { id: '18-28', name: 'Ages 18–28', products: 'Auto & Renters', tenure: 1.8, bundling: 14, retention: 42, churn: 'High', note: '84% shop rates at annual renewal; high digital responsiveness but extreme price sensitivity.' },
      { id: '29-42', name: 'Ages 29–42', products: 'Life & Homeowners', tenure: 9.4, bundling: 68, retention: 76, churn: 'Low', note: 'Prime profitability window; 68% multi-policy bundling locks tenure.' },
      { id: '43-58', name: 'Ages 43–58', products: 'Commercial & Umbrella', tenure: 14.2, bundling: 78, retention: 84, churn: 'Ultra-Low', note: 'Highest customer lifetime value; anchors 84% industry average retention.' },
      { id: '59+', name: 'Ages 59+', products: 'Medicare & Annuities', tenure: 11.6, bundling: 45, retention: 82, churn: 'Low', note: 'Regulated acquisition landscape; assisted digital onboarding & phone touchpoints.' }
    ];

    let maxVal = 15;
    let unit = ' yrs';
    let tickLabels = ['0y', '3y', '6y', '9y', '12y', '15y'];
    let valKey = 'tenure';

    if (activeMetric === 'bundling') {
      maxVal = 100;
      unit = '%';
      tickLabels = ['0%', '20%', '40%', '60%', '80%', '100%'];
      valKey = 'bundling';
    } else if (activeMetric === 'retention') {
      maxVal = 100;
      unit = '%';
      tickLabels = ['0%', '20%', '40%', '60%', '80%', '100%'];
      valKey = 'retention';
    }

    const width = 640;
    const height = 230;
    const leftMargin = 175;
    const rightMargin = 65;
    const chartWidth = width - leftMargin - rightMargin;
    const barHeight = 22;
    const rowSpacing = 48;
    const topMargin = 20;

    let gridLinesHtml = '';
    tickLabels.forEach((lbl, i) => {
      const x = leftMargin + (i / (tickLabels.length - 1)) * chartWidth;
      gridLinesHtml += `
        <line x1="${x}" y1="${topMargin}" x2="${x}" y2="${topMargin + 4 * rowSpacing - 14}" stroke="var(--color-border-subtle)" stroke-dasharray="3,3" />
        <text x="${x}" y="${topMargin + 4 * rowSpacing + 8}" font-size="10" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">${lbl}</text>
      `;
    });

    let barsHtml = '';
    cohorts.forEach((c, idx) => {
      const val = c[valKey];
      const barW = Math.max(8, (val / maxVal) * chartWidth);
      const y = topMargin + idx * rowSpacing;
      const isTeal = valKey === 'tenure' ? val >= 9 : (val >= 60);
      const barColor = isTeal ? '#0D9488' : (valKey === 'tenure' && val < 5 ? '#E11D48' : '#334155');

      barsHtml += `
        <g class="cohort-bar-group" data-idx="${idx}" style="cursor:pointer;">
          <text x="${leftMargin - 12}" y="${y + 11}" font-size="12" font-weight="700" fill="var(--color-ink-primary)" text-anchor="end" font-family="var(--font-sans)">
            ${c.name}
          </text>
          <text x="${leftMargin - 12}" y="${y + 24}" font-size="10" fill="var(--color-ink-muted)" text-anchor="end" font-family="var(--font-sans)">
            ${c.products}
          </text>
          
          <rect x="${leftMargin}" y="${y}" width="${chartWidth}" height="${barHeight}" rx="4" fill="var(--color-paper-subtle)" />
          <rect x="${leftMargin}" y="${y}" width="${barW}" height="${barHeight}" rx="4" fill="${barColor}" class="cohort-svg-bar" style="transition: width 0.6s ease;" />
          
          <text x="${leftMargin + barW + 8}" y="${y + 15}" font-size="11" font-weight="800" fill="var(--color-ink-primary)" font-family="var(--font-sans)">
            ${val}${unit}
          </text>
        </g>
      `;
    });

    container.innerHTML = `
      <div class="exhibit-tabs-row">
        <button class="exhibit-tab-btn ${activeMetric === 'tenure' ? 'active' : ''}" data-metric="tenure">Average Tenure (Years)</button>
        <button class="exhibit-tab-btn ${activeMetric === 'bundling' ? 'active' : ''}" data-metric="bundling">Multi-Policy Bundling (%)</button>
        <button class="exhibit-tab-btn ${activeMetric === 'retention' ? 'active' : ''}" data-metric="retention">Renewal Retention Rate (%)</button>
      </div>

      <div class="exhibit-chart-canvas">
        <svg class="exhibit-svg" viewBox="0 0 ${width} ${height}">
          ${gridLinesHtml}
          ${barsHtml}
        </svg>
        <div class="chart-tooltip" id="cohort-tooltip"></div>
      </div>
    `;

    // Tab buttons event
    const tabBtns = container.querySelectorAll('.exhibit-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.getAttribute('data-metric');
        this.renderCohortBarChart(container, m);
      });
    });

    // Tooltip hover
    const tooltip = container.querySelector('#cohort-tooltip');
    const barGroups = container.querySelectorAll('.cohort-bar-group');
    barGroups.forEach(g => {
      g.addEventListener('mouseenter', (e) => {
        const idx = parseInt(g.getAttribute('data-idx'));
        const item = cohorts[idx];
        if (!item || !tooltip) return;

        tooltip.innerHTML = `
          <div class="tooltip-year">${item.name} — ${item.products}</div>
          <div class="tooltip-metric-row"><span>Average Tenure:</span> <strong>${item.tenure} yrs</strong></div>
          <div class="tooltip-metric-row"><span>Multi-Policy Bundling:</span> <strong>${item.bundling}%</strong></div>
          <div class="tooltip-metric-row"><span>Renewal Retention:</span> <strong>${item.retention}%</strong></div>
          <div class="tooltip-metric-row"><span>Churn Profile:</span> <strong style="color:${item.churn === 'High' ? '#FDA4AF' : '#5EEAD4'};">${item.churn}</strong></div>
          <div class="tooltip-milestone">— ${item.note}</div>
        `;
        const rect = container.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top - 20}px`;
        tooltip.classList.add('visible');
      });

      g.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.style.top = `${e.clientY - rect.top - 20}px`;
      });

      g.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('visible');
      });
    });
  },

  /**
   * EXHIBIT 2: Device Conversion Gap & Form Completion Collapse Chart
   */
  renderDeviceAndAttritionChart(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="dual-chart-grid">
        <!-- Panel 1: Device Conversion Rate Gap (2026) -->
        <div class="chart-sub-panel">
          <div class="chart-sub-title">Quote Completion by Device (2026)</div>
          <div class="chart-sub-desc">Catastrophic mobile drop-off vs. desktop web portals (GoCardless Benchmark)</div>
          
          <svg viewBox="0 0 340 160" class="exhibit-svg" style="margin-top:0.5rem;">
            <!-- Gridlines -->
            <line x1="80" y1="20" x2="310" y2="20" stroke="var(--color-border-subtle)" stroke-dasharray="2,2" />
            <line x1="80" y1="75" x2="310" y2="75" stroke="var(--color-border-subtle)" stroke-dasharray="2,2" />
            <line x1="80" y1="130" x2="310" y2="130" stroke="var(--color-border-subtle)" />

            <!-- X-ticks -->
            <text x="80" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">0%</text>
            <text x="137" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">1%</text>
            <text x="195" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">2%</text>
            <text x="252" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">3%</text>
            <text x="310" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">4%</text>

            <!-- Desktop Bar -->
            <text x="72" y="47" font-size="11" font-weight="700" fill="var(--color-ink-primary)" text-anchor="end" font-family="var(--font-sans)">Desktop</text>
            <rect x="80" y="32" width="230" height="22" rx="3" fill="var(--color-paper-subtle)" />
            <rect x="80" y="32" width="226" height="22" rx="3" fill="#0D9488" />
            <text x="312" y="47" font-size="11" font-weight="800" fill="var(--color-ink-primary)" font-family="var(--font-sans)">3.93%</text>

            <!-- Mobile Bar -->
            <text x="72" y="102" font-size="11" font-weight="700" fill="var(--color-ink-primary)" text-anchor="end" font-family="var(--font-sans)">Mobile</text>
            <rect x="80" y="87" width="230" height="22" rx="3" fill="var(--color-paper-subtle)" />
            <rect x="80" y="87" width="104" height="22" rx="3" fill="#E11D48" />
            <text x="190" y="102" font-size="11" font-weight="800" fill="#E11D48" font-family="var(--font-sans)">1.81%</text>
          </svg>

          <div style="font-size:0.75rem;color:var(--color-ink-secondary);line-height:1.45;margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid var(--color-border-subtle);">
            <strong>2.17x Conversion Disparity:</strong> Mobile policy shoppers abandon complex 20+ field quote forms at over 98%, turning mobile CPC spend into immediate capital loss.
          </div>
        </div>

        <!-- Panel 2: Carrier Form Completion Collapse (2018–2026) -->
        <div class="chart-sub-panel">
          <div class="chart-sub-title">Portal Form Completion Collapse (2018–2026)</div>
          <div class="chart-sub-desc">Empirical attrition across carrier lead gateways from 13.6% down to 4.2%</div>

          <svg viewBox="0 0 340 160" class="exhibit-svg" style="margin-top:0.5rem;">
            <!-- Gridlines -->
            <line x1="40" y1="20" x2="320" y2="20" stroke="var(--color-border-subtle)" stroke-dasharray="2,2" />
            <line x1="40" y1="75" x2="320" y2="75" stroke="var(--color-border-subtle)" stroke-dasharray="2,2" />
            <line x1="40" y1="130" x2="320" y2="130" stroke="var(--color-border-subtle)" />

            <!-- Y Ticks -->
            <text x="32" y="24" font-size="9" fill="var(--color-ink-muted)" text-anchor="end" font-family="var(--font-sans)">15%</text>
            <text x="32" y="79" font-size="9" fill="var(--color-ink-muted)" text-anchor="end" font-family="var(--font-sans)">8%</text>
            <text x="32" y="134" font-size="9" fill="var(--color-ink-muted)" text-anchor="end" font-family="var(--font-sans)">0%</text>

            <!-- Area & Line Curve -->
            <!-- 2018: 13.6% -> y=30, 2020: 10.8% -> y=51, 2022: 7.5% -> y=75, 2024: 5.4% -> y=90, 2026: 4.2% -> y=99 -->
            <path d="M 55 30 L 115 51 L 180 75 L 245 90 L 310 99 L 310 130 L 55 130 Z" fill="rgba(225, 29, 72, 0.12)" />
            <path d="M 55 30 L 115 51 L 180 75 L 245 90 L 310 99" fill="none" stroke="#E11D48" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Points -->
            <circle cx="55" cy="30" r="4" fill="#E11D48" stroke="#FFFFFF" stroke-width="1.5" />
            <text x="55" y="20" font-size="10" font-weight="800" fill="var(--color-ink-primary)" text-anchor="middle" font-family="var(--font-sans)">13.6%</text>
            <text x="55" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">2018</text>

            <circle cx="180" cy="75" r="3.5" fill="#E11D48" stroke="#FFFFFF" stroke-width="1.5" />
            <text x="180" y="66" font-size="9" font-weight="700" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">7.5%</text>
            <text x="180" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">2022</text>

            <circle cx="310" cy="99" r="4" fill="#E11D48" stroke="#FFFFFF" stroke-width="1.5" />
            <text x="310" y="90" font-size="10" font-weight="800" fill="#E11D48" text-anchor="middle" font-family="var(--font-sans)">4.2%</text>
            <text x="310" y="145" font-size="9" fill="var(--color-ink-muted)" text-anchor="middle" font-family="var(--font-sans)">2026</text>
          </svg>

          <div style="font-size:0.75rem;color:var(--color-ink-secondary);line-height:1.45;margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid var(--color-border-subtle);">
            <strong>-69.1% Cumulative Attrition:</strong> Driven by three structural catalysts: Upfront Field Fatigue (20+ fields), Outbound Agent Call Phobia, and heightened Data Broker Privacy Hesitancy.
          </div>
        </div>
      </div>
    `;
  },

  /**
   * EXHIBIT 3: Acquisition Funnel Architecture — 3-Column Layout
   * Labels flanking an SVG-only dual funnel (no text inside shapes)
   * Each row has hover highlight across both the label card and SVG segment.
   */
  renderFunnelFlowChart(container) {
    if (!container) return;

    const STAGE_H = 82; // px — must match CSS .flb-box height

    const tradStages = [
      { label: 'Auction Click',     sub: '$65+ CPC',           note: '1,000 Clicks · $65K Spend',      color: '#334155' },
      { label: 'Form Start',        sub: 'Static 20+ Field',   note: '380 reach the form gateway',     color: '#3B5068' },
      { label: 'Form Completion',   sub: '4.2% CVR',           note: '42 complete — 95.8% abandon',    color: '#475569' },
      { label: 'Quote-to-Close',    sub: '18–24 Days',         note: '~21 policyholders · $215 CAC',   color: '#1E293B' },
    ];
    const aiStages = [
      { label: 'Intent Inquiry',    sub: 'Contextual Query',   note: 'Natural language discovery',     color: '#0F766E' },
      { label: 'AI Q&A Engage',     sub: 'Zero Friction',      note: '780 engage — 42% less drop-off', color: '#0D9488' },
      { label: 'Intent Qualified',  sub: '+42% Retain',        note: '520 pre-qualified leads',        color: '#0A8878' },
      { label: 'Quote-to-Close',    sub: '9–11 Days',          note: '~380 policyholders · $64 CAC',   color: '#0A7A74' },
    ];

    // Minimum 18% width so even tiny stages stay visible in the shape
    const tradPcts = [100, 38, 18, 12];
    const aiPcts   = [100, 78, 52, 38];

    const svgH  = STAGE_H * 4;   // 328
    const halfW = 160;
    const gapPx = 10;
    const svgW  = halfW * 2 + gapPx;

    // Build SVG path groups — no text inside
    const buildPaths = (pcts, startX, colors, side) =>
      pcts.map((pct, i) => {
        const botPct = i < pcts.length - 1 ? pcts[i + 1] : Math.max(pcts[i] * 0.65, 8);
        const topW = (pct / 100) * halfW;
        const botW = (botPct / 100) * halfW;
        const cx   = startX + halfW / 2;
        const y1   = i * STAGE_H;
        const y2   = (i + 1) * STAGE_H;
        const tlx  = (cx - topW / 2).toFixed(1);
        const trx  = (cx + topW / 2).toFixed(1);
        const blx  = (cx - botW / 2).toFixed(1);
        const brx  = (cx + botW / 2).toFixed(1);
        return `
          <g class="fsg" data-side="${side}" data-idx="${i}" style="cursor:default;">
            <rect x="${startX}" y="${y1}" width="${halfW}" height="${STAGE_H}" fill="transparent"/>
            <path class="fsg-path"
              d="M${tlx},${y1} L${trx},${y1} L${brx},${y2} L${blx},${y2} Z"
              fill="${colors[i]}"/>
          </g>`;
      }).join('');

    const tradStartX = 0;
    const aiStartX   = halfW + gapPx;

    // Label columns (pure HTML — no SVG text)
    const labelBoxes = (stages, side) =>
      stages.map((s, i) => `
        <div class="flb-box flb-${side}" data-idx="${i}">
          <div class="flb-name">${s.label}</div>
          <div class="flb-sub">${s.sub}</div>
          <div class="flb-note">${s.note}</div>
        </div>`).join('');

    // CAC comparison bar
    const cacBarHtml = `
      <div class="funnel-cac-comparison">
        <div class="funnel-cac-row">
          <div class="funnel-cac-label">Traditional Search</div>
          <div class="funnel-cac-bar-wrap">
            <div class="funnel-cac-bar-fill" style="width:100%;background:#334155;"></div>
          </div>
          <div class="funnel-cac-val">$215 CAC</div>
        </div>
        <div class="funnel-cac-row">
          <div class="funnel-cac-label">Conversational AI</div>
          <div class="funnel-cac-bar-wrap">
            <div class="funnel-cac-bar-fill" style="width:29.8%;background:#0F766E;"></div>
          </div>
          <div class="funnel-cac-val" style="color:#0D9488;">$64 CAC</div>
        </div>
        <div class="funnel-cac-row">
          <div class="funnel-cac-label">Reduction</div>
          <div class="funnel-cac-bar-wrap" style="display:flex;align-items:center;">
            <span style="font-size:0.78rem;font-weight:700;color:#0D9488;padding-left:4px;">&#8209;70.2% acquisition cost savings vs. traditional search</span>
          </div>
          <div class="funnel-cac-val" style="color:#0D9488;">−70.2%</div>
        </div>
      </div>`;

    // Annotation table
    const stageTableHtml = `
      <div class="funnel-stage-table">
        <div class="funnel-stage-header">
          <span>Stage</span><span>Traditional Search</span><span>Conversational AI</span>
        </div>
        ${tradStages.map((t, i) => `
          <div class="funnel-stage-row">
            <span>${t.label}</span>
            <span>${t.note}</span>
            <span>${aiStages[i].note}</span>
          </div>`).join('')}
      </div>`;

    container.innerHTML = `
      <div class="funnel-visual-wrap">
        <!-- Column headers -->
        <div class="funnel-col-headers">
          <div class="funnel-col-head trad-head">
            <span class="funnel-head-title">Traditional Search Funnel</span>
            <span class="funnel-head-badge red-badge">High Attrition · $215 CAC</span>
          </div>
          <div class="funnel-col-head ai-head">
            <span class="funnel-head-title">Conversational AI Funnel</span>
            <span class="funnel-head-badge teal-badge">High Efficiency · $64 CAC</span>
          </div>
        </div>

        <!-- 3-column: trad labels | SVG | ai labels -->
        <div class="funnel-triple-grid">
          <div class="funnel-lbl-col funnel-lbl-trad" id="funnel-lbl-trad">
            ${labelBoxes(tradStages, 'trad')}
          </div>

          <div class="funnel-svg-col">
            <svg viewBox="0 0 ${svgW} ${svgH}" id="funnel-svg-main"
                 style="display:block;width:100%;height:${svgH}px;">
              ${buildPaths(tradPcts, tradStartX, tradStages.map(s=>s.color), 'trad')}
              ${buildPaths(aiPcts,   aiStartX,   aiStages.map(s=>s.color),  'ai')}
              <line x1="${halfW + gapPx/2}" y1="0" x2="${halfW + gapPx/2}" y2="${svgH}"
                    stroke="rgba(148,163,184,0.25)" stroke-width="1" stroke-dasharray="4,3"/>
            </svg>
          </div>

          <div class="funnel-lbl-col funnel-lbl-ai" id="funnel-lbl-ai">
            ${labelBoxes(aiStages, 'ai')}
          </div>
        </div>

        ${cacBarHtml}
        ${stageTableHtml}
      </div>`;

    // ── Hover interactions ──────────────────────────────────────────────────
    const svgEl     = container.querySelector('#funnel-svg-main');
    const segs      = container.querySelectorAll('.fsg');
    const tradBoxes = container.querySelectorAll('.flb-trad');
    const aiBoxes   = container.querySelectorAll('.flb-ai');

    const setHighlight = (idx, side, on) => {
      // SVG segments
      segs.forEach(g => {
        const match = g.dataset.idx == idx && g.dataset.side === side;
        const path  = g.querySelector('.fsg-path');
        if (!path) return;
        if (on) {
          path.style.filter    = match ? 'brightness(1.3) saturate(1.2)' : 'brightness(0.55)';
          path.style.transform = match ? 'scaleX(1.06)' : 'scaleX(1)';
        } else {
          path.style.filter    = 'none';
          path.style.transform = 'scaleX(1)';
        }
      });

      // Label boxes — this side only
      const boxes = side === 'trad' ? tradBoxes : aiBoxes;
      boxes.forEach((b, bi) => {
        if (on) {
          b.style.transform  = bi == idx ? 'scale(1.04)' : 'scale(0.97)';
          b.style.opacity    = bi == idx ? '1'           : '0.55';
          b.style.background = bi == idx
            ? (side === 'trad' ? 'rgba(51,65,85,0.09)' : 'rgba(13,148,136,0.09)')
            : '';
        } else {
          b.style.transform  = 'scale(1)';
          b.style.opacity    = '1';
          b.style.background = '';
        }
      });
    };

    // Bind to SVG segment groups
    segs.forEach(g => {
      const idx  = parseInt(g.dataset.idx);
      const side = g.dataset.side;
      g.addEventListener('mouseenter', () => setHighlight(idx, side, true));
      g.addEventListener('mouseleave', () => setHighlight(idx, side, false));
    });

    // Bind to label boxes too
    tradBoxes.forEach((b, idx) => {
      b.addEventListener('mouseenter', () => setHighlight(idx, 'trad', true));
      b.addEventListener('mouseleave', () => setHighlight(idx, 'trad', false));
    });
    aiBoxes.forEach((b, idx) => {
      b.addEventListener('mouseenter', () => setHighlight(idx, 'ai', true));
      b.addEventListener('mouseleave', () => setHighlight(idx, 'ai', false));
    });
  },


  /**
   * EXHIBIT 4: Interactive Capital Allocation & Blended CAC Simulator
   */
  renderBudgetShiftSimulator(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="budget-shift-wrap">
        <div class="budget-shift-controls">
          <div class="budget-shift-slider-row">
            <label for="budget-shift-slider">Performance Marketing Budget Shifted to Conversational AI:</label>
            <span class="budget-shift-display-val" id="shift-pct-val">20%</span>
          </div>
          <input type="range" id="budget-shift-slider" class="scrubber-slider" min="0" max="50" step="5" value="20">
          <div style="font-size:0.72rem;color:var(--color-ink-muted);margin-top:0.35rem;">
            Reallocate legacy search intent ad spend ($65+ CPC) into conversational AI ad units ($64 baseline CAC).
          </div>
        </div>

        <div class="budget-shift-bars-comparison">
          <div class="shift-bar-item">
            <div class="shift-bar-labels">
              <span>Status Quo: 100% Traditional Search Allocation</span>
              <strong>$215.00 Blended CAC</strong>
            </div>
            <div class="shift-bar-track">
              <div class="shift-bar-fill" style="width: 100%; background: #334155;">100% Search Intent ($215 CAC)</div>
            </div>
          </div>

          <div class="shift-bar-item">
            <div class="shift-bar-labels">
              <span>Optimized Portfolio (<span id="shift-label-sub">20%</span> Conversational AI / <span id="search-label-sub">80%</span> Search)</span>
              <strong id="blended-cac-result" style="color:var(--color-brand-teal);">$139.75 Blended CAC</strong>
            </div>
            <div class="shift-bar-track">
              <div class="shift-bar-fill" id="blended-bar-fill" style="width: 65%; background: #0D9488;">$139.75 Blended CAC (-35.0%)</div>
            </div>
          </div>
        </div>

        <div class="budget-shift-metrics-grid">
          <div class="shift-metric-box">
            <div class="shift-metric-label">Blended CAC Reduction</div>
            <div class="shift-metric-val" id="shift-metric-reduction" style="color:var(--color-brand-teal);">-35.0%</div>
          </div>
          <div class="shift-metric-box">
            <div class="shift-metric-label">Capital Saved / $1M Spend</div>
            <div class="shift-metric-val" id="shift-metric-savings">+$350,000</div>
          </div>
          <div class="shift-metric-box">
            <div class="shift-metric-label">Sales Cycle Velocity</div>
            <div class="shift-metric-val" id="shift-metric-velocity">50% Faster</div>
          </div>
        </div>
      </div>
    `;

    const slider = container.querySelector('#budget-shift-slider');
    const pctVal = container.querySelector('#shift-pct-val');
    const shiftLabelSub = container.querySelector('#shift-label-sub');
    const searchLabelSub = container.querySelector('#search-label-sub');
    const blendedResult = container.querySelector('#blended-cac-result');
    const blendedBar = container.querySelector('#blended-bar-fill');
    const metricReduction = container.querySelector('#shift-metric-reduction');
    const metricSavings = container.querySelector('#shift-metric-savings');

    const updateCalc = () => {
      const shift = parseInt(slider.value, 10);
      pctVal.textContent = `${shift}%`;
      shiftLabelSub.textContent = `${shift}%`;
      searchLabelSub.textContent = `${100 - shift}%`;

      // Search CAC = 215, AI CAC = 64
      // Empirical benchmark at 20% shift delivers 35% reduction ($139.75)
      // Scale linearly based on shift:
      const reductionPct = (shift / 20) * 35;
      const currentCac = 215;
      const calculatedCac = currentCac * (1 - reductionPct / 100);
      const barWidthPct = Math.max(25, (calculatedCac / currentCac) * 100);

      blendedResult.textContent = `$${calculatedCac.toFixed(2)} Blended CAC`;
      blendedBar.style.width = `${barWidthPct.toFixed(1)}%`;
      blendedBar.textContent = `$${calculatedCac.toFixed(2)} Blended CAC (-${reductionPct.toFixed(1)}%)`;

      metricReduction.textContent = `-${reductionPct.toFixed(1)}%`;
      const savingsPerMillion = (reductionPct / 100) * 1000000;
      metricSavings.textContent = `+$${Math.round(savingsPerMillion).toLocaleString()}`;
    };

    slider.addEventListener('input', updateCalc);
  }
};

