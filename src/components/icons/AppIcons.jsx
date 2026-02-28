// ─── AppIcons.jsx ─────────────────────────────────────────────────────────────
// All custom SVG icons for the fashion e-com app.
// Props: size (default 20), color (CSS color string, inherits by default).
// aria-hidden="true" by default (decorative). Pass aria-hidden={undefined} +
// role="img" + aria-label="…" when the icon is the sole accessible label.

const I = ({ size = 20, color, children, ...rest }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...(color ? { style: { color } } : {})}
    {...rest}
  >
    {children}
  </svg>
);

// ─── PRE-COMPUTED GEOMETRY ────────────────────────────────────────────────────
// Static icons never change — compute sin/cos once at module load, not per render.

const _asianDots = [0,72,144,216,288].map(deg => ({
  cx: 10 + 4 * Math.cos((deg - 90) * Math.PI / 180),
  cy: 10 + 4 * Math.sin((deg - 90) * Math.PI / 180),
}));
const _asianLines = [0,60,120,180,240,300].map(deg => ({
  x2: 10 + 3 * Math.cos((deg - 90) * Math.PI / 180),
  y2: 10 + 3 * Math.sin((deg - 90) * Math.PI / 180),
}));

const _caucSpokes = [0,30,60,90,120,150].map(deg => {
  const r = deg * Math.PI / 180;
  return { x1: 10-6*Math.cos(r), y1: 10-6*Math.sin(r), x2: 10+6*Math.cos(r), y2: 10+6*Math.sin(r) };
});
const _caucBranches = [0,30,60,90,120,150].flatMap((deg, i) =>
  [deg-30, deg+30].map((a, j) => {
    const mr = deg * Math.PI / 180, br = a * Math.PI / 180;
    const bx = 10 + 4*Math.cos(mr), by = 10 + 4*Math.sin(mr);
    return { key: `${i}${j}`, x1: bx, y1: by, x2: bx+1.8*Math.cos(br), y2: by+1.8*Math.sin(br) };
  })
);

const _natureSunRays = [0,45,90,135].map(d => {
  const r = d * Math.PI / 180;
  return { x1: 15+2.8*Math.cos(r), y1: 5+2.8*Math.sin(r), x2: 15+3.8*Math.cos(r), y2: 5+3.8*Math.sin(r) };
});

const _beachSunRays = [0,45,90,135,180,225,270,315].map(d => {
  const r = d * Math.PI / 180;
  return { x1: 10+3.3*Math.cos(r), y1: 6+3.3*Math.sin(r), x2: 10+4.2*Math.cos(r), y2: 6+4.2*Math.sin(r) };
});

const _westAfricaRays = [0,90,180,270].map(d => {
  const r = d * Math.PI / 180;
  return { x1: 10+4*Math.cos(r), y1: 10+4*Math.sin(r), x2: 10+5.5*Math.cos(r), y2: 10+5.5*Math.sin(r) };
});

// ─── ETHNICITIES ──────────────────────────────────────────────────────────────

export const IconDiverse = ({ size = 20 }) => (
  <I size={size}>
    {["#F5CBA7","#C68642","#4A2912","#FDDBB4","#E8A87C","#8D5524"].map((c,i)=>(
      <path key={i}
        d={`M ${10-6+i*1.2} 10 A ${6-i*1.2} ${6-i*1.2} 0 0 1 ${10+6-i*1.2} 10`}
        stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity={0.95-i*0.04}
      />
    ))}
    <circle cx="10" cy="10" r="1.5" fill="white" opacity="0.9"/>
  </I>
);

export const IconAsian = ({ size = 20 }) => (
  <I size={size}>
    {_asianDots.map(({ cx, cy }, i) => (
      <circle key={i} cx={cx} cy={cy} r="2.4" fill="#E8B4C8" opacity="0.85"/>
    ))}
    <circle cx="10" cy="10" r="2" fill="#F5E6EF"/>
    {_asianLines.map(({ x2, y2 }, i) => (
      <line key={i} x1="10" y1="10" x2={x2} y2={y2} stroke="#D4A0B8" strokeWidth="0.6"/>
    ))}
  </I>
);

