const usersStorageKey = "socialcoinUsers";
const authSessionKey = "socialcoinCurrentUser";

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(usersStorageKey) || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function setMessage(element, message, isError) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
    element.classList.toggle("success", !isError);
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");
        const users = getUsers();

        if (password !== confirmPassword) {
            setMessage(message, "Mật khẩu nhập lại không khớp.", true);
            return;
        }

        if (users.some(user => user.email === email)) {
            setMessage(message, "Email này đã được đăng ký.", true);
            return;
        }

        users.push({ email, password });
        localStorage.setItem(usersStorageKey, JSON.stringify(users));
        setMessage(message, "Tạo tài khoản thành công. Đang chuyển đến trang đăng nhập...", false);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 700);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");
        const user = getUsers().find(item => item.email === email && item.password === password);

        if (!user) {
            setMessage(message, "Email hoặc mật khẩu không đúng.", true);
            return;
        }

        localStorage.setItem(authSessionKey, JSON.stringify({ email: user.email }));
        setMessage(message, "Đăng nhập thành công. Đang chuyển đến trang chủ...", false);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);
    });
}
