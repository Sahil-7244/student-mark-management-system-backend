import { PrismaClient } from "@prisma/client";


declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db = new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

const MAX_RETRIES = 5;
const DELAY_MS = 1000;
const MONITOR_INTERVAL = 10_000; // 10s background check
const RECONNECT_DELAY = 5000; // 5s retry on reconnect

async function CheckDbConnection() {
  let connected = false;
  let attempts = 0;
  while (!connected && attempts < MAX_RETRIES) {
    try {
      await db.$connect();
      connected = true;
      console.log("✅ Postgres DB Connected");
      startConnectionMonitor(); // start auto-monitor
    } catch (error) {
      attempts++;
      console.error(`❌ Attempt ${attempts}: Failed to connect. Retrying in ${DELAY_MS}ms`,error);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }
  if (!connected) {
    console.error('❌ Could not connect to the database after multiple attempts.');
    // throw new Error('❌ Could not connect to the database after multiple attempts.');
    startConnectionMonitor(); // start auto-monitor
  }
}

// ✅ Background monitor — check if DB still alive
function startConnectionMonitor() {
  setInterval(async () => {
    try {
      await db.$queryRaw`SELECT 1`; // lightweight heartbeat
    } catch (err) {
      console.warn("⚠️ Lost DB connection. Trying to reconnect...");
      startAutoReconnect();
    }
  }, MONITOR_INTERVAL);
}

// ✅ Auto-reconnect loop (runs forever until reconnected)
async function startAutoReconnect() {
  let connected = false;
  while (!connected) {
    try {
      await db.$connect();
      connected = true;
      if(connected){
        console.log("🔄 Reconnected to Postgres successfully!");
      }
    } catch {
      console.warn("⚠️ Reconnect failed. Retrying in 5s...");
      await new Promise((r) => setTimeout(r, RECONNECT_DELAY));
    }
  }
}


CheckDbConnection();

export default db;