export const IconBlack = ({ size = 20 }) => (
  <I size={size}>
    {[0,45,90,135].map((deg,i)=>(
      <rect key={i} x="9" y="3" width="2.5" height="14" rx="0.5"
        fill={i%2===0?"#F5B942":"#E8813A"}
        transform={`rotate(${deg} 10 10)`} opacity="0.9"/>
    ))}
    <circle cx="10" cy="10" r="2.8" fill="#141414" stroke="#F5B942" strokeWidth="0.9"/>
    <circle cx="10" cy="10" r="1.1" fill="#F5B942"/>
  </I>
);

export const IconCaucasian = ({ size = 20 }) => (
  <I size={size}>
    {_caucSpokes.map(({ x1, y1, x2, y2 }, i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A8D8EA" strokeWidth="1" strokeLinecap="round"/>
    ))}
    {_caucBranches.map(({ key, x1, y1, x2, y2 }) => (
      <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A8D8EA" strokeWidth="0.7" strokeLinecap="round" opacity="0.7"/>
    ))}
    <circle cx="10" cy="10" r="1.4" fill="#E8F4F8"/>
  </I>
);

export const IconHispanic = ({ size = 20 }) => (
  <I size={size}>
    {[0,1,2].map(i=>(
      <rect key={i} x={7-i*1.4} y={7-i*1.4} width={6+i*2.8} height={6+i*2.8}
        fill="none" stroke={["#E85D4A","#F5B942","#3DB88A"][i]}
        strokeWidth="1.2" transform="rotate(45 10 10)" rx="0.4" opacity={0.9-i*0.08}
      />
    ))}
    <circle cx="10" cy="10" r="1.6" fill="#F5B942"/>
    <circle cx="10" cy="10" r="0.7" fill="#E85D4A"/>
  </I>
);

export const IconMiddleEastern = ({ size = 20 }) => (
  <I size={size}>
    <polygon points="10,4 10.8,8.5 15,10 10.8,11.5 10,16 9.2,11.5 5,10 9.2,8.5"
      fill="#C9A84C" opacity="0.3"/>
    <polygon points="10,4 10.8,8.5 15,10 10.8,11.5 10,16 9.2,11.5 5,10 9.2,8.5"
      fill="none" stroke="#C9A84C" strokeWidth="0.7" transform="rotate(45 10 10)" opacity="0.8"/>
    <path d="M 11.5 7 A 4 4 0 1 0 11.5 13 A 3 3 0 1 1 11.5 7 Z" fill="#C9A84C" opacity="0.9"/>
    <circle cx="13.5" cy="6.5" r="0.7" fill="#C9A84C" opacity="0.8"/>
  </I>
);

export const IconSouthAsian = ({ size = 20 }) => (
  <I size={size}>
    {[0,45,90,135].map((deg,i)=>(
      <ellipse key={i} cx="10" cy="5.5" rx="1.3" ry="2.5"
        fill={i%2===0?"#E85D9A":"#FF7043"}
        transform={`rotate(${deg} 10 10)`} opacity="0.8"/>
    ))}
    {[22.5,67.5,112.5,157.5].map((deg,i)=>(
      <ellipse key={i} cx="10" cy="6.5" rx="0.9" ry="1.8"
        fill={i%2===0?"#FF7043":"#FFCA28"}
        transform={`rotate(${deg} 10 10)`} opacity="0.7"/>
    ))}
    <circle cx="10" cy="10" r="2" fill="#141414" stroke="#FF7043" strokeWidth="0.8"/>
    <circle cx="10" cy="10" r="0.9" fill="#FFCA28"/>
  </I>
);

export const IconNorthAfrican = ({ size = 20 }) => (
  <I size={size}>
    <polygon points="10,4 16,14 4,14" fill="none" stroke="#7BC67E" strokeWidth="1.2" opacity="0.9"/>
    <polygon points="10,16 16,6 4,6" fill="none" stroke="#7BC67E" strokeWidth="1.2" opacity="0.5"/>
    <rect x="8" y="8" width="4" height="4" fill="none" stroke="#C5E1A5" strokeWidth="0.9" transform="rotate(45 10 10)"/>
    <circle cx="10" cy="10" r="1.2" fill="#7BC67E"/>
    {[[10,4],[16,14],[4,14]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="0.9" fill="#7BC67E"/>)}
  </I>
);

// ─── MODEL TYPES ─────────────────────────────────────────────────────────────

