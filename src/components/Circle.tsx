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
  // Set color to stand out over the background
  red: (
    <BuildIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  green: (
    <AgricultureIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  blue: (
    <BathtubIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  yellow: (
    <LightbulbIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  purple: (
    <AccessTimeIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  orange: (
    <CallSplitIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  cyan: (
    <EggAltIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  magenta: (
    <BalanceIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  lime: (
    <BakeryDiningIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  pink: (
    <Brightness3Icon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  teal: (
    <CakeIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  lavender: (
    <CallIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  brown: (
    <ElderlyIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  beige: (
    <ChairIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  maroon: (
    <CelebrationIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
  mint: (
    <Face4Icon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  olive: (
    <FortIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  coral: (
    <HotelIcon
      fontSize="large"
      sx={{
        color: "black",
      }}
    />
  ),
  navy: (
    <LocalGroceryStoreIcon
      fontSize="large"
      sx={{
        color: "white",
      }}
    />
  ),
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
      zIndex="2"
    >
      {colorToIconMap[color as keyof typeof colorToIconMap]}
    </Box>
  );
};

export default Circle;
