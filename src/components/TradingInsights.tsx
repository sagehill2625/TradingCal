import { useState } from "react";
import { Brain, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Trade } from "../types/Trade";
import { OpenAI } from "openai";

interface TradingInsightsProps {
  trades: Trade[];
}

const TradingInsights = ({ trades }: TradingInsightsProps) => {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTradeAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const tradeStats = {
        totalTrades: trades.length,
        winningTrades: trades.filter((t) => t.pnl > 0).length,
        losingTrades: trades.filter((t) => t.pnl < 0).length,
        totalPnL: trades.reduce((sum, t) => sum + t.pnl, 0),
        symbols: [...new Set(trades.map((t) => t.symbol))],
        timeDistribution: trades.reduce((acc: { [key: string]: number }, t) => {
          const hour = new Date(t.boughtTimestamp).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {}),
        averageWin:
          trades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) /
          trades.filter((t) => t.pnl > 0).length,
        averageLoss:
          trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) /
          trades.filter((t) => t.pnl < 0).length,
      };

      const openai = new OpenAI({
        apiKey: "YOUR KEY",
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Analyze this trading data and provide specific, actionable insights for improvement. Format your response in markdown with headers and bullet points:
      
Total Trades: ${tradeStats.totalTrades}
Win Rate: ${((tradeStats.winningTrades / tradeStats.totalTrades) * 100).toFixed(
        1
      )}%
Total P&L: $${tradeStats.totalPnL.toFixed(2)}
Average Win: $${tradeStats.averageWin.toFixed(2)}
Average Loss: $${tradeStats.averageLoss.toFixed(2)}
Risk/Reward Ratio: ${Math.abs(
        tradeStats.averageWin / tradeStats.averageLoss
      ).toFixed(2)}
Most Active Hours: ${Object.entries(tradeStats.timeDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour, count]) => `${hour}:00 (${count} trades)`)
        .join(", ")}
Traded Symbols: ${tradeStats.symbols.join(", ")}

Please provide:
1. Key strengths in the trading strategy
2. Main areas for improvement
3. Specific patterns that need attention
4. Risk management suggestions
5. Actionable steps to improve performance`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
      });

      const analysisText = completion.choices[0]?.message?.content || "";
      setInsights(analysisText);
    } catch (err) {
      setError("Failed to generate insights. Please try again later.");
      console.error("Error generating insights:", err);
    } finally {
      setLoading(false);
    }
  };

  if (trades.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Trading Insights
        </h2>
        <button
          onClick={generateTradeAnalysis}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition-colors`}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze Trades
            </>
          )}
        </button>
      </div>

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {insights && (
        <div className="bg-gray-800 p-6 rounded-lg prose prose-invert max-w-none">
          <ReactMarkdown>{insights}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default TradingInsights;
