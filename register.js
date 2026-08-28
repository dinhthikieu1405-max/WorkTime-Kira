const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Đang tạo tài khoản...";

    // Tạo tài khoản Supabase Auth
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        message.textContent = "Lỗi: " + error.message;
        return;
    }

    const user = data.user;

    if (!user) {
        message.textContent = "Không tạo được tài khoản.";
        return;
    }

    // Lưu thông tin người dùng vào profiles
    const { error: profileError } = await supabaseClient
        .from("profiles")
        .insert({
            id: user.id,
            full_name: fullName,
            work_type: "part-time",
            hourly_rate: 0,
            daily_rate: 0
        });

    if (profileError) {
        message.textContent =
            "Tạo tài khoản thành công nhưng không lưu được thông tin: "
            + profileError.message;
        return;
    }

    message.textContent =
        "Đăng ký thành công! Đang chuyển sang đăng nhập...";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});