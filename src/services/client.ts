import { CRYPTO_COMPARE_API_URL, ETHERSCAN_API_URL } from "@/config/constants";
import Token from "@/types/token";
import weiToEther from "@/utils/weiToEther";
import axios from "axios";

/**
 * Fetches token transactions data for a given wallet address from the Etherscan API
 * @param address - The wallet address
 * @returns An array of token transaction objects
 */
const fetchTokenData = async (address: string) => {
  const result = await axios.get(
    `${ETHERSCAN_API_URL}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  );
  return result.data.result;
};

/**
 * Fetches the current price of a token in USD via CryptoCompare API
 * @param symbol - The token symbol (e.g. "ETH")
 * @returns The price of the token in USD
 */
const fetchTokenPrice = async (symbol: string): Promise<number> => {
  const result = await axios.get(`${CRYPTO_COMPARE_API_URL}/data/price?fsym=${symbol}&tsyms=USD`);
  return result.data.USD;
};

/**
 * Aggregates token balances and prices of an array of wallet addresses
 * @param walletsAddresses - An array of wallet addresses
 * @returns An array of all tokens and the total value
 */
const aggregateData = async (walletsAddresses: Array<string>) => {
  const aggregatedBalances: Array<Token> = [];

  let totalValue = 0;

  for (const wallet of walletsAddresses) {
    const walletArray = Array.isArray(wallet) ? wallet : [wallet];

    for (const token of walletArray) {
      const balance = parseFloat(token.value) / 10 ** parseInt(token.tokenDecimal);

      const existingTokenIndex = aggregatedBalances.findIndex((t) => t.symbol === token.tokenSymbol);

      if (existingTokenIndex > -1) {
        aggregatedBalances[existingTokenIndex].balance += balance;
      } else {
        aggregatedBalances.push({
          symbol: token.tokenSymbol,
          name: token.tokenName,
          contractAddress: token.contractAddress,
          balance: balance,
          price: (await fetchTokenPrice(token.tokenSymbol)) * balance,
        });
      }

      totalValue += balance;
    }
  }

  return { aggregatedBalances, totalValue };
};

/**
 * Fetches portfolio data for a list of wallet addresses and aggregates the result
 * @param walletsAddresses - An array of wallet addresses
 * @returns An array of aggregated Token objects
 */
export const fetchPortfoliosAndAggregate = async (walletsAddresses: Array<string>) => {
  const walletData = await Promise.all(walletsAddresses.map(fetchTokenData));
  const aggregatedBalances = await aggregateData(walletData);
  return aggregatedBalances;
};

/**
 * Fetches the Ether balance and price for an array of Ethereum addresses.
 *
 * @param addresses - The array of Ethereum addresses to fetch the balance for
 * @returns The ether balance and price converted for the provided addresses
 */
export const fetchEthBalance = async (addresses: Array<string>) => {
  const result = await axios.get(
    `${ETHERSCAN_API_URL}/api?module=account&action=balancemulti&address=${addresses}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  );

  let totalBalance = 0;

  for (const address of result.data.result) {
    totalBalance += parseFloat(address.balance);
  }

  const balance = weiToEther(totalBalance);
  const value = (await fetchTokenPrice("ETH")) * balance;

  return { balance, value };
};
