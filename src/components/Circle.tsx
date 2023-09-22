import { Box } from "@chakra-ui/react";
import React from "react";
import ElderlyIcon from "@mui/icons-material/Elderly";
import EggAltIcon from "@mui/icons-material/EggAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BathtubIcon from "@mui/icons-material/Bathtub";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import BalanceIcon from "@mui/icons-material/Balance";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import CakeIcon from "@mui/icons-material/Cake";
import CallIcon from "@mui/icons-material/Call";
import BuildIcon from "@mui/icons-material/Build";
import ChairIcon from "@mui/icons-material/Chair";
import CelebrationIcon from "@mui/icons-material/Celebration";
import Face4Icon from "@mui/icons-material/Face4";
import FortIcon from "@mui/icons-material/Fort";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

// Icons fill the circle
const colorToIconMap = {
  red: <BuildIcon fontSize="large" />,
  green: <AgricultureIcon fontSize="large" />,
  blue: <BathtubIcon fontSize="large" />,
  yellow: <LightbulbIcon fontSize="large" />,
  purple: <AccessTimeIcon fontSize="large" />,
  orange: <CallSplitIcon fontSize="large" />,
  cyan: <EggAltIcon fontSize="large" />,
  magenta: <BalanceIcon fontSize="large" />,
  lime: <BakeryDiningIcon fontSize="large" />,
  pink: <Brightness3Icon fontSize="large" />,
  teal: <CakeIcon fontSize="large" />,
  lavender: <CallIcon fontSize="large" />,
  brown: <ElderlyIcon fontSize="large" />,
  beige: <ChairIcon fontSize="large" />,
  maroon: <CelebrationIcon fontSize="large" />,
  mint: <Face4Icon fontSize="large" />,
  olive: <FortIcon fontSize="large" />,
  coral: <HotelIcon fontSize="large" />,
  navy: <LocalGroceryStoreIcon fontSize="large" />,
};

type CircleProps = {
  color: string;
};

const Circle: React.FC<CircleProps> = ({ color }) => {
  return (
    <Box
      position="absolute"
      w="70%"
      h="70%"
      borderRadius="50%"
      backgroundColor={color}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {colorToIconMap[color as keyof typeof colorToIconMap]}
    </Box>
  );
};

export default Circle;
