import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "./components/Grid";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="black"
      h="100vh"
    >
      <Grid
        size={5}
        puzzle={[
          { color: "red", x: 0, y: 0 },
          {
            color: "red",
            x: 3,
            y: 3,
          },
        ]}
      />
    </Box>
  );
}

export default App;
