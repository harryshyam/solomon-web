"use client";

import React, { useState } from "react";
import { 
  TrendingUp, Wallet, Search, ShieldCheck, Trophy, 
  BarChart3, PlusCircle, CheckCircle2, DollarSign, RefreshCw 
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Market {
  id: number;
  question: string;
  category: string;
  volume: string;
  yesPrice: number; // 0 to 100 cents
  noPrice: number;
  endTime: string;
  resolved: boolean;
  outcome?: "YES" | "NO";
}

interface Position {
  marketId: number;
  question: string;
  type: "YES" | "NO";
  shares: number;
  avgPrice: number;
}

const INITIAL_MARKETS: Market[] = [
  {
    id: 1,
    question: "Will Bitcoin reach $100,000 before end of 2026?",
    category: "Crypto",
    volume: "$1,245,000",
    yesPrice: 68,
    noPrice: 32,
    endTime: "Dec 31, 2026",
    resolved: false
  },
  {
    id: 2,
    question: "Will Manchester United win their next Premier League match?",
    category: "Sports",
    volume: "$480,200",
    yesPrice: 54,
    noPrice: 46,
    endTime: "Oct 05, 2026",
    resolved: false
  },
  {
    id: 3,
    question: "Will the US Federal Reserve cut interest rates in Q4 2026?",
    category: "Macro",
    volume: "$890,000",
    yesPrice: 82,
    noPrice: 18,
    endTime: "Nov 15, 2026",
    resolved: false
  }
];

export default function SolomonApp() {
  const [activeTab, setActiveTab] = useState<"markets" | "portfolio" | "admin">("markets");
  const [category, setCategory] = useState<string>("All");
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [positions, setPositions] = useState<Position[]>([]);
  
  // Mock User Account Balance (Zero real tokens needed)
  const [balance, setBalance] = useState<number>(1000.00); // $1,000 Mock USDC
  const [tradeAmount, setTradeAmount] = useState<number>(50);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<"YES" | "NO">("YES");

  // Admin New Market Form
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("Crypto");

  // Execute Mock Trade
  const handleBuy = (market: Market, outcome: "YES" | "NO") => {
    if (balance < tradeAmount) {
      alert("Insufficient mock USDC balance!");
      return;
    }

    const price = outcome === "YES" ? market.yesPrice : market.noPrice;
    const shares = Math.floor((tradeAmount / (price / 100)));

    setBalance(prev => prev - tradeAmount);

    setPositions(prev => {
      const existing = prev.find(p => p.marketId === market.id && p.type === outcome);
      if (existing) {
        return prev.map(p => 
          p.marketId === market.id && p.type === outcome
            ? { ...p, shares: p.shares + shares }
            : p
        );
      }
      return [...prev, { marketId: market.id, question: market.question, type: outcome, shares, avgPrice: price }];
    });

    alert(`Successfully bought ${shares} ${outcome} shares in "${market.question}" for $${tradeAmount}!`);
    setSelectedMarket(null);
  };

  // Admin Create Market
  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion) return;

    const newMkt: Market = {
      id: markets.length + 1,
      question: newQuestion,
      category: newCategory,
      volume: "$0",
      yesPrice: 50,
      noPrice: 50,
      endTime: "Dec 31, 2026",
      resolved: false
    };

    setMarkets([...markets, newMkt]);
    setNewQuestion("");
    alert("New prediction market created!");
  };

  const filteredMarkets = category === "All" 
    ? markets 
    : markets.filter(m => m.category === category);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-[#0d1322] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-bold text-xl text-slate-950 shadow-lg shadow-amber-500/20">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
            SOLOMON
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 bg-[#141c2e] p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab("markets")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "markets" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Markets
          </button>
          <button 
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "portfolio" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Portfolio ({positions.length})
          </button>
          <button 
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "admin" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Create Market
          </button>
        </nav>

        {/* Balance & Live Web3 Wallet Header */}
        <div className="flex items-center gap-4">
          <div className="bg-[#141c2e] border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-400">Mock USDC:</span>
            <span className="text-base font-bold text-amber-400">${balance.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => setBalance(1000)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 transition flex items-center gap-1"
            title="Reset Mock Balance"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>

          {/* RainbowKit Connect Wallet Button */}
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === "markets" && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {["All", "Crypto", "Sports", "Macro", "Tech"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                    category === cat 
                      ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                      : "bg-[#141c2e] border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Market Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((m) => (
                <div key={m.id} className="bg-[#141c2e] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                      <span className="bg-slate-800/80 px-2.5 py-1 rounded-md text-amber-400 font-medium">{m.category}</span>
                      <span>Vol: {m.volume}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-4 leading-snug">{m.question}</h3>
                  </div>

                  <div>
                    {/* Probabilities Bar */}
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-emerald-400">YES {m.yesPrice}¢</span>
                      <span className="text-rose-400">NO {m.noPrice}¢</span>
                    </div>
                    <div className="w-full bg-rose-500/20 h-2.5 rounded-full overflow-hidden flex mb-5">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${m.yesPrice}%` }} />
                    </div>

                    {/* Quick Trade Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { setSelectedMarket(m); setSelectedOutcome("YES"); }}
                        className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold py-2.5 rounded-xl transition"
                      >
                        Buy YES ({m.yesPrice}¢)
                      </button>
                      <button 
                        onClick={() => { setSelectedMarket(m); setSelectedOutcome("NO"); }}
                        className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-bold py-2.5 rounded-xl transition"
                      >
                        Buy NO ({m.noPrice}¢)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio View */}
        {activeTab === "portfolio" && (
          <div className="bg-[#141c2e] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
              <BarChart3 className="w-5 h-5" /> Your Active Positions
            </h2>
            {positions.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">No active positions yet. Buy shares in the Markets tab!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">Market</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Shares</th>
                      <th className="pb-3">Avg Price</th>
                      <th className="pb-3">Est. Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((p, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 text-slate-200">
                        <td className="py-3 font-medium">{p.question}</td>
                        <td className={`py-3 font-bold ${p.type === "YES" ? "text-emerald-400" : "text-rose-400"}`}>{p.type}</td>
                        <td className="py-3">{p.shares}</td>
                        <td className="py-3">{p.avgPrice}¢</td>
                        <td className="py-3 font-bold text-amber-400">${p.shares.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Admin Create Market View */}
        {activeTab === "admin" && (
          <div className="bg-[#141c2e] border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
              <PlusCircle className="w-5 h-5" /> Create New Prediction Market
            </h2>
            <form onSubmit={handleCreateMarket} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Market Question</label>
                <input 
                  type="text"
                  placeholder="e.g. Will ETH break $4,000 this month?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Crypto">Crypto</option>
                  <option value="Sports">Sports</option>
                  <option value="Macro">Macro</option>
                  <option value="Tech">Tech</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition"
              >
                Publish Market
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Trade Execution Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#141c2e] border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2 text-slate-100">{selectedMarket.question}</h3>
            <p className="text-xs text-slate-400 mb-4">Outcome Selected: <span className={selectedOutcome === "YES" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{selectedOutcome}</span></p>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Investment Amount (Mock USDC)</label>
              <input 
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Number(e.target.value))}
                className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-4 py-2 text-amber-400 font-bold text-lg"
              />
            </div>

            <div className="bg-[#0d1322] p-3 rounded-xl mb-6 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Est. Shares:</span>
                <span className="text-slate-200 font-bold">{Math.floor(tradeAmount / ((selectedOutcome === "YES" ? selectedMarket.yesPrice : selectedMarket.noPrice) / 100))}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Max Return:</span>
                <span className="text-emerald-400 font-bold">${(tradeAmount / ((selectedOutcome === "YES" ? selectedMarket.yesPrice : selectedMarket.noPrice) / 100)).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedMarket(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold text-sm text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleBuy(selectedMarket, selectedOutcome)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 py-2.5 rounded-xl font-bold text-sm text-slate-950"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}