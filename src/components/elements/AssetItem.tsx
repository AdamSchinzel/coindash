import Asset from "@/types/Asset";
import roundToTwoDigits from "@/utils/roundToTwoDigitis";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Flex, Link, Text } from "@chakra-ui/react";

const AssetItem = ({ name, symbol, contractAddress, balance, price }: Asset) => {
  return (
    <Flex justifyContent="flex-start" width="100%">
      <Flex flex={1}>
        <Text mr={2}>{`${name}`}</Text>
        {contractAddress && (
          <Link href={`https://etherscan.io/address/${contractAddress}`} target="_blank">
            <ExternalLinkIcon cursor="pointer" />
          </Link>
        )}
      </Flex>
      <Text>{`${roundToTwoDigits(balance)} ${symbol} (${roundToTwoDigits(price) || "-"} USD)`}</Text>
    </Flex>
  );
};

export default AssetItem;
