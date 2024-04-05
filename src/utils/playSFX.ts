export const playSFX = (filename: string) => {
  // if on mobile, don't play sound
  if (window.innerWidth < 768) return;

  const success = new Audio(filename);
  success.volume = 0.5;
  success.play();
};
