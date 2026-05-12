import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart, Legend } from "recharts";

const MULTIPLIER = 2;
const QTY = 5;
const CALL_PREMIUM = 938;
const PUT_PREMIUM = 852;
const STRIKE = 27000;
const CALL_EXIT = 1660;
const PUT_EXIT = 343;

// Total cost paid
const totalPremiumPaid = (CALL_PREMIUM + PUT_PREMIUM) * QTY * MULTIPLIER; // $17,900

// Breakeven points
const upperBreakeven = STRIKE + (CALL_PREMIUM + PUT_PREMIUM); // 27000 + 1790 = 28790
const lowerBreakeven = STRIKE - (CALL_PREMIUM + PUT_PREMIUM); // 27000 - 1790 = 25210

// At expiry payoff (theoretical)
function payoffAtExpiry(price) {
  const callPayoff = Math.max(0, price - STRIKE);
  const putPayoff = Math.max(0, STRIKE - price);
  const netPremium = CALL_PREMIUM + PUT_PREMIUM;
  return (callPayoff + putPayoff - netPremium) * QTY * MULTIPLIER;
}

// Actual exit payoff (what happened)
const actualCallPnl = (CALL_EXIT - CALL_PREMIUM) * QTY * MULTIPLIER; // +$7,220
const actualPutPnl = (PUT_EXIT - PUT_PREMIUM) * QTY * MULTIPLIER;   // -$5,090
const actualTotalPnl = actualCallPnl + actualPutPnl; // +$2,130

// MNQ was around 19,000-19,500 range in late April/early May 2026 — but strike is 27000
// Actually let me use the strike of 27000 and reasonable range
const priceMin = 23000;
const priceMax = 31000;
const step = 100;

