// Skill animation tokens: durations + easing + stagger
export const dur = { fast: 0.15, normal: 0.3, slow: 0.5 } as const;
export const easeOut: [number, number, number, number] = [0, 0, 0.2, 1];

export const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: easeOut } },
};
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
