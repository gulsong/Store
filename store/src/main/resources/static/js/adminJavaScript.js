function clickBtn(input, btn) {
    input.keydown(function (e) {
        if (e.which === 13) {
            btn.click();
        }
    });
}

function findFirst(pageNum, pageSize) {
    return (pageNum - 1) * pageSize;
}

function getUrlParam(name) {
    let url = window.location.search;
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let result = url.substring(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

function showUser() {
    $.ajax({
        url: "/users/get_user_type",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.data === 3) {
                $("#change-password-li").remove();
            }
        }
    });
    $.ajax({
        url: "/users/get_by_uid",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            let userMenu = $("#user-menu");
            let html = '<span class="top-dropdown-btn dropdown">' +
                '<a class="dropdown-toggle" href="javascript:void(0);" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">&nbsp;#{username}&nbsp;\n' +
                '<span class="caret"></span>\n' +
                '</a>\n' +
                '<ul class="dropdown-menu">\n' +
                '<li>\n' +
                '<a href="javascript:void(0)" onclick="logout()">退出登录</a>\n' +
                '</li>\n';
            if (json.data["userType"] !== 3) {
                html += '<li>\n' +
                    '<a href="cancelAccount.html">注销用户</a>\n' +
                    '</li>\n';
            }
            html += '</ul>\n' +
                '</span>\n';
            userMenu.empty();
            html = html.replace(/#{username}/g, json.data["username"]);
            userMenu.append(html);
        }
    });
}

function logout() {
    $.ajax({
        url: "/users/logout",
        type: "POST",
        dataType: "JSON",
        success: function () {
            location.href = "../login.html";
        }
    });
}

function bindDelete(uid) {
    let deleteYes = $("#delete-yes");
    deleteYes.unbind("click");
    deleteYes.bind("click", function () {
        deleteAccount(uid);
    });
}

function deleteAccount(uid) {
    $.ajax({
        url: "/users/admin/delete_user",
        type: "POST",
        data: "uid=" + uid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $(".modal").modal('toggle');
                location.reload();
            } else if (json.state === 4001) {
                alert("删除失败(用户不存在)");
                $(".modal").modal('toggle');
            } else {
                alert("删除失败，未知错误");
                $(".modal").modal('toggle');
            }
        },
        error: function (xhr) {
            alert("删除时产生未知异常" + xhr.message);
            $(".modal").modal('toggle');
        }
    });
}

function setUserType(uid, userType) {
    $.ajax({
        url: "/users/admin/change_user_type",
        type: "POST",
        data: "uid=" + uid + "&userType=" + userType,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.reload();
            } else if (json.state === 4001) {
                alert("修改失败(用户不存在)");
            } else {
                alert("修改失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("修改时产生未知异常" + xhr.message);
        }
    });
}