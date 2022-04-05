$(document).ready(function () {
    let regBtn = $("#btn-reg")
    clickBtn($("#username"), regBtn);
    clickBtn($("#password"), regBtn);
    clickBtn($("#check-password"), regBtn);
    regBtn.bind("click", function () {
        register();
    });
});

function register() {
    let username = $("#username");
    let password = $("#password");
    let checkPassword = $("#check-password");
    const re = new RegExp("^[a-zA-Z0-9]+$");
    username.css("border-color", "");
    password.css("border-color", "");
    checkPassword.css("border-color", "");
    username.attr("placeholder", "请输入用户名");
    password.attr("placeholder", "请输入密码（6-18位数字或英文符号）");
    checkPassword.attr("placeholder", "请再次输入密码");
    if (username.val().length === 0) {
        username.css("border-color", "red");
        username[0].focus();
        return;
    }
    if (password.val().length === 0) {
        password.css("border-color", "red");
        password[0].focus();
        return;
    }
    if ((!re.test(password.val())) || password.val().length < 6 || password.val().length > 18) {
        password.val("");
        password.attr("placeholder", "密码不合法");
        password.css("border-color", "red");
        password[0].focus();
        return;
    }
    if (password.val() !== checkPassword.val()) {
        checkPassword.val("");
        checkPassword.attr("placeholder", "密码不一致");
        checkPassword.css("border-color", "red");
        checkPassword[0].focus();
        return;
    }
    $.ajax({
        url: "/users/reg",
        type: "POST",
        data: $("#form-reg").serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("注册成功");
                location.href = "login.html"
            } else if (json.state === 4000) {
                username.val("");
                password.val("");
                checkPassword.val("");
                username.attr("placeholder", "用户名已存在");
                username.css("border-color", "red");
                username[0].focus();
            } else {
                location.href = "500.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}