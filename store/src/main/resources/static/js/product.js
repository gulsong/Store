$(document).ready(function () {
    let id = $.getUrlParam("id");
    let num = $("#num");
    let addCart = $("#btn-add-to-cart");
    let buy = $("#btn-buy");
    let numUp = $("#numUp");
    let numDown = $("#numDown");
    let big = $(".img-big:eq(0)");
    numUp.bind("click", function () {
        let n = parseInt(num.val());
        num.val(n + 1);
    });
    numDown.bind("click", function () {
        let n = parseInt(num.val());
        if (n === 1) {
            return;
        }
        num.val(n - 1);
    });
    addCart.bind("click", function () {
        toCart(id, num.val());
    });
    buy.bind("click", function () {
        toBuy(id, num.val());
    });
    showProduct(id);
    big.show();
});

function showProduct(id) {
    let toCollect = $("#btn-add-to-collect");
    toCollect.one("click", function () {
        location.href = "login.html";
    });
    $.ajax({
        url: "/products/" + id + "/details",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                $("#product-title").html(json.data["title"]);
                $("#product-sell-point").html(json.data["sellPoint"]);
                $("#product-price").html(json.data["price"]);
                $("#product-image-big").attr("src", ".." + json.data["image"]);
                $("title").html(json.data["title"]);
            } else {
                location.href = "404.html";
            }
        }
    });
    $.ajax({
        url: "/favorites/get_favorite",
        type: "GET",
        data: "pid=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                if (json.data === null) {
                    toCollect.html('<span class="fa fa-heart-o"></span>&nbsp;加入收藏');
                    toCollect.unbind("click");
                    toCollect.bind("click", function () {
                        addFavorite(id);
                    });
                } else {
                    toCollect.html('<span class="fa fa-heart"></span>&nbsp;取消收藏');
                    toCollect.unbind("click");
                    toCollect.bind("click", function () {
                        deleteFavorite(json.data["fid"]);
                    });
                }
            } else {
                location.href = "404.html";
            }
        }
    });
}

function addFavorite(id) {
    let toCollect = $("#btn-add-to-collect");
    $.ajax({
        url: "/favorites/add_to_favorite",
        type: "POST",
        data: "pid=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                toCollect.html('<span class="fa fa-heart"></span> 取消收藏');
                toCollect.unbind("click");
                toCollect.bind("click", function () {
                    deleteFavorite(json.data["fid"]);
                });
            } else if (json.state === 4014) {
                alert("加入收藏失败（收藏已存在）");
            } else {
                alert("加入收藏失败，未知错误");
            }
        },
        error: function (xhr) {
            alert("加入收藏时产生未知异常" + xhr.message);
        }
    });
}

function deleteFavorite(fid) {
    let toCollect = $("#btn-add-to-collect");
    $.ajax({
        url: "/favorites/" + fid + "/delete",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let id = $.getUrlParam("id");
                toCollect.html('<span class="fa fa-heart-o"></span> 加入收藏');
                toCollect.unbind("click");
                toCollect.bind("click", function () {
                    addFavorite(id);
                });
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

function toBuy(id, mun) {
    let fromBuy = $("#from-buy");
    let temp1 = '<input class="to-next-item" name="pid" type="text" value="#{id}"/>';
    let temp2 = '<input class="to-next-item" name="num" type="text" value="#{num}"/>';
    temp1 = temp1.replace(/#{id}/g, id);
    temp2 = temp2.replace(/#{num}/g, mun);
    fromBuy.attr("action", "orderConfirm.html")
    fromBuy.append(temp1);
    fromBuy.append(temp2);
    fromBuy.submit();
}