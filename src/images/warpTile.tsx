import { Box } from "@chakra-ui/react";

export const WarpTile = () => (
  <Box w="70%" h="70%" position="absolute" animation="spin 5s linear infinite">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <radialGradient
        id="radialGradient3"
        cx="128.035402"
        cy="128.014446"
        r="104.933785"
        fx="128.035402"
        fy="128.014446"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0.707107 -0.707107 0.707107 0.707107 -53.074064 127.977331)"
      >
        <stop offset="0" stop-color="#000000" stop-opacity="1" />
        <stop offset="0.334896" stop-color="#014741" stop-opacity="1" />
        <stop offset="0.698271" stop-color="#292b88" stop-opacity="1" />
        <stop offset="1" stop-color="#b46a8e" stop-opacity="1" />
      </radialGradient>
      <path
        id="Rounded-Rectangle"
        fill="url(#radialGradient3)"
        fill-rule="evenodd"
        stroke="none"
        d="M 87.862419 237.292755 C 109.999565 259.429901 145.890976 259.429901 168.028122 237.292755 L 237.183304 168.137589 C 259.320435 146.000427 259.320435 110.109024 237.183304 87.971878 L 168.028122 18.816711 C 145.890976 -3.320435 109.999565 -3.320435 87.862419 18.816711 L 18.707243 87.971878 C -3.429905 110.109024 -3.429905 146.000427 18.707243 168.137589 Z"
      />
    </svg>
  </Box>
);