export const IconFemale = ({ size = 20 }) => (
  <I size={size}>
    {/* head */}
    <circle cx="10" cy="5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* neck */}
    <line x1="10" y1="7.8" x2="10" y2="9.5" stroke="currentColor" strokeWidth="1.3"/>
    {/* dress silhouette */}
    <path d="M 6 9.5 Q 4.5 14 5 18 L 15 18 Q 15.5 14 14 9.5 Q 12 11 10 11 Q 8 11 6 9.5 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* waist tuck */}
    <line x1="6.5" y1="13" x2="13.5" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </I>
);

export const IconMale = ({ size = 20 }) => (
  <I size={size}>
    {/* head */}
    <circle cx="10" cy="4.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* torso */}
    <path d="M 6.5 9 L 5 18 L 15 18 L 13.5 9 Q 10 11 6.5 9 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* shoulders */}
    <path d="M 6.5 9 Q 4 8.5 3.5 11 L 5 18" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <path d="M 13.5 9 Q 16 8.5 16.5 11 L 15 18" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    {/* collar */}
    <path d="M 8 9.2 L 10 10.5 L 12 9.2" stroke="currentColor" strokeWidth="0.9" fill="none"/>
  </I>
);

export const IconKids = ({ size = 20 }) => (
  <I size={size}>
    {/* bigger head proportions */}
    <circle cx="10" cy="5.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* neck */}
    <line x1="10" y1="9" x2="10" y2="10.5" stroke="currentColor" strokeWidth="1.2"/>
    {/* short body */}
    <path d="M 7 10.5 L 6 17 L 14 17 L 13 10.5 Q 10 12 7 10.5 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* arms out wide (playful) */}
    <line x1="7" y1="11.5" x2="3.5" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="13" y1="11.5" x2="16.5" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </I>
);

// ─── ENVIRONMENTS ─────────────────────────────────────────────────────────────

export const IconStudioWhite = ({ size = 20 }) => (
  <I size={size}>
    {/* cyclorama sweep */}
    <path d="M 3 16 L 3 5 Q 3 3 5 3 L 17 3 L 17 16 Z"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M 3 16 Q 3 12 10 12 Q 17 12 17 16"
      fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* softbox light top */}
    <rect x="7" y="1" width="6" height="2" rx="0.5" fill="currentColor" opacity="0.4"/>
    <line x1="10" y1="3" x2="10" y2="5" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
  </I>
);

export const IconStudioGray = ({ size = 20 }) => (
  <I size={size}>
    {/* same cyclorama, gradient fill hint */}
    <path d="M 3 16 L 3 5 Q 3 3 5 3 L 17 3 L 17 16 Z"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M 3 16 Q 3 12 10 12 Q 17 12 17 16"
      fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* directional spot light */}
    <path d="M 15 1.5 L 12 6 L 8 6 L 5 1.5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
    <line x1="10" y1="6" x2="10" y2="9" stroke="currentColor" strokeWidth="0.9" strokeDasharray="1 1" opacity="0.5"/>
  </I>
);

export const IconCozyIndoor = ({ size = 20 }) => (
  <I size={size}>
    {/* sofa silhouette */}
    <rect x="2" y="11" width="16" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="2" y="8" width="3" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="15" y="8" width="3" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* cushion divider */}
    <line x1="10" y1="11" x2="10" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    {/* window light rays */}
    <path d="M 16 2 L 14 5 M 18 4 L 15.5 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
  </I>
);

export const IconUrbanStreet = ({ size = 20 }) => (
  <I size={size}>
    {/* buildings */}
    <rect x="2" y="5" width="5" height="13" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="8" y="3" width="5" height="15" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="14" y="7" width="5" height="11" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* windows */}
    <rect x="3.5" y="7" width="1.5" height="1.5" fill="currentColor" opacity="0.35"/>
    <rect x="3.5" y="10" width="1.5" height="1.5" fill="currentColor" opacity="0.35"/>
    <rect x="9.5" y="5" width="1.5" height="1.5" fill="currentColor" opacity="0.35"/>
    <rect x="9.5" y="8.5" width="1.5" height="1.5" fill="currentColor" opacity="0.35"/>
    <rect x="15.5" y="9" width="1.5" height="1.5" fill="currentColor" opacity="0.35"/>
    {/* ground line */}
    <line x1="1" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
  </I>
);

