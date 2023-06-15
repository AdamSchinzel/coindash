import { CRYPTO_COMPARE_API_URL, ETHERSCAN_API_URL } from "@/config/constants";
import Asset from "@/types/Asset";
import weiToEther from "@/utils/weiToEther";
import axios from "axios";

/**
 * Fetches asset transactions data for a given wallet address from the Etherscan API
 * @param address - The wallet address
 * @returns An array of asset transaction objects
 */
const fetchAssetData = async (address: string) => {
  const result = await axios.get(
    `${ETHERSCAN_API_URL}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
  return result.data.result;
};

/**
 * Fetches the current price of a asset in USD via CryptoCompare API
 * @param symbol - The asset symbol (e.g. "ETH")
 * @returns The price of the asset in USD
 */
const fetchAssetPrice = async (symbol: string): Promise<number> => {
  const result = await axios.get(`${CRYPTO_COMPARE_API_URL}/data/price?fsym=${symbol}&tsyms=USD`);
  return result.data.USD;
};

/**
 * Aggregates asset balances and prices of an array of assets of each wallet address
 * @param walletsAddresses - An array of assets of each wallet address
 * @returns An array of all asset and the total value
 */
const aggregateData = async (walletsAddresses: Array<string>) => {
  const aggregatedBalances: Array<Asset> = [];

  let totalValue = 0;

  for (const wallet of walletsAddresses) {
    const walletArray = Array.isArray(wallet) ? wallet : [wallet];

    for (const asset of walletArray) {
      const balance = parseFloat(asset.value) / 10 ** parseInt(asset.tokenDecimal);

      const existingAssetIndex = aggregatedBalances.findIndex(
        (asset: Asset) => asset.contractAddress === asset.contractAddress
      );

      const price = (await fetchAssetPrice(asset.tokenSymbol)) * balance;

      if (existingAssetIndex > -1) {
        aggregatedBalances[existingAssetIndex].balance += balance;
        aggregatedBalances[existingAssetIndex].price += price;
      } else {
        aggregatedBalances.push({
          symbol: asset.tokenSymbol,
          name: asset.tokenName,
          contractAddress: asset.contractAddress,
          balance: balance,
          price: price,
        });
      }

      if (price) {
        totalValue += price;
      }
    }
  }

  return { aggregatedBalances, totalValue };
};

/**
 * Fetches portfolio data for a list of wallet addresses and aggregates the result
 * @param walletsAddresses - An array of wallet addresses
 * @returns An array of aggregated Asset objects
 */
export const fetchPortfoliosAndAggregate = async (walletsAddresses: Array<string>) => {
  const walletData = await Promise.all(walletsAddresses.map(fetchAssetData));
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
    `${ETHERSCAN_API_URL}/api?module=account&action=balancemulti&address=${addresses}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  let totalBalance = 0;

  for (const address of result.data.result) {
    totalBalance += parseFloat(address.balance);
  }

  const balance = weiToEther(totalBalance);
  const value = (await fetchAssetPrice("ETH")) * balance;

  return { balance, value };
};
