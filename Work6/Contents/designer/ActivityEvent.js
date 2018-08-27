/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//var _ActivityEvent_GlobalString = {
//    "ActivityEvent_Set": "已设置",
//    "Button_Remove": "删除",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "ActivityEvent_Set,Button_Remove" }, function (data) {
//    if (data.IsSuccess) {
//        _ActivityEvent_GlobalString = data.TextObj;
//    }
//}, "json");

var ActivityEventSettings = {
    //属性标记名称
    PropertyAttrName: "activity-event-property"
}

var ActivityEventStack = {
    //编辑控件容器
    Panel: undefined,
    //编辑单元格
    EditCells: undefined,
    //数据映射编辑框
    divEventDataMap: undefined,
    //当前活动
    CurrentActivity: undefined,
    //当前事件名称
    CurrentEventName: undefined,
    //当前事件对象
    CurrentActivityEvent: undefined,
    //复选控件:执行的动作
    MultipleSelect: undefined,
    // 是否取消其他活动
    CancelParllelActivities: undefined
}

var ActivityEventEditor = function () {
    //编辑控件的容器
    if (!ActivityEventStack.Panel)
        ActivityEventStack.Panel = $("#divBizEvents");
    if (!ActivityEventStack.EditCells)
        ActivityEventStack.EditCells = ActivityEventStack.Panel.find("td[" + ActivityEventSettings.PropertyAttrName + "]");
    //数据映射编辑框
    if (!ActivityEventStack.divEventDataMap)
        ActivityEventStack.divEventDataMap = ActivityEventStack.Panel.find("div#divEventDataMap");
    //筛选控件
    if (!ActivityEventStack.MultipleSelect) {
        ActivityEventStack.MultipleSelect = ActivityEventStack.EditCells.find("select[multiple]");

        //初始化选项
        $(ActivityEventStack.MultipleSelect).find("option").remove();
        if (typeof (BizMethods) != "undefined" && BizMethods) {
            $(BizMethods).each(function () {
                $("<option></option>").text(this.Text).val(this.Value).appendTo(ActivityEventStack.MultipleSelect);
            });
        }

        //启用选择控件
        ActivityEventStack.MultipleSelect.chosen();
        //设置宽度
        ActivityEventStack.MultipleSelect.parent().find("div.chosen-container-multi").width("95%");
    }
    if (!ActivityEventStack.CancelParllelActivities) {
        ActivityEventStack.CancelParllelActivities = ActivityEventStack.EditCells.find("input[type=checkbox]");
    }

    this.InitControls();
}

//是否已设置
ActivityEventEditor.prototype.Set = function () {
    // Receivers :消息接收人
    if (ActivityEventStack.Panel.find("td[" + ActivityEventSettings.PropertyAttrName + "=Receivers]").find("input[type=text]").val()) {
        return true;
    }
    // Title:消息标题
    if (ActivityEventStack.Panel.find("td[" + ActivityEventSettings.PropertyAttrName + "=Title]").find("input[type=text]").val()) {
        return true;
    }
    // DataDisposals:设置数据
    if (ActivityEventStack.divEventDataMap.find("tr:has('select')").length > 0) {
        return true;
    }
    // 执行的动作
    if (ActivityEventStack.Panel.find("td[" + ActivityEventSettings.PropertyAttrName + "=BizActions]").find("option").filter(function () { return $(this).prop("selected"); }).length > 0) {
        return true;
    }
    // 是否取消其他活动
    return ActivityEventStack.Panel.find("input[type='checkbox']").is(":checked");
}

