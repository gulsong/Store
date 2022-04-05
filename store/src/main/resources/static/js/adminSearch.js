$(document).ready(function () {
    let keyword = $.getUrlParam("keyword");
    let pageNum = $.getUrlParam("pageNum") === null ? 1 : $.getUrlParam("pageNum");
    showSearchList(keyword, pageNum);
    showUser();
});

function showSearchList(keyword, pageNum) {
    let thisUser = 0;
    let thisUserType = 3;
    let userList = $("#user-list");
    let searchKey = $("#search-key");
    let page = $("#page");
    let Url = "search.html";
    userList.empty();
    $.ajax({
        url: "/users/get_uid",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            thisUser = json.data;
        }
    });
    $.ajax({
        url: "/users/get_user_type",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            thisUserType = json.data;
        }
    });
    $.ajax({
        url: "/users/admin/search_user",
        type: "POST",
        data: "keyword=" + keyword + "&pageNum=" + pageNum,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                searchKey.html(keyword);
                if (json.data.list.length === 0 || keyword === "") {
                    let tr = '<tr class="well" >\n' +
                        '<td  colspan="3">暂无数据。</td>\n' +
                        '</tr>\n';
                    userList.append(tr);
                } else {
                    if (json.data["pageNum"] > 0) {
                        let list = json.data["list"];
                        let first = findFirst(json.data["pageNum"], json.data["pageSize"])
                        for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                            let tr = '<tr id="user#{uid}" class="well">\n' +
                                '<td>#{username}</td>\n' +
                                '<td>#{userType}</td>\n' +
                                '<td>\n' +
                                '<div class="btn-group" role="group">\n';
                            if (list[i]["uid"] === thisUser) {
                                tr += '<a href="changePassword.html">\n' +
                                    '<button class="btn btn-default" type="button" data-toggle="modal" >修改密码</button>\n' +
                                    '</a>\n';
                            } else {
                                tr += '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">修改权限\n' +
                                    '<span class="caret"></span>\n' +
                                    '</button>\n' +
                                    '<ul class="dropdown-menu">\n' +
                                    '<li>\n' +
                                    '<a id="changeToAdmin#{uid}" href="javascript:void(0);"  onclick="setUserType(#{uid},2)">管理员</a>\n' +
                                    '</li>\n' +
                                    '<li>\n' +
                                    '<a id="changeToSale#{uid}" href="javascript:void(0);"  onclick="setUserType(#{uid},1)">销售</a>\n' +
                                    '</li>\n' +
                                    '<li>\n' +
                                    '<a id="changeToCustomer#{uid}" href="javascript:void(0);"  onclick="setUserType(#{uid},0)">顾客</a>\n' +
                                    '</li>\n' +
                                    '</ul>\n';
                                if (thisUserType === 3 || list[i]["userType"] === 0 || list[i]["userType"] === 1) {
                                    tr += '<button class="btn btn-default" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{uid})">删除</button>\n';
                                }
                            }
                            tr += '</div>\n';
                            '</td>\n' +
                            '</tr>';
                            let userTypeStr = '';
                            if (list[i]["userType"] === 0) {
                                userTypeStr = "顾客";
                            } else if (list[i]["userType"] === 1) {
                                userTypeStr = "销售";
                            } else if (list[i]["userType"] === 2) {
                                userTypeStr = "管理员";
                            }
                            tr = tr.replace(/#{username}/g, list[i]["username"]);
                            tr = tr.replace(/#{uid}/g, list[i]["uid"]);
                            tr = tr.replace(/#{userType}/g, userTypeStr);
                            userList.append(tr);
                        }
                        let li = '<li #{disabled}>\n' +
                            '<a href="#{url}?keyword=#{keyword}&pageNum=#{pre}" aria-label="Previous">\n' +
                            '<span aria-hidden="true">&laquo;</span>\n' +
                            '</a>\n' +
                            '</li>\n';
                        li = li.replace(/#{disabled}/g, json.data["pageNum"] === 1 ? 'class="disabled"' : "");
                        li = li.replace(/#{url}/g, json.data["pageNum"] === 1 ? "javascript:void(0);" : Url);
                        li = li.replace(/#{keyword}/g, keyword);
                        li = li.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) - 1));
                        page.append(li);
                        for (let i = json.data["pageNum"] > 2 ? json.data["pageNum"] - 3 : 0; i < (json.data["pages"] < json.data["pageNum"] + 3 ? json.data["pages"] : (json.data["pageNum"] + 3)); i++) {
                            if (i + 1 === json.data["pageNum"]) {
                                li = '<li class="active">\n' +
                                    '<a href="' + Url + '?keyword=#{keyword}&pageNum=#{pageNum}">#{pageNum}</a>\n' +
                                    '</li>\n';
                            } else {
                                li = '<li>\n' +
                                    '<a href="' + Url + '?keyword=#{keyword}&pageNum=#{pageNum}">#{pageNum}</a>\n' +
                                    '</li>\n';
                            }
                            li = li.replace(/#{keyword}/g, keyword);
                            li = li.replace(/#{pageNum}/g, i + 1);
                            page.append(li);
                        }
                        li = '<li #{disabled}>\n' +
                            '<a href="#{url}?keyword=#{keyword}&pageNum=#{pre}" aria-label="Next">\n' +
                            '<span aria-hidden="true">&raquo;</span>\n' +
                            '</a>\n' +
                            '</li>\n';
                        li = li.replace(/#{disabled}/g, json.data["pageNum"] < json.data["pages"] ? "" : 'class="disabled"');
                        li = li.replace(/#{url}/g, json.data["pageNum"] < json.data["pages"] ? Url : "javascript:void(0);");
                        li = li.replace(/#{keyword}/g, keyword);
                        li = li.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) + 1));
                        page.append(li);
                    }
                }
            } else {
                location.href = "../404.html";
            }
        },
        error: function () {
            location.href = "../500.html";
        }
    });
}