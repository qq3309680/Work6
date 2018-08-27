$(function () {
    $("#tbSheetActionPanel0").removeAttr("class");
    $("#tbSheetActionPanel0").find("img").remove();
    $("#tbSheetActionPanel0").find("span").remove();
    $("#tbSheetActionPanel0").find("div").css("float","right");
    $("#tbSheetActionPanel0").find("a").css({  "text-align": "center", "width": "60px", "margin-right":"8px", "height": "22px", "display": "inline-block",
        "background-color": "#c4e5fa", "border": "1px solid #0066cc", "font-size": "12px", "line-height": "16px", "color": "black"
    }).hover(function () { $(this).css("background-color", "#62b6f0") }, function () { $(this).css("background-color", "#c4e5fa"); });
    
    $("#tbSheetActionPanel0").css({ "float": "right", "clear": "both", "margin-right": "10px"});

    $("#tbTable tr").eq(0).css("display", "none");
    $("#divBottomBars").hide();

    $("table[class='inputMouseOut']").css("border","none");
    $(".divButton").find("br").css("display","none");
    
  $("#divTopBars").css("width","80%");

});

$(function () {
    ////////////////////////////////////////////
    //选项卡 根据选项卡Id决定tr的Id
    ///////////////////////////////////////////
    $("#ulTab li").click(function () {
        var c = $(this).attr("class");
        if (c != null && c != "") {
            $(".curr").attr("class", "other");
            $(this).attr("class", "curr");

            //获取当前li的Id
            var id = $(this).attr("id").substring(2, 3);
            var trCurr = "tr" + id;
            $("#" + trCurr).show();
            $("#" + trCurr).siblings().hide();




            //解决相对路径引起的问题
            if (id == 4 || $("#" + trCurr).attr("class") == "flowchart") {
                var src = $("#LookChart1_BinaryImage1_image").attr("src"); 
                //如果已经处理了，则跳过处理
                if (src.indexOf("Sheets") > -1) {
                    return;
                }
                else {
                    src = "/Sheets/Headquarters" + src;
                    $("#LookChart1_BinaryImage1_image").attr("src", src);
                }
            }

        }
    });
    ///////////////////////////////////////////////////////////End

    if ($("#tdLog").html() == "") {
        $("#tdLog").html("&nbsp;&nbsp;暂无日志记录!");
    }

});

function openDialog(url, width, height) {
    /// <summary>模态窗口打开URL</summary>
    /// <param name="url" type="string">url地址</param>
    /// <param name="width" type="int">窗口宽度</param>
    /// <param name="height" type="int">窗口高度</param>
    /// <returns type="void"/>
    var top = ($(window).height() - height) / 2;
    var left = ($(window).width() - width) / 2;
    var sFeatures = "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes";
    window.open(url, "_blank", sFeatures);
}

