import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Text, Tooltip, VStack } from "@chakra-ui/react";

interface HeadingProps {
  text: string;
  description: string;
}

const Heading = ({ text, description }: HeadingProps) => {
  return (
    <VStack>
      <Text fontSize="3xl" fontWeight="black">
        {text}
      </Text>
      <Text fontSize="lg" fontWeight="semibold" textAlign="center" px={4}>
        {description}
        <Tooltip label="We track assets just on Ethereum mainnet" placement="bottom">
          <InfoOutlineIcon ml={2} />
        </Tooltip>
      </Text>
    </VStack>
  );
};

export default Heading;
