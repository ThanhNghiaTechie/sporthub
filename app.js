/* =========================================================
   SOCIALCOIN - APP.JS
   ========================================================= */


/* =========================================================
   DỮ LIỆU DỊCH VỤ
   ========================================================= */

const services = {

    tiktok: {
        follow: {
            name: "TikTok Follow",
            price: 5
        },

        like: {
            name: "TikTok Like",
            price: 3
        },

        view: {
            name: "TikTok View",
            price: 1
        },

        comment: {
            name: "TikTok Comment",
            price: 10
        }
    },


    facebook: {
        follow: {
            name: "Facebook Follow",
            price: 5
        },

        like: {
            name: "Facebook Like",
            price: 4
        },

        view: {
            name: "Facebook View",
            price: 2
        },

        comment: {
            name: "Facebook Comment",
            price: 8
        }
    },


    instagram: {
        follow: {
            name: "Instagram Follow",
            price: 6
        },

        like: {
            name: "Instagram Like",
            price: 4
        },

        view: {
            name: "Instagram View",
            price: 2
        },

        comment: {
            name: "Instagram Comment",
            price: 10
        }
    },


    youtube: {
        follow: {
            name: "YouTube Subscribe",
            price: 8
        },

        like: {
            name: "YouTube Like",
            price: 5
        },

        view: {
            name: "YouTube View",
            price: 2
        },

        comment: {
            name: "YouTube Comment",
            price: 10
        }
    }

};


/* =========================================================
   LẤY ELEMENT
   ========================================================= */

const platformSelect = document.getElementById("platform");
const serviceSelect = document.getElementById("service");
const linkInput = document.getElementById("link");
const quantityInput = document.getElementById("quantity");

const unitPriceElement = document.getElementById("unitPrice");
const summaryQuantityElement = document.getElementById("summaryQuantity");
const totalCoinElement = document.getElementById("totalCoin");

const orderButton = document.getElementById("orderButton");
const headerCoin = document.getElementById("headerCoin");
const coinApiUrl = window.location.hostname === "localhost" && window.location.port === "5500"
    ? "http://localhost:3000"
    : "";
const localDataResetKey = "socialcoinLocalDataResetV1";

if (!localStorage.getItem(localDataResetKey)) {
    localStorage.removeItem("coinBalance");
    localStorage.removeItem("orders");
    sessionStorage.removeItem("adCount");
    localStorage.setItem(localDataResetKey, "1");
}


/* =========================================================
   COIN DEMO
   ========================================================= */

let coinBalance = Number(
    localStorage.getItem("coinBalance")
) || 0;


/* =========================================================
   HIỂN THỊ COIN
   ========================================================= */

function updateCoinDisplay() {

    if (headerCoin) {

        headerCoin.textContent =
            coinBalance.toLocaleString("vi-VN");

    }

    const heroCoin = document.getElementById("heroCoin");

    if (heroCoin) {
        heroCoin.firstChild.textContent = `${coinBalance.toLocaleString("vi-VN")} `;
    }

    const dashboardBalance = document.getElementById("dashboardBalance");

    if (dashboardBalance) {
        dashboardBalance.textContent = coinBalance.toLocaleString("vi-VN");
    }

}

async function rewardAdForCurrentUser() {
    const session = JSON.parse(
        localStorage.getItem("socialcoinCurrentUser") || "{}"
    );

    if (!session.email) {
        throw new Error("Bạn cần đăng nhập để nhận Coin.");
    }

    const response = await fetch(`${coinApiUrl}/api/watch-ad`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: session.email })
    });

    if (!response.ok) {
        throw new Error("Không thể kết nối máy chủ Coin.");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Không thể cộng Coin.");
    }

    coinBalance = Number(result.balance);
    localStorage.setItem("coinBalance", coinBalance);
    updateCoinDisplay();
}


/* =========================================================
   LẤY DỊCH VỤ HIỆN TẠI
   ========================================================= */

function getCurrentService() {

    const platform = platformSelect.value;
    const service = serviceSelect.value;

    return services[platform][service];

}


