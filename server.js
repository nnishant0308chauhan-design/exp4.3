const express = require("express");
const { client, connectRedis } = require("./redisClient");
const { bookSeat } = require("./booking");

const app = express();
app.get("/", (req, res) => {
  res.send("Concurrent Ticket Booking System API is running 🚀");
});
app.use(express.json());

const PORT = 3000;

// Booking API
app.post("/api/book", async (req, res) => {

    const result = await bookSeat();

    res.json(result);
});

async function startServer() {

    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Booking system running on port ${PORT}`);
    });

}
app.get("/api/logs", async (req, res) => {

    const logs = await client.lRange("booking:logs", 0, -1);

    const parsedLogs = logs.map(log => JSON.parse(log));

    res.json({
        totalBookings: parsedLogs.length,
        logs: parsedLogs
    });

});

startServer();