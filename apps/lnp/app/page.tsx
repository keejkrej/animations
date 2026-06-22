"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, onScroll, stagger } from "animejs";
import styles from "./page.module.css";

const PARTICLES = [
  { x: 260, y: 240, r: 3 }, { x: 520, y: 190, r: 4 }, { x: 680, y: 360, r: 2.5 },
  { x: 180, y: 540, r: 3.5 }, { x: 420, y: 680, r: 2 }, { x: 640, y: 620, r: 4 },
  { x: 310, y: 440, r: 3 }, { x: 580, y: 500, r: 2.5 }, { x: 230, y: 760, r: 3.5 },
  { x: 470, y: 840, r: 2 }, { x: 720, y: 780, r: 4 }, { x: 360, y: 980, r: 3 },
  { x: 600, y: 290, r: 2.5 }, { x: 210, y: 920, r: 3 },
];

const LABELS = [
  {
    id: "label1",
    title: "1. Cell-surface binding",
    body: "Lipid nanoparticles drift toward the membrane and dock onto surface receptors, clustering the mRNA cargo at the cell surface.",
  },
  {
    id: "label2",
    title: "2. Uptake & endosome formation",
    body: "The membrane curves inward and pinches off into an early endosome, ferrying the LNP cargo into the cytoplasm.",
  },
  {
    id: "label3",
    title: "3. Endosomal escape",
    body: "As the endosome acidifies, ionisable lipids in the LNP flip charge, disrupt the vesicle, and release the mRNA into the cytosol.",
  },
  {
    id: "label4",
    title: "4. Translation to protein",
    body: "A ribosome clamps the mRNA, ratchets along the strand, and stitches amino acids into a growing therapeutic protein.",
  },
];

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const tl = createTimeline({ autoplay: false });

    // ---------------- Stage 1: binding (0–22%) ----------------
    tl.add(".lnp", {
      opacity: [0, 1],
      scale: [0.25, 1],
      translateX: (el: HTMLElement) => (el.id === "lnp1" ? -240 : el.id === "lnp2" ? 240 : 200),
      translateY: (el: HTMLElement) => (el.id === "lnp1" ? -300 : el.id === "lnp2" ? -300 : -260),
      duration: 1400,
      ease: "outExpo",
      delay: stagger(120, { from: "first" }),
    }, 0)
    .add(".receptor", {
      scale: [1, 1.35],
      opacity: [0.55, 1],
      duration: 500,
      ease: "outBack",
      delay: stagger(90),
    }, 900)
    .add("#label1", { opacity: [0, 1], translateX: [36, 0], duration: 600, ease: "outQuint" }, 300)
    .add("#label1", { opacity: [1, 0], translateX: [0, -28], duration: 450, ease: "inQuint" }, 1900);

    // ---------------- Stage 2: uptake (22–47%) ----------------
    tl.add(".lnp", {
      translateX: (el: HTMLElement) => {
        const targets = { lnp1: 220, lnp2: -220, lnp3: 270 };
        return [0, targets[el.id as keyof typeof targets] ?? 0];
      },
      translateY: (el: HTMLElement) => {
        const targets = { lnp1: 170, lnp2: 10, lnp3: -90 };
        return [0, targets[el.id as keyof typeof targets] ?? 0];
      },
      duration: 1100,
      ease: "inOutQuint",
    }, 2400)
    .add("#endosome", {
      opacity: [0, 1],
      scale: [0.15, 1],
      duration: 1000,
      ease: "outBack",
    }, 2450)
    .add(".receptor", {
      opacity: [1, 0],
      scale: [1, 0.35],
      duration: 500,
      ease: "inBack",
      delay: stagger(60),
    }, 2300)
    .add("#label2", { opacity: [0, 1], translateX: [36, 0], duration: 600, ease: "outQuint" }, 2500)
    .add("#label2", { opacity: [1, 0], translateX: [0, -28], duration: 450, ease: "inQuint" }, 4000);

    // ---------------- Stage 3: escape (47–70%) ----------------
    tl.add("#endosome .vesicle", {
      stroke: ["#c084fc", "#ef4444"],
      fill: ["rgba(148,163,184,0.12)", "rgba(239,68,68,0.22)"],
      duration: 800,
      ease: "inOutSine",
    }, 4700)
    .add(".lnp .shell", {
      scale: [1, 1.3],
      opacity: [1, 0.45],
      duration: 600,
      ease: "outExpo",
    }, 5100)
    .add("#mrna", {
      opacity: [0, 1],
      scale: [0.2, 1],
      translateX: [220, 0],
      translateY: [-220, 0],
      duration: 900,
      ease: "outQuint",
    }, 5300)
    .add(".lnp", {
      opacity: [1, 0],
      scale: [1, 0],
      duration: 500,
      ease: "inBack",
    }, 5800)
    .add("#endosome", {
      opacity: [1, 0],
      scale: [1, 0.55],
      duration: 700,
      ease: "inQuint",
    }, 6100)
    .add("#ribosome", {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 700,
      ease: "outBack",
    }, 6400)
    .add("#label3", { opacity: [0, 1], translateX: [36, 0], duration: 600, ease: "outQuint" }, 4700)
    .add("#label3", { opacity: [1, 0], translateX: [0, -28], duration: 450, ease: "inQuint" }, 6200);

    // ---------------- Stage 4: translation (70–100%) ----------------
    tl.add("#mrna", {
      translateX: [0, 390],
      duration: 2600,
      ease: "linear",
    }, 7200)
    .add("#ribosome", {
      translateY: [0, 8, 0, -6, 0],
      scale: [1, 1.05, 1, 1.03, 1],
      duration: 1400,
      ease: "inOutSine",
      loop: 2,
    }, 7200)
    .add("#protein", {
      opacity: [0, 1],
      strokeDashoffset: [1, 0],
      duration: 2400,
      ease: "linear",
    }, 7400)
    .add(".amino", {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 400,
      ease: "outBack",
      delay: stagger(240, { from: "first" }),
    }, 7600)
    .add("#label4", { opacity: [0, 1], translateX: [36, 0], duration: 600, ease: "outQuint" }, 7000)
    .add("#label4", { opacity: [1, 0.92], duration: 500, ease: "linear" }, 10000);

    const observer = onScroll({
      target: trackRef.current,
      enter: "top top",
      leave: "bottom bottom",
      sync: true,
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.height = `${self.progress * 100}%`;
        }
      },
    });

    observer.link(tl);

    const particleAnim = animate(".particle", {
      translateY: [0, -24, 0],
      opacity: [0.2, 0.5, 0.2],
      duration: 3200,
      ease: "inOutSine",
      delay: stagger(380, { from: "random" }),
      loop: true,
      alternate: true,
    });

    return () => {
      observer.revert();
      tl.revert();
      particleAnim.revert();
    };
  }, []);

  return (
    <div className={styles.page}>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.scene}>
          <svg
            className={styles.svgBg}
            viewBox="0 -100 900 1400"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="cyto" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stopColor="#fff8f3" />
                <stop offset="50%" stopColor="#f5ebe4" />
                <stop offset="100%" stopColor="#ede0d8" />
              </radialGradient>
              <linearGradient id="membrane" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <radialGradient id="lnpShell" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </radialGradient>
              <linearGradient id="mrnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="proteinGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#84a98c" />
                <stop offset="100%" stopColor="#52796f" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Cell body */}
            <circle
              cx="450"
              cy="650"
              r="400"
              fill="url(#cyto)"
              stroke="url(#membrane)"
              strokeWidth="10"
              filter="url(#softGlow)"
            />

            {/* Inner membrane rim glow */}
            <circle
              cx="450"
              cy="650"
              r="385"
              fill="none"
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="4"
            />

            {/* Cytoplasm texture lines */}
            <g opacity="0.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <path d="M 280,300 Q 340,360 300,420 T 320,520" fill="none" opacity="0.4" />
              <path d="M 620,380 Q 560,440 600,500 T 580,600" fill="none" opacity="0.4" />
              <path d="M 350,700 Q 410,760 370,820 T 390,920" fill="none" opacity="0.35" />
              <path d="M 550,780 Q 490,840 530,900 T 510,1000" fill="none" opacity="0.35" />
            </g>

            {/* Organelle: nucleus hint */}
            <g opacity="0.25">
              <ellipse cx="450" cy="650" rx="90" ry="60" fill="#e2e8f0" filter="url(#softGlow)" />
              <ellipse cx="450" cy="650" rx="70" ry="45" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            </g>

            {/* Ambient particles */}
            {PARTICLES.map((p, i) => (
              <circle
                key={i}
                className="particle"
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill="#94a3b8"
                opacity={0.25}
                filter="url(#softGlow)"
              />
            ))}

            {/* Receptors */}
            {[
              { x: 230, y: 340 },
              { x: 670, y: 340 },
              { x: 650, y: 300 },
            ].map(({ x, y }) => (
              <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
                <g className="receptor">
                  <line x1="0" y1="0" x2="-10" y2="-16" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="10" y2="-16" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="7" fill="#94a3b8" filter="url(#softGlow)" />
                </g>
              </g>
            ))}

            {/* LNPs */}
            {[
              { x: 230, y: 320, id: "lnp1" },
              { x: 670, y: 320, id: "lnp2" },
              { x: 450, y: 250, id: "lnp3" },
            ].map(({ x, y, id }) => (
              <g key={id} transform={`translate(${x},${y})`}>
                <g className="lnp" id={id} style={{ opacity: 0, transform: "scale(0.25)" }}>
                  <circle className="shell" cx="0" cy="0" r="34" fill="url(#lnpShell)" stroke="#cbd5e1" strokeWidth="2" filter="url(#softGlow)" />
                  <path
                    d="M -18,-6 C -10,-16 0,-6 10,-6 S 22,-14 26,-4"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <circle cx="-14" cy="-14" r="7" fill="white" opacity="0.4" />
                </g>
              </g>
            ))}

            {/* Endosome */}
            <g transform="translate(450,510)">
              <g id="endosome" style={{ opacity: 0, transform: "scale(0.15)" }}>
                <circle
                  className="vesicle"
                  cx="0"
                  cy="0"
                  r="78"
                  fill="rgba(148,163,184,0.12)"
                  stroke="#94a3b8"
                  strokeWidth="5"
                  filter="url(#softGlow)"
                />
              </g>
            </g>

            {/* mRNA strand */}
            <g transform="translate(230,730)">
              <g id="mrna" style={{ opacity: 0, transform: "scale(0.2)" }}>
                <path
                  d="M 0,0
                     C 22,-18 42,18 64,0
                     S 104,-18 126,0
                     S 166,18 188,0
                     S 228,-18 250,0
                     S 290,18 312,0
                     S 352,-18 374,0"
                  fill="none"
                  stroke="url(#mrnaGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#softGlow)"
                />
                {[0, 62, 124, 186, 250, 312, 374].map((dx, i) => (
                  <circle key={i} cx={dx} cy={0} r="5" fill={i % 2 ? "#f472b6" : "#fca5a5"} />
                ))}
              </g>
            </g>

            {/* Ribosome */}
            <g transform="translate(620,730)">
              <g id="ribosome" style={{ opacity: 0, transform: "scale(0)" }}>
                <circle cx="0" cy="-24" r="20" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" filter="url(#softGlow)" />
                <circle cx="0" cy="18" r="28" fill="#64748b" stroke="#e2e8f0" strokeWidth="2" filter="url(#softGlow)" />
                <rect x="-9" y="-20" width="18" height="32" rx="5" fill="#334155" opacity="0.65" />
              </g>
            </g>

            {/* Protein chain */}
            <g transform="translate(620,730)">
              <path
                id="protein"
                d="M 0,-50
                   C 28,-88 58,-76 86,-118
                   S 138,-138 170,-106
                   S 212,-84 242,-126"
                fill="none"
                stroke="url(#proteinGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                filter="url(#glow)"
                style={{ opacity: 0 }}
              />
              {[
                { x: 24, y: -72, c: "#84a98c" },
                { x: 58, y: -92, c: "#94a3b8" },
                { x: 100, y: -120, c: "#d4a373" },
                { x: 146, y: -116, c: "#e9c46a" },
                { x: 190, y: -104, c: "#52796f" },
                { x: 230, y: -120, c: "#b08968" },
              ].map((a, i) => (
                <g key={i} transform={`translate(${a.x},${a.y})`}>
                  <g className="amino" style={{ opacity: 0, transform: "scale(0)" }}>
                    <circle r="8" fill={a.c} filter="url(#softGlow)" />
                  </g>
                </g>
              ))}
            </g>
          </svg>

          <div className={styles.overlay}>
            <div className={styles.title}>
              <h1>LNP transfection lifecycle</h1>
              <p>Scroll down to travel from the cell surface to protein expression</p>
            </div>

            {LABELS.map(({ id, title, body }) => (
              <div key={id} className={styles.labelSlot}>
                <div id={id} className={styles.stageLabel}>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
              </div>
            ))}

            <div className={styles.progressWrap}>
              <div ref={progressRef} className={styles.progressBar} />
            </div>

            <div className={styles.scrollHint}>
              <span>Scroll</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
