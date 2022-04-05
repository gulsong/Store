$(document).ready(function () {
    showUser();
    showOrderList();
});

function showOrderList() {
    let orderList = $("#order-list");
    let page = $("#page");
    let Url = "orders.html";
    orderList.empty();
    page.empty();
    $.ajax({
        url: "/orders/sale/orders_list",
        type: "POST",
        data: location.search.substring(1),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                if (json.data["pageNum"] > 0) {
                    let list = json.data["list"];
                    let first = findFirst(json.data["pageNum"], json.data["pageSize"])
                    for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                        let date = new Date(list[i]["payTime"]);
                        let year = date.getFullYear();
                        let month = date.getMonth();
                        let day = date.getDate();
                        let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                        let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                        let str = year + "." + month + "." + day + " " + hours + ":" + min;
                        let tr = '<tr class="well">\n' +
                            '<td>#{oid}</td>\n' +
                            '<td>#{name}</td>\n' +
                            '<td>#{province}#{city}#{area}#{address}</td>\n' +
                            '<td>￥#{price}</td>\n' +
                            '<td>#{status}</td>\n' +
                            '<td>#{payTime}</td>\n' +
                            '<td>\n' +
                            '<a href="orderInfo.html?oid=#{oid}">订单详情</a>\n' +
                            '</td>\n' +
                            '</tr>';
                        let statusStr = '';
                        if (list[i]["status"] === 0) {
                            statusStr = "未支付";
                        } else if (list[i]["status"] === 1) {
                            statusStr = "未发货";
                        } else if (list[i]["status"] === 2) {
                            statusStr = "未收货";
                        } else if (list[i]["status"] === 3) {
                            statusStr = "已收货";
                        } else if (list[i]["status"] === 4) {
                            statusStr = "已取消";
                        }
                        tr = tr.replace(/#{oid}/g, list[i]["oid"]);
                        tr = tr.replace(/#{name}/g, list[i]["recvName"]);
                        tr = tr.replace(/#{province}/g, list[i]["recvProvince"]);
                        tr = tr.replace(/#{city}/g, list[i]["recvCity"]);
                        tr = tr.replace(/#{area}/g, list[i]["recvArea"]);
                        tr = tr.replace(/#{address}/g, list[i]["recvAddress"]);
                        tr = tr.replace(/#{price}/g, list[i]["totalPrice"]);
                        tr = tr.replace(/#{payTime}/g, str);
                        tr = tr.replace(/#{status}/g, statusStr);
                        orderList.append(tr);
                    }
                    let li = '<li #{disabled}>\n' +
                        '<a href="#{url}?pageNum=#{pre}" aria-label="Previous">\n' +
                        '<span aria-hidden="true">&laquo;</span>\n' +
                        '</a>\n' +
                        '</li>\n';
                    li = li.replace(/#{disabled}/g, json.data["pageNum"] === 1 ? 'class="disabled"' : "");
                    li = li.replace(/#{url}/g, json.data["pageNum"] === 1 ? "javascript:void(0);" : Url);
                    li = li.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) - 1));
                    page.append(li);
                    for (let i = json.data["pageNum"] > 2 ? json.data["pageNum"] - 3 : 0; i < (json.data["pages"] < json.data["pageNum"] + 3 ? json.data["pages"] : (json.data["pageNum"] + 3)); i++) {
                        if (i + 1 === json.data["pageNum"]) {
                            li = '<li class="active">\n' +
                                '<a href="' + Url + '?pageNum=#{pageNum}">#{pageNum}</a>\n' +
                                '</li>\n';
                        } else {
                            li = '<li>\n' +
                                '<a href="' + Url + '?pageNum=#{pageNum}">#{pageNum}</a>\n' +
                                '</li>\n';
                        }
                        li = li.replace(/#{pageNum}/g, i + 1);
                        page.append(li);
                    }
                    li = '<li #{disabled}>\n' +
                        '<a href="#{url}?pageNum=#{pre}" aria-label="Next">\n' +
                        '<span aria-hidden="true">&raquo;</span>\n' +
                        '</a>\n' +
                        '</li>\n';
                    li = li.replace(/#{disabled}/g, json.data["pageNum"] < json.data["pages"] ? "" : 'class="disabled"');
                    li = li.replace(/#{url}/g, json.data["pageNum"] < json.data["pages"] ? Url : "javascript:void(0);");
                    li = li.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) + 1));
                    page.append(li);
                }
            }
        }
    });
}