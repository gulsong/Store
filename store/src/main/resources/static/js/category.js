$(document).ready(function () {
    let categoryId = $.getUrlParam("categoryId");
    let pageNum = $.getUrlParam("pageNum") === null ? 1 : $.getUrlParam("pageNum");
    showUser();
    showCategoryList(categoryId);
    showCategory(categoryId, pageNum);
});

function showCategory(categoryId, pageNum) {
    let categoryList = $("#category-list");
    let page = $("#page");
    let categoryUrl = "category.html";
    categoryList.empty();
    $.ajax({
        url: "/products/category_list",
        type: "POST",
        data: "categoryId=" + categoryId + "&pageNum=" + pageNum,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                if (json.data["pageNum"] > 0) {
                    let list = json.data["list"];
                    let html = '';
                    let first = findFirst(json.data["pageNum"], json.data["pageSize"]);
                    for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                        let row = i - first;
                        if (row % 4 === 0) {
                            html += '<div id="product-row" class="col-md-offset-1 col-md-10">\n';
                        }
                        html += '<div class="col-md-3">\n' +
                            '<div class="goods-panel">\n' +
                            '<img class="img-responsive" src="..#{image}" onclick="toProduct(#{id})" alt=""/>\n' +
                            '</div>\n' +
                            '<p>¥#{price}</p>\n' +
                            '<p class="text-row-3">\n' +
                            '<a href="product.html?id=#{id}">\n' +
                            '<small>#{title}</small>\n' +
                            '</a>\n' +
                            '</p>\n' +
                            '</div>\n';

                        if (row % 4 === 3 || i === ((json.data["pageNum"] * json.data["pageSize"]) - 1) || i === list.length - 1) {
                            html += '</div>\n';
                        }
                        html = html.replace(/#{image}/g, list[i]["image"]);
                        html = html.replace(/#{title}/g, list[i]["title"]);
                        html = html.replace(/#{price}/g, list[i]["price"]);
                        html = html.replace(/#{id}/g, list[i]["id"]);
                    }
                    categoryList.html(html);
                    html = '<a href="' + categoryUrl + '?categoryId=#{id}&pageNum=#{pre}">上一页</a>\n';
                    html = html.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) - 1));
                    html = html.replace(/#{id}/g, categoryId);
                    if (json.data["pageNum"] === 1) {
                        html = '';
                    }
                    for (let i = json.data["pageNum"] > 2 ? json.data["pageNum"] - 3 : 0; i < (json.data["pages"] < json.data["pageNum"] + 3 ? json.data["pages"] : (json.data["pageNum"] + 3)); i++) {
                        if (i + 1 === json.data["pageNum"]) {
                            html += '<a id="active-page" href="' + categoryUrl + '?categoryId=#{id}&pageNum=#{pageNum}">#{pageNum}</a>\n';
                        } else {
                            html += '<a href="' + categoryUrl + '?categoryId=#{id}&pageNum=#{pageNum}">#{pageNum}</a>\n';
                        }
                        html = html.replace(/#{pageNum}/g, i + 1);
                        html = html.replace(/#{id}/g, categoryId);
                    }
                    if (json.data["pageNum"] < json.data["pages"]) {
                        html += '<a href="' + categoryUrl + '?categoryId=#{id}&pageNum=#{next}">下一页</a>\n';
                        html = html.replace(/#{next}/g, (String)(parseInt(json.data["pageNum"]) + 1));
                        html = html.replace(/#{id}/g, categoryId);
                    }
                    page.html(html);
                }
            }
        }
    });
}