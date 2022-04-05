$(document).ready(function () {
    let deleteBtn = $("#btn-del");
    deleteBtn.bind("click", function () {
        deleteCart();
    })
    showCartList();
});

function checkAll(checkBtn) {
    $(".check-item").prop("checked", $(checkBtn).prop("checked"));
    showTotal();
}

function showCartList() {
    let cartList = $("#cart-list");
    cartList.empty();
    $.ajax({
        url: "/carts/",
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let list = json.data;
                for (let i = 0; i < list.length; i++) {
                    let tr = '<tr>\n' +
                        '<td num="#{num}" price="#{totalPrice}">\n' +
                        '<input id="checkbox#{i}" name="cids" value="#{cid}" type="checkbox" class="check-item" onchange="showTotal()"/>\n' +
                        '</td>\n' +
                        '<td>\n' +
                        '<img class="img-responsive" src="../../../webapp#{image}" alt=""/>\n' +
                        '</td>\n' +
                        '<td>#{title}#{message}</td>\n' +
                        '<td>¥\n' +
                        '<span id="goodsPrice#{cid}">#{singlePrice}</span>\n' +
                        '</td>\n' +
                        '<td id="changeNum">\n' +
                        '<input id="price-#{cid}" class="num-btn" type="button" onclick="reduceNum(#{cid})" value="-" #{disabled}/>\n' +
                        '<input id="goodsCount#{cid}" class="num-text" type="text" size="2" readonly="readonly" value="#{num}"/>\n' +
                        '<input id="price+#{cid}" class="num-btn" type="button" onclick="addNum(#{cid})" value="+"/>\n' +
                        '</td>\n' +
                        '<td>\n' +
                        '<span id="goodsCast#{cid}">#{totalPrice}</span>\n' +
                        '</td>\n' +
                        '<td>\n' +
                        '<input class="cart-del btn btn-default btn-xs" type="button" value="删除" onclick="deleteByCid(#{cid})"/>\n' +
                        '</td>\n' +
                        '</tr>\n';
                    tr = tr.replace(/#{cid}/g, list[i]["cid"]);
                    tr = tr.replace(/#{image}/g, list[i]["image"]);
                    tr = tr.replace(/#{title}/g, list[i]["title"]);
                    tr = tr.replace(/#{message}/g, list[i]["realPrice"]);
                    tr = tr.replace(/#{num}/g, list[i]["num"]);
                    tr = tr.replace(/#{singlePrice}/g, list[i]["price"]);
                    tr = tr.replace(/#{totalPrice}/g, list[i]["price"] * list[i]["num"]);
                    tr = tr.replace(/#{i}/g, i);
                    tr = tr.replace(/#{disabled}/g, (list[i]["num"] === 1) ? "disabled" : null);
                    cartList.append(tr);
                }
                showTotal();
            } else {
                location.href = "404.html";
            }
        },
        error: function () {
            location.href = "500.html";
        }
    });
}

function showTotal() {
    let allCount = 0;
    let allPrice = 0;
    let count = 0;
    let subMessage = $("#sub-message");
    let checkItem = $(".check-item");
    let subBox = $("#sub-box");
    let allCheckbox = $("#all-checkbox");
    subMessage.empty();
    for (let i = checkItem.length - 1; i >= 0; i--) {
        if (checkItem[i].checked) {
            let checkboxI = $("#checkbox" + i);
            allCount += parseFloat(checkboxI.parent().attr("num"));
            allPrice += parseFloat(checkboxI.parent().attr("price"));
            count++;
        }
    }
    if (count === checkItem.length) {
        allCheckbox.prop("checked", true);
    } else {
        allCheckbox.prop("checked", false);
    }
    let tr = '已选商品<span id="selectCount">#{allCount}</span>件 总价¥\n' +
        '<span id="selectTotal">#{allPrice}</span>元\n';
    let sub = '<input #{disabled} type="submit" value="  结  算  " class="btn btn-primary btn-lg link-account"/>';
    tr = tr.replace(/#{allCount}/g, allCount);
    tr = tr.replace(/#{allPrice}/g, allPrice);
    sub = sub.replace(/#{disabled}/g, (allCount === 0) ? "disabled" : null);
    subBox.empty();
    subMessage.append(tr);
    subBox.append(sub);
}

function addNum(cid) {
    let goodsCount = $("#goodsCount" + cid);
    let goodPrice = $("#goodPrice" + cid);
    let goodCast = $("#goodCast" + cid);
    $.ajax({
        url: "/carts/" + cid + "/num/add",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let price = goodPrice.html();
                let totalPrice = price * json.data;
                goodsCount.val(json.data);
                goodCast.html(totalPrice);
                showCartList();
            } else if (json.state === 4007) {
                alert("增加购物车数据加载失败（购物车数据不存在）");
                showCartList();
            } else if (json.state === 4005) {
                alert("增加购物车数据加载失败（用户非法访问）");
                showCartList();
            } else {
                alert("增加购物车数据加载失败，未知错误");
                showCartList();
            }
        },
        error: function (xhr) {
            alert("增加购物车数据产生未知的异常" + xhr.status);
            showCartList();
        }
    });
}

function reduceNum(cid) {
    let goodsCount = $("#goodsCount" + cid);
    let goodPrice = $("#goodPrice" + cid);
    let goodCast = $("#goodCast" + cid);
    $.ajax({
        url: "/carts/" + cid + "/num/reduce",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                let price = goodPrice.html();
                let totalPrice = price * json.data;
                goodsCount.val(json.data);
                goodCast.html(totalPrice);
                showCartList();
            } else if (json.state === 4007) {
                alert("减少购物车数据加载失败（购物车数据不存在）");
                showCartList();
            } else if (json.state === 4005) {
                alert("减少购物车数据加载失败（用户非法访问）");
                showCartList();
            } else {
                alert("减少购物车数据加载失败，未知错误");
                showCartList();
            }
        },
        error: function (xhr) {
            alert("减少购物车数据产生未知的异常" + xhr.status);
            showCartList();
        }
    });
}

function deleteByCid(cid) {
    let cartList = $("#cart-list");
    $.ajax({
        url: "/carts/" + cid + "/delete",
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                cartList.empty();
                showCartList();
            } else if (json.state === 4007) {
                alert("删除购物车数据失败（购物车数据不存在）");
                cartList.empty();
                showCartList();
            } else if (json.state === 4005) {
                alert("删除购物车数据失败（用户非法访问）");
                cartList.empty();
                showCartList();
            } else {
                alert("删除购物车数据失败，未知错误");
                showCartList();
            }
        },
        error: function (xhr) {
            alert("删除购物车数据时产生未知异常" + xhr.message);
            showCartList();
        }
    });
}

function deleteCart() {
    let checkItem = $(".check-item");
    for (let i = checkItem.length - 1; i >= 0; i--) {
        if (checkItem[i].checked) {
            deleteByCid($("#checkbox" + i).val());
        }
    }
}