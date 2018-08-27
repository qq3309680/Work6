$(document).ready(function () {

    /*
    $("#divTopBars>table").removeAttr("class");
    $("#divTopBars>table").find("img").remove();
    $("#divTopBars>table").find("span").remove();
    $("#divTopBars>table").find("br").remove();
    $("#divTopBars").find("a").css({
        "text-align": "center", "width": "50px", "height": "16px", "display": "inline-block",
        "background-color": "#c4e5fa", "border": "1px solid #0066cc", "font-size": "12px", "line-height": "16px", "color": "black"
    }).hover(function () { $(this).css("background-color", "#62b6f0") }, function () { $(this).css("background-color", "#c4e5fa"); });

    $("#divTopBars>table").find("table").find("td:odd").html("&nbsp;&nbsp;");
    //$("#divTopBars>table").css({ "float": "right", "clear": "both", "margin-right": "10px" });
    $("#divTopBars>table").css({ "float": "right", "clear": "both", "margin-right": "10px", "height": "16px", "line-height": "16px" });

  
     
    $("#divBottomBars").hide();

    //$("table[class='inputMouseOut']").css("border", "none");

    */

    

    if ($(".curr").size() > 0) {
         
        var currindex = $(".navIndex").val() == "" ? $(".curr").index($("#divNav>div")) : $(".navIndex").val();
         
        $(".curr").attr("class", "other")
        $("#divNav>div:eq(" + currindex + ")").attr("class", "curr");
        TabDisplay(currindex);

        $("#divNav div").click(function () {
            var c = $(this).attr("class");
            if (c != null && c != "") {
                $(".curr").attr("class", "other");
                $(this).attr("class", "curr");
                var i = $(this).index();
                TabDisplay(i);
                $(".navIndex").val(i);
            }
        });
    }

    //
    $(".input_readonly_no_boder").attr("readonly", "true");


    $(".inputMouseOut").each(function () {
        if ($(this).closest("[class$='tdData']").prev() != null && $(this).closest("[class$='tdData']").prev().attr("class") != null) {
            if ($(this).closest("[class$='tdData']").prev().text().indexOf("*") < 0) {
                if ($(this).closest("[class$='tdData']").prev().attr("class").indexOf("novalidate") == -1) {
                    if(window.location.href.indexOf("Sheets/Budget")>0)
                    {
                        $(this).closest("[class$='tdData']").prev().append("<font color='red'>*</font>");
                    }
                }
            };
        }
    });
    $(".tableRadion").each(function () {
        if ($(this).closest("[class$='tdData']").prev() != null && $(this).closest("[class$='tdData']").prev().attr("class") != null) {
            if ($(this).closest("[class$='tdData']").prev().text().indexOf("*") < 0) {
                if ($(this).closest("[class$='tdData']").prev().attr("class").indexOf("novalidate") == -1) {
                    if (window.location.href.indexOf("Sheets/Budget") > 0) {
                        $(this).closest("[class$='tdData']").prev().append("<font color='red'>*</font>");
                    }
                }
            };
        }
    });

})

function TabDisplay(currindex) { 
    $(".divContent").children("table").each(function (index) {
        if (index == currindex) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
   
}



 