const data = [];
for (let p = priceMin; p <= priceMax; p += step) {
  data.push({
    price: p,
    payoff: payoffAtExpiry(p),
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div style={{
        background: "rgba(10,15,30,0.97)",
        border: `1px solid ${val >= 0 ? "#00ffc8" : "#ff4d6d"}`,
        borderRadius: 10,
        padding: "12px 18px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
      }}>
        <div style={{ color: "#8899bb", marginBottom: 4 }}>MNQ Price</div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{Number(label).toLocaleString()}</div>
        <div style={{ color: "#8899bb", marginTop: 8, marginBottom: 4 }}>P&L at Expiry</div>
        <div style={{ color: val >= 0 ? "#00ffc8" : "#ff4d6d", fontWeight: 700, fontSize: 15 }}>
          {val >= 0 ? "+" : ""}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d1f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Rajdhani:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        .fade-in { opacity: 0; transform: translateY(18px); animation: fadeUp 0.7s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .card { animation-delay: 0.1s; }
        .chart-wrap { animation-delay: 0.25s; }
        .stats-row { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <div className="fade-in card" style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #0d1f3c 0%, #0a1628 100%)",
          border: "1px solid #1a3a6e",
          borderRadius: 4,
          padding: "4px 14px",
          color: "#4d9fff",
          fontSize: 11,
          letterSpacing: 3,
          fontWeight: 600,
          marginBottom: 12,
          textTransform: "uppercase",
        }}>CME Group · MNQ Practice Sim</div>
        <h1 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 4px",
          letterSpacing: 1,
        }}>Long Straddle · 27000 Strike</h1>
        <p style={{ color: "#4a6080", fontSize: 13, margin: 0 }}>
          Opened 4/24/2026 &nbsp;·&nbsp; Closed 5/6/2026 &nbsp;·&nbsp; Qty 5 contracts each leg
        </p>
      </div>

      {/* Chart */}
      <div className="fade-in chart-wrap" style={{
        width: "100%",
        maxWidth: 820,
        background: "linear-gradient(160deg, #0b1628 0%, #060d1f 100%)",
        border: "1px solid #1a2e50",
        borderRadius: 16,
        padding: "28px 8px 20px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative grid glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,120,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ paddingLeft: 16, marginBottom: 20 }}>
          <span style={{ color: "#4a6080", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
            Payoff at Expiry vs. Underlying Price
          </span>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffc8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ffc8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0} />
                <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0.22} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#0e1e36" strokeDasharray="4 4" />
            <XAxis
              dataKey="price"
              tickFormatter={v => v.toLocaleString()}
              tick={{ fill: "#3a5070", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#0e1e36" }}
              interval={9}
            />
            <YAxis
              tickFormatter={v => `$${(v/1000).toFixed(0)}k`}
              tick={{ fill: "#3a5070", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Zero line */}
            <ReferenceLine y={0} stroke="#1e3a5f" strokeWidth={1.5} />

            {/* Strike */}
            <ReferenceLine
              x={STRIKE}
              stroke="#4d9fff"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              label={{ value: "Strike 27000", position: "insideTopRight", fill: "#4d9fff", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            />

            {/* Breakevens */}
            <ReferenceLine
              x={upperBreakeven}
              stroke="#ffd700"
              strokeWidth={1}
              strokeDasharray="3 4"
              label={{ value: `BE ${upperBreakeven.toLocaleString()}`, position: "insideTopLeft", fill: "#ffd700", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            />
            <ReferenceLine
              x={lowerBreakeven}
              stroke="#ffd700"
              strokeWidth={1}
              strokeDasharray="3 4"
              label={{ value: `BE ${lowerBreakeven.toLocaleString()}`, position: "insideTopRight", fill: "#ffd700", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            />

            {/* Actual P&L dot */}
            <ReferenceLine
              y={actualTotalPnl}
              stroke="#00ffc8"
              strokeWidth={1}
              strokeDasharray="2 5"
              label={{ value: `Your Exit: +$${actualTotalPnl.toLocaleString()}`, position: "insideTopRight", fill: "#00ffc8", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            />

            <Area
              type="monotone"
              dataKey="payoff"
              stroke="url(#payoffStroke)"
              strokeWidth={2.5}
              fill="url(#profitGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#00ffc8", strokeWidth: 0 }}
              stroke="#00ffc8"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: "flex", gap: 24, paddingLeft: 20, marginTop: 8, flexWrap: "wrap" }}>
          {[
            { color: "#4d9fff", dash: true, label: "Strike Price (27000)" },
            { color: "#ffd700", dash: true, label: "Breakeven Points" },
            { color: "#00ffc8", dash: true, label: "Your Actual Exit P&L" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 22, height: 2, background: color, opacity: 0.85 }} />
              <span style={{ color: "#4a6080", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="fade-in stats-row" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        width: "100%",
        maxWidth: 820,
      }}>
        {[
          { label: "Call Premium Paid", value: `$${(CALL_PREMIUM * QTY * MULTIPLIER).toLocaleString()}`, color: "#4d9fff" },
          { label: "Put Premium Paid", value: `$${(PUT_PREMIUM * QTY * MULTIPLIER).toLocaleString()}`, color: "#4d9fff" },
          { label: "Total Invested", value: `$${totalPremiumPaid.toLocaleString()}`, color: "#a0b8d8" },
          { label: "Call P&L", value: `+$${actualCallPnl.toLocaleString()}`, color: "#00ffc8" },
          { label: "Put P&L", value: `-$${Math.abs(actualPutPnl).toLocaleString()}`, color: "#ff4d6d" },
          { label: "Net Return", value: `+11.9%`, color: "#00ffc8" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "linear-gradient(145deg, #0b1628, #060d1f)",
            border: "1px solid #1a2e50",
            borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{ color: "#3a5070", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
            <div style={{ color, fontWeight: 700, fontSize: 18, fontFamily: "'Rajdhani', sans-serif" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ color: "#1e3a5f", fontSize: 10, marginTop: 28, letterSpacing: 1 }}>
        PRACTICE SIMULATOR · NOT FINANCIAL ADVICE
      </div>
    </div>
  );
}
