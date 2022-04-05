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
                '<a href="changePassword.html">修改密码</a>\n' +
                '</li>\n' +
                '<li>\n' +
                '<a href="javascript:void(0)" onclick="logout()">退出登录</a>\n' +
                '</li>\n' +
                '<li>\n' +
                '<a href="cancelAccount.html">注销用户</a>\n' +
                '</li>\n' +
                '</ul>\n' +
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

function getCategoryName(id) {
    let category = '';
    $.ajax({
        url: "/products/sale/category",
        type: "POST",
        data: "id=" + id,
        dataType: "JSON",
        async: false,
        success: function (json) {
            category = json.data["name"];
        }
    });
    return category;
}

function changeStatus(id, status) {
    $.ajax({
        url: "/products/sale/set_status",
        type: "POST",
        data: "id=" + id + "&status=" + status,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.reload();
            } else if (json.state === 4006) {
                alert("更新失败（商品不存在）");
            } else {
                alert("更新失败,未知错误");
            }
        },
        error: function (xhr) {
            alert("更新时产生未知异常" + xhr.message);
        }
    });
}

function deleteProduct(id) {
    $.ajax({
        url: "/products/sale/delete",
        type: "POST",
        data: "id=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.reload();
            } else if (json.state === 4006) {
                alert("删除失败（商品不存在）");
                $(".modal").modal('toggle');
            } else {
                alert("删除失败,未知错误");
                $(".modal").modal('toggle');
            }
        },
        error: function (xhr) {
            alert("删除时产生未知异常" + xhr.message);
            $(".modal").modal('toggle');
        }
    });
}

function changePrice(id) {
    let price = $("#price").val();
    $.ajax({
        url: "/products/sale/set_price",
        type: "POST",
        data: "id=" + id + "&price=" + price,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.reload();
            } else if (json.state === 4006) {
                alert("价格修改失败(商品不存在)");
                $(".modal").modal('toggle');
            } else {
                alert("价格修改失败,未知错误");
                $(".modal").modal('toggle');
            }
        },
        error: function (xhr) {
            alert("价格修改时产生未知异常" + xhr.message);
            $(".modal").modal('toggle');
        }
    });
}

function bindDelete(id) {
    let deleteYes = $("#delete-yes");
    deleteYes.unbind("click");
    deleteYes.bind("click", function () {
        deleteProduct(id);
    });
}

function bindChangePrice(id) {
    let changePriceYes = $("#change-price-yes");
    changePriceYes.unbind("click");
    changePriceYes.bind("click", function () {
        changePrice(id);
    });
}

function showSaleMessage(pid) {
    $.ajax({
        url: "/orders/sale/count_mun_month",
        type: "POST",
        data: "pid=" + pid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#count-mun-month").html("月销售量：" + json.data + "件");
            }
        }
    });
    $.ajax({
        url: "/orders/sale/count_money_month",
        type: "POST",
        data: "pid=" + pid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#count-money-month").html("月销售额：￥" + json.data);
            }
        }
    });
    $.ajax({
        url: "/orders/sale/count_mun",
        type: "POST",
        data: "pid=" + pid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#count-mun").html("总销售量：" + json.data + "件");
            }
        }
    });
    $.ajax({
        url: "/orders/sale/count_money",
        type: "POST",
        data: "pid=" + pid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#count-money").html("总销售额：￥" + json.data);
            }
        }
    });
}

function showCategorySelect() {
    let defaultOption = "<option value='0'>---- 请选择 ----</option>";
    let categorySelectList = $("#category-select-list");
    categorySelectList.empty();
    categorySelectList.append(defaultOption);
    $.ajax({
        url: "/products/categories",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let id = list[i]["id"];
                    let name = list[i]["name"];
                    let opt = "<option value='" + id + "'>" + name + "</option>";
                    categorySelectList.append(opt);
                }
            }
        }
    });
}