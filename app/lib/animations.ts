export const scaleUp = (stagger?: number) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "circOut",
      duration: 0.4,
      staggerChildren: stagger ?? undefined,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
});

export const fade = () => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
});
