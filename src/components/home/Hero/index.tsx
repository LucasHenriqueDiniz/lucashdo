import DesktopHero from './Hero';
import HeroMobile from './HeroMobile';

export default function Hero() {
  return (
    <>
      <HeroMobile />
      <DesktopHero />
    </>
  );
}
