/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//使用HTML编码
$.fn.htmlEscape = function (str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

//获取URL参数
$.fn.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
    //if (r != null) return unescape(r[2]); return null;
    // if (r != null) return decodeURI(r[2]); return null
}

$.fn.isOffsetLeftMouseDown = function (e) {
    return (e.button == 0 || e.button == 1) && e.type == "mousedown";
}

//生成GUID
$.fn.guid = function () {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

//是否在空间内:e为当前鼠标事件，selectoer为空间对象，dockSize为扩展停靠区域宽度
$.fn.isInSpace = function (e, selector, dockSize) {
    dockSize = dockSize || 0;
    if ($(selector).offset())
        return $(selector).offset().left - dockSize < e.pageX && $(selector).offset().top - dockSize < e.pageY && $(selector).offset().left + $(selector).outerWidth() + dockSize > e.pageX && $(selector).offset().top + $(selector).outerHeight() + dockSize > e.pageY;
    return false;
}

//是否在容器的区域内，（与父子关系无关）
$.fn.inRangeOf = function (containerSelector) {
    var obj = this;
    var container = $(containerSelector);
    var x = $(obj).offset().left;
    var y = $(obj).offset().top;
    if ($(obj).offset() && $(container).offset())
        return container.offset().left < x
            && (container.offset().left + container.width()) > x
            && container.offset().top < y
            && (container.offset().top + container.height()) > y;
}

//获取点停靠到可停靠对象的位置,返回DockPosition
//e:Event
//dockSize:距离小于dockSize时停靠
//dockableObjects:可停靠对象
DockPosition = function (e, dockSize, dockableObjects) {
    this.DockPoint = {
        x: 0,
        y: 0
    };
    this.DockObject = undefined;
    //方向，默认为未指定，当停靠到特定活动时，值为指定
    this.ActivityDockDirection = LineArrowDirection.Unspecified;

    //获取点停靠到可停靠对象的位置,返回DockPosition
    //e:Event
    //dockSize:距离小于dockSize时停靠
    //dockableObjects:可停靠对象
    {
        if (dockableObjects && $(dockableObjects).length > 0) {
            var dockActivity;
            //寻找鼠标下方的活动
            for (var index = 0 ; index < $(dockableObjects).length; index++) {
                dockActivity = $(dockableObjects)[index];
                if ($(dockActivity).offset().left <= e.pageX
                    && $(dockActivity).offset().top <= e.pageY
                    && $(dockActivity).offset().left + $(dockActivity).outerWidth() >= e.pageX
                    && $(dockActivity).offset().top + $(dockActivity).outerHeight() >= e.pageY) {
                    var xPercentage = (e.pageX - $(dockActivity).offset().left) / $(dockActivity).outerWidth();
                    var yPercentage = (e.pageY - $(dockActivity).offset().top) / $(dockActivity).outerHeight();

                    if (Math.min(xPercentage, 1 - xPercentage) < Math.min(yPercentage, 1 - yPercentage)) {
                        if (xPercentage < 0.5) {
                            this.ActivityDockDirection = LineArrowDirection.Left;
                            this.DockPoint.x = $(dockActivity).offset().left;
                        }
                        else {
                            this.ActivityDockDirection = LineArrowDirection.Right;
                            this.DockPoint.x = $(dockActivity).offset().left + $(dockActivity).outerWidth();
                        }
                        this.DockPoint.y = e.pageY;
                        //停靠到活动边中点
                        if (Math.abs(e.pageY - $(dockActivity).offset().top - $(dockActivity).outerHeight() / 2) <= 10)
                            this.DockPoint.y = $(dockActivity).offset().top + $(dockActivity).outerHeight() / 2;
                    }
                    else {
                        if (yPercentage < 0.5) {
                            this.ActivityDockDirection = LineArrowDirection.Up;
                            this.DockPoint.y = $(dockActivity).offset().top;
                        }
                        else {
                            this.ActivityDockDirection = LineArrowDirection.Down;
                            this.DockPoint.y = $(dockActivity).offset().top + $(dockActivity).outerHeight();
                        }
                        this.DockPoint.x = e.pageX;
                        //停靠到活动边中点
                        if (Math.abs(e.pageX - $(dockActivity).offset().left - $(dockActivity).outerWidth() / 2) <= 10)
                            this.DockPoint.x = $(dockActivity).offset().left + $(dockActivity).outerWidth() / 2;
                    }
                    this.DockObject = dockActivity;
                    return this;
                }
            }

            if (dockSize) {
                //寻找可停靠的活动
                for (var index = 0 ; index < $(dockableObjects).length; index++) {
                    dockActivity = $(dockableObjects)[index];
                    if ($(dockActivity).offset().left - dockSize <= e.pageX
                        && $(dockActivity).offset().top - dockSize <= e.pageY
                        && $(dockActivity).offset().left + $(dockActivity).outerWidth() + dockSize >= e.pageX
                        && $(dockActivity).offset().top + $(dockActivity).outerHeight() + dockSize >= e.pageY) {
                        dockActivity = dockActivity;

                        if (e.pageX < $(dockActivity).offset().left || e.pageX > $(dockActivity).offset().left + $(dockActivity).outerWidth()) {
                            this.DockPoint.y = Math.max($(dockActivity).offset().top, Math.min(e.pageY, $(dockActivity).offset().top + $(dockActivity).outerHeight()));

                            //停靠到活动边中点
                            if (Math.abs(e.pageY - $(dockActivity).offset().top - $(dockActivity).outerHeight() / 2) <= 10)
                                this.DockPoint.y = $(dockActivity).offset().top + $(dockActivity).outerHeight() / 2;

                            if (e.pageX < $(dockActivity).offset().left) {
                                this.DockPoint.x = $(dockActivity).offset().left;
                                this.ActivityDockDirection = LineArrowDirection.Left;
                            }
                            else {
                                this.DockPoint.x = $(dockActivity).offset().left + $(dockActivity).outerWidth();
                                this.ActivityDockDirection = LineArrowDirection.Right;
                            }
                        }
                        else {
                            this.DockPoint.x = e.pageX;
                            //停靠到活动边中点
                            if (Math.abs(e.pageX - $(dockActivity).offset().left - $(dockActivity).outerWidth() / 2) <= 10)
                                this.DockPoint.x = $(dockActivity).offset().left + $(dockActivity).outerWidth() / 2;

                            if (e.pageY < $(dockActivity).offset().top) {
                                this.DockPoint.y = $(dockActivity).offset().top;
                                this.ActivityDockDirection = LineArrowDirection.Up;
                            }
                            else {
                                this.DockPoint.y = $(dockActivity).offset().top + $(dockActivity).outerHeight();
                                this.ActivityDockDirection = LineArrowDirection.Down;
                            }
                        }
                        this.DockObject = dockActivity;
                        return this;
                    }
                }
            }
        }
    };
}

//移动指定位移
$.fn.move = function (offset) {
    if (offset) {
        if (offset.x && offset.x != Number.POSITIVE_INFINITY) {
            $(this).css("left", $(this).css("left").parsePxToFloat() + offset.x);
        }
        if (offset.y && offset.y != Number.POSITIVE_INFINITY) {
            $(this).css("top", $(this).css("top").parsePxToFloat() + offset.y);
        }
    }
}

$.fn.innerOffsetLeft = function () {
    return $(this).offset().left + $(this).css("border-left-width").parsePxToFloat()//- $(this).css("margin-left").parsePxToFloat() + $(this).css("padding-left").parsePxToFloat();
}

$.fn.innerTop = function () {
    return $(this).offset().top + $(this).css("border-top-width").parsePxToFloat()// - $(this).css("margin-top").parsePxToFloat() + $(this).css("padding-top").parsePxToFloat();
}

$.fn._position = function () {
    var tagName = $(this)[0].tagName;
    if (tagName && tagName.toLowerCase() == "svg") {
        return {
            left: $(this).css("left").parsePxToFloat(),
            top: $(this).css("top").parsePxToFloat()
        }
    }
    return $(this).position();
}

$.fn._offset = function () {
    var tagName = $(this)[0].tagName;
    if (tagName && tagName.toLowerCase() == "svg") {
        return {
            left: $(this).parent().offset().left + $(this).parent().css("border-left-width").parsePxToFloat() + $(this).css("left").parsePxToFloat(),
            top: $(this).parent().offset().top + $(this).parent().css("border-top-width").parsePxToFloat() + $(this).css("top").parsePxToFloat()
        }
    }
    return $(this).offset();
}

//将像素值字符串转为数值
String.prototype.parsePxToFloat = function () {
    var f = parseFloat(this.toString().replace("px", ""));
    if (isNaN(f))
        f = 0;
    return f;
}