//从编辑控件读取属性设置活动
ActivityEventEditor.prototype.SetActivity = function () {
    var _DisplayDiv = $("tr[group=ActivityEvent][property=" + ActivityEventStack.CurrentEventName + "]").find("div.BizEvents");
    var _Configured = this.Set();
    if (_Configured)
        _DisplayDiv.text(_WorkflowDesigner_GlobalString.ActivityEvent_Set);
    else
        _DisplayDiv.text("");

    if (!ActivityEventStack.CurrentActivity[ActivityEventStack.CurrentEventName])
        ActivityEventStack.CurrentActivity[ActivityEventStack.CurrentEventName] = {};
    var thisActivityEvent = ActivityEventStack.CurrentActivity[ActivityEventStack.CurrentEventName];

    thisActivityEvent.Configured = _Configured;

    ActivityEventStack.EditCells.each(function () {
        var _ActivityEventPropertyName = $(this).attr(ActivityEventSettings.PropertyAttrName);
        switch (_ActivityEventPropertyName) {
            case "BizActions":
                //复选框:动作列表
                thisActivityEvent[_ActivityEventPropertyName] = [];
                $(this).find("option").each(function () {
                    if ($(this).prop("selected"))
                        thisActivityEvent[_ActivityEventPropertyName].push($(this).val());
                });
                break;
            case "CancelParllelActivities":
                thisActivityEvent[_ActivityEventPropertyName] = $(this).find("input").is(":checked");
                break;
                //参与者直接读取
                //case "Receivers":
                //    //接收方
                //    thisActivityEvent[_ActivityEventPropertyName] = _ReadDisplayUsers(this);
                //    break;
            default:
                if ($(this).find("input[type=checkbox]").length > 0) {
                    thisActivityEvent[_ActivityEventPropertyName] = $(this).find("input[type=checkbox]").prop("checked");
                }
                else {
                    thisActivityEvent[_ActivityEventPropertyName] = $(this).find("input[type=text],textarea,select").val();
                }
                break;
        }
    });

    thisActivityEvent.DataDisposals = [];

    $(ActivityEventStack.divEventDataMap).find("tr:has('select')").each(function () {
        var _DataItem = $(this).find("select:eq(0)").val();
        var _Disposal = $(this).find("select:eq(1)").val();
        var _Value = $(this).find("input[type=text]").val();
        thisActivityEvent.DataDisposals.push({
            DataItem: _DataItem,
            Disposal: _Disposal,
            Value: _Value
        });
    });

}

var _AddNewRow;

