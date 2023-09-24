export const toAddNewColor = ({
  colourCount,
  size,
}: {
  colourCount: number;
  size: number;
}) => {
  if (size < 4) {
    return colourCount < size - 1;
  }
  if (size >= 8) {
    return true;
  }
  return colourCount < size;
};
