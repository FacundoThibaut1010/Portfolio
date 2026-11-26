import type { CSSProperties, ReactNode } from 'react';

export type MockupScene = 'midnight' | 'ember' | 'stone' | 'sand' | 'paper' | 'sunny';
export type MockupLayout = 'laptop' | 'combo' | 'phone' | 'float';

type Props = {
  screen?: string;        // desktop capture
  phoneScreen?: string;   // mobile capture
  alt: string;
  scene?: MockupScene;
  layout?: MockupLayout;
  /** Y rotation of the main device in degrees (negative = turned to the left). */
  angle?: number;
  /** Color the screen "emits" onto the surface. */
  glow?: string;
  className?: string;
};

// Studio-style sets: dark set, warm backdrop, grey concrete, warm sand
const SCENES: Record<MockupScene, { bg: string; light: string; stoneTop: string; stoneFront: string }> = {
  midnight: {
    bg: 'radial-gradient(120% 90% at 70% 10%, #1d1b33 0%, #0b0b12 55%, #050507 100%)',
    light: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 35%, transparent 55%)',
    stoneTop: 'linear-gradient(180deg, #4a4a52 0%, #2c2c33 100%)',
    stoneFront: 'linear-gradient(180deg, #24242a 0%, #111115 100%)',
  },
  ember: {
    bg: 'radial-gradient(110% 90% at 50% 0%, #f2571c 0%, #b8350c 38%, #3b1206 78%, #170703 100%)',
    light: 'linear-gradient(120deg, rgba(255,220,180,0.22) 0%, rgba(255,200,150,0.05) 30%, transparent 52%)',
    stoneTop: 'linear-gradient(180deg, #5b4a44 0%, #2e2421 100%)',
    stoneFront: 'linear-gradient(180deg, #241b18 0%, #0f0a08 100%)',
  },
  stone: {
    bg: 'radial-gradient(120% 100% at 30% 0%, #6b6d72 0%, #3a3b3f 45%, #18191b 100%)',
    light: 'linear-gradient(110deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 28%, transparent 48%)',
    stoneTop: 'linear-gradient(180deg, #8a8a8e 0%, #55565a 100%)',
    stoneFront: 'linear-gradient(180deg, #3d3e42 0%, #1d1e20 100%)',
  },
  paper: {
    bg: 'radial-gradient(120% 100% at 25% 0%, #fbfaf6 0%, #ece8df 45%, #c9c3b6 100%)',
    light: 'linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 30%, transparent 50%)',
    stoneTop: 'linear-gradient(180deg, #e7e2d8 0%, #bdb6a8 100%)',
    stoneFront: 'linear-gradient(180deg, #a49d90 0%, #6f695f 100%)',
  },
  sunny: {
    bg: 'radial-gradient(110% 95% at 50% 0%, #ffe14d 0%, #ffcc00 40%, #e0a800 80%, #9c6f00 100%)',
    light: 'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 30%, transparent 52%)',
    stoneTop: 'linear-gradient(180deg, #f2c200 0%, #c89a00 100%)',
    stoneFront: 'linear-gradient(180deg, #a87f00 0%, #6b5000 100%)',
  },
  sand: {
    bg: 'radial-gradient(120% 100% at 75% 5%, #e9dfd0 0%, #c7b8a3 40%, #6f6252 85%, #3b332a 100%)',
    light: 'linear-gradient(105deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 30%, transparent 50%)',
    stoneTop: 'linear-gradient(180deg, #d9cfc1 0%, #a99d8d 100%)',
    stoneFront: 'linear-gradient(180deg, #8a7f71 0%, #4f463c 100%)',
  },
};

// Fine grain for the concrete (inline SVG noise, no extra request)
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const Pedestal = ({ s, glow, inset = '11%', height = '30%' }: { s: (typeof SCENES)[MockupScene]; glow: string; inset?: string; height?: string }) => (
  <div className="absolute bottom-0" style={{ left: inset, right: inset, height }}>
    <div className="absolute inset-x-0 top-0 h-[16%]" style={{ background: s.stoneTop }}>
      <div className="absolute inset-0 opacity-70 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
      <div className="absolute left-[10%] right-[10%] -top-[60%] h-[220%] opacity-70" style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }} />
    </div>
    <div className="absolute inset-x-0 top-[16%] bottom-0" style={{ background: s.stoneFront }}>
      <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
      <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
    </div>
  </div>
);