/* =========================================================
   CẬP NHẬT GIÁ
   ========================================================= */

function updatePrice() {

    const currentService = getCurrentService();

    const quantity =
        Math.max(
            Number(quantityInput.value) || 0,
            0
        );

    const price = currentService.price;

    const total = price * quantity;


    /* Đơn giá */

    unitPriceElement.textContent =
        `${price.toLocaleString("vi-VN")} Coin / 1`;


    /* Số lượng */

    summaryQuantityElement.textContent =
        quantity.toLocaleString("vi-VN");


    /* Tổng */

    totalCoinElement.textContent =
        total.toLocaleString("vi-VN");

}


/* =========================================================
   CẬP NHẬT DỊCH VỤ KHI ĐỔI NỀN TẢNG
   ========================================================= */

function updateServices() {

    const platform = platformSelect.value;

    const platformServices =
        services[platform];


    serviceSelect.innerHTML = "";


    Object.keys(platformServices).forEach(
        serviceKey => {

            const service =
                platformServices[serviceKey];


            const option =
                document.createElement("option");


            option.value = serviceKey;

            option.textContent =
                service.name;


            serviceSelect.appendChild(option);

        }
    );


    updatePrice();

}


/* =========================================================
   FORMAT LINK
   ========================================================= */

function isValidUrl(value) {

    try {

        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;

    }

}


/* =========================================================
   TẠO ID ĐƠN HÀNG
   ========================================================= */

function generateOrderId() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `SC${random}`;

}


/* =========================================================
   LƯU ĐƠN HÀNG
   ========================================================= */

function saveOrder(order) {

    const oldOrders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    oldOrders.unshift(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(oldOrders)
    );

}


/* =========================================================
   ĐẶT DỊCH VỤ
   ========================================================= */

function createOrder() {

    if (!isAuthenticated()) {
        window.location.href = "login.html";
        return;
    }

    const platform =
        platformSelect.value;

    const serviceKey =
        serviceSelect.value;

    const link =
        linkInput.value.trim();

    const quantity =
        Number(quantityInput.value);


    const currentService =
        services[platform][serviceKey];


    const total =
        currentService.price * quantity;


    /* Kiểm tra link */

    if (!link) {

        alert("Vui lòng nhập link cần tăng.");

        linkInput.focus();

        return;

    }


    if (!isValidUrl(link)) {

        alert(
            "Link không hợp lệ. Vui lòng nhập URL bắt đầu bằng https://"
        );

        linkInput.focus();

        return;

    }


    /* Kiểm tra số lượng */

    if (!quantity || quantity < 100) {

        alert(
            "Số lượng tối thiểu là 100."
        );

        quantityInput.focus();

        return;

    }


    /* Kiểm tra Coin */

    if (total > coinBalance) {

        alert(
            `Bạn không đủ Coin.\n\n` +
            `Cần: ${total.toLocaleString("vi-VN")} Coin\n` +
            `Số dư: ${coinBalance.toLocaleString("vi-VN")} Coin`
        );

        return;

    }


    /* Tạo đơn */

    const order = {

        id: generateOrderId(),

        userEmail: JSON.parse(
            localStorage.getItem("socialcoinCurrentUser") || "{}"
        ).email || "",

        platform: platform,

        service: currentService.name,

        link: link,

        quantity: quantity,

        total: total,

        status: "Đang xử lý",

        createdAt:
            new Date().toLocaleString("vi-VN")

    };


    /* Trừ Coin */

    coinBalance -= total;


    localStorage.setItem(
        "coinBalance",
        coinBalance
    );


    /* Lưu đơn */

    saveOrder(order);


    /* Cập nhật giao diện */

    updateCoinDisplay();


    /* Thông báo */

    alert(
        `Đặt dịch vụ thành công!\n\n` +
        `Mã đơn: ${order.id}\n` +
        `Dịch vụ: ${order.service}\n` +
        `Số lượng: ${order.quantity.toLocaleString("vi-VN")}\n` +
        `Thanh toán: ${order.total.toLocaleString("vi-VN")} Coin`
    );


    /* Reset */

    linkInput.value = "";

    quantityInput.value = 1000;

    updatePrice();

}


