$(document).ready(function () {
    showUser();
    showCategoryList(-1);
    showHotList();
    showNewList();
});

function showHotList() {
    let hotList = $("#hot-list");
    hotList.empty();
    $.ajax({
        url: "/products/hot_list",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            let list = json.data;
            for (let i = 0; i < list.length; i++) {
                let html = '<div class="col-md-12 hot-item">\n' +
                    '<div class="col-md-7 text-row-2">\n' +
                    '<a href="product.html?id=#{id}">#{title}</a>\n' +
                    '</div>\n' +
                    '<div class="col-md-2">¥#{price}</div>\n' +
                    '<div class="col-md-3">\n' +
                    '<img class="img-responsive" src="..#{image}" onclick="toProduct(#{id})" alt=""/>\n' +
                    '</div>\n' +
                    '</div>\n';
                html = html.replace(/#{id}/g, list[i]["id"]);
                html = html.replace(/#{title}/g, list[i]["title"]);
                html = html.replace(/#{price}/g, list[i]["price"]);
                html = html.replace(/#{image}/g, list[i]["image"]);
                hotList.append(html);
            }
        }
    });
}

function showNewList() {
    let newList = $("#new-list");
    newList.empty();
    $.ajax({
        url: "/products/new_list",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            let list = json.data;
            for (let i = 0; i < list.length; i++) {
                let html = '<div class="col-md-12 new-item">\n' +
                    '<div class="col-md-7 text-row-2">\n' +
                    '<a href="product.html?id=#{id}">#{title}</a>\n' +
                    '</div>\n' +
                    '<div class="col-md-2">¥#{price}</div>\n' +
                    '<div class="col-md-3">\n' +
                    '<img class="img-responsive" src="..#{image}" onclick="toProduct(#{id})" alt=""/>\n' +
                    '</div>\n' +
                    '</div>\n';
                html = html.replace(/#{id}/g, list[i]["id"]);
                html = html.replace(/#{title}/g, list[i]["title"]);
                html = html.replace(/#{price}/g, list[i]["price"]);
                html = html.replace(/#{image}/g, list[i]["image"]);
                newList.append(html);
            }
        }
    });
}