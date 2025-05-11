const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: false,
    rejectUnauthorized: false,
  },
});

// Ensure Redis connects once on app start
client.connect().then(() => {
  console.log("🟢 Redis connected");
}).catch((err) => {
  console.error("🔴 Redis connection error:", err);
});

module.exports = async function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate-limit:${ip}`;

  try {
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, 60); // 60s window
    }
    if (count > 10) {
      return res.status(429).json({ error: "Too many requests. Please wait." });
    }
    next();
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ error: "Server error" });
  }
};