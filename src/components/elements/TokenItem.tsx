import Token from "@/types/token";
import roundToTwoDigits from "@/utils/roundToTwoDigitis";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

const TokenItem = ({ name, symbol, contractAddress, balance, price }: Token) => {
  return (
    <Flex justifyContent="flex-start" width="100%">
      <Flex flex={1}>
        <Text display={["none", "inline", "inline", "inline"]}>{`${name}`}</Text>
        <Text mr={2}>&nbsp;{`(${symbol})`}</Text>
        {contractAddress && (
          <Link href={`https://etherscan.io/address/${contractAddress}`} target="_blank">
            <ExternalLinkIcon cursor="pointer" />
          </Link>
        )}
      </Flex>
      <Text>{`${roundToTwoDigits(balance)} (${roundToTwoDigits(price) || "-"} USD)`}</Text>
    </Flex>
  );
};

export default TokenItem;
