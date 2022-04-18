$(document).ready(function () {
    let statusStr = $.getUrlParam("status") === null ? "all" : $.getUrlParam("status");
    showOrder(statusStr);
});

function showOrder(statusStr) {
    let orderList = $("#order-list");
    $.ajax({
        url: "/orders/get_by_uid",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                let arr = [0, 1, 2, 3, 4];
                let statusTitle = $("#" + statusStr);
                orderList.empty();
                if (statusStr === "all") {
                    statusTitle.html('<b>全部订单</b>');
                    arr = [0, 1, 2, 3, 4];
                } else if (statusStr === "waitPay") {
                    statusTitle.html('<b>待付款</b>');
                    arr = [0];
                } else if (statusStr === "waitFinish") {
                    statusTitle.html('<b>待收货</b>');
                    arr = [1, 2];
                } else if (statusStr === "finished") {
                    statusTitle.html('<b>已收货</b>');
                    arr = [3];
                } else if (statusStr === "cancel") {
                    statusTitle.html('<b>已取消</b>');
                    arr = [4];
                }
                for (let i = 0; i < list.length; i++) {
                    if (arr.includes(list[i]["status"])) {
                        let date = new Date(list[i]["orderTime"]);
                        let year = date.getFullYear();
                        let month = date.getMonth();
                        let day = date.getDate();
                        let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                        let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                        let str = year + "." + month + "." + day + " " + hours + ":" + min;
                        let status = "未知状态";
                        let btn = "未知状态";
                        let refund = "未知状态";
                        let fn = "";
                        let fun = "";
                        let statusArr = [2, 3, 4];
                        if (list[i]["status"] === 0) {
                            status = "待付款";
                            btn = "点击付款";
                            refund = "取消订单";
                            fn = "toPay";
                            fun = "toCancel";
                        } else if (list[i]["status"] === 1) {
                            status = "待发货";
                            btn = "提醒发货";
                            refund = "申请退款";
                            fn = "toRemind";
                            fun = "toRefund";
                        } else if (list[i]["status"] === 2) {
                            status = "待收货";
                            btn = "确认收货";
                            refund = "申请退款";
                            fn = "toFinish";
                            fun = "toRefund";
                        } else if (list[i]["status"] === 3) {
                            status = "已收货";
                            btn = "删除订单";
                            refund = "申请退款";
                            fn = "toDelete";
                            fun = "toRefund";
                        } else if (list[i]["status"] === 4) {
                            status = "已取消";
                            btn = "删除订单";
                            fn = "toDelete";
                        }
                        let div = '<div class="panel panel-default">\n' +
                            '<div class="panel-heading">\n' +
                            '<p class="panel-title">下单时间：#{orderTime} ，收货人：#{recvName}，#{status}\n' +
                            '<span class="pull-right #{hid}" >\n' +
                            '<button class="btn btn-default btn-xs" onclick="#{fun}(#{oid}#{cancelStatus})">#{refund}</button>\n' +
                            '</span>\n' +
                            '</p>\n' +
                            '</div>\n' +
                            '<div class="panel-body">\n' +
                            '<table class="orders-table">\n' +
                            '<thead>\n' +
                            '<tr>\n' +
                            '<th id="title-th"></th>\n' +
                            '<th id="product-th">商品</th>\n' +
                            '<th id="price-th">单价</th>\n' +
                            '<th id="num-th">数量</th>\n' +
                            '<th id="total-th">小计</th>\n' +
                            '</tr>\n' +
                            '</thead>\n' +
                            '<tbody id="order-item-list#{oid}" class="orders-body">\n' +
                            '</tbody>\n' +
                            '</table>\n' +
                            '<div>\n' +
                            '<span class="pull-right">订单总金额：¥#{totalPrice}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                            '<button class="btn btn-default btn-xs" onclick="#{fn}(#{oid}#{statusStr})">#{btn}</button>\n' +
                            '</span>\n' +
                            '</div>\n' +
                            '</div>\n' +
                            '</div>\n';
                        div = div.replace(/#{orderTime}/g, str);
                        div = div.replace(/#{recvName}/g, list[i]["recvName"]);
                        div = div.replace(/#{status}/g, status);
                        div = div.replace(/#{fun}/g, fun);
                        div = div.replace(/#{refund}/g, refund);
                        div = div.replace(/#{totalPrice}/g, list[i]["totalPrice"]);
                        div = div.replace(/#{oid}/g, list[i]["oid"]);
                        div = div.replace(/#{btn}/g, btn);
                        div = div.replace(/#{fn}/g, fn);
                        div = div.replace(/#{hid}/g, list[i]["status"] === 4 ? "none-display" : "");
                        div = div.replace(/#{cancelStatus}/g, list[i]["status"] === 0 ? ',\'' + statusStr + '\'' : "");
                        div = div.replace(/#{statusStr}/g, statusArr.includes(list[i]["status"]) ? ',\'' + statusStr + '\'' : "");
                        orderList.append(div);
                        showOrderItem(list[i]["oid"]);
                    }
                }
            } else {
                location.href = "404.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}

function showOrderItem(oid) {
    $.ajax({
        url: "/orders/" + oid + "/get_order_item",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let orderItem = $("#order-item-list" + oid);
                orderItem.empty();
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let tr = '<tr>\n' +
                        '<td>\n' +
                        '<img class="img-responsive" src="..#{image}" onclick="toProduct(#{pid})" alt=""/>\n' +
                        '</td>\n' +
                        '<td>\n' +
                        '<a href="javascript:void(0)" onclick="toProduct(#{pid})">#{title}</a>\n' +
                        '</td>\n' +
                        '<td>¥\n' +
                        '<span>#{price}</span>\n' +
                        '</td>\n' +
                        '<td>#{num}件</td>\n' +
                        '<td>¥\n' +
                        '<span>#{totalPrice}</span>\n' +
                        '</td>\n' +
                        '</tr>';
                    tr = tr.replace(/#{pid}/g, list[i]["pid"]);
                    tr = tr.replace(/#{image}/g, list[i]["image"]);
                    tr = tr.replace(/#{title}/g, list[i]["title"]);
                    tr = tr.replace(/#{price}/g, list[i]["price"]);
                    tr = tr.replace(/#{num}/g, list[i]["num"]);
                    tr = tr.replace(/#{totalPrice}/g, (String)(list[i]["price"] * list[i]["num"]));
                    orderItem.append(tr);
                }
            } else {
                location.href = "404.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}

function toPay(oid) {
    let toNext = $("#to-next");
    let temp = '<input id="to-next-item" type="text" name="oid" value="#{oid}"/>';
    temp = temp.replace(/#{oid}/g, oid);
    toNext.attr("action", "payment.html");
    toNext.append(temp);
    toNext.submit();
}

function toFinish(oid, statusStr) {
    $.ajax({
        url: "/orders/set_finish",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showOrder(statusStr);
            } else if (json.state === 4008) {
                alert("确认收货失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("确认收货失败（用户非法访问）");
            } else if (json.state === 4011) {
                alert("确认收货失败（订单未付款）");
            } else {
                alert("确认收货失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("确认收货产生未知异常" + xhr.status);
        }
    });
}

function toDelete(oid, statusStr) {
    $.ajax({
        url: "/orders/set_delete",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showOrder(statusStr);
            } else if (json.state === 4008) {
                alert("删除订单失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("删除订单失败（用户非法访问）");
            } else if (json.state === 4012) {
                alert("删除订单失败（订单未完成）");
            } else {
                alert("删除订单失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("删除订单产生未知异常" + xhr.status);
        }
    });
}

function toCancel(oid, statusStr) {
    $.ajax({
        url: "/orders/set_cancel",
        type: "POST",
        data: "oid=" + oid,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showOrder(statusStr)
            } else if (json.state === 4008) {
                alert("取消订单失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("取消订单失败（用户非法访问）");
            } else if (json.state === 4013) {
                alert("取消订单失败（订单未完成）");
            } else {
                alert("取消订单失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("取消订单产生未知异常" + xhr.status);
        }
    });
}

function toRemind(oid) {
    $.ajax({
        url: "/orders/message/create",
        type: "POST",
        data: "oid=" + oid + "&messageType=1",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("已提醒卖家发货");
            } else if (json.state === 4008) {
                alert("提醒发货失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("提醒发货失败（用户非法访问）");
            } else {
                alert("提醒发货失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("提醒发货产生未知异常" + xhr.status);
        }
    });
}

function toRefund(oid) {
    $.ajax({
        url: "/orders/message/create",
        type: "POST",
        data: "oid=" + oid + "&messageType=2",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                alert("已提交申请");
            } else if (json.state === 4008) {
                alert("申请退款失败（订单不存在）");
            } else if (json.state === 4005) {
                alert("申请退款失败（用户非法访问）");
            } else {
                alert("申请退款失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("申请退款产生未知异常" + xhr.status);
        }
    });
}