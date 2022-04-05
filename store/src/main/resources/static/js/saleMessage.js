$(document).ready(function () {
    showUser();
    showMessageList();
});

function showMessageList() {
    let messageList = $("#message-list");
    let page = $("#page");
    let Url = "message.html";
    messageList.empty();
    page.empty();
    $.ajax({
        url: "/orders/message/list",
        type: "POST",
        data: location.search.substring(1),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                if (json.data["pageNum"] > 0) {
                    let list = json.data["list"];
                    let first = findFirst(json.data["pageNum"], json.data["pageSize"])
                    for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                        let date = new Date(list[i]["createdTime"]);
                        let year = date.getFullYear();
                        let month = date.getMonth();
                        let day = date.getDate();
                        let hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                        let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                        let str = year + "." + month + "." + day + " " + hours + ":" + min;
                        let tr = '<tr class="well">\n' +
                            '<td>#{oid}</td>\n' +
                            '<td>#{type}</td>\n' +
                            '<td>#{time}</td>\n' +
                            '<td>#{status}</td>\n';
                        let typeStr = '';
                        let statusStr = '';
                        if (list[i]["messageType"] === 1) {
                            typeStr = "提醒发货";
                        } else if (list[i]["messageType"] === 2) {
                            typeStr = "申请退款";
                        }
                        if (list[i]["status"] === 1) {
                            statusStr = "未处理";
                            tr += '<td>\n' +
                                '<a href="orderInfo.html?oid=#{oid}">前往处理</a>\n' +
                                '</td>\n' +
                                '<td>\n' +
                                '<button class="btn btn-primary" type="button" onclick="toFinish(#{id})">处理完成</button>\n' +
                                '</td>\n';
                        } else if (list[i]["status"] === 2) {
                            statusStr = "已处理";
                            tr += '<td colspan="2">\n' +
                                '<button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{id})">删除</button>\n' +
                                '</td>\n';
                        }
                        tr += '</tr>\n';
                        tr = tr.replace(/#{id}/g, list[i]["id"]);
                        tr = tr.replace(/#{oid}/g, list[i]["oid"]);
                        tr = tr.replace(/#{type}/g, typeStr);
                        tr = tr.replace(/#{time}/g, str);
                        tr = tr.replace(/#{status}/g, statusStr);
                        messageList.append(tr);
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

function toFinish(id) {
    $.ajax({
        url: "/orders/message/finish",
        type: "POST",
        data: "id=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showMessageList();
            } else if (json.state === 4016) {
                alert("确认完成失败（消息不存在）");
            } else {
                alert("确认完成失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("确认完成产生未知异常" + xhr.status);
        }
    });
}

function deleteMessage(id) {
    $.ajax({
        url: "/orders/message/delete",
        type: "POST",
        data: "id=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showMessageList();
                $(".modal").modal('toggle');
            } else if (json.state === 4016) {
                alert("删除失败（消息不存在）");
                $(".modal").modal('toggle');
            } else {
                alert("删除失败，未知错误");
                $(".modal").modal('toggle');
            }
        },
        error: function (xhr) {
            alert("删除产生未知异常" + xhr.status);
        }
    });
}

function bindDelete(id) {
    let deleteYes = $("#delete-yes");
    deleteYes.unbind("click");
    deleteYes.bind("click", function () {
        deleteMessage(id);
    });
}