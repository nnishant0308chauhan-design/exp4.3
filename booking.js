const { client } = require("./redisClient");

async function bookSeat() {

    const totalKey = "tickets:remaining";

    let remaining = await client.get(totalKey);

    if (!remaining) {
        await client.set(totalKey, 100);
        remaining = 100;
    }

    remaining = parseInt(remaining);

    if (remaining <= 0) {
        return {
            success: false,
            message: "Tickets sold out"
        };
    }

    const lock = await client.set("lock:ticket", "locked", {
        NX: true,
        EX: 5
    });

    if (!lock) {
        return {
            success: false,
            message: "Another booking in progress"
        };
    }

    const bookingId = Date.now();

    remaining = remaining - 1;

    await client.set(totalKey, remaining);

    // store booking log
    const bookingLog = {
        bookingId: bookingId,
        time: new Date().toISOString()
    };

    await client.rPush("booking:logs", JSON.stringify(bookingLog));

    return {
        success: true,
        bookingId: bookingId,
        remaining: remaining
    };
}

module.exports = { bookSeat };