import { Box, ChakraProvider, Container } from "@chakra-ui/react";
import Axios from "axios";
import Upload from "./components/Upload";

Axios.defaults.baseURL = "http://localhost:4000";

function App() {
  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        w="100%"
      >
          <Upload />
      </Box>
    </ChakraProvider>
  );
}

export default App;
