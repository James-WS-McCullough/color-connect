type stopDrawingProps = {
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const stopDrawing = ({ setDrawing }: stopDrawingProps) => {
  setDrawing(false);
};