export const IconNature = ({ size = 20 }) => (
  <I size={size}>
    {/* sun */}
    <circle cx="15" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.1"/>
    {_natureSunRays.map(({ x1, y1, x2, y2 }, i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
    ))}
    {/* hills */}
    <path d="M 1 16 Q 5 8 9 13 Q 13 7 19 13 L 19 18 L 1 18 Z"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    {/* grass detail */}
    <line x1="4" y1="18" x2="4" y2="16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
    <line x1="7" y1="18" x2="7" y2="15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
    <line x1="11" y1="18" x2="11" y2="16.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
  </I>
);

export const IconLuxuryInterior = ({ size = 20 }) => (
  <I size={size}>
    {/* arch frame */}
    <path d="M 4 18 L 4 9 Q 4 4 10 4 Q 16 4 16 9 L 16 18"
      fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* inner arch */}
    <path d="M 6.5 18 L 6.5 10 Q 6.5 6.5 10 6.5 Q 13.5 6.5 13.5 10 L 13.5 18"
      fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    {/* marble floor lines */}
    <line x1="1" y1="18" x2="19" y2="18" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="3" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="0.7" opacity="0.3"/>
    {/* chandelier hint */}
    <circle cx="10" cy="2" r="0.8" fill="currentColor" opacity="0.6"/>
    <line x1="10" y1="2.8" x2="10" y2="5" stroke="currentColor" strokeWidth="0.7" opacity="0.5"/>
  </I>
);

export const IconBeach = ({ size = 20 }) => (
  <I size={size}>
    {/* waves */}
    <path d="M 1 12 Q 3.5 10 6 12 Q 8.5 14 11 12 Q 13.5 10 16 12 Q 18.5 14 20 12"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M 1 15 Q 3.5 13 6 15 Q 8.5 17 11 15 Q 13.5 13 16 15 Q 18.5 17 20 15"
      fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    {/* sun */}
    <circle cx="10" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {_beachSunRays.map(({ x1, y1, x2, y2 }, i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    ))}
  </I>
);

// ─── GARMENT CATEGORIES ───────────────────────────────────────────────────────

export const IconAll = ({ size = 20 }) => (
  <I size={size}>
    {/* 4-dot grid with radiating spark */}
    {[[6,6],[14,6],[6,14],[14,14]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2" fill="none" stroke="currentColor" strokeWidth="1.1"/>
    ))}
    <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.7"/>
    {[45,135,225,315].map((d,i)=>{
      const r=d*Math.PI/180;
      return <line key={i} x1={10+2*Math.cos(r)} y1={10+2*Math.sin(r)} x2={10+4*Math.cos(r)} y2={10+4*Math.sin(r)} stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>;
    })}
  </I>
);

export const IconTops = ({ size = 20 }) => (
  <I size={size}>
    {/* t-shirt */}
    <path d="M 7 3 L 3 7 L 6 8 L 6 17 L 14 17 L 14 8 L 17 7 L 13 3 Q 11.5 5 10 5 Q 8.5 5 7 3 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </I>
);

export const IconBottoms = ({ size = 20 }) => (
  <I size={size}>
    {/* trousers */}
    <path d="M 4 4 L 16 4 L 14 12 L 12 12 L 10 17 L 8 12 L 6 12 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* waistband */}
    <line x1="4" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </I>
);

export const IconDresses = ({ size = 20 }) => (
  <I size={size}>
    {/* dress */}
    <path d="M 7 2 L 13 2 L 15 8 Q 13 9 10 9 Q 7 9 5 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M 5 8 Q 3 13 4 18 L 16 18 Q 17 13 15 8"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* neckline */}
    <path d="M 8.5 2 Q 10 4 11.5 2" fill="none" stroke="currentColor" strokeWidth="0.9"/>
  </I>
);

export const IconOuterwear = ({ size = 20 }) => (
  <I size={size}>
    {/* puffer jacket quilted look */}
    <path d="M 7 3 L 3 6 L 4 17 L 16 17 L 17 6 L 13 3 Q 11.5 5 10 5 Q 8.5 5 7 3 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* quilt lines */}
    {[7.5,10.5,13.5].map((y,i)=>(
      <line key={i} x1="4.5" y1={y} x2="15.5" y2={y} stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
    ))}
    {/* zip */}
    <line x1="10" y1="5" x2="10" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeDasharray="1.2 0.8"/>
  </I>
);

export const IconTraditional = ({ size = 20 }) => (
  <I size={size}>
    {/* djellaba / kaftan robe */}
    <path d="M 10 2 Q 7 3 6 6 L 4 18 L 16 18 L 14 6 Q 13 3 10 2 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* hood suggestion */}
    <path d="M 7 5 Q 10 3 13 5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
    {/* embroidery band */}
    <path d="M 8 8 Q 10 9 12 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    <path d="M 7.5 9.5 Q 10 10.8 12.5 9.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </I>
);

