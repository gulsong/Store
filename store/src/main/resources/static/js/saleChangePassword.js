$(document).ready(function () {
    let changePasswordBtn = $("#btn-change-password")
    changePasswordBtn.bind("click", function () {
        changePassword();
    });
    clickBtn($("#old-password"), changePasswordBtn);
    clickBtn($("#new-password"), changePasswordBtn);
    clickBtn($("#check-password"), changePasswordBtn);
    showUser();
});

function changePassword() {
    let formChangePassword = $("#form-change-password");
    let oldPassword = $("#old-password");
    let newPassword = $("#new-password");
    let checkPassword = $("#check-password");
    let re = new RegExp("^[a-zA-Z0-9]+$");
    oldPassword.css("border-color", "");
    newPassword.css("border-color", "");
    checkPassword.css("border-color", "");
    oldPassword.attr("placeholder", "请输入原密码");
    newPassword.attr("placeholder", "请输入新密码（6-18位数字或英文符号）");
    checkPassword.attr("placeholder", "请再次输入新密码");
    if (oldPassword.val().length === 0) {
        oldPassword.css("border-color", "red");
        oldPassword[0].focus();
        return;
    }
    if (newPassword.val().length === 0) {
        newPassword.css("border-color", "red");
        newPassword[0].focus();
        return;
    }
    if ((!re.test(newPassword.val())) || newPassword.val().length < 6 || newPassword.val().length > 18) {
        newPassword.val("");
        newPassword.attr("placeholder", "密码不合法");
        newPassword.css("border-color", "red");
        newPassword[0].focus();
        return;
    }
    if (newPassword.val() !== checkPassword.val()) {
        checkPassword.val("");
        checkPassword.attr("placeholder", "密码不一致");
        checkPassword.css("border-color", "red");
        checkPassword[0].focus();
        return;
    }
    $.ajax({
        url: "/users/change_password",
        type: "POST",
        data: formChangePassword.serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("密码修改成功");
                location.href = "index.html";
            } else if (json.state === 4001) {
                alert("密码修改失败(用户不存在)");
                location.reload();
            } else if (json.state === 4002) {
                oldPassword.val("");
                newPassword.val("");
                checkPassword.val("");
                oldPassword.attr("placeholder", "密码错误");
                oldPassword.css("border-color", "red");
                oldPassword[0].focus();
            } else {
                alert("密码修改失败，未知错误");
                location.reload();
            }
        },
        error: function (xhr) {
            alert("修改密码时产生未知异常" + xhr.message);
            location.reload();
        }
    });
}