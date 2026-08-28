const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    message.textContent = "Đang đăng nhập...";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        message.textContent =
            "Email hoặc mật khẩu không đúng.";
        return;
    }

    message.textContent =
        "Đăng nhập thành công!";

    setTimeout(() => {

        window.location.href = "index.html";

    }, 500);

});