import { useEffect } from "react";

export default function LiveTicker() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "FOREXCOM:EURUSD",
          title: "EUR/USD",
        },
        {
          proName: "FOREXCOM:GBPUSD",
          title: "GBP/USD",
        },
        {
          proName: "OANDA:XAUUSD",
          title: "Gold",
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin",
        },
        {
          proName: "NASDAQ:NDX",
          title: "NASDAQ",
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "light",
      locale: "en",
    });

    const container =
      document.getElementById(
        "tradingview-ticker"
      );

    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-white border-b">
      <div
        id="tradingview-ticker"
        className="tradingview-widget-container"
      />
    </div>
  );
}