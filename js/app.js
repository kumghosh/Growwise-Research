/**
 * Growwise Research - Main Application Controller
 * Handles scroll observation, responsive rendering, research switching, and interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  let activeResearchId = 'google-ads-cac-2015-2026';
  let activeChartMetric = 'cac';
  let activeScrubberIndex = 11; // Default to 2026

  // DOM Elements Cache
  const readingBar = document.getElementById('reading-progress');
  const mastheadEl = document.getElementById('article-masthead-container');
  const kpiGridEl = document.getElementById('kpi-grid-container');
  const execSummaryEl = document.getElementById('exec-summary-container');
  const narrativeEl = document.getElementById('narrative-container');
  const chartContainer = document.getElementById('timeline-chart-svg-wrap');
  const channelContainer = document.getElementById('channel-matrix-container');
  const imperativesEl = document.getElementById('imperatives-container');
  const timelineSlider = document.getElementById('timeline-slider');
  const timelineMilestoneText = document.getElementById('scrubber-milestone-text');
  const scrubberYearLabel = document.getElementById('scrubber-year-label');

  // Simulator Elements
  const simIndustry = document.getElementById('sim-industry');
  const simCustomerVal = document.getElementById('sim-cust-val');
  const simCustValDisplay = document.getElementById('sim-cust-val-display');
  const simYear = document.getElementById('sim-year');
  const simYearDisplay = document.getElementById('sim-year-display');
  const simCvr = document.getElementById('sim-cvr');
  const simCvrDisplay = document.getElementById('sim-cvr-display');
  const simOutCac = document.getElementById('sim-out-cac');
  const simOutRatio = document.getElementById('sim-out-ratio');
  const simOutMargin = document.getElementById('sim-out-margin');
  const simOutProfit = document.getElementById('sim-out-profit');
  const simDiagnosisBadge = document.getElementById('sim-diagnosis-badge');
  const simRecText = document.getElementById('sim-rec-text');

  // Modal Elements
  const modalBackdrop = document.getElementById('research-modal');
  const modalOpenBtn = document.getElementById('open-research-modal-btn');
  const modalCloseBtn = document.getElementById('close-research-modal-btn');
  const presetSelector = document.getElementById('preset-research-select');
  const customJsonInput = document.getElementById('custom-json-input');
  const applyCustomBtn = document.getElementById('apply-custom-json-btn');
  const copyTemplateBtn = document.getElementById('copy-template-btn');

  // Toast
  const toastEl = document.getElementById('toast-notification');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /**
   * Initializes or re-renders research page
   */
  function loadResearch(researchId, customData = null) {
    let data = customData;
    if (!data) {
      data = window.RESEARCH_DATABASE[researchId];
    }
    if (!data) return;

    activeResearchId = researchId;

    // Dynamically update document title and description meta
    if (data.meta && data.meta.title) {
      document.title = `Growwise Research — ${data.meta.title}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.meta.deck) {
        metaDesc.setAttribute('content', data.meta.deck);
      }
    }

    // Dynamic Section Header for Data Lab
    const timelineTitle = document.querySelector('#data-lab .section-title');
    const timelineSub = document.querySelector('#data-lab .section-subtitle');
    if (timelineTitle && timelineSub) {
      if (researchId === 'the-insurance-cac-crisis') {
        timelineTitle.textContent = '10-Year Insurance Acquisition Cost Trajectory (2016–2026)';
        timelineSub.textContent = 'Paid search and paid social longitudinal benchmark across carrier performance metrics.';
      } else {
        timelineTitle.textContent = 'The Search CAC Trajectory (2015–2026)';
        timelineSub.textContent = 'Longitudinal analysis across 12 auction cycles with macro milestones & black-box algorithmic shifts.';
      }
    }

    // Dynamic Simulator Defaults
    if (simIndustry) {
      if (researchId === 'the-insurance-cac-crisis') {
        simIndustry.value = 'insurance';
        if (simCustomerVal) simCustomerVal.value = 850;
        if (simCustValDisplay) simCustValDisplay.textContent = '$850';
        if (simCvr) simCvr.value = 2.4;
        if (simCvrDisplay) simCvrDisplay.textContent = '2.4%';
      }
    }

    // Keep authors fixed and constant per report (never randomly changed on refresh)
    if (!data.meta.authors || !data.meta.authors.length) {
      data.meta.authors = window.getAssignedAuthorsForResearch 
        ? window.getAssignedAuthorsForResearch(researchId, 2) 
        : [window.GROWWISE_AUTHORS[0], window.GROWWISE_AUTHORS[1]];
    }

    // 1. Render Masthead
    renderMasthead(data.meta);

    // 2. Render KPIs
    renderKPIs(data.kpis);

    // 3. Render Executive Summary
    renderExecutiveSummary(data.executiveSummary);

    // 4. Render Narrative Acts + Bespoke Cohort & Funnel Visualizers
    renderNarrative(data.narrative, data);

    // 5. Render Flagship Interactive Chart
    renderChart(data.timeline);

    // 6. Render Channel Breakdown
    renderChannels(data.channelComparison);

    // 7. Render Strategic Imperatives
    renderImperatives(data.strategicImperatives);

    // 8. Re-arm Scroll Observer for Smooth Popups
    initScrollObserver();

    // 9. Update Simulator with defaults
    updateSimulator();

    // 10. Mount Budget Shift Simulator if present
    const budgetMount = document.getElementById('budget-shift-mount');
    if (budgetMount && window.ChartEngine.renderBudgetShiftSimulator && researchId === 'the-insurance-cac-crisis') {
      window.ChartEngine.renderBudgetShiftSimulator(budgetMount);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderMasthead(meta) {
    if (!mastheadEl || !meta) return;

    const authors = (meta.authors && meta.authors.length) 
      ? meta.authors 
      : (window.GROWWISE_AUTHORS ? [window.GROWWISE_AUTHORS[0], window.GROWWISE_AUTHORS[1]] : []);

    const authorsHtml = authors.map(a => `
      <div class="author-info">
        <div class="author-avatar">${a.initials || a.name.split(' ').map(n=>n[0]).join('')}</div>
        <div>
          <div class="author-details-name">${a.name}</div>
          <div class="author-details-role">${a.role}</div>
        </div>
      </div>
    `).join('');

    mastheadEl.innerHTML = `
      <h1 class="article-title">${meta.title}</h1>
      <p class="article-deck">${meta.deck}</p>
      <div class="author-block">
        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
          ${authorsHtml}
        </div>
      </div>
    `;
  }

  function renderKPIs(kpis) {
    if (!kpiGridEl || !kpis) return;

    kpiGridEl.innerHTML = kpis.map((kpi, idx) => `
      <div class="kpi-card reveal-item delay-${idx + 1}">
        <div class="kpi-header">
          <span class="kpi-title">${kpi.title}</span>
          <span class="kpi-delta ${kpi.badgeType}">
            ${kpi.trend === 'up' ? '▲' : '▼'} ${kpi.change}
          </span>
        </div>
        <div class="kpi-value">${kpi.value}</div>
        <div class="kpi-footer">
          <div style="font-size:0.75rem;color:var(--color-ink-muted);">${kpi.note}</div>
          <div class="kpi-sparkline-canvas" id="sparkline-${kpi.id}"></div>
        </div>
      </div>
    `).join('');

    // Draw sparklines for each card with subtle directional color
    setTimeout(() => {
      kpis.forEach(kpi => {
        const container = document.getElementById(`sparkline-${kpi.id}`);
        if (container && kpi.sparkline) {
          const color = kpi.badgeType === 'rose' ? '#E11D48' : (kpi.badgeType === 'amber' ? '#D97706' : '#0D9488');
          window.ChartEngine.renderSparkline(container, kpi.sparkline, color);
        }
      });
    }, 50);
  }

  function renderExecutiveSummary(summary) {
    if (!execSummaryEl || !summary) return;

    const bulletsHtml = (summary.bullets || []).map(b => `<li>${b}</li>`).join('');

    execSummaryEl.innerHTML = `
      <div class="executive-summary-banner reveal-item">
        <div class="executive-summary-label">
          Executive Thesis & Strategic Synthesis
        </div>
        <blockquote class="executive-summary-quote">"${summary.quote}"</blockquote>
        <ul class="executive-summary-bullets">
          ${bulletsHtml}
        </ul>
      </div>
    `;
  }

  function renderNarrative(acts, data = null) {
    if (!narrativeEl || !acts) return;

    let narrativeHtml = '';

    acts.forEach((act, i) => {
      narrativeHtml += `
        <section class="editorial-act reveal-item delay-${(i % 3) + 1}">
          <div class="act-marker">${act.act}</div>
          <h2 class="act-heading">${act.title}</h2>
          <div class="act-body">
            <p>${act.text}</p>
          </div>
        </section>
      `;

      // Exhibit 1: Demographic LTV & Retention Benchmark (after Act II)
      if (i === 1 && data && data.id === 'the-insurance-cac-crisis') {
        narrativeHtml += `
          <div class="editorial-exhibit reveal-item">
            <div class="exhibit-header">
              <div class="exhibit-num">Exhibit 1</div>
              <h3 class="exhibit-title">Demographic LTV & Policyholder Retention Benchmark</h3>
              <p class="exhibit-subtitle">Empirical policyholder tenure, multi-policy bundling rates, and annual renewal retention across age cohorts.</p>
            </div>
            <div id="cohort-chart-mount"></div>
            <div class="exhibit-footer">
              <span>Source: Growwise Research Cross-Carrier Performance Database & Sprinklr Retention Telemetry</span>
              <span>Interactive: Select metric tab or hover over bars for cohort intelligence</span>
            </div>
          </div>
        `;
      }

      // Exhibit 2: Form Attrition & Device Disparity (after Act III)
      if (i === 2 && data && data.id === 'the-insurance-cac-crisis') {
        narrativeHtml += `
          <div class="editorial-exhibit reveal-item">
            <div class="exhibit-header">
              <div class="exhibit-num">Exhibit 2</div>
              <h3 class="exhibit-title">Form Attrition: Device Disparity & Portal Completion Collapse</h3>
              <p class="exhibit-subtitle">Mobile quote conversion drop-off compared with longitudinal carrier portal completion rates from 2018 to 2026.</p>
            </div>
            <div id="attrition-chart-mount"></div>
            <div class="exhibit-footer">
              <span>Source: GoCardless 2026 Device Conversion Analysis & Carrier Portal Telemetry</span>
              <span>Normalized across 420 mid-market & enterprise carrier domains</span>
            </div>
          </div>
        `;
      }

      // Exhibit 3: Funnel Architecture & Sales Velocity (after Act IV)
      if (i === 3 && data && data.id === 'the-insurance-cac-crisis') {
        narrativeHtml += `
          <div class="editorial-exhibit reveal-item">
            <div class="exhibit-header">
              <div class="exhibit-num">Exhibit 3</div>
              <h3 class="exhibit-title">Acquisition Funnel Architecture: Traditional Search vs. Conversational AI</h3>
              <p class="exhibit-subtitle">Comparative stage-by-stage friction analysis from initial intent discovery through quote-to-close underwriting velocity.</p>
            </div>
            <div id="funnel-chart-mount"></div>
            <div class="exhibit-footer">
              <span>Source: Growwise Research & McKinsey Carrier Advisory Telemetry</span>
              <span>Modeled on $65 baseline search CPC vs LLM contextual inquiry units</span>
            </div>
          </div>
        `;
      }
    });

    narrativeEl.innerHTML = narrativeHtml;

    // Mount Exhibit Charts immediately
    if (data && data.id === 'the-insurance-cac-crisis') {
      const cohortMount = document.getElementById('cohort-chart-mount');
      if (cohortMount && window.ChartEngine.renderCohortBarChart) {
        window.ChartEngine.renderCohortBarChart(cohortMount, 'tenure');
      }
      const attritionMount = document.getElementById('attrition-chart-mount');
      if (attritionMount && window.ChartEngine.renderDeviceAndAttritionChart) {
        window.ChartEngine.renderDeviceAndAttritionChart(attritionMount);
      }
      const funnelMount = document.getElementById('funnel-chart-mount');
      if (funnelMount && window.ChartEngine.renderFunnelFlowChart) {
        window.ChartEngine.renderFunnelFlowChart(funnelMount);
      }
    }
  }

  function renderChart(timelineData) {
    if (!chartContainer || !timelineData) return;

    const scrubberHeaderSpan = document.querySelector('.timeline-scrubber-box .scrubber-header span:first-child');
    if (scrubberHeaderSpan && timelineData.length) {
      scrubberHeaderSpan.innerHTML = `Timeline Scrubber: <strong>${timelineData[0].year}</strong> to <strong>${timelineData[timelineData.length - 1].year}</strong>`;
    }

    // Set slider bounds
    if (timelineSlider) {
      timelineSlider.min = 0;
      timelineSlider.max = timelineData.length - 1;
      timelineSlider.value = timelineData.length - 1;
      activeScrubberIndex = timelineData.length - 1;
      updateScrubberCallout(timelineData, activeScrubberIndex);
    }

    window.ChartEngine.renderTimelineChart(chartContainer, timelineData, activeChartMetric, activeScrubberIndex);
  }

  function updateScrubberCallout(timelineData, index) {
    const item = timelineData[index];
    if (!item) return;

    if (scrubberYearLabel) {
      scrubberYearLabel.textContent = item.year;
    }
    if (timelineMilestoneText) {
      timelineMilestoneText.innerHTML = `<strong>${item.year} Macro Event:</strong> ${item.milestone || 'Organic Auction Trajectory'}`;
    }
  }

  function renderChannels(channelData) {
    if (!channelContainer || !channelData) return;
    window.ChartEngine.renderChannelComparison(channelContainer, channelData);
  }

  function renderImperatives(imperatives) {
    if (!imperativesEl || !imperatives) return;

    imperativesEl.innerHTML = imperatives.map((imp, idx) => `
      <div class="imperative-card reveal-item delay-${idx + 1}">
        <div class="imperative-num">${imp.num}</div>
        <h3 class="imperative-title">${imp.title}</h3>
        <p class="imperative-desc">${imp.desc}</p>
      </div>
    `).join('');
  }

  /**
   * IntersectionObserver for scroll-triggered popups & animations
   */
  function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
  }

  /**
   * Reading progress tracker
   */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / (docHeight || 1)) * 100;
    if (readingBar) {
      readingBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }, { passive: true });

  /**
   * Chart Tab Switching (CAC vs CPC vs ROAS)
   */
  document.querySelectorAll('.chart-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.chart-tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeChartMetric = e.target.getAttribute('data-metric');
      const data = window.RESEARCH_DATABASE[activeResearchId];
      if (data && data.timeline) {
        window.ChartEngine.renderTimelineChart(chartContainer, data.timeline, activeChartMetric, activeScrubberIndex);
      }
    });
  });

  /**
   * Timeline Scrubber Slider interaction
   */
  if (timelineSlider) {
    timelineSlider.addEventListener('input', (e) => {
      activeScrubberIndex = parseInt(e.target.value);
      const data = window.RESEARCH_DATABASE[activeResearchId];
      if (data && data.timeline) {
        updateScrubberCallout(data.timeline, activeScrubberIndex);
        window.ChartEngine.renderTimelineChart(chartContainer, data.timeline, activeChartMetric, activeScrubberIndex);
      }
    });
  }

  /**
   * Simulator Events & Live Recalculation
   */
  function updateSimulator() {
    if (!simIndustry || !simCustomerVal || !simYear || !simCvr) return;

    const indKey = simIndustry.value;
    const custVal = parseFloat(simCustomerVal.value);
    const targetYr = parseInt(simYear.value);
    const cvr = parseFloat(simCvr.value);

    // Update range numeric text tags
    if (simCustValDisplay) simCustValDisplay.textContent = `$${custVal.toFixed(0)}`;
    if (simYearDisplay) simYearDisplay.textContent = targetYr;
    if (simCvrDisplay) simCvrDisplay.textContent = `${cvr.toFixed(1)}%`;

    const res = window.SimulatorEngine.calculate(indKey, custVal, targetYr, cvr);

    if (simOutCac) simOutCac.textContent = `$${res.calculatedCac}`;
    if (simOutRatio) simOutRatio.textContent = `${res.cacRatioPct}%`;
    if (simOutMargin) simOutMargin.textContent = `${res.netMarginPct > 0 ? '+' : ''}${res.netMarginPct}%`;
    if (simOutProfit) simOutProfit.textContent = `$${res.grossProfit}`;

    if (simDiagnosisBadge) {
      simDiagnosisBadge.textContent = res.statusLabel;
      if (res.status === 'healthy') {
        simDiagnosisBadge.className = 'pill';
      } else if (res.status === 'warning') {
        simDiagnosisBadge.className = 'pill';
      } else {
        simDiagnosisBadge.className = 'pill';
      }
      simDiagnosisBadge.style.backgroundColor = '';
      simDiagnosisBadge.style.color = '';
      simDiagnosisBadge.style.border = '';
    }

    if (simRecText) {
      simRecText.textContent = res.recommendation;
    }
  }

  [simIndustry, simCustomerVal, simYear, simCvr].forEach(el => {
    if (el) el.addEventListener('input', updateSimulator);
  });

  // When industry changes, adjust customer value default slider position
  if (simIndustry) {
    simIndustry.addEventListener('change', () => {
      const p = window.SimulatorEngine.presets[simIndustry.value];
      if (p && simCustomerVal) {
        simCustomerVal.value = p.defaultAov;
        if (simCvr) simCvr.value = p.baselineCvr;
        updateSimulator();
      }
    });
  }

  /**
   * Theme Toggle (Dark / Light) - Text and clean styling, zero emojis
   */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const updateThemeBtnText = (theme) => {
      themeToggleBtn.textContent = theme === 'dark' ? 'Day' : 'Night';
    };

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      updateThemeBtnText(next);
      localStorage.setItem('growwise_theme', next);

      // Re-render SVG chart with updated theme colors
      const data = window.RESEARCH_DATABASE[activeResearchId];
      if (data && data.timeline) {
        window.ChartEngine.renderTimelineChart(chartContainer, data.timeline, activeChartMetric, activeScrubberIndex);
      }
    });

    const saved = localStorage.getItem('growwise_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      updateThemeBtnText(saved);
    } else {
      updateThemeBtnText('light');
    }
  }

  /**
   * Natural Voice Narration & Citation Engine
   * Sentence scrubbing (-10s / +10s), speed cycling (1.0x / 1.5x / 2.0x / 3.0x), and minimal controls
   */
  const audioBtn = document.getElementById('audio-briefing-btn');
  const audioPlayerPanel = document.getElementById('audio-player-panel');
  const audioRewindBtn = document.getElementById('audio-rewind-btn');
  const audioPlayPauseBtn = document.getElementById('audio-play-pause-btn');
  const audioForwardBtn = document.getElementById('audio-forward-btn');
  const audioSpeedBtn = document.getElementById('audio-speed-btn');
  const audioStopBtn = document.getElementById('audio-stop-btn');

  let speechSentences = [];
  let currentSentenceIdx = 0;
  let isAudioPlaying = false;
  let isAudioPaused = false;
  let currentPlaybackRate = 1.0;
  const speedOptions = [1.0, 1.5, 2.0, 3.0];
  let currentSpeedIndex = 0;

  function buildBriefingScript() {
    const data = window.RESEARCH_DATABASE[activeResearchId];
    if (!data) return [];

    const authorText = (data.meta.authors || []).map(a => `${a.name}, ${a.role}`).join('; and ');

    return [
      "Growwise Research Citation.",
      `${data.meta.title}.`,
      authorText ? `Authored by ${authorText}.` : '',
      `Volume ${data.meta.volume || '9'}, published ${data.meta.publishDate}.`,
      `Executive Thesis: ${data.executiveSummary.quote}`,
      ...(data.executiveSummary.bullets || []).map(b => `Key Takeaway: ${b}`),
      ...(data.narrative || []).map(act => `${act.act}. ${act.title}. ${act.text}`),
      "End of Growwise Research citation."
    ].filter(Boolean);
  }

  function getBestNaturalVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    // Prioritize high-fidelity natural / neural English voices
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Online') || 
        v.name.includes('Neural') ||
        v.name.includes('Jenny') || 
        v.name.includes('Guy') || 
        v.name.includes('Aria') ||
        v.name.includes('Google US English') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
      )
    );

    if (naturalVoice) return naturalVoice;
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestNaturalVoice();
    };
  }

  function playCurrentSentence() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (currentSentenceIdx < 0) currentSentenceIdx = 0;
    if (currentSentenceIdx >= speechSentences.length) {
      stopAudio();
      showToast('Research citation concluded.');
      return;
    }

    const text = speechSentences[currentSentenceIdx];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = currentPlaybackRate;
    utterance.pitch = 1.0;

    const voice = getBestNaturalVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      isAudioPlaying = true;
      isAudioPaused = false;
      if (audioPlayPauseBtn) audioPlayPauseBtn.textContent = 'Pause';
      if (audioBtn) audioBtn.textContent = 'Playing';
    };

    utterance.onend = () => {
      if (isAudioPlaying && !isAudioPaused) {
        currentSentenceIdx++;
        playCurrentSentence();
      }
    };

    utterance.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('SpeechSynthesis error:', e);
      stopAudio();
    };

    window.speechSynthesis.speak(utterance);
  }

  function startAudio() {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }

    speechSentences = buildBriefingScript();
    currentSentenceIdx = 0;
    isAudioPaused = false;

    if (audioPlayerPanel) audioPlayerPanel.classList.add('active');
    if (audioBtn) audioBtn.textContent = 'Playing';

    playCurrentSentence();
    showToast('Citation audio active: Natural voice narration');
  }

  function togglePlayPause() {
    if (!isAudioPlaying) {
      startAudio();
      return;
    }

    if (isAudioPaused) {
      isAudioPaused = false;
      if (audioPlayPauseBtn) audioPlayPauseBtn.textContent = 'Pause';
      if (audioBtn) audioBtn.textContent = 'Playing';
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          playCurrentSentence();
        }
      }
    } else {
      isAudioPaused = true;
      if (audioPlayPauseBtn) audioPlayPauseBtn.textContent = 'Play';
      if (audioBtn) audioBtn.textContent = 'Paused';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    }
  }

  function stopAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isAudioPlaying = false;
    isAudioPaused = false;
    currentSentenceIdx = 0;

    if (audioPlayerPanel) audioPlayerPanel.classList.remove('active');
    if (audioBtn) audioBtn.textContent = 'Listen';
    if (audioPlayPauseBtn) audioPlayPauseBtn.textContent = 'Pause';
  }

  function rewindAudio() {
    currentSentenceIdx = Math.max(0, currentSentenceIdx - 1);
    playCurrentSentence();
    showToast('Rewound -10s');
  }

  function forwardAudio() {
    if (currentSentenceIdx < speechSentences.length - 1) {
      currentSentenceIdx++;
      playCurrentSentence();
      showToast('Advanced +10s');
    } else {
      stopAudio();
    }
  }

  function cycleSpeed() {
    currentSpeedIndex = (currentSpeedIndex + 1) % speedOptions.length;
    currentPlaybackRate = speedOptions[currentSpeedIndex];
    if (audioSpeedBtn) {
      audioSpeedBtn.textContent = `${currentPlaybackRate.toFixed(1)}x`;
    }
    showToast(`Playback speed: ${currentPlaybackRate.toFixed(1)}x`);
    if (isAudioPlaying && !isAudioPaused) {
      playCurrentSentence();
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        togglePlayPause();
      } else {
        startAudio();
      }
    });
  }

  if (audioPlayPauseBtn) audioPlayPauseBtn.addEventListener('click', togglePlayPause);
  if (audioRewindBtn) audioRewindBtn.addEventListener('click', rewindAudio);
  if (audioForwardBtn) audioForwardBtn.addEventListener('click', forwardAudio);
  if (audioSpeedBtn) audioSpeedBtn.addEventListener('click', cycleSpeed);
  if (audioStopBtn) audioStopBtn.addEventListener('click', stopAudio);

  window.addEventListener('beforeunload', stopAudio);

  /**
   * Print / PDF Export Preparation
   */
  function prepareForPrint() {
    // 1. Force reveal all scroll-reveal elements so no pages are blank
    document.querySelectorAll('.reveal-item').forEach(el => {
      el.classList.add('revealed');
    });

    // 2. Render all charts and sparklines to static state
    const data = window.RESEARCH_DATABASE[activeResearchId];
    if (data && data.timeline && chartContainer) {
      window.ChartEngine.renderTimelineChart(chartContainer, data.timeline, activeChartMetric, activeScrubberIndex);
    }
  }

  window.addEventListener('beforeprint', prepareForPrint);

  const printBtn = document.getElementById('print-export-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      prepareForPrint();
      setTimeout(() => {
        window.print();
      }, 60);
    });
  }

  // Window resize debounced re-render
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const data = window.RESEARCH_DATABASE[activeResearchId];
      if (data && data.timeline) {
        window.ChartEngine.renderTimelineChart(chartContainer, data.timeline, activeChartMetric, activeScrubberIndex);
      }
      if (data && data.kpis) {
        data.kpis.forEach(kpi => {
          const container = document.getElementById(`sparkline-${kpi.id}`);
          if (container && kpi.sparkline) {
            const color = kpi.badgeType === 'rose' ? '#E11D48' : (kpi.badgeType === 'amber' ? '#D97706' : '#0D9488');
            window.ChartEngine.renderSparkline(container, kpi.sparkline, color);
          }
        });
      }
    }, 150);
  });

  // Initial Load dynamically based on body attribute or path
  const bodyResearchId = document.body.getAttribute('data-research-id');
  const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
  let researchIdToLoad = bodyResearchId || 'google-ads-cac-2015-2026'; // fallback
  
  if (!bodyResearchId && pathParts.length > 0) {
    const lastPart = pathParts[pathParts.length - 1];
    if (window.RESEARCH_DATABASE && window.RESEARCH_DATABASE[lastPart]) {
      researchIdToLoad = lastPart;
    } else if (lastPart.includes('google-ads-unit-economics')) {
      researchIdToLoad = 'google-ads-cac-2015-2026';
    } else if (lastPart.includes('insurance-acquisition') || lastPart.includes('insurance-cac-crisis')) {
      researchIdToLoad = 'the-insurance-cac-crisis';
    }
  }
  loadResearch(researchIdToLoad);
});
