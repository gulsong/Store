$(document).ready(function () {
    let createOrderBtn = $("#btn-create-order");
    createOrderBtn.bind("click", function () {
        createOrder();
    })
    if (location.search.substring(1, 2) === "c") {
        showOrderCartList();
    } else if (location.search.substring(1, 2) === "p") {
        let pid = location.search.substring(1).split("&")[0].split("=")[1];
        let num = location.search.substring(1).split("&")[1].split("=")[1];
        showOrderProduct(pid, num);
    }
    showOrderAddressList();
});

function showOrderCartList() {
    let cartList = $("#cart-list");
    let allCountBox = $("#all-count");
    let allPriceBox = $("#all-price");
    cartList.empty();
    $.ajax({
        url: "/carts/list",
        type: "GET",
        data: location.search.substring(1),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                let allCount = 0;
                let allPrice = 0;
                for (let i = 0; i < list.length; i++) {
                    let tr = '<tr>\n' +
                        '<td>\n' +
                        '<img class="img-responsive" src="../{image}" alt=""/>\n' +
                        '</td>\n' +
                        '<td>#{title}</td>\n' +
                        '<td>¥\n' +
                        '<span>#{price}</span>\n' +
                        '</td>\n' +
                        '<td>#{num}</td>\n' +
                        '<td>\n' +
                        '<span>#{totalPrice}</span>\n' +
                        '</td>\n' +
                        '</tr>';
                    tr = tr.replace(/#{image}/g, list[i]["image"]);
                    tr = tr.replace(/#{title}/g, list[i]["title"]);
                    tr = tr.replace(/#{price}/g, list[i]["price"]);
                    tr = tr.replace(/#{num}/g, list[i]["num"]);
                    tr = tr.replace(/#{totalPrice}/g, list[i]["price"] * list[i]["num"]);
                    cartList.append(tr);
                    allCount += list[i]["num"];
                    allPrice += list[i]["price"] * list[i]["num"];
                }
                allCountBox.html(allCount);
                allPriceBox.html(allPrice);
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}

function showOrderProduct(pid, num) {
    let cartList = $("#cart-list");
    let allCountBox = $("#all-count");
    let allPriceBox = $("#all-price");
    $.ajax({
        url: "/products/" + pid + "/details",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let tr = '<tr>\n' +
                    '<td>\n' +
                    '<img class="img-responsive" src="..#{image}" alt=""/>\n' +
                    '</td>\n' +
                    '<td>#{title}</td>\n' +
                    '<td>¥\n' +
                    '<span>#{price}</span>\n' +
                    '</td>\n' +
                    '<td>#{num}</td>\n' +
                    '<td>\n' +
                    '<span>#{totalPrice}</span>\n' +
                    '</td>\n' +
                    '</tr>\n';
                tr = tr.replace(/#{image}/g, json.data["image"]);
                tr = tr.replace(/#{title}/g, json.data["title"]);
                tr = tr.replace(/#{price}/g, json.data["price"]);
                tr = tr.replace(/#{num}/g, num);
                tr = tr.replace(/#{totalPrice}/g, json.data["price"] * num);
                cartList.append(tr);
                allCountBox.html(num);
                allPriceBox.html(json.data["price"] * num);
            } else {
                location.href = "404.html";
            }
        }

    });
}

function showOrderAddressList() {
    let addressList = $("#address-list");
    addressList.empty();
    $.ajax({
        url: "/addresses/",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let opt = "<option value='#{aid}'>#{name}&nbsp;&nbsp;&nbsp;#{tag}&nbsp;&nbsp;&nbsp;#{provinceName}#{cityName}#{areaName}#{address}&nbsp;&nbsp;&nbsp;#{phone}</option>"
                    opt = opt.replace(/#{aid}/g, list[i]["aid"]);
                    opt = opt.replace(/#{name}/g, list[i]["name"]);
                    opt = opt.replace(/#{tag}/g, list[i]["tag"] !== null ? list[i]["tag"] : "");
                    opt = opt.replace(/#{provinceName}/g, list[i]["provinceName"]);
                    opt = opt.replace(/#{cityName}/g, list[i]["cityName"]);
                    opt = opt.replace(/#{areaName}/g, list[i]["areaName"]);
                    opt = opt.replace(/#{address}/g, list[i]["address"]);
                    opt = opt.replace(/#{phone}/g, list[i]["phone"]);
                    addressList.append(opt);
                }
            }
        },
        error: function (xhr) {
            alert("购物车收货地址列表数据加载产生未知的异常" + xhr.status);
        }
    });
}

function createOrder() {
    let formCreateOrder = $("#form-create-order");
    if (location.search.substring(1, 2) === "c") {
        let aid = $("#address-list").val();
        let cids = location.search.substring(1);
        $.ajax({
            url: "/orders/create",
            type: "POST",
            data: "aid=" + aid + "&" + cids,
            dataType: "JSON",
            success: function (json) {
                if (json.state === 200) {
                    let temp = '<input id="to-next-item" name="oid" type="text" value="#{oid}">';
                    temp = temp.replace(/#{oid}/g, json.data["oid"]);
                    formCreateOrder.append(temp);
                    formCreateOrder.submit();
                }
            },
            error: function (xhr) {
                alert("创建订单产生未知的异常" + xhr.status);
            }
        });
    } else if (location.search.substring(1, 2) === "p") {
        let aid = $("#address-list").val();
        $.ajax({
            url: "/orders/create_by_pid",
            type: "POST",
            data: "aid=" + aid + "&" + location.search.substring(1),
            dataType: "JSON",
            success: function (json) {
                if (json.state === 200) {
                    let temp = '<input id="to-next-item" type="text" name="oid" value="#{oid}">';
                    temp = temp.replace(/#{oid}/g, json.data["oid"]);
                    formCreateOrder.append(temp);
                    formCreateOrder.submit();
                }
            },
            error: function (xhr) {
                alert("创建订单产生未知的异常" + xhr.status);
            }
        });
    }
}