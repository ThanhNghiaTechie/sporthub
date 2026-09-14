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
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");
        if (password !== confirmPassword) {
            setMessage(message, "Mật khẩu nhập lại không khớp.", true);
            return;
        }

        const { error } = await supabaseClient.auth.signUp({
            email,
            password
        });

        if (error) {
            setMessage(message, error.message, true);
            return;
        }

        setMessage(message, "Tạo tài khoản thành công. Hãy kiểm tra email để xác nhận tài khoản.", false);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 700);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setMessage(message, "Email hoặc mật khẩu không đúng.", true);
            return;
        }

        localStorage.setItem("socialcoinCurrentUser", JSON.stringify({
            id: data.user.id,
            email: data.user.email
        }));

        setMessage(message, "Đăng nhập thành công. Đang chuyển đến trang chủ...", false);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 500);
    });
}
