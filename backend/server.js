import app from "./app.js";
import dotenv from "dotenv";
import { runScanner } from "./services/scanner.service.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * RUN SCANNER LOOP
 */
const startScannerLoop = async () => {
  console.log("🚀 Scanner Loop Started");

  setInterval(async () => {
    console.log("🔄 Running Market Scan...");

    try {
      const signals = await runScanner();

      console.log(`✅ Scan Complete - Signals: ${signals.length}`);
    } catch (err) {
      console.error("❌ Scanner Error:", err.message);
    }

  }, 60 * 1000); // every 60 seconds
};

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // start auto scanner
  startScannerLoop();
});
