$(document).ready(function () {
    let oid = $.getUrlParam("oid");
    showUser();
    showOrderInfo(oid);
});

function showOrderInfo(oid) {
    let panelBody = $(".panel-body");
    let panelFooter = $("#order-info-panel-footer");
    let html = "";
    $.ajax({
        url: "/orders/sale/get_by_oid",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#info-oid").html(json.data["oid"]);
                $("#info-name").html(json.data["recvName"]);
                $("#info-phone").html(json.data["recvPhone"]);
                $("#info-address").html(json.data["recvProvince"] + json.data["recvCity"] + json.data["recvArea"] + json.data["recvAddress"]);
                $("#info-total").html(json.data["totalPrice"]);
                if (json.data["status"] === 0) {
                    $("#info-status").html("未支付");
                    $("#pay-time").remove();
                    html = '<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{oid})">删除</button>\n';
                } else if (json.data["status"] === 1) {
                    let date = new Date(json.data["payTime"]);
                    let year = date.getFullYear();
                    let month = date.getMonth();
                    let day = date.getDate();
                    let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                    let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                    let str = year + "." + month + "." + day + " " + hours + ":" + min;
                    $("#info-status").html("未发货");
                    $("#info-pay-time").html(str);
                    html = '<button id="btn-send" class="btn btn-primary" type="button" onclick="toSend(#{oid})">已发货</button>\n' +
                        '<button id="btn-refund" class="btn btn-primary" type="button" onclick="toRefund(#{oid})">已退款</button>\n';
                } else if (json.data["status"] === 2) {
                    let date = new Date(json.data["payTime"]);
                    let year = date.getFullYear();
                    let month = date.getMonth();
                    let day = date.getDate();
                    let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                    let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                    let str = year + "." + month + "." + day + " " + hours + ":" + min;
                    $("#info-status").html("未收货");
                    $("#info-pay-time").html(str);
                    html = '<button id="btn-refund" class="btn btn-primary" type="button" onclick="toRefund(#{oid})">已退款</button>\n';
                } else if (json.data["status"] === 3) {
                    let date = new Date(json.data["payTime"]);
                    let year = date.getFullYear();
                    let month = date.getMonth();
                    let day = date.getDate();
                    let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                    let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                    let str = year + "." + month + "." + day + " " + hours + ":" + min;
                    $("#info-status").html("已收货");
                    $("#info-pay-time").html(str);
                    html = '<button id="btn-refund" class="btn btn-primary" type="button" onclick="toRefund(#{oid})">已退款</button>\n' +
                        '<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{oid})">删除</button>\n';
                } else if (json.data["status"] === 4) {
                    $("#info-status").html("已取消");
                    $("#pay-time").remove();
                    html = '<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{oid})">删除</button>\n';
                }
                showOrderItem(oid);
                html = html.replace(/#{oid}/g, json.data["oid"]);
                panelFooter.html(html);
            } else if (json.state === 4008) {
                panelBody.empty();
                panelBody.html("未找到该订单。");
            }
        }
    });
}

function showOrderItem(oid) {
    let OrderItemList = $("#order-item-list");
    OrderItemList.empty();
    $.ajax({
        url: "/orders/" + oid + "/get_order_item",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let tr = '<tr class="well">\n' +
                        '<td>#{title}</td>\n' +
                        '<td>￥#{price}</td>\n' +
                        '<td>#{num}</td>\n' +
                        '<td>￥#{total}</td>\n' +
                        '</tr>\n'
                    tr = tr.replace(/#{title}/g, list[i]["title"]);
                    tr = tr.replace(/#{price}/g, list[i]["price"]);
                    tr = tr.replace(/#{num}/g, list[i]["num"]);
                    tr = tr.replace(/#{total}/g, (String)(list[i]["price"] * list[i]["num"]));
                    OrderItemList.append(tr);
                }
            }
        }
    });
}

function toSend(oid) {
    $.ajax({
        url: "/orders/sale/set_send",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showOrderInfo(oid);
            } else if (json.state === 4008) {
                alert("确认发货失败（订单不存在）");
            } else if (json.state === 4017) {
                alert("确认发货失败（订单未付款）");
            } else {
                alert("确认发货失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("确认发货产生未知异常" + xhr.status);
        }
    });
}

function toRefund(oid) {
    $.ajax({
        url: "/orders/sale/set_refund",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showOrderInfo(oid);
            } else if (json.state === 4008) {
                alert("确认退款失败（订单不存在）");
            } else if (json.state === 4018) {
                alert("确认退款失败（订单未付款）");
            } else {
                alert("确认退款失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("确认退款产生未知异常" + xhr.status);
        }
    });
}

function toDelete(oid) {
    $.ajax({
        url: "/orders/sale/set_delete",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "orders.html";
            } else if (json.state === 4008) {
                alert("删除订单失败（订单不存在）");
                $(".modal").modal('toggle');
            } else if (json.state === 4012) {
                alert("删除订单失败（订单未完成）");
                $(".modal").modal('toggle');
            } else {
                alert("删除订单失败，未知错误");
                $(".modal").modal('toggle');
            }
        },
        error: function (xhr) {
            alert("删除订单产生未知异常" + xhr.status);
            $(".modal").modal('toggle');
        }
    });
}

function bindDelete(oid) {
    let deleteYes = $("#delete-yes");
    deleteYes.unbind("click");
    deleteYes.bind("click", function () {
        toDelete(oid);
    });
}