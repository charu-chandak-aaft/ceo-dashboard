const cron = require("node-cron");
const fetch = require("node-fetch");

console.log("⏳ Cron service started...");

cron.schedule("0 5 * * *", async () => {
  console.log("🚀 Running cron job at 5 AM...");
  try {
    const response = await fetch("http://br.aaft.com/api/attendance-sync");
    const data = await response.json();
    console.log("✅ API Response:", data);
  } catch (error) {
    console.error("❌ API call failed:", error);
  }
});
