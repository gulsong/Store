$(document).ready(function () {
    showFavorite();
});

function showFavorite() {
    let favoriteList = $("#favorite-list");
    let page = $("#page");
    let favoriteUrl = "favorites.html";
    favoriteList.empty();
    $.ajax({
        url: "/favorites/",
        type: "POST",
        data: location.search.substring(1),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let html = '';
                if (json.data.list.length === 0) {
                    html = '<div id="product-row" class="col-md-offset-1 col-md-10">暂无收藏。</div>\n';
                    favoriteList.html(html);
                } else {
                    if (json.data["pageNum"] > 0) {
                        let list = json.data["list"];
                        let first = findFirst(json.data["pageNum"], json.data["pageSize"])
                        for (let i = first; i < (json.data["pageNum"] * json.data["pageSize"] < list.length ? json.data["pageNum"] * json.data["pageSize"] : list.length); i++) {
                            let row = i - first;
                            if (row % 4 === 0) {
                                html += '<div id="product-row" class="col-md-offset-1 col-md-10">\n';
                            }
                            html += '<div class="col-md-3">\n' +
                                '<div class="goods-panel">\n' +
                                '<img class="img-responsive" src="..#{image}" onclick="toProduct(#{pid})" alt=""/>\n' +
                                '</div>\n' +
                                '<p>¥#{price}</p>\n' +
                                '<p class="text-row-3">\n' +
                                '<a href="product.html?id=#{pid}">\n' +
                                '<small>#{title}</small>\n' +
                                '</a>\n' +
                                '</p>\n' +
                                '<span>\n' +
                                '<a class="btn btn-default btn-xs add-fav" href="javascript:void(0)" onclick="deleteFavoriteFromFavorites(#{fid})">\n' +
                                '<span class="fa fa-heart"></span>取消收藏\n' +
                                '</a>\n' +
                                '<a class="btn btn-default btn-xs add-cart" href="javascript:void(0)" onclick="toCart(#{pid},1)">\n' +
                                '<span class="fa fa-cart-arrow-down"></span>加入购物车\n' +
                                '</a>\n' +
                                '</span>\n' +
                                '</div>\n';

                            if (row % 4 === 3 || i === ((json.data["pageNum"] * json.data["pageSize"]) - 1) || i === list.length - 1) {
                                html += '</div>\n';
                            }
                            html = html.replace(/#{image}/g, list[i]["image"]);
                            html = html.replace(/#{title}/g, list[i]["title"]);
                            html = html.replace(/#{price}/g, list[i]["price"]);
                            html = html.replace(/#{fid}/g, list[i]["fid"]);
                            html = html.replace(/#{pid}/g, list[i]["pid"]);
                        }
                        favoriteList.html(html);
                        html = '<a href="' + favoriteUrl + '?pageNum=#{pre}">上一页</a>\n';
                        html = html.replace(/#{pre}/g, (String)(parseInt(json.data["pageNum"]) - 1));
                        if (json.data["pageNum"] === 1) {
                            html = '';
                        }
                        for (let i = json.data["pageNum"] > 2 ? json.data["pageNum"] - 3 : 0; i < (json.data["pages"] < json.data["pageNum"] + 3 ? json.data["pages"] : (json.data["pageNum"] + 3)); i++) {
                            if (i + 1 === json.data["pageNum"]) {
                                html += '<a style="color: #000000" href="' + favoriteUrl + '?pageNum=#{pageNum}">#{pageNum}</a>\n';
                            } else {
                                html += '<a href="' + favoriteUrl + '?pageNum=#{pageNum}">#{pageNum}</a>\n';
                            }
                            html = html.replace(/#{pageNum}/g, i + 1);
                        }
                        if (json.data["pageNum"] < json.data["pages"]) {
                            html += '<a href="' + favoriteUrl + '?pageNum=#{next}">下一页</a>\n';
                            html = html.replace(/#{next}/g, (String)(parseInt(json.data["pageNum"]) + 1));
                        }
                        page.html(html);
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

function deleteFavoriteFromFavorites(fid) {
    $.ajax({
        url: "/favorites/" + fid + "/delete",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                showFavorite();
            } else if (json.state === 4015) {
                alert("取消收藏失败（收藏不存在）");
            } else if (json.state === 4005) {
                alert("取消收藏失败（用户非法访问））");
            } else {
                alert("取消收藏失败" + json.state);
            }
        },
        error: function (xhr) {
            alert("取消收藏时产生未知异常" + xhr.message);
        }
    });
}