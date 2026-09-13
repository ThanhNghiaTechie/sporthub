const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

/*
    DATABASE DEMO
    Sau này thay bằng MySQL / PostgreSQL / Supabase
*/

const users = Object.create(null);


/*
    API: XEM QUẢNG CÁO

    POST /api/watch-ad

    Body:
    {
        "email": "user@example.com"
    }

    Khi request hợp lệ:
    +1 Coin
*/

app.post("/api/watch-ad", (req, res) => {

    const { email } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();

    // Kiểm tra email
    if (!normalizedEmail) {
        return res.status(400).json({
            success: false,
            message: "Thiếu email người dùng"
        });
    }


    // Tìm user
    const user = users[normalizedEmail] || {
        email: normalizedEmail,
        coins: 0
    };

    users[normalizedEmail] = user;


    // Cộng 1 Coin
    user.coins += 1;


    // Trả kết quả về frontend
    return res.json({
        success: true,
        message: "Bạn đã nhận được 1 Coin",
        reward: 1,
        balance: user.coins
    });

});


/*
    API: XEM SỐ DƯ
*/

app.get("/api/balance/:email", (req, res) => {

    const email = String(req.params.email).trim().toLowerCase();

    const user = users[email];

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy tài khoản"
        });
    }

    res.json({
        success: true,
        email: user.email,
        balance: user.coins
    });

});


/*
    API kiểm tra server
*/

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "SocialCoin Backend đang hoạt động"
    });

});


app.listen(PORT, () => {

    console.log(`SocialCoin Backend chạy tại:`);
    console.log(`http://localhost:${PORT}`);

});