const Laptop = ({ screen, alt, angle }: { screen: string; alt: string; angle: number }) => (
  <div style={{ perspective: '140cqw' } as CSSProperties}>
    <div style={{ transform: `rotateY(${angle}deg) rotateX(3deg)`, transformStyle: 'preserve-3d' }}>
      <div
        className="relative w-full rounded-[3.2cqw] bg-[#0b0b0c] p-[1.3cqw]"
        style={{ aspectRatio: '16 / 10.4', boxShadow: '0 0 0 0.25cqw #2b2b2f inset, 0 3cqw 6cqw rgba(0,0,0,0.55)' } as CSSProperties}
      >
        <div className="relative w-full h-full rounded-[1.9cqw] overflow-hidden bg-black">
          <img src={screen} alt={alt} draggable={false} decoding="async" loading="lazy" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, transparent 40%)' }} />
        </div>
        <div className="absolute left-1/2 top-[1.3cqw] -translate-x-1/2 w-[11%] h-[2.2cqw] rounded-b-[1cqw] bg-[#0b0b0c]" />
      </div>
      <div
        className="relative left-1/2 -translate-x-1/2 w-[112%] h-[2.6cqw] rounded-b-[1.6cqw] rounded-t-[0.4cqw]"
        style={{ background: 'linear-gradient(180deg, #5a5b60 0%, #2a2a2e 45%, #121214 100%)' }}
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[14%] h-[45%] rounded-b-[1cqw] bg-[#1a1a1d]" />
      </div>
    </div>
    <div className="absolute left-[-10%] right-[-10%] -bottom-[3.5cqw] h-[6cqw]" style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,0.75), transparent)' }} />
  </div>
);

/** Modern phone: thin titanium frame, dynamic island, side buttons, glass reflection. Sized by its parent's height. */
const Phone = ({ screen, alt, transform, shadow = true }: { screen: string; alt: string; transform: string; shadow?: boolean }) => (
  <div className="relative h-full" style={{ aspectRatio: '9 / 19.2', perspective: '120cqh' } as CSSProperties}>
    <div className="relative w-full h-full" style={{ transform, transformStyle: 'preserve-3d' }}>
      {/* Side buttons */}
      <span className="absolute -left-[2.2%] top-[22%] w-[2.4%] h-[7%] rounded-l-sm bg-[#3a3a3f]" />
      <span className="absolute -left-[2.2%] top-[32%] w-[2.4%] h-[11%] rounded-l-sm bg-[#3a3a3f]" />
      <span className="absolute -right-[2.2%] top-[28%] w-[2.4%] h-[14%] rounded-r-sm bg-[#3a3a3f]" />
      {/* Frame */}
      <div
        className="absolute inset-0 rounded-[15%/7%] p-[3.2%]"
        style={{
          background: 'linear-gradient(145deg, #6b6b70 0%, #2b2b2f 30%, #18181b 70%, #4a4a4f 100%)',
          boxShadow: shadow ? '0 4cqh 8cqh rgba(0,0,0,0.55), 0 0 0 0.3cqh rgba(0,0,0,0.6)' : 'none',
        }}
      >
        <div className="relative w-full h-full rounded-[12.5%/5.8%] overflow-hidden bg-black">
          <img src={screen} alt={alt} draggable={false} decoding="async" loading="lazy" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 34%, transparent 36%)' }} />
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-[1.8%] -translate-x-1/2 w-[30%] h-[3.3%] rounded-full bg-black" />
        </div>
      </div>
    </div>
  </div>
);

const Vignette = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(130% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
);

export const LaptopMockup = ({ screen, phoneScreen, alt, scene = 'midnight', layout = 'laptop', angle = -14, glow = '#f97316', className = '' }: Props) => {
  const s = SCENES[scene];
  let content: ReactNode = null;

  if (layout === 'laptop' && screen) {
    content = (
      <>
        <Pedestal s={s} glow={glow} />
        <div className="absolute left-1/2 bottom-[25.5%] w-[64%] -translate-x-1/2">
          <Laptop screen={screen} alt={alt} angle={angle} />
        </div>
      </>
    );
  } else if (layout === 'combo' && screen && phoneScreen) {
    // Laptop on the block, phone leaning in front: desktop + mobile at a glance
    content = (
      <>
        <Pedestal s={s} glow={glow} inset="6%" height="28%" />
        <div className="absolute left-[9%] bottom-[23.5%] w-[60%]">
          <Laptop screen={screen} alt={alt} angle={angle} />
        </div>
        <div className="absolute right-[10%] bottom-[9%] h-[58%]">
          <Phone screen={phoneScreen} alt={alt} transform="rotateY(-16deg) rotateZ(4deg)" />
        </div>
      </>
    );
  } else if (layout === 'float' && screen) {
    // A laptop floating, tilted like a product shot, with its soft shadow on the floor
    content = (
      <>
        <div className="absolute left-1/2 bottom-[8%] w-[62%] h-[9%] -translate-x-1/2" style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,0.38), transparent)' }} />
        <div className="absolute left-1/2 top-[14%] w-[66%]" style={{ transform: 'translateX(-50%) rotate(-7deg)' }}>
          <Laptop screen={screen} alt={alt} angle={angle} />
        </div>
      </>
    );
  } else if (layout === 'phone' && phoneScreen) {
    // A single phone floating over the scene with its shadow on the floor
    content = (
      <>
        <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: s.stoneTop }}>
          <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
        </div>
        <div className="absolute left-1/2 bottom-[8%] w-[46%] h-[8%] -translate-x-1/2" style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,0.5), transparent)' }} />
        <div className="absolute left-1/2 top-[7%] bottom-[14%] -translate-x-1/2 flex justify-center">
          <Phone screen={phoneScreen} alt={alt} transform={`rotateY(${angle}deg) rotateX(6deg) rotateZ(-7deg)`} />
        </div>
      </>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ background: s.bg, containerType: 'size' } as CSSProperties}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: s.light }} />
      {content}
      <Vignette />
    </div>
  );
};
