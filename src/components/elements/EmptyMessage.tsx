import { Text } from "@chakra-ui/react";

interface EmptyMessageProps {
  text: string;
}

const EmptyMessage = ({ text }: EmptyMessageProps) => {
  return (
    <Text as="i" my={10} textAlign="center">
      {text}
    </Text>
  );
};

export default EmptyMessage;
