const redis = require("redis");

const client = redis.createClient();

client.on("error", (err) => {
    console.log("Redis Error:", err);
});

async function connectRedis() {
    await client.connect();
    console.log("Connected to Redis");
}

module.exports = { client, connectRedis };