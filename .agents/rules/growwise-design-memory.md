# Growwise Research — Permanent Design Memory & Publication Protocol

## 1. Brand Identity & Executive Editorial Philosophy
- **Standard**: McKinsey / Financial Times executive research grade.
- **Tone**: Authoritative, quantitative, elegant, minimal, tactile paper feel.
- **Zero Generic SaaS & Zero Emojis**: Never use generic SaaS dashboard conventions, bright neon gradients, childish illustration placeholders, or emojis anywhere in the interface or copy.
- **Typography Standards**:
  - Headings & Editorial Deck: `Newsreader` (Editorial Serif, optical sizing, italicized accents).
  - Body, Data Labels, & UI Elements: `Plus Jakarta Sans` (Clean Neo-Grotesque Sans).
  - No monospace fonts for body or standard metadata; use crisp tabular numbers where needed.
- **Color Discipline**:
  - Light / Day Mode: Clean tactile warm paper (`#FAF9F6`), high-contrast dark charcoal ink (`#111827`), secondary ink (`#4B5563`), muted borders (`#E5E7EB`).
  - Night / Dark Mode: Deep obsidian slate (`#090C10`), elevated surface (`#161B22`), crisp text (`#F0F6FC`).
  - Semantic Accents: Restrained palette. Slate teal (`#0F766E`), slate gray (`#334155`), muted sage (`#059669`), subtle amber (`#D97706`).
  - Bar Charts & Channel Matrices: Must use only 2–3 muted, cohesive tones. Never use multi-colored rainbow bars.

---

## 2. Standard Page Architecture & Section Ordering
Every research brief must follow this structural flow:

### 2.1 Sticky Top Navigation Bar (`.top-nav-bar`)
- **Top-Left**: Single official transparent logo (`assets/logo-black.png` in Day mode, `assets/logo-white.png` in Night mode).
  - *Strict Rule*: In Day mode, ONLY `logo-black.png` is visible (`display: block !important`). In Night mode, ONLY `logo-white.png` is visible. Never display both simultaneously.
- **Top-Right** (aligned on the exact horizontal axis):
  - Inline audio citation toolbar (hidden until active): `-10s`, `Pause/Play`, `+10s`, speed toggle (`1.0x / 1.5x / 2.0x / 3.0x`), `✕` close.
  - Utility pill actions:
    1. `Listen` (triggers natural speech citation)
    2. `Print` (opens print/PDF export)
    3. `Night` / `Day` (theme toggle)
    4. `Visit Growwise` (external link to `https://growwisemedia.com` with `target="_blank" rel="noopener noreferrer"`)

### 2.2 Article Masthead
- Metadata row: `Category • Volume • Publish Date • Read Time`.
- Display Headline (`h1.article-title`) in Newsreader serif.
- Sub-headline / Executive Thesis Deck (`p.article-deck`).
- **Fixed Author Profile Cards**:
  - Must ONLY use profiles from the official 6-member directory.
  - Formatted with circular initials avatars (`BC`, `AM`, `DW`, `SR`, `KG`, `MB`), bold names, and roles.
  - *Strict Rule*: Authors are assigned once per research brief and remain **strictly constant across all refreshes**. Never randomize or switch authors on page refresh.

### 2.3 At-a-Glance KPI Grid
- 4-card high-impact summary grid.
- Each card contains metric title, bold figure, percentage change pill with arrow (`↗` / `↘`), historical benchmark note, and live inline SVG sparkline.

### 2.4 Executive Summary Pull-Box
- Subtle paper-bordered callout featuring the central empirical quote and 3 bulleted strategic takeaways.

### 2.5 Structured Narrative (~500 Words)
- Divided into 4 chronological or thematic Acts (`Act I` to `Act IV`).
- Act I begins with an editorial drop-cap.
- Micro-interactions: subtle hover popups for critical data points (`.data-pop`).

