# Growwise Research — Workspace Agent Guidelines & Design Memory

This workspace houses **Growwise Research**, an executive publication platform for quantitative macroeconomic, performance marketing, and unit economics briefs.

## Core Rules for All Future Research Posts & Features

1. **Design System & Aesthetics**:
   - Follow the established executive editorial standard detailed in [`.agents/rules/growwise-design-memory.md`](file:///e:/Growwise%20Research/.agents/rules/growwise-design-memory.md).
   - High-contrast typography: `Newsreader` (editorial serif) for titles and pull quotes, `Plus Jakarta Sans` for UI, data, and body.
   - Zero emojis anywhere. Zero generic SaaS conventions. Zero multi-colored rainbow charts.
   - Channel matrices and comparative graphs must use only 2–3 muted cohesive tones (`#0F766E`, `#334155`, `#059669`).

2. **Data Visualizations & Scalability**:
   - Every post follows the standard executive layout: Sticky Top Bar with single logo & utility section, Article Masthead, 4-Card KPI Grid with sparklines, Executive Summary, 500-Word Narrative in 4 Acts, Interactive Data Lab, Unit Economics Ledger, Strategic Imperatives, and Footer.
   - **Scalability Rule**: If a post has more data points or multi-dimensional datasets, expand the interactive visualizations (e.g. multi-series comparative lines, segmented area curves, interactive scatter matrices, breakdown heatmaps, or scenario filter toggles) while maintaining the clean, muted editorial aesthetic.

3. **Author Attribution (6 Profiles Only & Strictly Constant)**:
   - Authors must strictly be drawn from the verified 6-profile directory in [`js/data/authors.js`](file:///e:/Growwise%20Research/js/data/authors.js):
     1. **Briony Claire** (`BC`, Market Intelligence Analyst)
     2. **Arjun Mehra** (`AM`, Senior Industry Researcher)
     3. **Daniel Whitmore** (`DW`, Senior Research Analyst)
     4. **Sayan Roy** (`SR`, Economic & Market Research Analyst)
     5. **Kumarjit Ghosh** (`KG`, Founder & CTO)
     6. **Moly B.** (`MB`, Senior Data Researcher)
   - **Persistence Rule**: Once authors are assigned to a report, they are **strictly constant across all refreshes**. Never randomize or switch authors on page refresh.

4. **Sticky Top Bar**:
   - Top-left: Single official transparent logo (`assets/logo-black.png` in Day mode, `assets/logo-white.png` in Night mode).
   - Top-right: Inline audio player toolbar (`-10s`, `Pause/Play`, `+10s`, `1.0x-3.0x`, `✕`), `{Listen, Print, Night/Day}`, and `Visit Growwise` (pointing to `https://growwisemedia.com` target="_blank").

5. **Unit Economics Ledger / Simulator**:
   - Always calibrate default inputs to realistic, positive unit economics on initial load. Never display alarming negative deficit numbers by default.

6. **Print & PDF Export**:
   - Uses direct watermark `<div class="print-watermark"><img src="assets/logo-black.png" class="print-watermark-img" /></div>` positioned behind text (`z-index: -100`, bounded percentage dimensions).
   - Never use viewport units (`100vw`/`100vh`) in print styles.
   - Force all `.reveal-item` elements to `opacity: 1 !important; transform: none !important; visibility: visible !important;` during print.
   - Hide screen-only interactive controls (`.top-nav-bar`, sliders, tab buttons).
