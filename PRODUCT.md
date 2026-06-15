# Product

## Register

product

## Users

Three roles that one OAB-registered lawyer can move between, never fixed account types:

- **Advogado Iniciante** — recently registered (≤5 years OAB). Arrives with a real case and uncertainty. Often under time pressure, sometimes on mobile, may have low familiarity with legal-tech. Needs guidance and confidence, not jargon.
- **Advogado Especialista / Parceiro** — experienced practitioner offering humanized support or a 50/50 partnership. Wants their validated track record (DataJud) to be visible and to receive well-qualified opportunities with low friction.
- **Administrador / Comitê Gestor** — the extension-project governance team. Validates registrations, reviews AI outputs, mediates conflicts, and watches the project's targets (≥80% completion rate, avg rating ≥4.0, 300 partnership terms, ~5.000 lawyers in year one).

Context: a Brazilian university extension project in the theme of **Direitos Humanos e Justiça**, hybrid (web + responsive mobile), live 01/08/2026 → 31/07/2027. Trust, dignity and legal confidentiality are first-class concerns.

## Product Purpose

A marketplace that pairs junior lawyers who need support with specialists who can mentor or partner. The differentiators: an **AI onboarding agent** that turns a messy case description into a structured briefing; **automated validation of professional history** via the CNJ DataJud API; **automated matching**; a **self-hosted videoconference** (Jitsi-model) for humanized sessions; **mutual rating**; and **formal 50/50 partnership terms**. Success = lawyers feel the platform is competent and trustworthy enough to bring real cases to, and the governance team can prove the project's social impact.

## Brand Personality

Institutional, sober, credible — an established chamber of advocacy translated to software. Three words: **trustworthy, dignified, clear**. Voice is plain Brazilian Portuguese (linguagem simples is a literal requirement, RF-49), never patronizing, never marketing-loud. The interface should feel like it respects the weight of legal work and the confidentiality of the people behind each case.

## Anti-references

- Generic SaaS dashboard with playful gradients, emoji, and rounded-everything — undermines legal credibility.
- "Gig-economy / ride-hailing" loudness implied by the working name. The product is humanized mentorship, not surge pricing.
- Cream/sand "AI-warm" body backgrounds, gradient text, glassmorphism, identical icon-card grids, tiny tracked uppercase eyebrows over every section.
- Navy-and-gold fintech cliché — navy is structural, but the deliberate accent is **bordô (oxblood)**, not gold; brass appears only on credibility seals, sparingly.

## Design Principles

1. **Confiança por sobriedade** — credibility is earned through restraint, hierarchy and precision, not decoration. Deep navy chrome, generous whitespace, editorial serif headings.
2. **Linguagem simples, sempre** — every label, error and instruction is readable by a stressed non-expert. Plain words win over legal/tech jargon (RF-49).
3. **A IA organiza, o humano decide** — AI surfaces are clearly labeled, auditable, editable by the user, and never pretend to give legal advice (RF-19, RF-20, RF-10/RNF-10). Show sources and validation status.
4. **Sigilo é padrão, não opção** — confidentiality, LGPD and segredo de justiça are visible in the UI: access scoping, consent (TCLE), validation badges, redaction of sealed data (RF-13, RF-21, RF-53).
5. **Acessível para todos os papéis** — WCAG 2.1 AA / eMAG, adjustable contrast and font size, simple language, captions and Libras affordances are built in, not bolted on (RF-48–RF-52).

## Accessibility & Inclusion

Target **WCAG 2.1 AA + eMAG**. Body text ≥4.5:1, large text ≥3:1, visible focus rings, full keyboard reach, semantic landmarks, screen-reader labels. First-class in-product controls: adjustable contrast (standard / high-contrast) and font-size scaling, a Libras affordance, automatic captions on video, and a "priority service" flag for lawyers with disabilities (RF-31/RF-52). Every animation honors `prefers-reduced-motion`.
