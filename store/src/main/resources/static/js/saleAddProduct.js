$(document).ready(function () {
    let addProductBtn = $("#btn-add-product")
    clickBtn($("#title"), addProductBtn);
    clickBtn($("#price"), addProductBtn);
    clickBtn($("#num"), addProductBtn);
    showUser();
    showCategorySelect();
});

function addProduct() {
    let title = $("#title");
    let price = $("#price");
    let num = $("#num");
    let categorySelectList = $("#category-select-list");
    title.css("border-color", "");
    price.css("border-color", "");
    num.css("border-color", "");
    categorySelectList.css("border-color", "");
    title.attr("placeholder", "请输入标题");
    price.attr("placeholder", "请输入价格");
    num.attr("placeholder", "请输入数量");
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
    if (categorySelectList.val() === "0") {
        categorySelectList.css("border-color", "red");
        return;
    }
    $.ajax({
        url: "/products/sale/add_product",
        type: "POST",
        data: new FormData(document.getElementById('form-add-product')),
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "index.html"
            } else if (json.state === 6000) {
                alert("请上传图片");
            } else if (json.state === 6001) {
                alert("图片大小不超过10MB");
            } else if (json.state === 6002) {
                alert("图像类型不支持");
            } else {
                alert("添加失败,未知错误");
            }
        },
        error: function (xhr) {
            alert("添加时产生未知异常" + xhr.status);
        }
    });
}