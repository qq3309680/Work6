//ligerui皮肤库
var skin_links = {
    "aqua": "/Contents/LigerUI/lib/ligerUI/skins/Aqua/css/ligerui-all.css",
    "gray": "/Contents/LigerUI/lib/ligerUI/skins/Gray/css/all.css",
    "silvery": "/Contents/LigerUI/lib/ligerUI/skins/Silvery/css/style.css",
    "gray2014": "/Contents/LigerUI/lib/ligerUI/skins/gray2014/css/all.css"
};
$(function () {
    //ligerui皮肤
    var css = $("#mylink").get(0);
    $('body').addClass("body-" + "gray");
    $(css).attr("href", skin_links["gray"]);
});