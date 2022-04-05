$(document).ready(function () {
    let defaultOption = "<option value='0'>---- 请选择 ----</option>";
    let provinceList = $("#province-list");
    let cityList = $("#city-list");
    let areaList = $("#area-list");
    let addAddressBtn = $("#btn-add-new-address");
    provinceList.append(defaultOption);
    cityList.append(defaultOption);
    areaList.append(defaultOption);
    provinceList.bind("change", function () {
        showCityList("0", "0");
    });
    cityList.bind("change", function () {
        showAreaList("0");
    });
    addAddressBtn.bind("click", function () {
        addAddress();
    })
    showProvinceList("0", "0", "0");
});

function addAddress() {
    let formAddNewAddress = $("#form-add-new-address");
    let name = $("#name");
    let provinceList = $("#province-list");
    let cityList = $("#city-list");
    let areaList = $("#area-list");
    let zip = $("#zip");
    let address = $("#address");
    let phone = $("#phone");
    let tel = $("#tel");
    let re = new RegExp("^[0-9]");
    name.css("border-color", "");
    provinceList.css("border-color", "");
    cityList.css("border-color", "");
    areaList.css("border-color", "");
    zip.css("border-color", "");
    address.css("border-color", "");
    phone.css("border-color", "");
    tel.css("border-color", "");
    name.attr("placeholder", "请输入收货人姓名");
    zip.attr("placeholder", "请输入6位邮政编码");
    address.attr("placeholder", "输入详细的收货地址，小区名称、门牌号等");
    phone.attr("placeholder", "请输入11位手机号码");
    tel.attr("placeholder", "请输入7-8位固定电话号码");
    if (name.val().length === 0) {
        name.css("border-color", "red");
        name[0].focus();
        return;
    }
    if (provinceList.val() === "0") {
        provinceList.css("border-color", "red");
        return;
    }
    if (cityList.val() === "0") {
        cityList.css("border-color", "red");
        return;
    }
    if (areaList.val() === "0") {
        areaList.css("border-color", "red");
        return;
    }
    if (zip.val().length !== 0) {
        if ((!re.test(zip.val())) || zip.val().length !== 6) {
            zip.val("");
            zip.css("border-color", "red");
            zip[0].focus();
            return;
        }
    }
    if (address.val().length === 0) {
        address.css("border-color", "red");
        address[0].focus();
        return;
    }
    if ((!re.test(phone.val())) || phone.val().length !== 11) {
        phone.val("");
        phone.css("border-color", "red");
        phone[0].focus();
        return;
    }
    if (tel.val().length !== 0) {
        if ((!re.test(tel.val())) || (tel.val().length !== 7 && tel.val().length !== 8)) {
            tel.val("");
            tel.css("border-color", "red");
            tel[0].focus();
            return;
        }
    }
    $.ajax({
        url: "/addresses/add_new_address",
        type: "POST",
        data: formAddNewAddress.serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.state === 200) {
                location.href = "address.html";
            } else if (json.state === 4003) {
                alert("新增收货地址失败，超过收货地址上限（20条）");
                location.href = "address.html";
            } else {
                alert("新增收货地址失败，未知错误");
                location.reload();
            }
        },
        error: function (xhr) {
            alert("新增收货地址时产生未知的错误！" + xhr.status);
            location.reload();
        }
    });
}