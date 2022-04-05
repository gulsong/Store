$(document).ready(function () {
    let avatar = $.cookie("avatar");
    let changeAvatarBtn = $("#btn-change-avatar");
    changeAvatarBtn.bind("click", function () {
        changeAvatar();
    });
    $("#img-avatar").attr("src", avatar != null ? "../images"+avatar : "../images/index/user.jpg");
});

function changeAvatar() {
    let formChangeAvatar = $("#form-change-avatar");
    let avatar = $("#img-avatar");
    $.ajax({
        url: "/users/change_avatar",
        type: "POST",
        data: new FormData(formChangeAvatar[0]),
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                avatar.attr("src", "../images"+json.data);
                $.cookie("avatar", json.data, {expires: 7});
            } else if (json.state === 4001) {
                alert("头像修改失败(用户不存在)");
                location.reload();
            } else if (json.state === 6000) {
                alert("请上传头像");
            } else if (json.state === 6001) {
                alert("头像大小不超过10MB");
            } else if (json.state === 6002) {
                alert("图像类型不支持");
            } else {
                alert("头像修改失败,未知错误");
                location.reload();
            }
        },
        error: function (xhr) {
            alert("修改头像时产生未知异常" + xhr.message);
            location.reload();
        }
    });
}