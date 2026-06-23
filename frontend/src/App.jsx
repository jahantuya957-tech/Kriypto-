import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function App() {
  const [signals, setSignals] = useState([]);

  const fetchSignals = async () => {
    try {
      const res = await axios.get(`${API}/api/signals`);
      setSignals(res.data || []);
    } catch (err) {
      console.log("Error fetching signals", err.message);
    }
  };

  useEffect(() => {
    fetchSignals();

    const interval = setInterval(() => {
      fetchSignals();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 Kriypto Trading Dashboard</h1>

      <h3>Live Signals</h3>

      {signals.length === 0 ? (
        <p>No signals yet...</p>
      ) : (
        signals.map((s, i) => (
          <div key={i} style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px"
          }}>
            <h2>{s.symbol} - {s.signal}</h2>
            <p>Score: {s.score}</p>
            <p>Grade: {s.grade}</p>
            <p>Entry: {s.entry_price}</p>
            <p>SL: {s.stop_loss}</p>
            <p>TP: {s.take_profit}</p>
          </div>
        ))
      )}
    </div>
  );
}
