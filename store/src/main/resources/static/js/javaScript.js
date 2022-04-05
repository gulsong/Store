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
    let avatar = $.cookie("avatar");
    $.ajax({
        url: "/users/get_by_uid",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            let userMenu = $("#user-menu");
            let html = '<button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown">\n' +
                '<span class="top-dropdown-btn">\n' +
                '&nbsp;&nbsp;<img src="../images#{avatar}" width="20" height="20" alt=""/>&nbsp;#{username}&nbsp;\n' +
                '<span class="caret"></span>\n' +
                '</span>\n' +
                '</button>\n' +
                '<ul class="dropdown-menu top-dropdown-ul" role="menu">\n' +
                '<li>\n' +
                '<a href="javascript:void(0)" onclick="logout()">退出登录</a>\n' +
                '</li>\n' +
                '<li>\n' +
                '<a href="cancelAccount.html">注销用户</a>\n' +
                '</li>\n' +
                '</ul>\n';
            userMenu.empty();
            html = html.replace(/#{avatar}/g, avatar != null ? avatar : "/index/user.jpg");
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
            location.href = "login.html";
        }
    });
}

function showCategoryList(categoryId) {
    let categoriesList = $("#categories-list");
    let indexUrl = "index.html";
    let categoryUrl = "category.html";
    categoriesList.empty();
    $.ajax({
        url: "/products/categories",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (categoryId === -1) {
                let html = '<li class="active"><a href="' + indexUrl + '"><span class="fa fa-home"></span></a></li>';
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    html += '<li><a href="' + categoryUrl + '?categoryId=#{id}">#{name}</a></li>';
                    html = html.replace(/#{id}/g, list[i]["id"]);
                    html = html.replace(/#{name}/g, list[i]["name"]);
                }
                categoriesList.append(html);
            } else {
                let html = '<li><a href="' + indexUrl + '"><span class="fa fa-home"></span></a></li>';
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    if (list[i]["id"] === parseInt(categoryId)) {
                        html += '<li class="active"><a href="' + categoryUrl + '?categoryId=#{id}">#{name}</a></li>';
                        $("title").html("电子产品销售系统-" + list[i]["name"]);
                    } else {
                        html += '<li><a href="' + categoryUrl + '?categoryId=#{id}">#{name}</a></li>';
                    }
                    html = html.replace(/#{id}/g, list[i]["id"]);
                    html = html.replace(/#{name}/g, list[i]["name"]);
                }
                categoriesList.append(html);
            }

        }
    });
}

function toProduct(pid) {
    let toNext = $("#to-next");
    let temp = '<input id="to-next-item" name="id" type="text" value="#{pid}"/>';
    temp = temp.replace(/#{pid}/g, pid);
    toNext.attr("action", "product.html");
    toNext.append(temp);
    toNext.submit();
}

function toCart(id, amount) {
    $.ajax({
        url: "/carts/add_to_cart",
        type: "POST",
        data: {
            "pid": id,
            "amount": amount
        },
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "cart.html"
            } else {
                alert("加入购物车失败，未知错误");
            }
        },
        error: function () {
            location.href = "login.html";
        }
    });
}

function showProvinceList(provinceCode, cityCode, areaCode) {
    let provinceList = $("#province-list");
    $.ajax({
        url: "/districts/",
        type: "POST",
        data: "parent=86",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let code = list[i]["code"];
                    let name = list[i]["name"];
                    let opt = "<option value='" + code + "'>" + name + "</option>";
                    provinceList.append(opt);
                }
                if (provinceCode !== 0) {
                    provinceList.val(provinceCode);
                    showCityList(cityCode, areaCode);
                }
            } else {
                alert("省/直辖市信息加载失败");
                location.href = "address.html";
            }
        }
    });
}

function showCityList(cityCode, areaCode) {
    let defaultOption = "<option value='0'>---- 请选择 ----</option>";
    let parent = $("#province-list").val();
    let cityList = $("#city-list");
    let areaList = $("#area-list");
    cityList.empty();
    areaList.empty();
    cityList.append(defaultOption);
    areaList.append(defaultOption);
    if (parent === 0) {
        return;
    }
    $.ajax({
        url: "/districts/",
        type: "POST",
        data: "parent=" + parent,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let code = list[i]["code"];
                    let name = list[i]["name"];
                    let opt = "<option value='" + code + "'>" + name + "</option>";
                    cityList.append(opt);
                }
                if (cityCode !== 0) {
                    cityList.val(cityCode);
                    showAreaList(areaCode);
                }
            } else {
                alert("城市信息加载失败");
                location.href = "address.html";

            }
        }
    });
}

function showAreaList(areaCode) {
    let defaultOption = "<option value='0'>---- 请选择 ----</option>";
    let parent = $("#city-list").val();
    let areaList = $("#area-list");
    areaList.empty();
    areaList.append(defaultOption);
    if (parent === 0) {
        return;
    }
    $.ajax({
        url: "/districts/",
        type: "POST",
        data: "parent=" + parent,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let code = list[i]["code"];
                    let name = list[i]["name"];
                    let opt = "<option value='" + code + "'>" + name + "</option>";
                    areaList.append(opt);
                }
                if (areaCode !== 0) {
                    $("#area-list").val(areaCode);
                }
            } else {
                alert("区县信息加载失败");
                location.href = "address.html";
            }
        }
    });
}