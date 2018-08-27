var RowsControl = {
	Init: function () {
		alert("Init");
	},
	Add: function () {
		alert("Add");
	}
}
; (function ($) {
	$.extend(RowsControl);

	$.fn.extend({
		"AddRow": function (currRows, column, colWidthArr, rowCount) {
			var appendHtml = "";
			if (rowCount != undefined) {
				for (var i = 0; i < rowCount; i++) {
					appendHtml += '<div class="row" Rows="' + parseInt(currRows + i + 1) + '"  style="min-height: 33px;">';
					for (var j = 0; j < column; j++) {
						appendHtml += '<div id="div_' + currRows + '_' + parseInt(j + 1) + '" class="col-md-' + colWidthArr[j] + '" style="padding-left: 11px; padding-right: 11px; border: 1px dashed #B6ACAC; vertical-align: middle; min-height: 33px;" ondrop="drop(event)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragend="dragEnd(event)" ondragleave="dragLeave(event)" oncontextmenu="onContextMenu(event)"></div>';
					}
					appendHtml += "</div>";
				}
			} else {
				console.dir(parseInt(currRows + 1));
				appendHtml += '<div class="row" Rows="' + parseInt(currRows + 1) + '"  style="min-height: 33px;">';
				for (var i = 0; i < column; i++) {
					appendHtml += '<div id="div_' + currRows + '_' + parseInt(i + 1) + '" class="col-md-' + colWidthArr[i] + '" style="padding-left: 11px; padding-right: 11px; border: 1px dashed #B6ACAC; vertical-align: middle; min-height: 33px;" ondrop="drop(event)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragend="dragEnd(event)" ondragleave="dragLeave(event)" oncontextmenu="onContextMenu(event)"></div>';
				}
				appendHtml += "</div>";
			}
			return this.append(appendHtml);
		}
	});
})(jQuery);