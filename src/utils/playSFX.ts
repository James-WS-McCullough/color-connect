export const playSFX = (filename: string) => {
  const success = new Audio(filename);
  success.volume = 0.5;
  success.play();
};