/* =========================================================
   EVENT
   ========================================================= */

if (platformSelect) {

    platformSelect.addEventListener(
        "change",
        updateServices
    );

}


if (serviceSelect) {

    serviceSelect.addEventListener(
        "change",
        updatePrice
    );

}


if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        updatePrice
    );

}


if (orderButton) {

    orderButton.addEventListener(
        "click",
        createOrder
    );

}


/* =========================================================
   AD POPUP
   Hiện ô quảng cáo ở giữa màn hình
   Người dùng click mới mở quảng cáo
   Tối đa 3 quảng cáo / phiên
   ========================================================= */

const adLinks = [
    "https://www.profitableratecpmnetwork.com/qsvq4hu9?key=c54e644a4b501b13a5dcca95c53fde94",

    "https://www.profitableratecpmnetwork.com/nujqhn7t?key=a1c56ec4549fabb0096c9b18d4911436",

    "https://www.profitableratecpmnetwork.com/fv9e8t4a?key=96dd3308710cfaeb75537267981dbf88"
];

const authSessionKey = "socialcoinCurrentUser";

function isAuthenticated() {
    return Boolean(localStorage.getItem(authSessionKey));
}

function updateAuthHeader() {
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const dashboardLink = document.getElementById("dashboardLink");
    const logoutButton = document.getElementById("headerLogout");

    if (!loginLink || !registerLink || !dashboardLink || !logoutButton) {
        return;
    }

    const loggedIn = isAuthenticated();
    loginLink.hidden = loggedIn;
    registerLink.hidden = loggedIn;
    dashboardLink.hidden = !loggedIn;
    logoutButton.hidden = !loggedIn;

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem(authSessionKey);
        sessionStorage.removeItem("adCount");
        window.location.href = "index.html";
    });
}

let adCount = Number(
    sessionStorage.getItem("adCount") || 0
);


/* =========================================================
   TẠO CSS CHO POPUP
   ========================================================= */