export const IconFootwear = ({ size = 20 }) => (
  <I size={size}>
    {/* sneaker side view */}
    <path d="M 2 14 Q 2 11 5 10 L 9 10 L 12 7 L 15 8 L 16 10 L 18 10 Q 19 12 18 14 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    {/* sole line */}
    <line x1="2" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1"/>
    {/* swoosh hint */}
    <path d="M 5 11.5 Q 9 9.5 14 11" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round"/>
  </I>
);

export const IconAccessories = ({ size = 20 }) => (
  <I size={size}>
    {/* structured bag */}
    <rect x="4" y="8" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* handle */}
    <path d="M 7.5 8 Q 7.5 5 10 5 Q 12.5 5 12.5 8"
      fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* clasp */}
    <circle cx="10" cy="12.5" r="1.2" fill="none" stroke="currentColor" strokeWidth="0.9"/>
    {/* side lines */}
    <line x1="4" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="0.7" opacity="0.4"/>
  </I>
);

// ─── PRODUCT STYLES ───────────────────────────────────────────────────────────

export const IconGhostMannequin = ({ size = 20 }) => (
  <I size={size}>
    {/* ghost body outline dashed */}
    <path d="M 7 4 L 3 7 L 5 8 L 5 17 L 15 17 L 15 8 L 17 7 L 13 4 Q 11.5 6 10 6 Q 8.5 6 7 4 Z"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeDasharray="2 1.2"/>
    {/* subtle ghost figure inside */}
    <circle cx="10" cy="2.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeDasharray="1.5 1"/>
  </I>
);

export const IconFlatLay = ({ size = 20 }) => (
  <I size={size}>
    {/* top view t-shirt flat */}
    <path d="M 7 6 L 3 9 L 5.5 10 L 5.5 16 L 14.5 16 L 14.5 10 L 17 9 L 13 6 Q 11.5 7.5 10 7.5 Q 8.5 7.5 7 6 Z"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    {/* shadow line */}
    <path d="M 5.5 16 Q 10 17.5 14.5 16" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
  </I>
);

export const IconHanging = ({ size = 20 }) => (
  <I size={size}>
    {/* hanger */}
    <path d="M 10 2 Q 13 2 13 5 Q 13 6.5 10 8 Q 4 10 3 14 L 17 14"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="2" r="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    {/* garment */}
    <path d="M 3 14 L 4 18 L 16 18 L 17 14"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </I>
);

export const IconFolded = ({ size = 20 }) => (
  <I size={size}>
    {/* stacked folded layers */}
    <rect x="3" y="5" width="14" height="3.5" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="3" y="9.5" width="14" height="3.5" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="3" y="14" width="14" height="3.5" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* fold crease */}
    <line x1="10" y1="5" x2="10" y2="8.5" stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
    <line x1="10" y1="9.5" x2="10" y2="13" stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
  </I>
);

// ─── FABRICS ─────────────────────────────────────────────────────────────────

export const IconFabricAny = ({ size = 20 }) => (
  <I size={size}>
    {/* question mark woven in textile grid style */}
    <path d="M 7 7 Q 7 4 10 4 Q 13 4 13 7 Q 13 10 10 11 L 10 13"
      fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="10" cy="15.5" r="0.9" fill="currentColor"/>
  </I>
);

export const IconCotton = ({ size = 20 }) => (
  <I size={size}>
    {/* cotton boll */}
    <circle cx="10" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {[0,120,240].map((d,i)=>{
      const r=d*Math.PI/180;
      return <circle key={i} cx={10+2.8*Math.cos(r-Math.PI/2)} cy={11+2.8*Math.sin(r-Math.PI/2)} r="2" fill="none" stroke="currentColor" strokeWidth="1.1"/>;
    })}
    {/* stem */}
    <line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M 8.5 17 Q 10 16 11.5 17" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
  </I>
);

export const IconSilk = ({ size = 20 }) => (
  <I size={size}>
    {/* flowing drape lines */}
    <path d="M 4 4 Q 8 7 12 5 Q 16 3 18 6 Q 16 9 12 8 Q 8 7 5 10 Q 3 12 5 15 Q 8 18 12 16 Q 16 14 17 17"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    {/* sheen dots */}
    <circle cx="7" cy="6" r="0.7" fill="currentColor" opacity="0.4"/>
    <circle cx="14" cy="10" r="0.7" fill="currentColor" opacity="0.4"/>
  </I>
);

