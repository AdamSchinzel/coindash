const shortWalletAddress = (walletAddress: string): string => {
  return `${walletAddress?.slice(0, 5)}...${walletAddress?.slice(-4)}`;
};

export default shortWalletAddress;
