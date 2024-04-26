import { Box } from "@chakra-ui/react";

type ArrowTileProps = {
  rotation: number;
};

export const ArrowTile = ({ rotation }: ArrowTileProps) => (
  <Box w="100%" h="100%" position="absolute">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <radialGradient
        id="radialGradient1"
        cx="499.096304"
        cy="106.165464"
        r="774.922645"
        fx="499.096304"
        fy="106.165464"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00ffc9" stop-opacity="1" />
        <stop offset="1" stop-color="#9ba600" stop-opacity="1" />
      </radialGradient>
      <path
        id="Parallelogram-copy"
        fill="url(#radialGradient1)"
        fill-rule="evenodd"
        stroke="#ffffff"
        stroke-width="23.987926"
        stroke-linecap="square"
        stroke-linejoin="round"
        d="M 426.001953 899.035156 L 426.001953 781.849609 C 346.206085 853.496948 239.456299 897.34375 123.09375 897.34375 L 123.09375 800.566406 C 274.537384 800.566406 383.837524 716.467285 426.001953 590.320313 L 426.001953 305.615234 L 123.09375 467.251953 L 123.09375 312.775391 L 500.046875 101.375 L 877 312.775391 L 877 467.251953 L 574.091797 305.615234 L 574.091797 581.949219 C 613.80481 712.733215 723.588074 800.566406 877 800.566406 L 877 897.34375 C 760.361755 897.34375 653.467346 852.506409 574.091797 779.423828 L 574.091797 899.035156 L 426.001953 899.035156 Z"
      />
    </svg>
  </Box>
);
