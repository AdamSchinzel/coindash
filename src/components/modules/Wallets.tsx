import { ETH_ADDRESS_REGEX, TOAST_DURATION } from "@/config/constants";
import useStore from "@/hooks/useStore";
import useWalletsStore from "@/stores/wallets";
import shortWalletAddress from "@/utils/shortWalletAddress";
import { Badge, Button, Flex, HStack, Icon, Input, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FiX } from "react-icons/fi";

import EmptyMessage from "../elements/EmptyMessage";

const Wallets = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const store = useStore(useWalletsStore, (state) => state);

  const toast = useToast();

  const handleAddWallet = () => {
    if (store?.wallets.includes(walletAddress)) {
      toast({
        title: "Wallet already added",
        duration: TOAST_DURATION,
        status: "error",
        position: "bottom-right",
        variant: "solid",
      });
      return;
    }

    if (!ETH_ADDRESS_REGEX.test(walletAddress)) {
      toast({
        title: "Invalid wallet address",
        duration: TOAST_DURATION,
        status: "error",
        position: "bottom-right",
        variant: "solid",
      });
      return;
    }
    store?.addWallet(walletAddress);
    setWalletAddress("");

    toast({
      title: "Wallet added",
      duration: TOAST_DURATION,
      status: "success",
      position: "bottom-right",
      variant: "solid",
    });
  };

  const handleDeleteWallet = (wallet: string) => {
    store?.deleteWallet(wallet);
    toast({
      title: "Wallet deleted",
      duration: TOAST_DURATION,
      status: "success",
      position: "bottom-right",
      variant: "solid",
    });
  };

  return (
    <Flex width={["96%", "96%", "70%", "60%"]} flexDirection="column" justifyContent="center" alignItems="center">
      <Text fontSize="lg" fontWeight="medium" mt={35}>
        Connected wallets
      </Text>
      {store?.wallets.length === 0 ? (
        <EmptyMessage text="No wallets connected" />
      ) : (
        <HStack gap={2} flexWrap="wrap" my="37.2px">
          {store?.wallets.map((wallet, i) => (
            <Badge py={1} px={2} alignItems="center" fontSize="sm" colorScheme="teal" key={i}>
              {shortWalletAddress(wallet)}
              <Icon
                as={FiX}
                cursor="pointer"
                w={4}
                h={4}
                ml={2}
                position="relative"
                top={0.5}
                color="#234E52"
                onClick={() => handleDeleteWallet(wallet)}
              />
            </Badge>
          ))}
        </HStack>
      )}
      <Flex flexDirection={["column", "row", "row"]} width="100%">
        <Input
          placeholder="Wallet address"
          focusBorderColor="teal.500"
          onChange={(e) => setWalletAddress(e.target.value)}
          value={walletAddress}
        />
        <Button colorScheme="teal" ml={[0, 2, 2]} mt={[2, 0, 0]} px={8} onClick={() => handleAddWallet()}>
          Add wallet
        </Button>
      </Flex>
    </Flex>
  );
};

export default Wallets;
