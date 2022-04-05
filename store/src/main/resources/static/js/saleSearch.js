$(document).ready(function () {
    let keyword = getUrlParam("keyword");
    let pageNum = $.getUrlParam("pageNum") === null ? 1 : $.getUrlParam("pageNum");
    showSearch(keyword, pageNum);
    showUser();
});

function showSearch(keyword, pageNum) {
    let searchList = $("#search-list");
    let searchKey = $("#search-key");
    let page = $("#page");
    let Url = "search.html";
    searchList.empty();
    $.ajax({
        url: "/products/sale/search_list",
        type: "POST",
        data: "keyword=" + keyword + "&pageNum=" + pageNum,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                searchKey.html(keyword);
                if (json.data.list.length === 0 || keyword === "") {
                    let tr = '<tr class="well" >\n' +
                        '<td  colspan="8">暂无数据。</td>\n' +
                        '</tr>\n';
                    searchList.append(tr);
                }else {
                    if (json.data["pageNum"] > 0) {
                        let list = json.data["list"];
                        let first = findFirst(json.data["pageNum"], json.data["pageSize"])
                        for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                            let tr = '<tr class="well">\n' +
                                '<td>\n' +
                                '<img class="product-img-box" src="../..#{image}" alt=""/>\n' +
                                '</td>\n' +
                                '<td>#{title}</td>\n' +
                                '<td>￥#{price}</td>\n' +
                                '<td>#{num}</td>\n' +
                                '<td>#{category}</td>\n' +
                                '<td>#{priority}</td>\n' +
                                '<td>#{status}</td>\n' +
                                '<td>\n' +
                                '<div class="btn-group" role="group">\n' +
                                '<button class="btn btn-default" type="button" data-toggle="modal" data-target="#sale-message-dialog" onclick="showSaleMessage(#{pid})">查看销量</button>\n' +
                                '<button class="btn btn-default" type="button" data-toggle="modal" onclick="changeStatus(#{pid},#{changeStatusData})">#{changeStatus}</button>\n' +
                                '<a href="changeProductInfo.html?pid=#{pid}" class="btn btn-default">修改商品信息</a>\n' +
                                '<button class="btn btn-default" type="button" data-toggle="modal" data-target="#change-price-dialog" onclick="bindChangePrice(#{pid})">修改价格</button>\n' +
                                '<button class="btn btn-default" type="button" data-toggle="modal" data-target="#delete-dialog" onclick="bindDelete(#{pid})">删除</button>\n' +
                                '</div>\n' +
                                '</td>\n' +
                                '</tr>';
                            tr = tr.replace(/#{image}/g, list[i]["image"]);
                            tr = tr.replace(/#{title}/g, list[i]["title"]);
                            tr = tr.replace(/#{price}/g, list[i]["price"]);
                            tr = tr.replace(/#{num}/g, list[i]["num"]);
                            tr = tr.replace(/#{priority}/g, list[i]["priority"]);
                            tr = tr.replace(/#{pid}/g, list[i]["id"]);
                            if (parseInt(list[i]["status"]) === 1) {
                                tr = tr.replace(/#{status}/g, "已上架");
                                tr = tr.replace(/#{changeStatusData}/g, 2);
                                tr = tr.replace(/#{changeStatus}/g, "下架");
                            } else if (parseInt(list[i]["status"]) === 2) {
                                tr = tr.replace(/#{status}/g, "已下架");
                                tr = tr.replace(/#{changeStatusData}/g, 1);
                                tr = tr.replace(/#{changeStatus}/g, "上架");
                            }
                            tr = tr.replace(/#{category}/g, getCategoryName(list[i]["categoryId"]));
                            searchList.append(tr);
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
            }
        }
    });
}