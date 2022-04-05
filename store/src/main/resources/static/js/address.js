$(document).ready(function () {
    showAddressList();
});

function showAddressList() {
    let addressList = $("#address-list");
    $.ajax({
        url: "/addresses/",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let tr = '<tr class="addressItem">\n' +
                        '<td id="addressItemTag">#{tag}</td>\n' +
                        '<td id="addressItemName">#{name}</td>\n' +
                        '<td id="addressItemAddress">#{address}</td>\n' +
                        '<td id="addressItemPhone">#{phone}</td>\n' +
                        '<td id="addressItemNone">\n' +
                        '<div>\n' +
                        '<a class="btn btn-xs btn-info" href="changeAddress.html" onclick="saveAid(#{aid})">\n' +
                        '<span class="fa fa-edit"></span>&nbsp;修改\n' +
                        '</a>\n' +
                        '<a class="btn btn-xs add-del btn-info" onclick="deleteByAid(#{aid})">\n' +
                        '<span class="fa fa-trash-o"></span>&nbsp;删除\n' +
                        '</a>\n' +
                        '<a class="btn btn-xs add-def btn-default" onclick="setDefault(#{aid})">设为默认</a>\n' +
                        '</div>\n' +
                        '<td>\n' +
                        '</tr>\n';
                    tr = tr.replace(/#{tag}/g, list[i]["tag"] !== null ? list[i]["tag"] : "");
                    tr = tr.replace(/#{name}/g, list[i]["name"]);
                    tr = tr.replace(/#{address}/g, list[i]["address"]);
                    tr = tr.replace(/#{phone}/g, list[i]["phone"]);
                    tr = tr.replace(/#{aid}/g, list[i]["aid"]);
                    addressList.append(tr);
                }
                let addDef = $(".add-def:eq(0)");
                addDef.hide();
            } else {
                location.href = "404.html";
            }
        }
    });
}

function saveAid(aid) {
    $.ajax({
        url: "/addresses/" + aid + "/save_aid",
        type: "POST",
        dataType: "JSON"
    });
}

function deleteByAid(aid) {
    let addressList = $("#address-list");
    $.ajax({
        url: "/addresses/" + aid + "/delete",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                addressList.empty();
                showAddressList();
            } else if (json.state === 4004) {
                alert("删除收货地址失败（地址不存在）");
                addressList.empty();
                showAddressList();
            } else if (json.state === 4005) {
                alert("删除收货地址失败（用户非法访问）");
                addressList.empty();
                showAddressList();
            } else if (json.state === 5001) {
                alert("更新默认收货地址失败");
                addressList.empty();
                showAddressList();
            } else {
                alert("删除收货地址失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("删除收货地址时产生未知异常" + xhr.message);
        }
    });
}

function setDefault(aid) {
    let addressList = $("#address-list");
    $.ajax({
        url: "/addresses/" + aid + "/set_default",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                addressList.empty();
                showAddressList();
            } else if (json.state === 4004) {
                alert("设置默认收货地址失败（地址不存在）");
                addressList.empty();
                showAddressList();
            } else if (json.state === 4005) {
                alert("设置默认收货地址失败（用户非法访问）");
                addressList.empty();
                showAddressList();
            } else {
                alert("设置默认收货地址失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("设置默认收货地址时产生未知异常" + xhr.message);
        }
    });
}