export const IconDenim = ({ size = 20 }) => (
  <I size={size}>
    {/* diagonal woven texture in square */}
    <rect x="3" y="3" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {[0,1,2,3,4].map(i=>(
      <line key={i} x1={3+i*3.5} y1="3" x2="3" y2={3+i*3.5} stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    ))}
    {[0,1,2,3,4].map(i=>(
      <line key={i} x1={17} y1={3+i*3.5} x2={3+i*3.5} y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    ))}
  </I>
);

export const IconWool = ({ size = 20 }) => (
  <I size={size}>
    {/* yarn ball */}
    <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M 4 7 Q 10 5 16 9" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
    <path d="M 3 11 Q 10 9 17 13" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
    <path d="M 5 14 Q 10 13 15 16" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
    {/* knitting needle */}
    <line x1="14" y1="3" x2="6" y2="17" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="14" cy="3" r="1" fill="currentColor" opacity="0.6"/>
  </I>
);

export const IconLinen = ({ size = 20 }) => (
  <I size={size}>
    {/* woven grid (linen texture) */}
    {[4,7,10,13,16].map(x=>(
      <line key={x} x1={x} y1="3" x2={x} y2="17" stroke="currentColor" strokeWidth="0.9" opacity={0.45}/>
    ))}
    {[4,7,10,13,16].map(y=>(
      <line key={y} x1="3" y1={y} x2="17" y2={y} stroke="currentColor" strokeWidth="0.9" opacity={0.45}/>
    ))}
    <rect x="3" y="3" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  </I>
);

export const IconLeather = ({ size = 20 }) => (
  <I size={size}>
    {/* hide shape with stitch edges */}
    <path d="M 5 4 Q 3 4 3 8 L 3 14 Q 3 18 7 18 L 13 18 Q 17 18 17 14 L 17 8 Q 17 4 15 4 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* stitch line */}
    <path d="M 5.5 4.5 Q 3.8 4.5 3.8 8 L 3.8 14 Q 3.8 17.2 7 17.2 L 13 17.2 Q 16.2 17.2 16.2 14 L 16.2 8 Q 16.2 4.5 14.5 4.5"
      fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 1" opacity="0.5"/>
    {/* grain lines */}
    <line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="0.6" opacity="0.3"/>
    <line x1="6" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="0.6" opacity="0.3"/>
  </I>
);

export const IconActivewear = ({ size = 20 }) => (
  <I size={size}>
    {/* running figure */}
    <circle cx="13" cy="3.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M 13 5.3 L 11 10 L 7 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M 11 10 L 12 14 L 9 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M 13 7 L 16 10 L 17 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    {/* motion lines */}
    <line x1="2" y1="11" x2="6" y2="11" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
    <line x1="3" y1="13.5" x2="6.5" y2="13.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
  </I>
);

// ─── FITS ─────────────────────────────────────────────────────────────────────

export const IconFitRegular = ({ size = 20 }) => (
  <I size={size}>
    <path d="M 8 3 L 12 3 L 14 18 L 6 18 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="6" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1"/>
  </I>
);

export const IconFitTight = ({ size = 20 }) => (
  <I size={size}>
    <path d="M 9 3 L 11 3 L 12.5 18 L 7.5 18 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="7.5" y1="18" x2="12.5" y2="18" stroke="currentColor" strokeWidth="1"/>
  </I>
);

export const IconFitOversized = ({ size = 20 }) => (
  <I size={size}>
    <path d="M 7 3 L 13 3 L 16.5 18 L 3.5 18 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="3.5" y1="18" x2="16.5" y2="18" stroke="currentColor" strokeWidth="1"/>
  </I>
);

export const IconFitCropped = ({ size = 20 }) => (
  <I size={size}>
    <path d="M 8 3 L 12 3 L 13.5 11 L 6.5 11 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="6.5" y1="11" x2="13.5" y2="11" stroke="currentColor" strokeWidth="1"/>
    {/* cut line */}
    <line x1="4" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 1.2" opacity="0.5"/>
  </I>
);

