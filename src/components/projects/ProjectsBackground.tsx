'use client';

import dynamic from 'next/dynamic';

const Grainient = dynamic(() => import('@/components/Grainient'), {
  ssr: false,
  loading: () => <GradientFallback />,
});

interface ProjectsBackgroundProps {
  className?: string;
}

export function ProjectsBackground({ className }: ProjectsBackgroundProps) {
  return (
    <div className={`fixed inset-0 ${className || ''}`.trim()} style={{ zIndex: 1 }}>
      <Grainient
        color1="#0184FC"
        color2="#00D4FF"
        color3="#001F3F"
        timeSpeed={0.3}
        warpStrength={1.2}
        warpFrequency={4.0}
        warpSpeed={1.5}
        grainAmount={0.15}
        grainScale={2.5}
        grainAnimated={true}
        contrast={1.3}
        saturation={1.1}
        zoom={1.0}
      />
    </div>
  );
}

function GradientFallback({ className }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 ${className || ''}`.trim()}
      style={{
        zIndex: 1,
        background: `
          radial-gradient(circle at 20% 30%, rgba(1, 132, 252, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 31, 63, 0.3) 0%, transparent 100%),
          linear-gradient(180deg, #000000 0%, #001020 100%)
        `,
      }}
    />
  );
}
