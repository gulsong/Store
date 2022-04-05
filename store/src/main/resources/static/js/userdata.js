$(document).ready(function () {
    let changeInfoBtn = $("#btn-change-info");
    changeInfoBtn.bind("click", function () {
        changeInfo();
    });
    clickBtn($("#phone"), changeInfoBtn);
    showUserInfo();
});

function showUserInfo() {
    let formChangeInfo = $("#form-change-info");
    let username = $("#username");
    let phone = $("#phone");
    let genderSecret = $("#gender-secret");
    let genderMale = $("#gender-male");
    let genderFemale = $("#gender-female");
    $.ajax({
        url: "/users/get_by_uid",
        type: "GET",
        data: formChangeInfo.serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                username.val(json.data["username"]);
                phone.val(json.data["phone"]);
                let radio = genderSecret;
                if (json.data.gender === 1) {
                    radio = genderMale;
                } else if (json.data.gender === 2) {
                    radio = genderFemale;
                }
                radio.prop("checked", "checked");
            } else if (json.state === 4001) {
                location.href = "404.html";
            } else {
                location.href = "500.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}

function changeInfo() {
    let formChangeInfo = $("#form-change-info");
    let phone = $("#phone");
    let username = $("#username");
    let re = new RegExp("^[0-9]")
    phone.css("border-color", "");
    username.attr("placeholder", "");
    phone.attr("placeholder", "请输入11位电话号码");
    if (phone.val().length !== 0) {
        if ((!re.test(phone.val())) || phone.val().length !== 11) {
            phone.val("");
            phone.css("border-color", "red");
            phone[0].focus();
            return;
        }
    }
    $.ajax({
        url: "/users/change_info",
        type: "POST",
        data: formChangeInfo.serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("用户信息修改成功");
                location.reload();
            } else if (json.state === 4001) {
                alert("用户信息修改失败(用户不存在)");
                location.reload();
            } else {
                alert("用户信息修改失败,未知错误");
                location.reload();
            }
        },
        error: function (xhr) {
            alert("用户信息修改时产生未知异常" + xhr.message);
            location.reload();
        }
    });
}