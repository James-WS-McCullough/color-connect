type pickRandomStageTypeProps = {
  unlockedStageTypes: string[];
  levelNumber: number;
};

export const pickRandomStageType = ({
  unlockedStageTypes,
  levelNumber,
}: pickRandomStageTypeProps) => {
  if (unlockedStageTypes.length === 0) {
    return [];
  }
  if (levelNumber < 40) {
    const random = Math.random();
    if (random < 0.3) {
      return [];
    }
    const randomIndex = Math.floor(Math.random() * unlockedStageTypes.length);
    const randomStageType = unlockedStageTypes[randomIndex];
    return [randomStageType];
  } else if (levelNumber < 100) {
    const random1 = Math.random();
    if (random1 < 0.2) {
      return [];
    }
    const random = Math.random();
    if (random < 0.5) {
      const randomIndex = Math.floor(Math.random() * unlockedStageTypes.length);
      const randomStageType = unlockedStageTypes[randomIndex];
      return [randomStageType];
    }
    // Return 2 different random stage types
    const randomIndex1 = Math.floor(Math.random() * unlockedStageTypes.length);
    const randomIndex2 = Math.floor(Math.random() * unlockedStageTypes.length);
    const randomStageType1 = unlockedStageTypes[randomIndex1];
    const randomStageType2 = unlockedStageTypes[randomIndex2];
    if (randomStageType1 === randomStageType2) {
      return [randomStageType1];
    }
    return [randomStageType1, randomStageType2];
  }
  // Return 3 different random stage types
  const randomIndex1 = Math.floor(Math.random() * unlockedStageTypes.length);
  const randomIndex2 = Math.floor(Math.random() * unlockedStageTypes.length);
  const randomIndex3 = Math.floor(Math.random() * unlockedStageTypes.length);
  const randomStageType1 = unlockedStageTypes[randomIndex1];
  const randomStageType2 = unlockedStageTypes[randomIndex2];
  const randomStageType3 = unlockedStageTypes[randomIndex3];
  const randomStageTypes = [
    randomStageType1,
    randomStageType2,
    randomStageType3,
  ];
  const uniqueRandomStageTypes = randomStageTypes.filter(
    (stageType, index) => randomStageTypes.indexOf(stageType) === index
  );
  return uniqueRandomStageTypes;
};
