export const scaleUp = (duration = 0.5) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "circOut",
      duration: duration,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: duration / 2,
    },
  },
});

export const fade = (duration = 0.1) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration,
    },
  },
});
