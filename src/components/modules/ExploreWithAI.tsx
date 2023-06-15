import { TOAST_DURATION } from "@/config/constants";
import { fetchEthBalance, fetchPortfoliosAndAggregate } from "@/services/client";
import useWalletsStore from "@/stores/useWalletsStore";
import Asset from "@/types/Asset";
import { Box, Button, Center, Flex, Input, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

import EmptyMessage from "../elements/EmptyMessage";

const ExploreWithAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | undefined>("");
  const [assets, setAssets] = useState<{ aggregatedBalances: Array<Asset>; totalValue: number }>({
    aggregatedBalances: [],
    totalValue: 0,
  });
  const [ether, setEther] = useState<{ balance: number; value: number }>({ balance: 0, value: 0 });

  const store = useStore(useWalletsStore, (state) => state);

  const toast = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      const assetsData = await fetchPortfoliosAndAggregate(store?.wallets);
      const ethBalanceData = await fetchEthBalance(store?.wallets);

      setEther(ethBalanceData);
      setAssets(assetsData);
    };

    try {
      fetchAssets();
    } catch (error) {
      toast({
        title: "Something went wrong",
        duration: TOAST_DURATION,
        status: "error",
        position: "bottom-right",
        variant: "solid",
      });
    }
  }, [store?.wallets]);

  const handleAsk = async () => {
    setIsLoading(true);

    const prompt = `Given a crypto portfolio with these tokens: ${JSON.stringify(
      assets.aggregatedBalances
    )} and this Ethereum balance ${
      ether.balance
    }, answer this question from user: ${question}. When working with currencies use USD. If you answer something that changes during time, write to what day you have knowledge.`;

    try {
      const response = await axios.post(
        "/api/generate-answer",
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.data;

      setAnswer(data?.answer);
    } catch (err) {
      console.error(err);
      toast({
        title: "There was an error",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={["column", "row", "row"]} width="100%">
        <Input
          disabled={assets.aggregatedBalances.length === 0}
          placeholder="Ask any question about your portfolio"
          focusBorderColor="teal.500"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <Button
          isDisabled={assets.aggregatedBalances.length === 0}
          variant="outline"
          colorScheme="teal"
          ml={[0, 2, 2]}
          mt={[2, 0, 0]}
          px={8}
          onClick={() => handleAsk()}>
          Ask
        </Button>
      </Flex>
      {isLoading ? (
        <Center my={18}>
          <Spinner color="teal.500" />
        </Center>
      ) : answer ? (
        <Box bg="#FAFAFA" mt={4} p={3} borderRadius={6}>
          {answer}
        </Box>
      ) : (
        assets.aggregatedBalances.length === 0 && <EmptyMessage text="Connect wallet to get started" />
      )}
    </Flex>
  );
};

export default ExploreWithAI;
