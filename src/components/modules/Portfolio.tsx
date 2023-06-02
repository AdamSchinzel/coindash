import { TOAST_DURATION } from "@/config/constants";
import { fetchEthBalance, fetchPortfoliosAndAggregate } from "@/services/client";
import useWalletsStore from "@/stores/wallets";
import Token from "@/types/token";
import roundToTwoDigits from "@/utils/roundToTwoDigitis";
import { Center, Spinner, Stat, StatHelpText, StatLabel, StatNumber, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

import EmptyMessage from "../elements/EmptyMessage";
import TokenItem from "../elements/TokenItem";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<{ aggregatedBalances: Array<Token>; totalValue: number }>({
    aggregatedBalances: [],
    totalValue: 0,
  });
  const [ether, setEther] = useState<{ balance: number; value: number }>({ balance: 0, value: 0 });

  const store = useStore(useWalletsStore, (state) => state);

  const toast = useToast();

  useEffect(() => {
    const fetchBalances = async () => {
      const tokensData = await fetchPortfoliosAndAggregate(store?.wallets);
      const ethBalanceData = await fetchEthBalance(store?.wallets);

      setEther(ethBalanceData);
      setTokens(tokensData);
    };

    try {
      setIsLoading(true);
      fetchBalances();
    } catch (error) {
      toast({
        title: "Something went wrong",
        duration: TOAST_DURATION,
        status: "error",
        position: "bottom-right",
        variant: "solid",
      });
    } finally {
      setIsLoading(false);
    }
  }, [store?.wallets]);

  return (
    <>
      <Stat mb={3}>
        <StatLabel fontSize="xl">Total portfolio value</StatLabel>
        <StatNumber>${roundToTwoDigits(ether.value + tokens.totalValue) || " -"}</StatNumber>
        <StatHelpText></StatHelpText>
      </Stat>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        Assets
      </Text>
      {isLoading ? (
        <Center my={18}>
          <Spinner color="teal.500" />
        </Center>
      ) : tokens.aggregatedBalances.length === 0 ? (
        <Center my={8}>
          <EmptyMessage text="No assets" />
        </Center>
      ) : (
        <VStack gap={1}>
          {ether.balance > 0 && (
            <TokenItem name="Ethereum" symbol="ETH" contractAddress="" balance={ether.balance} price={ether.value} />
          )}
          {tokens.aggregatedBalances.map((token, i) => (
            <TokenItem
              key={i}
              name={token.name}
              symbol={token.symbol}
              contractAddress={token.contractAddress}
              balance={token.balance}
              price={token.price}
            />
          ))}
        </VStack>
      )}
    </>
  );
};

export default Portfolio;
