import { Center } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <Center mt={50} flexDir="column">
      {children}
    </Center>
  );
};

export default Main;
