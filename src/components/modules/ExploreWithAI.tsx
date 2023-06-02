import { TOAST_DURATION } from "@/config/constants";
import { fetchEthBalance, fetchPortfoliosAndAggregate } from "@/services/client";
import useWalletsStore from "@/stores/wallets";
import Token from "@/types/token";
import { Box, Button, Center, Flex, Input, Spinner, useToast } from "@chakra-ui/react";
import { Configuration, OpenAIApi } from "openai";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

import EmptyMessage from "../elements/EmptyMessage";

const ExploreWithAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | undefined>("");
  const [tokens, setTokens] = useState<{ aggregatedBalances: Array<Token>; totalValue: number }>({
    aggregatedBalances: [],
    totalValue: 0,
  });
  const [ether, setEther] = useState<{ balance: number; value: number }>({ balance: 0, value: 0 });

  const store = useStore(useWalletsStore, (state) => state);

  const toast = useToast();

  useEffect(() => {
    const fetchTokens = async () => {
      const tokensData = await fetchPortfoliosAndAggregate(store?.wallets);
      const ethBalanceData = await fetchEthBalance(store?.wallets);

      setEther(ethBalanceData);
      setTokens(tokensData);
    };

    try {
      fetchTokens();
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

  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY }));

  const handleAsk = async () => {
    setQuestion("");
    setIsLoading(true);

    const prompt = `Given a crypto portfolio with these tokens: ${JSON.stringify(
      tokens.aggregatedBalances
    )} and this Ethereum balance ${
      ether.balance
    }, answer this question from user: ${question}. When working with currencies use USD. If you answer something that changes during time, write to what day you have knowledge.`;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
      });
      setAnswer(response.data.choices[0].text);
    } catch {
      toast({
        title: "Something went wrong",
        duration: TOAST_DURATION,
        status: "error",
        position: "bottom-right",
        variant: "solid",
      });
    }

    setIsLoading(false);
  };

  return (
    <Flex flexDirection="column">
      <Flex flexDirection={["column", "row", "row"]} width="100%">
        <Input
          disabled={tokens.aggregatedBalances.length === 0}
          placeholder="Ask any question about your portfolio"
          focusBorderColor="teal.500"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <Button
          isDisabled={tokens.aggregatedBalances.length === 0}
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
          <Spinner color="cyan.500" />
        </Center>
      ) : answer ? (
        <Box bg="#FAFAFA" mt={4} p={3} borderRadius={6}>
          {answer}
        </Box>
      ) : (
        tokens.aggregatedBalances.length === 0 && <EmptyMessage text="Connect wallet to get started" />
      )}
    </Flex>
  );
};

export default ExploreWithAI;
