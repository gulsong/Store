$(document).ready(function () {
    showPaymentTotal();
});

function showPaymentTotal() {
    let oid = location.search.substring(1).split("&")[1] !== undefined ? location.search.substring(1).split("&")[1] : location.search.substring(1);
    let payBox = $("#pay-box");
    payBox.empty();
    $.ajax({
        url: "/orders/get_by_oid",
        type: "GET",
        data: oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let payment = '¥#{price} <input id="btn-pay" class="btn btn-primary btn-lg link-success" type="button" value="确认付款" onclick="reduceProductNum()"/>';
                payment = payment.replace(/#{price}/g, json.data["totalPrice"]);
                payBox.append(payment);
            } else if (json.state === 4008) {
                alert("获取订单失败（订单不存在）");
                location.href = "orderConfirm.html";
            } else if (json.state === 4005) {
                alert("获取订单失败（用户非法访问）");
                location.href = "orderConfirm.html";
            } else {
                alert("获取订单失败，未知错误");
                location.href = "orderConfirm.html";
            }
        },
        error: function (xhr) {
            alert("获取订单产生未知异常" + xhr.status);
            location.href = "orderConfirm.html";
        }
    });
}

function reduceProductNum() {
    let oid = location.search.substring(1).split("&")[1] !== undefined ? location.search.substring(1).split("&")[1] : location.search.substring(1);
    $.ajax({
        url: "/orders/reduce_product_num",
        type: "POST",
        data: oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                addProductPriority();
            } else if (json.state === 4010) {
                alert("支付订单失败（商品库存不足）");
            } else {
                alert("支付订单失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("支付订单产生未知异常" + xhr.status);
        }
    });
}

function addProductPriority() {
    let oid = location.search.substring(1).split("&")[1] !== undefined ? location.search.substring(1).split("&")[1] : location.search.substring(1);
    $.ajax({
        url: "/orders/add_product_priority",
        type: "POST",
        data: oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                pay();
            } else {
                alert("支付订单失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("支付订单产生未知异常" + xhr.status);
        }
    });
}

function pay() {
    let oid = location.search.substring(1).split("&")[1] !== undefined ? location.search.substring(1).split("&")[1] : location.search.substring(1);
    $.ajax({
        url: "/orders/set_pay",
        type: "POST",
        data: oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "paySuccess.html";
            } else if (json.state === 4008) {
                alert("支付订单失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("支付订单失败（用户非法访问）");
            } else if (json.state === 4009) {
                alert("支付订单失败（订单无法支付）");
            } else {
                alert("支付订单失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("支付订单产生未知异常" + xhr.status);
        }
    });
}