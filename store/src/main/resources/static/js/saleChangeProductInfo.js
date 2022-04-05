$(document).ready(function () {
    let id = $.getUrlParam("pid");
    let changeProductBtn = $("#btn-change-product")
    clickBtn($("#title"), changeProductBtn);
    clickBtn($("#price"), changeProductBtn);
    clickBtn($("#num"), changeProductBtn);
    clickBtn($("#priority"), changeProductBtn);
    showProductInfo(id);
    showUser();
});

function showProductInfo(id) {
    showCategorySelect();
    let title = $("#title");
    let price = $("#price");
    let num = $("#num");
    let categorySelectList = $("#category-select-list");
    let priority = $("#priority");
    $.ajax({
        url: "/products/sale/product_info",
        type: "POST",
        data: "id=" + id,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                title.val(json.data["title"]);
                price.val(json.data["price"]);
                num.val(json.data["num"]);
                categorySelectList.val(json.data["categoryId"]);
                priority.val(json.data["priority"]);
            } else if (json.state === 4006) {
                location.href = "../404.html";
            } else {
                location.href = "../500.html";
            }
        },
        error: function () {
            location.href = "../500.html";
        }
    });
}

function changeProductInfo() {
    let pid = $.getUrlParam("pid");
    let title = $("#title");
    let price = $("#price");
    let num = $("#num");
    let categorySelectList = $("#category-select-list");
    let priority = $("#priority");
    let formData = new FormData(document.getElementById('form-change-product'));
    formData.append("id", pid);
    title.css("border-color", "");
    price.css("border-color", "");
    num.css("border-color", "");
    categorySelectList.css("border-color", "");
    priority.css("border-color", "");
    title.attr("placeholder", "请输入标题");
    price.attr("placeholder", "请输入价格");
    num.attr("placeholder", "请输入数量");
    priority.attr("placeholder", "请输入优先级");
    if (title.val().length === 0) {
        title.css("border-color", "red");
        title[0].focus();
        return;
    }
    if (price.val().length === 0) {
        price.css("border-color", "red");
        price[0].focus();
        return;
    }
    if (num.val().length === 0) {
        num.css("border-color", "red");
        num[0].focus();
        return;
    }
    if (priority.val().length === 0) {
        priority.css("border-color", "red");
        priority[0].focus();
        return;
    }
    if (categorySelectList.val() === "0") {
        categorySelectList.css("border-color", "red");
        return;
    }
    $.ajax({
        url: "/products/sale/change_product",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "index.html";
            } else if (json.state === 4006) {
                alert("修改失败（商品不存在）");
            } else if (json.state === 6001) {
                alert("图片大小不超过10MB");
            } else if (json.state === 6002) {
                alert("图像类型不支持");
            } else {
                alert("修改失败,未知错误" + json.state);
            }
        },
        error: function (xhr) {
            alert("修改时产生未知异常" + xhr.status);
        }
    });
}