# Graph Report - .  (2026-04-13)

## Corpus Check
- Corpus is ~20,553 words - fits in a single context window. You may not need a graph.

## Summary
- 113 nodes · 83 edges · 44 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Portfolio Architecture|Core Portfolio Architecture]]
- [[_COMMUNITY_Portfolio Sections & Data|Portfolio Sections & Data]]
- [[_COMMUNITY_GPU Performance Tiering|GPU Performance Tiering]]
- [[_COMMUNITY_3D Scene Components|3D Scene Components]]
- [[_COMMUNITY_Camera Rig Animation|Camera Rig Animation]]
- [[_COMMUNITY_App Shell & Routing|App Shell & Routing]]
- [[_COMMUNITY_Tech Stack & Build Config|Tech Stack & Build Config]]
- [[_COMMUNITY_GPU Detection Utility|GPU Detection Utility]]
- [[_COMMUNITY_Experience Selector|Experience Selector]]
- [[_COMMUNITY_Contact Form|Contact Form]]
- [[_COMMUNITY_Skill Pill Component|Skill Pill Component]]
- [[_COMMUNITY_Glass Card UI|Glass Card UI]]
- [[_COMMUNITY_Space Experience Entry|Space Experience Entry]]
- [[_COMMUNITY_Hero Section|Hero Section]]
- [[_COMMUNITY_Testimonials Section|Testimonials Section]]
- [[_COMMUNITY_Projects Section|Projects Section]]
- [[_COMMUNITY_Contact Section|Contact Section]]
- [[_COMMUNITY_Skills Section|Skills Section]]
- [[_COMMUNITY_About Section|About Section]]
- [[_COMMUNITY_Space Canvas Scene|Space Canvas Scene]]
- [[_COMMUNITY_Starfield Effect|Starfield Effect]]
- [[_COMMUNITY_Neptune Planet|Neptune Planet]]
- [[_COMMUNITY_Base Planet Component|Base Planet Component]]
- [[_COMMUNITY_Saturn Planet|Saturn Planet]]
- [[_COMMUNITY_Uranus Planet|Uranus Planet]]
- [[_COMMUNITY_Mars Planet|Mars Planet]]
- [[_COMMUNITY_Jupiter Planet|Jupiter Planet]]
- [[_COMMUNITY_Earth Planet|Earth Planet]]
- [[_COMMUNITY_Sun Glow Effect|Sun Glow Effect]]
- [[_COMMUNITY_Big Bang Animation|Big Bang Animation]]
- [[_COMMUNITY_Orbit Controls Hook|Orbit Controls Hook]]
- [[_COMMUNITY_Section Progress Hook|Section Progress Hook]]
- [[_COMMUNITY_Scroll Camera Hook|Scroll Camera Hook]]
- [[_COMMUNITY_GPU Tier Hook|GPU Tier Hook]]
- [[_COMMUNITY_Route Hook|Route Hook]]
- [[_COMMUNITY_Vite Build Config|Vite Build Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_App Entry Point|App Entry Point]]
- [[_COMMUNITY_Scene Constants|Scene Constants]]
- [[_COMMUNITY_About Data|About Data]]
- [[_COMMUNITY_Testimonials Data|Testimonials Data]]
- [[_COMMUNITY_Skills Data|Skills Data]]
- [[_COMMUNITY_Projects Data|Projects Data]]

