/**
 * Growwise Research - Publication Landing Page Controller
 * Automatically renders dynamic Bento Grid of all research briefs
 */

document.addEventListener('DOMContentLoaded', () => {
  const bentoGrid = document.getElementById('research-bento-grid');
  const filterPills = document.querySelectorAll('.landing-filter-pill');

  // Slug mapping for clean, human-readable URLs (no %20 or %26)
  const URL_SLUGS = {
    'google-ads-cac-2015-2026': 'google-ads-unit-economics-2015-2026',
    'b2b-saas-ltv-cac-2026': 'google-ads-unit-economics-2015-2026' // or dedicated route
  };

  function renderBentoGrid(filterCategory = 'all') {
    if (!bentoGrid || !window.RESEARCH_DATABASE) return;

    const researchKeys = Object.keys(window.RESEARCH_DATABASE);
    let html = '';

    researchKeys.forEach((key, index) => {
      const item = window.RESEARCH_DATABASE[key];
      if (!item || !item.meta) return;

      // Filter check
      if (filterCategory !== 'all') {
        const catLower = (item.meta.category || '').toLowerCase();
        if (!catLower.includes(filterCategory.toLowerCase())) {
          return;
        }
      }

      const slug = URL_SLUGS[key] || key;
      const href = `${slug}/`;
      const isFeatured = (index === 0);
      const cardClass = isFeatured ? 'bento-card bento-card-featured' : 'bento-card bento-card-secondary';

      // Authors from item
      const authors = (item.meta.authors && item.meta.authors.length)
        ? item.meta.authors
        : (window.getAssignedAuthorsForResearch ? window.getAssignedAuthorsForResearch(key, 2) : []);

      const authorAvatars = authors.map(a => `
        <div class="author-avatar" title="${a.name} — ${a.role}">
          ${a.initials || a.name.split(' ').map(n=>n[0]).join('')}
        </div>
      `).join('');

      const authorNames = authors.map(a => a.name).join(' & ');

      // Metrics extract
      const kpi1 = item.kpis && item.kpis[0] ? item.kpis[0] : null;
      const kpi2 = item.kpis && item.kpis[1] ? item.kpis[1] : null;

      html += `
        <a href="${href}" class="${cardClass}" style="text-decoration:none !important;color:inherit !important;">
          <div>
            <div class="bento-kicker-row">
              <span class="bento-kicker-pill">${item.meta.category || 'Executive Research'}</span>
              <span>&bull;</span>
              <span>${item.meta.volume || 'Vol. IX'}</span>
              <span>&bull;</span>
              <span>${item.meta.publishDate || '2026'}</span>
              <span>&bull;</span>
              <span>${item.meta.readTime || '3 min read'}</span>
            </div>

            <h2 class="bento-title">${item.meta.title}</h2>
            <p class="bento-deck">${item.meta.deck}</p>

            ${(kpi1 || kpi2) ? `
              <div class="bento-metrics-row">
                ${kpi1 ? `
                  <div>
                    <div class="bento-metric-val">
                      ${kpi1.value}
                      ${kpi1.change ? `<span class="bento-metric-delta">(${kpi1.change})</span>` : ''}
                    </div>
                    <div class="bento-metric-label">${kpi1.title}</div>
                  </div>
                ` : ''}
                ${kpi2 ? `
                  <div>
                    <div class="bento-metric-val">
                      ${kpi2.value}
                      ${kpi2.change ? `<span class="bento-metric-delta">(${kpi2.change})</span>` : ''}
                    </div>
                    <div class="bento-metric-label">${kpi2.title}</div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <div class="bento-footer">
            <div class="bento-authors">
              <div class="bento-avatar-stack">
                ${authorAvatars}
              </div>
              <span class="bento-author-names">By ${authorNames}</span>
            </div>
            <span class="bento-read-link">Read Research Brief &rarr;</span>
          </div>
        </a>
      `;
    });

    if (!html) {
      html = `
        <div style="grid-column:span 12;text-align:center;padding:3rem;color:var(--color-ink-muted);">
          No publications match the selected filter category.
        </div>
      `;
    }

    bentoGrid.innerHTML = html;
  }

  // Filter pill events
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const category = pill.getAttribute('data-filter') || 'all';
      renderBentoGrid(category);
    });
  });

  // Theme Toggle for Landing Page
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
    });

    const saved = localStorage.getItem('growwise_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      updateThemeBtnText(saved);
    } else {
      updateThemeBtnText('light');
    }
  }

  // Initial render
  renderBentoGrid('all');
});
