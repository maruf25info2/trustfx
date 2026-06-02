const API_KEY =
  "0c125a9be86644bc8af72f9be4ff5e33";

export const fetchMarketData = async () => {
  try {
    const eurResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=EUR/USD&apikey=${API_KEY}`
    );

    const eurusd =
      await eurResponse.json();

    const btcResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${API_KEY}`
    );

    const btc =
      await btcResponse.json();

    const goldResponse = await fetch(
      `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`
    );

    const gold =
      await goldResponse.json();

    return {
      eurusd: eurusd.price,
      btc: btc.price,
      gold: gold.price,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};