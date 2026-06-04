const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon helpers
const { FaBrain, FaUserFriends, FaMicrophone, FaRobot, FaChartLine, FaShieldAlt, FaMusic, FaHeadphones, FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaCog } = require("react-icons/fa");
const { MdAutoFixHigh, MdSpeed, MdTrendingUp } = require("react-icons/md");

function renderIconSvg(IconComponent, color = "#FFFFFF", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Color Palette — Spotify-inspired dark green + neon green + white
const C = {
  spotifyBlack: "121212",
  spotifyDark: "1A1A2E",
  spotifyGreen: "1DB954",
  spotifyGreenDark: "158A3E",
  spotifyGreenLight: "1ED760",
  white: "FFFFFF",
  gray: "B3B3B3",
  lightGray: "F0F0F0",
  darkCard: "242424",
  accentPurple: "7C3AED",
  accentBlue: "2563EB",
  warmWhite: "F9FAFB",
};

const makeShadow = () => ({ type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.2 });

async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Spotify x GenAI — Open Project 2026";
  pres.author = "Doremon Den";

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 1 — Cover / Problem Introduction
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.spotifyBlack };

    // Left accent bar
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.07, h: 5.625, fill: { color: C.spotifyGreen } });

    // Top label
    s.addText("OPEN PROJECT 2026  ·  SOCIETY OF BUSINESS", {
      x: 0.35, y: 0.22, w: 9.3, h: 0.25,
      fontSize: 9, color: C.spotifyGreen, bold: true, charSpacing: 3
    });

    // Title
    s.addText("Spotify can predict\nyour next emotion.", {
      x: 0.35, y: 0.7, w: 5.8, h: 2.0,
      fontSize: 40, bold: true, color: C.white, fontFace: "Arial Black",
      lineSpacingMultiple: 1.1
    });

    // Sub
    s.addText("Reimagining Spotify with Generative AI to deliver\npersonalised, emotionally intelligent music experiences\nthat reduce churn and grow premium revenue.", {
      x: 0.35, y: 3.05, w: 5.5, h: 1.0,
      fontSize: 13, color: C.gray, lineSpacingMultiple: 1.4
    });

    // Visual — abstract circle cluster (right side)
    const circles = [
      { x: 6.8, y: 0.3, w: 3.0, h: 3.0, color: C.spotifyGreen, t: 88 },
      { x: 7.8, y: 1.5, w: 2.0, h: 2.0, color: "1A1A2E", t: 0 },
      { x: 6.2, y: 1.8, w: 1.5, h: 1.5, color: C.spotifyGreenDark, t: 60 },
      { x: 8.5, y: 0.2, w: 1.2, h: 1.2, color: C.spotifyGreen, t: 70 },
    ];
    for (const c of circles) {
      s.addShape(pres.shapes.OVAL, { x: c.x, y: c.y, w: c.w, h: c.h, fill: { color: c.color, transparency: c.t } });
    }

    // Stat callouts bottom
    const stats = [
      { val: "602M", label: "Monthly Active Users" },
      { val: "31%", label: "Churn within 90 days" },
      { val: "68%", label: "Skip AI-generated playlists" },
    ];
    stats.forEach((st, i) => {
      const x = 0.35 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 4.35, w: 2.8, h: 1.0, fill: { color: C.darkCard }, shadow: makeShadow() });
      s.addText(st.val, { x: x + 0.1, y: 4.38, w: 2.6, h: 0.45, fontSize: 26, bold: true, color: C.spotifyGreen, fontFace: "Arial Black", margin: 0 });
      s.addText(st.label, { x: x + 0.1, y: 4.82, w: 2.6, h: 0.3, fontSize: 9.5, color: C.gray, margin: 0 });
    });

    // Bottom tag
    s.addText("Doremon Den  ·  Product Track", {
      x: 0.35, y: 5.35, w: 6, h: 0.2, fontSize: 9, color: C.gray
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 2 — Problem + Impact + User Breakdown
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.warmWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.spotifyBlack } });
    s.addText("01  ·  PROBLEM INTRODUCTION + IMPACT + USER BREAKDOWN", {
      x: 0.4, y: 0, w: 9.2, h: 0.75, fontSize: 10, color: C.spotifyGreen, bold: true, charSpacing: 2, valign: "middle"
    });

    // Problem statement
    s.addText("The Discovery Problem", { x: 0.4, y: 0.9, w: 9.2, h: 0.45, fontSize: 22, bold: true, color: C.spotifyBlack, fontFace: "Arial Black" });
    s.addText("Spotify's recommendation engine is powerful — but passive. It reacts to listening history, not to emotional state, context, or intent. Users in grief get upbeat playlists. Users in flow get mood-breaking transitions. The result: friction, skipping, and churn.", {
      x: 0.4, y: 1.4, w: 5.6, h: 0.9, fontSize: 12, color: "374151", lineSpacingMultiple: 1.4
    });

    // Pain points — 3 cards
    const pains = [
      { icon: "😤", title: "Discovery Fatigue", body: "Users spend avg. 8 min searching for the right playlist, often giving up and switching apps." },
      { icon: "🎵", title: "Context Blindness", body: "Recommendations ignore real-world context — weather, time, mood, physical activity." },
      { icon: "💸", title: "Churn at Free Tier", body: "31% of free users churn within 90 days. AI-curated paywall features aren't compelling enough to convert." },
    ];
    pains.forEach((p, i) => {
      const x = 0.4 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 2.42, w: 2.9, h: 1.6, fill: { color: C.white }, shadow: makeShadow() });
      s.addText(p.icon, { x: x + 0.15, y: 2.5, w: 0.5, h: 0.4, fontSize: 18 });
      s.addText(p.title, { x: x + 0.1, y: 2.88, w: 2.7, h: 0.3, fontSize: 11, bold: true, color: C.spotifyBlack });
      s.addText(p.body, { x: x + 0.1, y: 3.2, w: 2.7, h: 0.75, fontSize: 9.5, color: "374151", lineSpacingMultiple: 1.3 });
    });

    // User segments
    s.addText("User Segments", { x: 0.4, y: 4.12, w: 9, h: 0.3, fontSize: 13, bold: true, color: C.spotifyBlack });
    const segs = [
      { label: "Passive Listeners", pct: "40%", desc: "Play ambient/background music. Low engagement, high churn risk." },
      { label: "Active Explorers", pct: "35%", desc: "Seek new artists & genres. Frustrated by repetition." },
      { label: "Mood Driven", pct: "25%", desc: "Curate by emotion. Feel unheard by current AI playlists." },
    ];
    segs.forEach((seg, i) => {
      const x = 0.4 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 4.5, w: 2.9, h: 0.85, fill: { color: C.spotifyGreen } });
      s.addText(`${seg.pct}  ${seg.label}`, { x: x + 0.1, y: 4.52, w: 2.7, h: 0.3, fontSize: 10.5, bold: true, color: C.white, margin: 0 });
      s.addText(seg.desc, { x: x + 0.1, y: 4.82, w: 2.7, h: 0.45, fontSize: 8.5, color: C.white, lineSpacingMultiple: 1.2, margin: 0 });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 3 — Why GenAI?
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.spotifyBlack };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.spotifyGreenDark } });
    s.addText("02  ·  WHY GENERATIVE AI?", {
      x: 0.4, y: 0, w: 9.2, h: 0.75, fontSize: 10, color: C.white, bold: true, charSpacing: 2, valign: "middle"
    });

    // Left: Traditional limitations
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 0.9, w: 4.3, h: 4.5, fill: { color: C.darkCard }, shadow: makeShadow() });
    s.addText("Traditional Approaches Fall Short", { x: 0.55, y: 1.0, w: 4.0, h: 0.4, fontSize: 13, bold: true, color: "F87171" });
    const tradItems = [
      "Collaborative filtering: only mirrors past behaviour, no emotional intelligence",
      "Rule-based playlists: static, can't adapt to real-time context",
      "Predictive ML: forecasts what you listened to, can't understand what you need",
      "Manual curation: doesn't scale to 602M users across 100+ moods",
    ];
    tradItems.forEach((item, i) => {
      s.addText([
        { text: "✗  ", options: { color: "F87171", bold: true } },
        { text: item, options: { color: C.gray } }
      ], { x: 0.55, y: 1.55 + i * 0.75, w: 4.0, h: 0.65, fontSize: 10.5, lineSpacingMultiple: 1.3 });
    });

    // Right: GenAI advantages
    s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 0.9, w: 4.6, h: 4.5, fill: { color: C.spotifyGreenDark }, shadow: makeShadow() });
    s.addText("GenAI Uniquely Enables", { x: 5.15, y: 1.0, w: 4.3, h: 0.4, fontSize: 13, bold: true, color: C.white });
    const genItems = [
      ["Emotional Context Understanding", "LLMs interpret natural language mood input + multimodal audio signals"],
      ["Dynamic Narrative Curation", "Generate personalised playlist stories, not just song lists"],
      ["Conversational Discovery", "User says: I need focus music for a deadline — agent understands and acts"],
      ["Generative Content Layer", "AI-written liner notes, artist bios, mood transitions narrated intelligently"],
    ];
    genItems.forEach(([title, body], i) => {
      s.addText([
        { text: "✓  " + title + "\n", options: { color: C.spotifyGreenLight, bold: true, breakLine: false } },
        { text: "    " + body, options: { color: "D1FAE5" } }
      ], { x: 5.15, y: 1.55 + i * 0.82, w: 4.3, h: 0.75, fontSize: 10, lineSpacingMultiple: 1.3 });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 4 — User Segments + Solution Overview
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.warmWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.spotifyBlack } });
    s.addText("03  ·  USER SEGMENTS + SOLUTION OVERVIEW", {
      x: 0.4, y: 0, w: 9.2, h: 0.75, fontSize: 10, color: C.spotifyGreen, bold: true, charSpacing: 2, valign: "middle"
    });

    // Core insight box
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 0.9, w: 9.2, h: 0.7, fill: { color: C.spotifyBlack }, shadow: makeShadow() });
    s.addText("Core Insight: ", { x: 0.55, y: 0.95, w: 1.3, h: 0.55, fontSize: 12, bold: true, color: C.spotifyGreen, valign: "middle", margin: 0 });
    s.addText("Music listening is an emotional act, not just a preference act. GenAI can bridge the gap between how a user feels right now and what they actually want to hear.", {
      x: 1.85, y: 0.95, w: 7.6, h: 0.55, fontSize: 11, color: C.white, valign: "middle", margin: 0, lineSpacingMultiple: 1.3
    });

    // 3 solution features
    const features = [
      {
        title: "MoodSync AI",
        emoji: "🎭",
        who: "Mood-Driven Users (25%)",
        what: "User speaks or types their current emotion. LLM interprets sentiment + context, generates a dynamic playlist with a narrative arc — from where they are emotionally to where they want to go.",
        impact: "+22% session length"
      },
      {
        title: "Context Conductor",
        emoji: "🌦️",
        who: "Passive Listeners (40%)",
        what: "Multimodal AI agent reads time, location (opt-in), calendar events, and ambient sound to automatically queue contextually perfect music without user input.",
        impact: "+18% retention"
      },
      {
        title: "Discovery Dialogue",
        emoji: "🔍",
        who: "Active Explorers (35%)",
        what: "Conversational AI interface: 'Show me artists like Radiohead but more hopeful.' Agent searches, reasons, and builds a curated session with AI-written discovery notes.",
        impact: "+31% new artist streams"
      }
    ];

    features.forEach((f, i) => {
      const x = 0.4 + i * 3.1;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w: 2.9, h: 3.55, fill: { color: C.white }, shadow: makeShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w: 2.9, h: 0.6, fill: { color: C.spotifyBlack } });
      s.addText(f.emoji + "  " + f.title, { x: x + 0.1, y: 1.78, w: 2.7, h: 0.55, fontSize: 12.5, bold: true, color: C.spotifyGreen, valign: "middle", margin: 0 });
      s.addText("For: " + f.who, { x: x + 0.1, y: 2.42, w: 2.7, h: 0.28, fontSize: 9, bold: true, color: C.accentPurple });
      s.addText(f.what, { x: x + 0.1, y: 2.72, w: 2.7, h: 1.75, fontSize: 9.5, color: "374151", lineSpacingMultiple: 1.35 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.1, y: 4.95, w: 2.7, h: 0.28, fill: { color: C.spotifyGreen } });
      s.addText("📈 " + f.impact, { x: x + 0.1, y: 4.95, w: 2.7, h: 0.28, fontSize: 10, bold: true, color: C.spotifyBlack, valign: "middle", margin: 4 });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 5 — Solution Deep Dive
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.spotifyBlack };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.spotifyGreenDark } });
    s.addText("04  ·  SOLUTION DEEP DIVE", {
      x: 0.4, y: 0, w: 9.2, h: 0.75, fontSize: 10, color: C.white, bold: true, charSpacing: 2, valign: "middle"
    });

    // AI architecture flow
    s.addText("AI Interaction Architecture", { x: 0.4, y: 0.9, w: 9, h: 0.35, fontSize: 14, bold: true, color: C.white });

    // Flow boxes
    const flowItems = [
      { label: "User Input", sub: "Voice / text / context signals", color: C.accentBlue },
      { label: "Intent Agent", sub: "LLM parses emotion + context intent", color: C.accentPurple },
      { label: "Curation Engine", sub: "Multimodal AI selects & sequences tracks", color: C.spotifyGreenDark },
      { label: "Narrative Layer", sub: "GenAI writes playlist story + liner notes", color: "B45309" },
      { label: "Spotify UX", sub: "Delivered in native Spotify UI", color: C.spotifyGreen },
    ];
    flowItems.forEach((item, i) => {
      const x = 0.4 + i * 1.85;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 1.7, h: 1.0, fill: { color: item.color }, shadow: makeShadow() });
      s.addText(item.label, { x: x + 0.06, y: 1.38, w: 1.6, h: 0.38, fontSize: 10.5, bold: true, color: C.white, valign: "middle", margin: 2 });
      s.addText(item.sub, { x: x + 0.06, y: 1.73, w: 1.6, h: 0.55, fontSize: 8, color: "E5E7EB", lineSpacingMultiple: 1.2, margin: 2 });
      if (i < 4) {
        s.addText("→", { x: x + 1.72, y: 1.62, w: 0.15, h: 0.3, fontSize: 14, color: C.gray, margin: 0 });
      }
    });

    // Key workflows
    s.addText("Key Workflows & Features", { x: 0.4, y: 2.55, w: 9, h: 0.32, fontSize: 14, bold: true, color: C.white });

    const workflows = [
      { icon: "🎙️", title: "Voice Mood Check-In", detail: "\"I'm anxious before a presentation\" → Agent detects anxiety, generates a 20-min focus + calm arc playlist with AI narration. Post-session: asks how you feel, refines future curations." },
      { icon: "🤖", title: "Autonomous Session Agent", detail: "Runs in background: checks time (7am = energising commute mix), calendar (\"big meeting at 10am\" = confidence music), then queues without asking. Full opt-in." },
      { icon: "💬", title: "Conversational Discovery", detail: "Chat interface within Spotify: \"Find something like lo-fi but with vocals and a 90s feel.\" LLM reasons across the catalogue, returns curated session with explainability notes." },
      { icon: "✍️", title: "AI Liner Notes", detail: "Each AI playlist includes a generated narrative: why these songs, what the arc is, artist context. Increases engagement and perceived value of the AI curation." },
    ];
    workflows.forEach((w, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.4 + col * 4.8;
      const y = 3.0 + row * 1.18;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.5, h: 1.1, fill: { color: C.darkCard }, shadow: makeShadow() });
      s.addText(w.icon + " " + w.title, { x: x + 0.12, y: y + 0.05, w: 4.3, h: 0.28, fontSize: 10.5, bold: true, color: C.spotifyGreenLight, margin: 0 });
      s.addText(w.detail, { x: x + 0.12, y: y + 0.35, w: 4.3, h: 0.7, fontSize: 8.5, color: C.gray, lineSpacingMultiple: 1.3, margin: 0 });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDE 6 — Success Metrics + Pitfalls
  // ─────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.warmWhite };

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.75, fill: { color: C.spotifyBlack } });
    s.addText("05 + 06  ·  SUCCESS METRICS  +  PITFALLS & WORKAROUNDS", {
      x: 0.4, y: 0, w: 9.2, h: 0.75, fontSize: 10, color: C.spotifyGreen, bold: true, charSpacing: 2, valign: "middle"
    });

    // Left: Metrics
    s.addText("Success Metrics", { x: 0.4, y: 0.88, w: 4.5, h: 0.35, fontSize: 14, bold: true, color: C.spotifyBlack, fontFace: "Arial Black" });

    const metrics = [
      { kpi: "+22%", label: "Avg. session length", how: "MoodSync AI cohort vs control" },
      { kpi: "+18%", label: "30-day retention", how: "Context Conductor users vs baseline" },
      { kpi: "+31%", label: "New artist stream rate", how: "Discovery Dialogue activation" },
      { kpi: "+15%", label: "Free → Premium conversion", how: "AI features gated in Premium" },
      { kpi: "–27%", label: "Support tickets", how: "AI resolves 'I can't find music for X' self-serve" },
    ];
    metrics.forEach((m, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.3 + i * 0.78, w: 4.5, h: 0.7, fill: { color: i % 2 === 0 ? C.spotifyBlack : C.darkCard }, shadow: makeShadow() });
      s.addText(m.kpi, { x: 0.55, y: 1.35 + i * 0.78, w: 1.0, h: 0.58, fontSize: 22, bold: true, color: C.spotifyGreen, valign: "middle", fontFace: "Arial Black", margin: 0 });
      s.addText(m.label, { x: 1.6, y: 1.35 + i * 0.78, w: 2.0, h: 0.3, fontSize: 10, bold: true, color: C.white, margin: 0 });
      s.addText(m.how, { x: 1.6, y: 1.63 + i * 0.78, w: 2.7, h: 0.24, fontSize: 8.5, color: C.gray, margin: 0 });
    });

    // Right: Pitfalls
    s.addText("Pitfalls & Workarounds", { x: 5.2, y: 0.88, w: 4.5, h: 0.35, fontSize: 14, bold: true, color: C.spotifyBlack, fontFace: "Arial Black" });

    const pitfalls = [
      { risk: "Hallucinations", workaround: "Constrain LLM to Spotify catalogue API; no free-form generation of song names. Always ground to real tracks." },
      { risk: "Privacy (context data)", workaround: "Full opt-in for location/calendar. On-device inference for mood signals. GDPR-compliant data minimisation." },
      { risk: "Latency", workaround: "Pre-compute context profiles async; intent agent runs on user action with <800ms SLA target using streaming responses." },
      { risk: "User Trust", workaround: "Always show AI reasoning ('Here's why I picked these'). Add one-tap feedback loop. Never hide that it's AI-generated." },
      { risk: "Adoption", workaround: "Progressive rollout: start with AI Liner Notes (low risk, high delight), then unlock agents for opted-in users after trust is built." },
    ];
    pitfalls.forEach((p, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3 + i * 0.78, w: 4.5, h: 0.7, fill: { color: "FEF3C7" }, shadow: makeShadow() });
      s.addText("⚠ " + p.risk, { x: 5.35, y: 1.33 + i * 0.78, w: 4.2, h: 0.26, fontSize: 10, bold: true, color: "92400E", margin: 0 });
      s.addText(p.workaround, { x: 5.35, y: 1.58 + i * 0.78, w: 4.2, h: 0.38, fontSize: 8.5, color: "374151", lineSpacingMultiple: 1.2, margin: 0 });
    });
  }

  await pres.writeFile({ fileName: "/home/claude/product_track/spotify_strategy_deck.pptx" });
  console.log("✅ Product deck saved.");
}

buildDeck().catch(console.error);