## God Nodes (most connected - your core abstractions)
1. `Space Portfolio Design Spec` - 10 edges
2. `Saturn Interactive Orbit (Project Centerpiece)` - 7 edges
3. `Hybrid Canvas + DOM Architecture` - 5 edges
4. `Big Bang Intro Animation (Canvas2D, Session-tracked)` - 5 edges
5. `GPU Tier Detection & Tiered Rendering` - 5 edges
6. `Performance Strategy (Instanced meshes, LOD, DPR cap, code-split)` - 4 edges
7. `SpaceCanvas.jsx — R3F Canvas Wrapper` - 4 edges
8. `Tech Stack (React 19, Vite, R3F, GSAP, Lenis, Tailwind, GLSL, detect-gpu)` - 3 edges
9. `Planet-to-Section Mapping` - 3 edges
10. `Color Palette — Planet-Accent Design Tokens` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ContactSection.jsx — Form + Resume + Socials` --references--> `Resume Placeholder PDF`  [INFERRED]
  docs/superpowers/specs/2026-04-11-space-portfolio-design.md → public/resume-placeholder.pdf
- `Space Portfolio Implementation Plan` --references--> `Space Portfolio Design Spec`  [EXTRACTED]
  docs/superpowers/plans/2026-04-11-space-portfolio-plan.md → docs/superpowers/specs/2026-04-11-space-portfolio-design.md
- `Space Portfolio Implementation Plan` --references--> `Hybrid Canvas + DOM Architecture`  [EXTRACTED]
  docs/superpowers/plans/2026-04-11-space-portfolio-plan.md → docs/superpowers/specs/2026-04-11-space-portfolio-design.md
- `Task 2: GPU Detection & Utility Layer` --implements--> `GPU Tier Detection & Tiered Rendering`  [EXTRACTED]
  docs/superpowers/plans/2026-04-11-space-portfolio-plan.md → docs/superpowers/specs/2026-04-11-space-portfolio-design.md
- `ProjectsSection.jsx — Saturn Orbit HUD + Detail Panel` --shares_data_with--> `projects.js — 8 Placeholder Project Data Objects`  [INFERRED]
  docs/superpowers/specs/2026-04-11-space-portfolio-design.md → docs/superpowers/plans/2026-04-11-space-portfolio-plan.md

## Hyperedges (group relationships)
- **Saturn Interactive Orbit System** — comp_saturn, comp_projectssection, hook_useorbitcontrols, data_projects [INFERRED 0.88]
- **Scroll-Driven Camera Voyage** — comp_camerarig, hook_usescrollcamera, spec_planetmapping [INFERRED 0.85]
- **Performance Tiering System** — util_gpudetect, hook_usegputier, spec_gputiering, spec_performancestrategy [INFERRED 0.87]

## Communities

### Community 0 - "Core Portfolio Architecture"
Cohesion: 0.15
Nodes (19): BigBang.jsx — Canvas2D Intro Effect, GlassCard.jsx — Shared Glassmorphism Component, useOrbitControls.js — Drag/Swipe Saturn Orbit, Space Portfolio Implementation Plan, Rationale: Big Bang uses Canvas2D not Three.js to avoid blocking R3F load, Rationale: Dev bypass skips ExperienceSelector to speed up iteration, Rationale: Hybrid Canvas+DOM for performance vs wow factor, Rationale: Planet accents shift warm-to-cool to convey distance (+11 more)

### Community 1 - "Portfolio Sections & Data"
Cohesion: 0.22
Nodes (9): ContactSection.jsx — Form + Resume + Socials, ProjectsSection.jsx — Saturn Orbit HUD + Detail Panel, SkillPill.jsx — Tech Stack Pill Component, SpaceExperience.jsx — Orchestrator Component, projects.js — 8 Placeholder Project Data Objects, skills.js — Skill Categories (Frontend, Backend, Tools), testimonials.js — Placeholder Testimonials, Task 3: Placeholder Data Files (+1 more)

### Community 2 - "GPU Performance Tiering"
Cohesion: 0.4
Nodes (5): useGpuTier.js — React Hook for GPU Detection, Task 2: GPU Detection & Utility Layer, Rationale: GPU tier detection avoids degraded experience on low-end devices, GPU Tier Detection & Tiered Rendering, gpuDetect.js — GPU Tier Detection Wrapper

### Community 3 - "3D Scene Components"
Cohesion: 0.4
Nodes (5): CameraRig.jsx — Scroll-driven Camera, Saturn.jsx — Saturn with Ring + Project Nodes, SpaceCanvas.jsx — R3F Canvas Wrapper, Starfield.jsx — Instanced Star Mesh, useScrollCamera.js — GSAP ScrollTrigger Camera Sync

### Community 4 - "Camera Rig Animation"
Cohesion: 0.67
Nodes (2): lerpWaypoints(), smootherstep()

### Community 5 - "App Shell & Routing"
Cohesion: 0.67
Nodes (0): 

### Community 6 - "Tech Stack & Build Config"
Cohesion: 0.67
Nodes (3): Task 1: Project Scaffolding, Browser Support (WebGL 2 required, fallback CSS), Tech Stack (React 19, Vite, R3F, GSAP, Lenis, Tailwind, GLSL, detect-gpu)

### Community 7 - "GPU Detection Utility"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Experience Selector"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Contact Form"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Skill Pill Component"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Glass Card UI"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Space Experience Entry"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Hero Section"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Testimonials Section"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Projects Section"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Contact Section"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Skills Section"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "About Section"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Space Canvas Scene"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Starfield Effect"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Neptune Planet"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Base Planet Component"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Saturn Planet"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Uranus Planet"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Mars Planet"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Jupiter Planet"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Earth Planet"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Sun Glow Effect"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Big Bang Animation"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Orbit Controls Hook"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Section Progress Hook"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Scroll Camera Hook"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "GPU Tier Hook"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Route Hook"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Vite Build Config"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "App Entry Point"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Scene Constants"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "About Data"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Testimonials Data"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Skills Data"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Projects Data"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **17 isolated node(s):** `Resume Placeholder PDF`, `Animation Philosophy (transform/opacity only, prefers-reduced-motion)`, `Browser Support (WebGL 2 required, fallback CSS)`, `Task 1: Project Scaffolding`, `Task 2: GPU Detection & Utility Layer` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `GPU Detection Utility`** (2 nodes): `detectGpuTier()`, `gpuDetect.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Experience Selector`** (2 nodes): `ExperienceSelector()`, `ExperienceSelector.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Contact Form`** (2 nodes): `ContactForm()`, `ContactForm.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skill Pill Component`** (2 nodes): `SkillPill()`, `SkillPill.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Glass Card UI`** (2 nodes): `GlassCard()`, `GlassCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Space Experience Entry`** (2 nodes): `SpaceExperience()`, `SpaceExperience.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hero Section`** (2 nodes): `HeroSection()`, `HeroSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testimonials Section`** (2 nodes): `TestimonialsSection.jsx`, `TestimonialsSection()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Projects Section`** (2 nodes): `ProjectsSection()`, `ProjectsSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Contact Section`** (2 nodes): `ContactSection()`, `ContactSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skills Section`** (2 nodes): `SkillsSection()`, `SkillsSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `About Section`** (2 nodes): `AboutSection()`, `AboutSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Space Canvas Scene`** (2 nodes): `SpaceCanvas()`, `SpaceCanvas.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Starfield Effect`** (2 nodes): `Starfield.jsx`, `Starfield()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Neptune Planet`** (2 nodes): `Neptune()`, `Neptune.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Base Planet Component`** (2 nodes): `BasePlanet()`, `BasePlanet.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Saturn Planet`** (2 nodes): `Saturn()`, `Saturn.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Uranus Planet`** (2 nodes): `Uranus.jsx`, `Uranus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mars Planet`** (2 nodes): `Mars()`, `Mars.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jupiter Planet`** (2 nodes): `Jupiter()`, `Jupiter.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Earth Planet`** (2 nodes): `Earth()`, `Earth.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sun Glow Effect`** (2 nodes): `SunGlow.jsx`, `SunGlow()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Big Bang Animation`** (2 nodes): `BigBang()`, `BigBang.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orbit Controls Hook`** (2 nodes): `useOrbitControls.js`, `useOrbitControls()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Section Progress Hook`** (2 nodes): `useSectionProgress.js`, `useSectionProgress()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scroll Camera Hook`** (2 nodes): `useScrollCamera.js`, `useScrollCamera()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GPU Tier Hook`** (2 nodes): `useGpuTier.js`, `useGpuTier()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Route Hook`** (2 nodes): `useRoute.js`, `useRoute()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Build Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Point`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scene Constants`** (1 nodes): `constants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `About Data`** (1 nodes): `about.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Testimonials Data`** (1 nodes): `testimonials.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skills Data`** (1 nodes): `skills.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Projects Data`** (1 nodes): `projects.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Space Portfolio Design Spec` connect `Core Portfolio Architecture` to `GPU Performance Tiering`, `Tech Stack & Build Config`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `Saturn Interactive Orbit (Project Centerpiece)` connect `Core Portfolio Architecture` to `Portfolio Sections & Data`, `3D Scene Components`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `ProjectsSection.jsx — Saturn Orbit HUD + Detail Panel` connect `Portfolio Sections & Data` to `Core Portfolio Architecture`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Saturn Interactive Orbit (Project Centerpiece)` (e.g. with `useOrbitControls.js — Drag/Swipe Saturn Orbit` and `Planet-to-Section Mapping`) actually correct?**
  _`Saturn Interactive Orbit (Project Centerpiece)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Hybrid Canvas + DOM Architecture` (e.g. with `Glass Card Style (Glassmorphism)` and `Experience Selector (Space / Maximalist / Minimalist)`) actually correct?**
  _`Hybrid Canvas + DOM Architecture` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Big Bang Intro Animation (Canvas2D, Session-tracked)` (e.g. with `Performance Strategy (Instanced meshes, LOD, DPR cap, code-split)` and `Saturn Interactive Orbit (Project Centerpiece)`) actually correct?**
  _`Big Bang Intro Animation (Canvas2D, Session-tracked)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `GPU Tier Detection & Tiered Rendering` (e.g. with `useGpuTier.js — React Hook for GPU Detection` and `Performance Strategy (Instanced meshes, LOD, DPR cap, code-split)`) actually correct?**
  _`GPU Tier Detection & Tiered Rendering` has 2 INFERRED edges - model-reasoned connections that need verification._