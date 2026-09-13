const dashboardSessionKey = "socialcoinCurrentUser";

function readDashboardValue(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
}

function formatCoin(value) {
    return Number(value || 0).toLocaleString("vi-VN");
}

function formatName(email) {
    const name = email.split("@")[0].replace(/[._-]+/g, " ").trim();
    return name
        .split(" ")
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ") || "bạn";
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

function renderRecentOrders(orders) {
    const list = document.getElementById("dashboardOrdersList");
    const emptyState = document.getElementById("noOrders");

    if (!list || !emptyState) {
        return;
    }

    list.replaceChildren();
    emptyState.hidden = orders.length > 0;

    orders.slice(0, 5).forEach(order => {
        const row = document.createElement("tr");
        row.appendChild(createCell(order.id || "-")).className = "order-id";
        row.appendChild(createCell(order.service || "-")).className = "order-service";
        row.appendChild(createCell(order.link || "-")).className = "order-link";
        row.appendChild(createCell(formatCoin(order.quantity)));
        row.appendChild(createCell(`${formatCoin(order.total)} Coin`));
        row.appendChild(createCell(order.status || "Đang xử lý"));
        list.appendChild(row);
    });
}

function initializeDashboard() {
    const session = readDashboardValue(dashboardSessionKey, null);

    if (!session || !session.email) {
        window.location.href = "login.html";
        return;
    }

    const email = session.email;
    const orders = readDashboardValue("orders", []).filter(order => order.userEmail === email);
    const balance = readDashboardValue("coinBalance", 0);
    const completedOrders = orders.filter(order => order.status === "Đã hoàn thành").length;
    const processingOrders = orders.filter(order => order.status !== "Đã hoàn thành").length;
    const displayName = formatName(email);

    document.getElementById("headerEmail").textContent = email;
    document.getElementById("welcomeEmail").textContent = displayName;
    document.getElementById("dashboardBalance").textContent = formatCoin(balance);
    document.getElementById("totalOrders").textContent = formatCoin(orders.length);
    document.getElementById("processingOrders").textContent = formatCoin(processingOrders);
    document.getElementById("completedOrders").textContent = formatCoin(completedOrders);

    renderRecentOrders(orders);

    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem(dashboardSessionKey);
        window.location.href = "login.html";
    });
}

initializeDashboard();
