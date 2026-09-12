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
  }
};