function createAdStyle() {

    if (document.getElementById("socialcoin-ad-style")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "socialcoin-ad-style";

    style.textContent = `

        #socialcoin-ad-box {

            position: fixed;

            left: 50%;
            top: 50%;

            transform: translate(-50%, -50%);

            width: 300px;
            max-width: calc(100vw - 30px);

            background: #ffffff;

            border: 1px solid #e5e7eb;

            border-radius: 16px;

            padding: 22px;

            box-shadow:
                0 20px 60px rgba(0,0,0,0.18);

            z-index: 99999;

            font-family: Inter, Arial, sans-serif;

            text-align: center;

            animation: socialcoinAdIn
                0.25s ease;

        }


        #socialcoin-ad-box .ad-label {

            display: inline-block;

            padding: 4px 9px;

            margin-bottom: 12px;

            border-radius: 20px;

            background: #f1f1f5;

            color: #6b7280;

            font-size: 10px;

            font-weight: 700;

        }


        #socialcoin-ad-box .ad-icon {

            width: 58px;
            height: 58px;

            margin: 0 auto 13px;

            border-radius: 14px;

            background: #635bff;

            color: white;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 25px;

            font-weight: 800;

        }


        #socialcoin-ad-box h3 {

            margin: 0;

            color: #171923;

            font-size: 17px;

        }


        #socialcoin-ad-box p {

            margin: 7px 0 18px;

            color: #6b7280;

            font-size: 12px;

            line-height: 1.5;

        }


        #socialcoin-ad-box .ad-open-button {

            width: 100%;

            height: 43px;

            border: none;

            border-radius: 9px;

            background: #635bff;

            color: white;

            cursor: pointer;

            font-size: 13px;

            font-weight: 700;

        }


        #socialcoin-ad-box .ad-open-button:hover {

            background: #5048e5;

        }


        #socialcoin-ad-box .ad-close {

            position: absolute;

            right: 10px;
            top: 10px;

            width: 27px;
            height: 27px;

            border: none;

            border-radius: 50%;

            background: #f3f4f6;

            color: #6b7280;

            cursor: pointer;

            font-size: 15px;

        }


        #socialcoin-ad-box .ad-progress {

            margin-top: 12px;

            color: #9ca3af;

            font-size: 10px;

        }


        @keyframes socialcoinAdIn {

            from {

                opacity: 0;

                transform:
                    translate(-50%, -46%)
                    scale(0.95);

            }

            to {

                opacity: 1;

                transform:
                    translate(-50%, -50%)
                    scale(1);

            }

        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   HIỆN POPUP
   ========================================================= */

function showAdPopup() {

    if (!isAuthenticated() || adCount >= adLinks.length) {
        return;
    }


    /* Xóa popup cũ nếu có */

    const oldPopup =
        document.getElementById("socialcoin-ad-box");

    if (oldPopup) {
        oldPopup.remove();
    }


    createAdStyle();


    const popup =
        document.createElement("div");

    popup.id = "socialcoin-ad-box";


    popup.innerHTML = `

        <button
            class="ad-close"
            id="adCloseButton"
            aria-label="Đóng"
        >
            ×
        </button>


        <div class="ad-label">
            QUẢNG CÁO
        </div>


        <div class="ad-icon">
            S
        </div>


        <h3>
            Bạn có một quảng cáo
        </h3>


        <p>
            Nhấn vào nút bên dưới để xem quảng cáo.
        </p>


        <button
            class="ad-open-button"
            id="adOpenButton"
        >
            Xem quảng cáo
        </button>


        <div class="ad-progress">
            Quảng cáo ${adCount + 1}/3
        </div>

    `;


    document.body.appendChild(popup);


    /* =====================================================
       CLICK XEM QUẢNG CÁO
       ===================================================== */

    const openButton =
        document.getElementById(
            "adOpenButton"
        );


    openButton.addEventListener(
        "click",
        async function () {

            const currentLink =
                adLinks[adCount];


            /*
               Mở bằng chính thao tác click
               của người dùng để giảm khả năng
               bị trình duyệt chặn popup.
            */

            window.open(
                currentLink,
                "_blank",
                "noopener,noreferrer"
            );

            try {
                await rewardAdForCurrentUser();
            } catch (error) {
                alert(error.message);
                return;
            }


            /*
               Đánh dấu quảng cáo đã được mở.
            */

            adCount++;


            sessionStorage.setItem(
                "adCount",
                adCount
            );


            popup.remove();


            /*
               Nếu chưa đủ 3 quảng cáo,
               chờ 10–15 giây rồi hiện quảng cáo tiếp.
            */

            if (adCount < adLinks.length) {

                const delay =
                    Math.floor(
                        Math.random() * 5000
                    ) + 10000;


                setTimeout(
                    showAdPopup,
                    delay
                );

            } else {

                console.log(
                    "Đã hoàn thành 3/3 quảng cáo."
                );

            }

        }
    );


    /* =====================================================
       NÚT ĐÓNG
       ===================================================== */

    const closeButton =
        document.getElementById(
            "adCloseButton"
        );


    closeButton.addEventListener(
        "click",
        function () {

            popup.remove();

            /*
               Đóng không được tính là đã xem.
               Popup sẽ xuất hiện lại sau 10–15 giây.
            */

            const delay =
                Math.floor(
                    Math.random() * 5000
                ) + 10000;


            setTimeout(
                showAdPopup,
                delay
            );

        }
    );

}


/* =========================================================
   KHỞI ĐỘNG HỆ THỐNG
   ========================================================= */

function startAdSystem() {

    if (!isAuthenticated() || adCount >= 3) {

        console.log(
            "Phiên này đã hoàn thành 3/3 quảng cáo."
        );

        return;
    }


    /*
       Lần đầu cũng chờ 10–15 giây
    */

    const delay =
        Math.floor(
            Math.random() * 5000
        ) + 10000;


    setTimeout(
        showAdPopup,
        delay
    );

}


updateAuthHeader();
startAdSystem();