export const IconFitLongline = ({ size = 20 }) => (
  <I size={size}>
    <path d="M 8.5 2 L 11.5 2 L 13 18.5 L 7 18.5 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="7" y1="18.5" x2="13" y2="18.5" stroke="currentColor" strokeWidth="1"/>
  </I>
);

// ─── TARGET MARKETS ───────────────────────────────────────────────────────────

export const IconMarketGlobal = ({ size = 20 }) => (
  <I size={size}>
    <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <ellipse cx="10" cy="10" rx="3.5" ry="7.5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
    <line x1="2.5" y1="10" x2="17.5" y2="10" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
    <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="0.7" opacity="0.3"/>
    <line x1="3" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="0.7" opacity="0.3"/>
  </I>
);

// Simplified geometric flag-inspired icons
export const IconMarketUSA = ({ size = 20 }) => (
  <I size={size}>
    {/* stripes */}
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {[5,7,9,11,13].map((y,i)=>(
      <line key={i} x1="2" y1={y} x2="18" y2={y} stroke="currentColor" strokeWidth="0.7" opacity={i%2===0?0.45:0.2}/>
    ))}
    {/* star field */}
    <rect x="2" y="3" width="7" height="7" fill="currentColor" opacity="0.18" rx="1.5"/>
    <circle cx="5" cy="6.5" r="0.7" fill="currentColor" opacity="0.7"/>
    <circle cx="7.5" cy="6.5" r="0.7" fill="currentColor" opacity="0.7"/>
    <circle cx="6.2" cy="4.8" r="0.7" fill="currentColor" opacity="0.7"/>
  </I>
);

export const IconMarketJapan = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </I>
);

export const IconMarketFrance = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="7.3" y1="3" x2="7.3" y2="17" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
    <line x1="12.7" y1="3" x2="12.7" y2="17" stroke="currentColor" strokeWidth="1.3" opacity="0.5"/>
  </I>
);

export const IconMarketBrazil = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* diamond */}
    <polygon points="10,5 17,10 10,15 3,10" fill="none" stroke="currentColor" strokeWidth="1"/>
    <circle cx="10" cy="10" r="2.8" fill="none" stroke="currentColor" strokeWidth="0.9"/>
  </I>
);

export const IconMarketUK = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* Union Jack simplified */}
    <line x1="2" y1="3" x2="18" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <line x1="18" y1="3" x2="2" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="1.3" opacity="0.6"/>
    <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.3" opacity="0.6"/>
  </I>
);

export const IconMarketSouthKorea = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* taegeuk */}
    <circle cx="10" cy="10" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M 10 6.5 Q 12.5 6.5 12.5 10 Q 12.5 13.5 10 13.5"
      fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
  </I>
);

export const IconMarketNorthAfrica = ({ size = 20 }) => (
  <I size={size}>
    {/* crescent + star on flag-like rect */}
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M 11 7 A 4 4 0 1 0 11 13 A 3 3 0 1 1 11 7 Z" fill="none" stroke="currentColor" strokeWidth="1.1"/>
    <circle cx="13.5" cy="7" r="0.8" fill="currentColor" opacity="0.6"/>
  </I>
);

export const IconMarketAlgeria = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="0.8" opacity="0.35"/>
    {/* crescent */}
    <path d="M 11.5 7.5 A 3.5 3.5 0 1 0 11.5 12.5 A 2.5 2.5 0 1 1 11.5 7.5 Z"
      fill="none" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M 13 8.5 L 14 10 L 13 11.5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/>
  </I>
);

export const IconMarketWestAfrica = ({ size = 20 }) => (
  <I size={size}>
    {/* Adinkra Gye Nyame inspired */}
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
    {_westAfricaRays.map(({ x1, y1, x2, y2 }, i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    ))}
  </I>
);

// ─── HEADWEAR ─────────────────────────────────────────────────────────────────

export const IconNoHeadwear = ({ size = 20 }) => (
  <I size={size}>
    <circle cx="10" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* hair lines */}
    <path d="M 5.5 6 Q 10 3 14.5 6" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5"/>
    {/* shoulders */}
    <path d="M 4 18 Q 4 14 10 14 Q 16 14 16 18" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  </I>
);

export const IconHijab = ({ size = 20 }) => (
  <I size={size}>
    {/* face oval */}
    <ellipse cx="10" cy="9" rx="4" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* head wrap draped shape */}
    <path d="M 3 8 Q 3 3 10 3 Q 17 3 17 8 Q 17 14 14 16 Q 10 18 6 16 Q 3 14 3 10 Z"
      fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* shoulder fall */}
    <path d="M 3 12 Q 1 16 2 18 M 17 12 Q 19 16 18 18"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/>
  </I>
);

