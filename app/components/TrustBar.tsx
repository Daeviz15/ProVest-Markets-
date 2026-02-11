"use client";

export default function TrustBar() {
  const currencies = [
    { name: "Bitcoin", symbol: "BTC", color: "#F7931A", icon: "/btc.jpg" },
    { name: "Ethereum", symbol: "ETH", color: "#627EEA", icon: "/eth.png" },
    { name: "Litecoin", symbol: "LTC", color: "#345D9D", icon: "/litecoin.png" },
    { name: "Polkadot", symbol: "DOT", color: "#E6007A", icon: "/polkadot.png" },
    { name: "Solana", symbol: "SOL", color: "#14F195", icon: "/solana.jpg" },
    { name: "Chainlink", symbol: "LINK", color: "#2A5ADA", icon: "/chainlink.png" },
  ];

  // Duplicate the list for seamless infinite scroll
  const marqueeItems = [...currencies, ...currencies];

  return (
    <section className="relative bg-bg-primary pt-8 pb-16 overflow-hidden">
      {/* Decorative gradient masks for smooth fade in/out at edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-scroll hover:[animation-play-state:paused] cursor-default">
        {marqueeItems.map((crypto, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 px-12 opacity-40 hover:opacity-100 transition-opacity duration-300 transition-all group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 p-1.5 transition-all relative">
              {/* Brand Aura Glow */}
              <div 
                className="absolute inset-2 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full pointer-events-none"
                style={{ backgroundColor: crypto.color }}
              />
              <img
                src={crypto.icon}
                alt={crypto.name}
                className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-300 relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=${crypto.color.replace("#", "")}&color=fff`;
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[18px] font-bold tracking-tight uppercase font-space">
                {crypto.name}
              </span>
              <span className="text-text-muted text-[13px] font-medium font-space">
                {crypto.symbol}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
