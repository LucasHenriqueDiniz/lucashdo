'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { LuExternalLink, LuFileText, LuMail } from 'react-icons/lu';
import LaserFlow from '@/components/LaserFlow';
import RotatingText from '@/components/RotatingText';
import HeroBrowser from '@/components/home/HeroBrowser/HeroBrowser';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';

export function Hero() {
  const t = useTranslations();
  const router = useRouter();
  const lang = useLanguageStore((state) => state.lang);

  const rotatingRoles = useMemo(
    () =>
      lang === 'pt'
        ? [
            'front-end pleno',
            'f\u00e3 de back-end',
            'entusiasta de UI/UX',
            'full-stack',
            'gamer nas horas vagas',
            'eterno aprendiz',
            'cat\u00f3lico',
            'estudante de \u65e5\u672c\u8a9e',
            'que ama m\u00fasica',
            'rato de academia',
            'que j\u00e1 chorou vendo Shigatsu wa Kimi no Uso',
          ]
        : [
            'mid-level front-end developer',
            'back-end enthusiast',
            'full-stack developer',
            'UI/UX enthusiast',
            'gamer in their free time',
            'eternal learner',
            'Catholic',
            '\u65e5\u672c\u8a9e language student',
            'who loves music',
            'gym rat',
            'who cried watching Shigatsu wa Kimi no Uso',
          ],
    [lang]
  );

  return (
    <section
      style={{
        height: '1200px',
        width: '100vw',
        position: 'relative',
        overflow: 'visible',
        marginBottom: '320px',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <LaserFlow
          className=""
          style={{}}
          dpr={undefined}
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#0184FC"
          horizontalSizing={0.5}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.1}
          falloffStart={1.2}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '86%',
          maxWidth: '980px',
          zIndex: 6,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            textAlign: 'center',
            padding: '24px 24px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              alignItems: 'center',
              maxWidth: '860px',
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: 'clamp(3.2rem, 6vw, 5.8rem)',
                lineHeight: 0.92,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                textWrap: 'balance',
                textShadow: '0 18px 60px rgba(1, 132, 252, 0.28), 0 4px 18px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span
                style={{
                  color: '#dcecff',
                }}
              >
                {t('Home.greeting')}
              </span>{' '}
              <span
                style={{
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 32%, #d9e4ef 68%, #b8c7d8 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
                }}
              >
                Lucas HDO
              </span>
            </h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                minHeight: '64px',
                fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
                fontWeight: 500,
                color: 'rgba(237, 248, 255, 0.92)',
              }}
            >
              <span
                style={{
                  color: 'rgba(222, 236, 248, 0.92)',
                }}
              >
                {t('Hero.developerPrefix')}
              </span>
              <RotatingText
                texts={rotatingRoles}
                rotationInterval={2800}
                staggerDuration={0.012}
                splitBy="characters"
                mainClassName="inline-flex w-fit px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg whitespace-nowrap flex-nowrap border border-[#6bbcff]/25 bg-[#0184FC] text-white shadow-[0_10px_30px_rgba(1,132,252,0.28)]"
                splitLevelClassName="justify-center whitespace-nowrap"
                elementLevelClassName="font-bold text-white"
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '14px',
            }}
          >
            <Button
              size="lg"
              onClick={() => router.push('/projects')}
              className="min-w-[220px] border border-sky-300/30 bg-[linear-gradient(135deg,#0d7ff2_0%,#0867cb_100%)] text-white shadow-[0_0_32px_rgba(8,103,203,0.28)] hover:brightness-110"
            >
              <LuExternalLink className="h-4 w-4" aria-hidden="true" />
              {t('Home.browseProjects')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="min-w-[220px] border-slate-200/10 bg-slate-950/45 text-slate-100 shadow-[0_10px_26px_rgba(2,8,20,0.18)] backdrop-blur-md hover:border-sky-300/25 hover:bg-slate-900/72"
            >
              <LuMail className="h-4 w-4" aria-hidden="true" />
              {t('Navigation.contact')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/cv')}
              className="min-w-[220px] border-slate-200/10 bg-slate-950/45 text-slate-100 shadow-[0_10px_26px_rgba(2,8,20,0.18)] backdrop-blur-md hover:border-sky-300/25 hover:bg-slate-900/72"
            >
              <LuFileText className="h-4 w-4" aria-hidden="true" />
              {t('Navigation.viewCV')}
            </Button>
          </div>
        </motion.div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '86%',
          maxWidth: '1200px',
          height: '60%',
          backgroundColor: 'rgba(6, 0, 16, 0.4)',
          borderRadius: '16px',
          border: '2px solid #0184FC',
          zIndex: 10,
          overflow: 'visible',
          backgroundImage: `
            radial-gradient(circle, rgba(1, 132, 252, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <HeroBrowser />
        </div>
      </div>
    </section>
  );
}

export default Hero;