### 2.6 Interactive Data Lab (Scalable Visualization Engine)
- **Flagship Interactive Timeline / Trajectory Curve**:
  - Clean SVG path with interactive milestone crosshair on hover/touch.
  - Interactive timeline scrubber slider (e.g. 2015 to 2026).
  - Metric switcher tabs (e.g. CAC, CPC, ROAS).
- **Scalability Rule for Multi-Point Data**:
  - *If a research brief contains more data points or multi-dimensional data*: Introduce expanded visualizations—such as multi-series comparative lines, segmented area curves, interactive scatter matrices, breakdown heatmaps, or scenario filter toggles.
- **Cross-Channel Comparative Matrix**:
  - Horizontal efficiency bars comparing channel performance.
  - Must be restricted to only 2–3 muted, cohesive editorial colors (`#0F766E`, `#334155`, `#059669`).

### 2.7 Unit Economics Ledger / Scenario Stress-Tester
- Interactive input panel for industry model, customer order value, benchmark year, and conversion rate.
- **Default Baseline Calibration**:
  - Initial defaults must always be calibrated to realistic, positive unit economics (`Capital Efficient` badge, positive gross profit, positive net margin).
  - Never display alarming negative deficit numbers on first page load.
- Output card styled as a clean executive balance sheet ledger with an authoritative **Strategic Advisory Note**.

### 2.8 Strategic Imperatives
- McKinsey 3-box action framework (`01`, `02`, `03`) outlining operational protocols for executive leadership.

### 2.9 Methodology & Footnotes
- Quantitative research sources, sample size, attribution methodology, and formal print export trigger.

### 2.10 Editorial Footer
- Left Column: Official Growwise Research transparent logo (`logo-black.png` / `logo-white.png`), mission statement, and exact copyright string:
  > `© 2026 Growwise Research | All rights reserved.`
- Right Column: Research practice areas navigation links.

---

## 3. Official Verified Author Directory
Every research brief must draw its author attribution exclusively from these 6 verified profiles:

| Author Name | Role | Initials Avatar |
| :--- | :--- | :--- |
| **Briony Claire** | Market Intelligence Analyst | `BC` |
| **Arjun Mehra** | Senior Industry Researcher | `AM` |
| **Daniel Whitmore** | Senior Research Analyst | `DW` |
| **Sayan Roy** | Economic & Market Research Analyst | `SR` |
| **Kumarjit Ghosh** | Founder & CTO | `KG` |
| **Moly B.** | Senior Data Researcher | `MB` |

*Persistence Rule*: When creating a new report, assign 2 authors from this directory. Once assigned, they are permanent and fixed for that report ID.

---

## 4. PDF Print & Export Standards
To prevent blank pages, layout reflow loops, and print engine crashes:
- **Direct Image Watermark**: Positioned via `<div class="print-watermark"><img src="assets/logo-black.png" class="print-watermark-img" /></div>` behind all content (`z-index: -100`), centered at `320px` width with `0.045` opacity.
- **Zero Pseudo-Element Text**: `body::after` and `body::before` must have `display: none !important; content: none !important;`.
- **Forced Content Visibility**: `.reveal-item` must have `opacity: 1 !important; transform: none !important; visibility: visible !important;`. All animations and transitions disabled (`animation: none !important`).
- **No Viewport Units in Print**: Avoid `100vw` or `100vh` in print CSS to eliminate infinite pagination recalculation loops.
- **Document Flow**: `html, body` must have `overflow: visible !important; height: auto !important; position: static !important;`.
- **Hide Screen Controls**: Screen-only controls (`.top-nav-bar`, sliders, tab buttons, toasts) must be hidden during print.

---

## 5. Audio Speech Narration Protocol
- Use native `window.speechSynthesis` with dynamic detection of natural/neural English voices (`Microsoft Natural / Online`, `Google US/UK English`, `Samantha`, `Daniel`).
- Text must be chunked sentence-by-sentence to enable responsive `-10s` (rewind) and `+10s` (skip) audio navigation.
- Real-time speed cycling across `1.0x`, `1.5x`, `2.0x`, and `3.0x`.
- Narration script must dynamically read the report's active fixed authors.
