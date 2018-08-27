$(document).ready(function () {
	
$("span[FormatRule='{0:N2}']").parent().css({"text-align":"right"});
$("input[FormatRule='{0:N2}']").css({"text-align":"right"});
$("span[formatrule='{0:N2}']").parent().css({"text-align":"right"});
$("input[formatrule='{0:N2}']").css({"text-align":"right"});

$("span[formatrule='{0:P}']").parent().css({"text-align":"right"});
$("input[formatrule='{0:P}']").css({"text-align":"right"});
    $(".inputMouseOut").each(function () {
        if ($(this).closest("[class$='tdData']").prev() != null && $(this).closest("[class$='tdData']").prev().attr("class") != null) {
            if ($(this).closest("[class$='tdData']").prev().text().indexOf("*") < 0) {
                if ($(this).closest("[class$='tdData']").prev().attr("class").indexOf("novalidate") == -1) {
                    $(this).closest("[class$='tdData']").prev().append("<font color='red'>*</font>");
                }
            };
        }
    });
    $(".tableRadion").each(function () {
        if ($(this).closest("[class$='tdData']").prev() != null && $(this).closest("[class$='tdData']").prev().attr("class") != null) {
            if ($(this).closest("[class$='tdData']").prev().text().indexOf("*") < 0) {
                if ($(this).closest("[class$='tdData']").prev().attr("class").indexOf("novalidate") == -1) {
                    $(this).closest("[class$='tdData']").prev().append("<font color='red'>*</font>");
                }
            };
        }
    });

})