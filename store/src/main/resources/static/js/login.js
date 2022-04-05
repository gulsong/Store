$(document).ready(function () {
    let loginBtn = $("#btn-login")
    clickBtn($("#username"), loginBtn);
    clickBtn($("#password"), loginBtn);
    loginBtn.bind("click", function () {
        login();
    });
})

function login() {
    let username = $("#username");
    let password = $("#password");
    username.css("border-color", "");
    password.css("border-color", "");
    username.attr("placeholder", "请输入用户名");
    password.attr("placeholder", "请输入密码");
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
    $.ajax({
        url: "/users/login",
        type: "POST",
        data: $("#form-login").serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                if (json.data["userType"] === 0) {
                    $.cookie("avatar", json.data["avatar"], {expires: 7});
                    location.href = "index.html";
                } else if (json.data["userType"] === 1) {
                    location.href = "salesperson/index.html";
                } else if (json.data["userType"] === 2 || json.data["userType"] === 3) {
                    location.href = "administrator/index.html";
                }
            } else if (json.state === 4001) {
                username.val("");
                password.val("");
                username.attr("placeholder", "用户名不存在");
                username.css("border-color", "red");
                username[0].focus();
            } else if (json.state === 4002) {
                password.val("");
                password.attr("placeholder", "密码错误");
                password.css("border-color", "red");
                password[0].focus();
            } else {
                location.href = "500.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}