// ─── BRAND STYLES ─────────────────────────────────────────────────────────────

export const IconBrandGeneric = ({ size = 20 }) => (
  <I size={size}>
    {/* clean grid layout mark */}
    <rect x="3" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="11" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="3" y="11" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="11" y="11" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  </I>
);

export const IconBrandZara = ({ size = 20 }) => (
  <I size={size}>
    {/* Z letterform, geometric */}
    <path d="M 4 5 L 16 5 L 4 15 L 16 15"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);

export const IconBrandRalphLauren = ({ size = 20 }) => (
  <I size={size}>
    {/* polo rider silhouette, simplified */}
    <circle cx="12" cy="4" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M 12 5.5 L 11 9 L 8 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M 11 9 L 13 12 L 11 15" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    {/* horse body */}
    <path d="M 4 10 Q 7 8 10 9 Q 13 10 14 8 Q 15 6 17 7 Q 16 10 14 11 Q 11 12 7 12 Z"
      fill="none" stroke="currentColor" strokeWidth="1.1"/>
    <line x1="7" y1="12" x2="6" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <line x1="10" y1="12" x2="9" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </I>
);

export const IconBrandHM = ({ size = 20 }) => (
  <I size={size}>
    {/* H & M letters clean */}
    <path d="M 2 4 L 2 16 M 2 10 L 8 10 M 8 4 L 8 16"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M 10 16 Q 10 4 13 10 Q 16 4 16 16"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);

export const IconBrandNike = ({ size = 20 }) => (
  <I size={size}>
    {/* swoosh */}
    <path d="M 2 12 Q 8 4 18 8 Q 14 9 10 11 Q 6 13 4 14 Z"
      fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);

export const IconBrandASOS = ({ size = 20 }) => (
  <I size={size}>
    {/* globe + shopping bag hybrid */}
    <circle cx="10" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    <ellipse cx="10" cy="9" rx="3" ry="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
    <line x1="4" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    {/* bag handle bottom */}
    <path d="M 7 15 L 6 18 L 14 18 L 13 15" fill="none" stroke="currentColor" strokeWidth="1.1"/>
  </I>
);

export const IconBrandGucci = ({ size = 20 }) => (
  <I size={size}>
    {/* interlocking G's */}
    <path d="M 9 6 Q 4 6 4 10 Q 4 14 9 14 L 9 11 L 7 11"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M 11 14 Q 16 14 16 10 Q 16 6 11 6 L 11 9 L 13 9"
      fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </I>
);

// ─── RESOLUTION ───────────────────────────────────────────────────────────────

export const IconRes1K = ({ size = 20 }) => (
  <I size={size}>
    <rect x="3" y="4" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    {/* "1": angled-top vertical  "K": stem + two diagonals */}
    <path d="M 6.5 8.5 L 7.5 7 L 7.5 13 M 9.5 7 L 9.5 13 M 9.5 10 L 12.5 7 M 9.5 10 L 12.5 13"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);

export const IconRes2K = ({ size = 20 }) => (
  <I size={size}>
    <rect x="2" y="3" width="16" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/>
    {/* "2": arc top + diagonal base  "K": stem + two diagonals */}
    <path d="M 6 8 Q 6 6.5 7.8 6.5 Q 9.5 6.5 9.5 8 Q 9.5 9.5 6 13.5 L 9.5 13.5 M 11 6.5 L 11 13.5 M 11 10 L 14.5 6.5 M 11 10 L 14.5 13.5"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);

export const IconRes4K = ({ size = 20 }) => (
  <I size={size}>
    <rect x="1" y="2" width="18" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {/* corner accent marks for premium */}
    <path d="M 1 6 L 1 2 L 5 2" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <path d="M 19 6 L 19 2 L 15 2" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <path d="M 1 14 L 1 18 L 5 18" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <path d="M 19 14 L 19 18 L 15 18" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    {/* "4": diagonal + crossbar + vertical  "K": stem + two diagonals */}
    <path d="M 9 6.5 L 5.5 12 L 11 12 M 9 6.5 L 9 14.5 M 12.5 6.5 L 12.5 14.5 M 12.5 10.5 L 16 6.5 M 12.5 10.5 L 16 14.5"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </I>
);