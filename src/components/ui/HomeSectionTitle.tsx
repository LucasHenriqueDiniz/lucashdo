import { motion, Variants } from 'framer-motion';
import { memo } from 'react';

interface HomeSectionTitleProps {
  containerClassName?: string;
  subTitle: string;
  titleWhitePart: string;
  titleBluePart: string;
  icon?: React.ReactNode;
}

// Animation constants
const VIEWPORT_CONFIG = { once: true };
const BASE_DELAY = 0.2;
const ANIMATION_DURATIONS = {
  short: 0.5,
  medium: 0.7,
  long: 1.0,
};

// Animation variants
const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.medium, delay },
  }),
};

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATIONS.medium, delay: BASE_DELAY },
  },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION_DURATIONS.medium, delay: BASE_DELAY + 0.8 },
  },
};

const iconAnimationVariants: Variants = {
  hidden: { rotate: -180, scale: 0.3 },
  visible: {
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: BASE_DELAY + 0.8,
    },
  },
};

// Component para o ícone padrão
const DefaultIcon = () => {
  const rectVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: ANIMATION_DURATIONS.short, delay },
    }),
  };

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <motion.rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        fill="#0ea5e9"
        variants={rectVariants}
        initial="hidden"
        whileInView="visible"
        custom={BASE_DELAY + 1.0}
        viewport={VIEWPORT_CONFIG}
      />
      <motion.rect
        x="18"
        y="2"
        width="12"
        height="12"
        rx="2"
        fill="#0ea5e9"
        variants={rectVariants}
        initial="hidden"
        whileInView="visible"
        custom={BASE_DELAY + 1.2}
        viewport={VIEWPORT_CONFIG}
      />
      <motion.rect
        x="2"
        y="18"
        width="12"
        height="12"
        rx="2"
        fill="#0ea5e9"
        variants={rectVariants}
        initial="hidden"
        whileInView="visible"
        custom={BASE_DELAY + 1.4}
        viewport={VIEWPORT_CONFIG}
      />
    </svg>
  );
};

const HomeSectionTitle = memo(
  ({
    containerClassName,
    subTitle,
    titleWhitePart,
    titleBluePart,
    icon,
  }: HomeSectionTitleProps) => {
    return (
      <h2
        className={`text-3xl md:text-4xl flex flex-col items-start font-semibold mb-16 text-center ${containerClassName || ''}`}
      >
        <motion.span
          className="text-lg text-[var(--muted-foreground)] mb-2"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
        >
          {subTitle}
        </motion.span>

        <motion.span
          className="inline-block align-middle"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          custom={BASE_DELAY + 0.5}
          viewport={VIEWPORT_CONFIG}
        >
          <motion.span
            className="inline-block mr-2 align-middle text-[var(--primary)]"
            variants={iconAnimationVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
          >
            {icon || <DefaultIcon />}
          </motion.span>

          <motion.span
            className="font-extrabold text-[var(--foreground)] gap-2 inline-flex align-middle"
            variants={fadeInLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
          >
            <span className="text-[var(--foreground)]">{titleWhitePart}</span>

            <motion.span
              className="text-[var(--primary)]"
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              custom={BASE_DELAY + 1.2}
              viewport={VIEWPORT_CONFIG}
            >
              {titleBluePart}
            </motion.span>
          </motion.span>
        </motion.span>
      </h2>
    );
  }
);
HomeSectionTitle.displayName = 'HomeSectionTitle';
export default HomeSectionTitle;
