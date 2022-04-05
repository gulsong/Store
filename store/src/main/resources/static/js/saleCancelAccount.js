$(document).ready(function () {
    let cancelAccountBtn = $("#btn-cancel-account");
    clickBtn($("#password"), cancelAccountBtn);
    showUser();
});
function cancelAccount() {
    let formCancelAccount = $("#form-cancel-account");
    let password = $("#password");
    password.css("border-color", "");
    password.attr("placeholder", "请输入密码");
    if (password.val().length === 0) {
        password.css("border-color", "red");
        password[0].focus();
        return;
    }
    $.ajax({
        url: "/users/cancel_account",
        type: "POST",
        data: formCancelAccount.serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("注销成功");
                location.href = "../login.html";
            } else if (json.state === 4001) {
                alert("注销失败(用户不存在)");
                location.reload();
            } else if (json.state === 4002) {
                password.val("");
                password.attr("placeholder", "密码错误");
                password.css("border-color", "red");
                password[0].focus();
            } else {
                alert("注销失败，未知错误");
                location.reload();
            }
        },
        error: function (xhr) {
            alert("注销时产生未知异常" + xhr.message);
            location.reload();
        }
    });
}