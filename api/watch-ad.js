const users = globalThis.__socialCoinUsers || (globalThis.__socialCoinUsers = Object.create(null));

module.exports = function handler(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({
            success: false,
            message: "Method không được hỗ trợ"
        });
    }

    const email = String(request.body?.email || "").trim().toLowerCase();

    if (!email) {
        return response.status(400).json({
            success: false,
            message: "Thiếu email người dùng"
        });
    }

    const user = users[email] || { email, coins: 0 };
    user.coins += 1;
    users[email] = user;

    return response.status(200).json({
        success: true,
        message: "Bạn đã nhận được 1 Coin",
        reward: 1,
        balance: user.coins
    });
};
