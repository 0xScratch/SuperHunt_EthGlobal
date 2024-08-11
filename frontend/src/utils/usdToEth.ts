import { PriceServiceConnection, PriceFeed } from "@pythnetwork/price-service-client";

const connection = new PriceServiceConnection("https://hermes.pyth.network");

const priceIds: string[] = [
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
];

const getEthPriceInUsd = async (): Promise<number> => {
  try {
    const priceFeeds: PriceFeed[] = await connection.getLatestPriceFeeds(priceIds) as PriceFeed[];
    // console.log('Fetched price feeds:', priceFeeds); // Log the fetched price feeds

    const ethPriceFeed = priceFeeds.find(feed => feed.id === "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"); // Remove 0x prefix
    if (!ethPriceFeed) {
      throw new Error('ETH/USD price feed not found');
    }

    // Use type assertion to access the price property
    const ethPrice = (ethPriceFeed as any).price.price * Math.pow(10, (ethPriceFeed as any).price.expo);
    return ethPrice;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    throw error;
  }
};

export const convertUsdToEth = async (usdAmount: number): Promise<number> => {
  try {
    const ethPriceInUsd = await getEthPriceInUsd();
    const ethAmount = usdAmount / ethPriceInUsd;
    return ethAmount;
  } catch (error) {
    console.error('Error converting USD to ETH:', error);
    throw error;
  }
};

// // Example usage
// convertUsdToEth(100.56).then(ethAmount => {
//   console.log(`$100.56 is approximately ${ethAmount} ETH`);
// }).catch(err => {
//   console.error('Error converting USD to ETH:', err);
// });