//绑定活动的事件
ActivityEventEditor.prototype.Bind = function (_Activity, _EventName) {
    ActivityEventStack.CurrentActivity = _Activity;
    ActivityEventStack.CurrentEventName = _EventName;

    //初始化控件
    this.InitControls();

    //显示数据映射
    //重置控件
    ActivityEventStack.divEventDataMap.find("tr").not(":has('th')").remove();

    //选项
    var _Option = $("<option></option>");

    //选择数据项的控件
    var _DataItemSelector = $("<select></select>");
    var _DataItems = PackageManager.GetDataItems();
    //数据权限
    if (_DataItems && _DataItems.length > 0) {
        $(_DataItems).each(function () {
            if (this.Value.indexOf(".") < 0) {
                _Option.clone().text(this.Text).val(this.Value).appendTo(_DataItemSelector);
            }
        });
    }

    //数据映射类型
    var _MapTypeSelector = $("<select></select>");
    if (typeof (DataDisposalTypes) != "undefined" && DataDisposalTypes) {
        $(DataDisposalTypes).each(function () {
            _Option.clone().text(this.Text).val(this.Value).appendTo(_MapTypeSelector);
        });
    }

    //映射值输入控件
    var _ValueInput = $('<input type="text" class="FormulaEditable" />');

    //删除按钮
    var _DeleteButton = $("<input type='button' value='" + _WorkflowDesigner_GlobalString.Button_Remove + "' />");

    var _tr = $("<tr></tr>");
    var _td = $("<td></td>");
    //添加新行
    _AddNewRow = function (_DataDisposal) {
        var _CurrentRow = _tr.clone().append($(_td).clone().append(_DataItemSelector.clone().width("160")))
               .append($(_td).clone().append(_MapTypeSelector.clone().width("100")))
               .append($(_td).clone().append(_ValueInput.clone().width("160")))
               .append($(_td).clone().append(_DeleteButton.clone().attr("onclick", "$(this).parents('tr:first').remove();")));

        if (_DataDisposal) {
            _CurrentRow.find("select:eq(0)").val(_DataDisposal.DataItem);
            _CurrentRow.find("select:eq(1)").val(_DataDisposal.Disposal);
            _CurrentRow.find("input[type=text]").val(_DataDisposal.Value);
        }

        var _PrevRow = ActivityEventStack.divEventDataMap.find("tr:has('select'):last");
        if (!_PrevRow || _PrevRow.length == 0)
            _PrevRow = ActivityEventStack.divEventDataMap.find("tr:first");

        _PrevRow.after(_CurrentRow);
        _CurrentRow.find(".BizData").DataItemsBind();

        //允许公式编辑
        $(_CurrentRow).find(".FormulaEditable").FormulaEditable();
    };

    //绑定显示
    if (_Activity && _Activity[_EventName] && _Activity[_EventName].Configured) {
        thisActivityEvent = _Activity[_EventName];

        //显示值
        ActivityEventStack.EditCells.each(function () {
            var _ActivityEventPropertyName = $(this).attr(ActivityEventSettings.PropertyAttrName);
            switch (_ActivityEventPropertyName) {
                case "BizActions":
                    //复选框:动作列表
                    //可选的动作
                    var _BizActionOptions = $(this).find("option");
                    if (_BizActionOptions) {
                        $(thisActivityEvent[_ActivityEventPropertyName]).each(function () {
                            var thisValue = this.toString();
                            ActivityEventStack.MultipleSelect.find("option").filter(function () {
                                return $(this).val() == thisValue;
                            }).prop("selected", "selected");
                        });
                    }
                    ActivityEventStack.MultipleSelect.trigger("chosen:updated");
                    break;
                case "CancelParllelActivities":
                    // 是否取消其他活动
                    var checked = thisActivityEvent[_ActivityEventPropertyName];
                    $(this).find("input[type=checkbox]")[0].checked = checked;
                    break;
                case "Receivers":
                    //接收方
                    var _Receivers = thisActivityEvent[_ActivityEventPropertyName];
                    $(this).find("input[type=text]").val(_Receivers);
                    FormulaEditableStack.ShowFormulaHtml(_Receivers, $(this).find("div.formula-display"));
                    break;
                default:
                    if ($(this).find("input[type=checkbox]").length > 0) {
                        $(this).find("input[type=checkbox]").prop("checked", thisActivityEvent[_ActivityEventPropertyName] ? true : false);
                    }
                    else {
                        $(this).find("input[type=text],textarea,select").val(thisActivityEvent[_ActivityEventPropertyName]);
                    }
                    break;
            }
        });

        //显示到编辑列表
        if (thisActivityEvent.DataDisposals) {
            //展示现有数据
            $(thisActivityEvent.DataDisposals).each(function (index) {
                if (this.DataItem) {
                    _AddNewRow(this);
                }
            });
        }
    }

    //添加
    //ActivityEventStack.divEventDataMap.find("tr:last").after($(_tr).clone().append($(_td).clone().attr("colspan", "4").append($("<input type='button' value='添加' />").bind("click", _AddNewRow))));

    if (!ActivityEventStack.CurrentActivity[ActivityEventStack.CurrentEventName])
        ActivityEventStack.CurrentActivity[ActivityEventStack.CurrentEventName] = {};
}

ActivityEventEditor.prototype._AddNewRow = function () {
    _AddNewRow();
}

//初始化控件
ActivityEventEditor.prototype.InitControls = function () {
    //文本框清空
    ActivityEventStack.EditCells.find("input[type=text]").val("");
    //长文本框清空
    ActivityEventStack.EditCells.find("textarea").val("");
    //选择控件选中第一个
    ActivityEventStack.EditCells.find("select").each(function () {
        if ($(this).find("option").length > 0) {
            $(this).find("option:first").prop("selected", true);
        }
    });
    //CheckBox取消选中
    ActivityEventStack.EditCells.find("input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
    });

    //可选的活动
    var sltActivity = $("td[" + ActivityEventSettings.PropertyAttrName + "='ActivateActivity']").find("select");
    sltActivity.children().remove();
    //添加空选项
    var _NullOption = $('<option></option>').prop("selected", true);
    sltActivity.append(_NullOption);
    //添加所有活动
    $(workflow.activities).each(function () {
        sltActivity.append($("<option value='" + this.ActivityCode + "'>" + this.DisplayName + "</option>"));
    });

    //参与者初始化
    ActivityEventStack.Panel.find("td[activity-event-property=Receivers]").find("input").val("");
    ActivityEventStack.Panel.find(".formula-display").text("");

    //初始化数据映射
    ActivityEventStack.divEventDataMap.find("tr").not(":has('th')").remove();

    //清空执行的动作
    ActivityEventStack.MultipleSelect.find("option").removeAttr("selected");
    ActivityEventStack.MultipleSelect.trigger("chosen:updated");
}