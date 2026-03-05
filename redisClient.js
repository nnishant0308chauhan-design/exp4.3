const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  await client.connect();
  console.log("Connected to Redis");
}

module.exports = { client, connectRedis };