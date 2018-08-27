/// <reference path="Activity.js" />
/// <reference path="Workflow.js" />
/// <reference path="Package.js" />
/// <reference path="ActivityEvent.js" />
/// <reference path="Participant.js" />
/// <reference path="FormulaEditable.js" />
/// <reference path="SubInstanceDataMap.js" />


/*
    属性编辑脚本库
*/

//var _Porperty_GlobalString = {
//    "Porperty_LeftKey": "左键按住编辑子项",
//    "Porperty_Activity": "活动",
//    "Porperty_WokflowTempalte": "流程模板",
//    "Porperty_Line": "线条",
//    "Porperty_Attribute": "属性",
//    "ActivityEvent_Set": "已设置",
//    "DataItem_Confirm": "确定",
//    "Button_Cancel": "取消",
//    "Porperty_More": "等",
//    "Poeperty_One": "个",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "Porperty_LeftKey,Porperty_Activity,Porperty_WokflowTempalte,Porperty_Line,Porperty_Attribute,ActivityEvent_Set,DataItem_Confirm,Button_Cancel,Porperty_More,Porperty_One" }, function (data) {
//    if (data.IsSuccess) {
//        _Porperty_GlobalString = data.TextObj;
//    }
//}, "json");

var WorkflowProperties = {
    // 开始节点包含属性
    Start: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey"] },
               { Group: "Style", Display: false }
    ],
    // 结束节点包含属性
    End: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition"] },
               { Group: "Style", Display: false }],
    // 手工节点包含属性
    FillSheet: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "WorkItemDisplayName", "SheetCode", "SortKey", "EntryCondition", "DisplayName", "Summary"] },
               { Group: "Participants", Display: true, Properties: ["Participants", "ParticipateType", "ParticipateMethod", "FinishExit", "NoParPolicy", "OriginatorParPolicy", "DupParPolicy", "ParticipatedParPolicy"] },
               //{ Group: "DataItem", Display: false, Properties: ["DataPermissions"] },
               //{ Group: "Operation", Display: false, Properties: ["PermittedActions"] },
               //{ Group: "Assist", Display: false },
               //{ Group: "ActivitySenior", Display: false },
               //{ Group: "ActivityEvent", Display: false },
               //{ Group: "ActivityPlan", Display: false },
               //{ Group: "Extend", Display: false },
               //{ Group: "CustomCode", Display: false },
               { Group: "Style", Display: false }
    ],
    // 审批节点
    Approve: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "WorkItemDisplayName", "SheetCode", "SortKey", "EntryCondition", "DisplayName", "ApprovalDataItem", "CommentDataItem", "Summary"] },
               { Group: "Participants", Display: true, Properties: ["Participants", "ParticipateType", "ParticipateMethod", "ApproveExit", "DisapproveExit", "NoParPolicy", "OriginatorParPolicy", "DupParPolicy", "ParticipatedParPolicy"] },
               //{ Group: "DataItem", Display: false, Properties: ["DataPermissions"] },
               //{ Group: "Operation", Display: false, Properties: ["PermittedActions"] },
               //{ Group: "Assist", Display: false },
               //{ Group: "ActivitySenior", Display: false },
               //{ Group: "ActivityEvent", Display: false },
               //{ Group: "ActivityPlan", Display: false },
               //{ Group: "Extend", Display: false },
               //{ Group: "CustomCode", Display: false },
               { Group: "Style", Display: false }
    ],
    // 传阅
    Circulate: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "WorkItemDisplayName", "SheetCode", "SortKey", "EntryCondition", "DisplayName", "Summary"] },
               { Group: "Participants", Display: false, Properties: ["Participants"] },
               //{ Group: "DataItem", Display: false, Properties: ["DataPermissions"] },
               ////ERROR:暂未确定是否允许设置传阅【允许的操作】
               ////{ Group: "Operation", Display: false, Properties: ["PermittedActions"] },
               //{ Group: "ActivityPlan", Display: false },
               //{ Group: "Extend", Display: false },
               //{ Group: "CustomCode", Display: false },
               { Group: "Style", Display: false }
    ],
    // 连接点
    Connection: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition"] },
               { Group: "Style", Display: false }
    ],
    //// 子流程
    //SubInstance: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition", "DisplayName", "ApprovalDataItem", "CommentDataItem", "WorkflowCode", "Sync", "FinishStartActivity", "Summary"] },
    //           { Group: "Participants", Display: false, Properties: ["Participants", "ParticipateType", "ParticipateMethod", "ApproveExit", "DisapproveExit"] },
    //           { Group: "SubInstanceDataMaps", Display: false, Properties: ["DataMaps"] },
    //           { Group: "ActivityEvent", Display: false },
    //           { Group: "ActivityPlan", Display: false },
    //           { Group: "Extend", Display: false },
    //           { Group: "CustomCode", Display: false },
    //           { Group: "Style", Display: false }
    //],
    //// 等待
    //Wait: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition", "DisplayName", "WaitCondition"] },
    //            { Group: "ActivityPlan", Display: false },
    //            { Group: "Extend", Display: false },
    //            { Group: "Style", Display: false }
    //],
    // 业务动作
    BizAction: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition", "DisplayName", "BizActions"] },
               { Group: "ActivityPlan", Display: false },
               //{ Group: "Extend", Display: false },
               //{ Group: "CustomCode", Display: false },
               { Group: "Style", Display: false }
    ],
    //// 消息
    //Notify: [{ Group: "ActivityBasic", Display: true, Properties: ["ActivityCode", "DisplayName", "SortKey", "EntryCondition", "DisplayName", "NotifyType", "Receivers", "Title", "Content"] },
    //           { Group: "ActivityPlan", Display: false },
    //           { Group: "Extend", Display: false },
    //           { Group: "CustomCode", Display: false },
    //           { Group: "Style", Display: false }
    //],
    // 线条包含属性
    Line: [{ Group: "LineBasic", Display: true, Properties: ["DisplayName", "UtilizeElse", "Formula"] },
          { Group: "Custom", Display: false, Properties: ["Custom", "CustomCode"] },
          { Group: "Style", Display: false }
    ],
    // 流程模板包含属性
    Workflow: [{ Group: "WorkflowBasic", Display: true },
              { Group: "WorkflowPlan", Display: false },
              { Group: "WorkflowBizActions", Display: false },
              { Group: "WorkflowExtend", Display: false }
    ]
}

var WorkflowProperty = function (layout, workflowDocument) {
    this.ObjectID = null;
    this.PropertyTitleBarHeight = 25;  // 属性区域标题栏的高度
    this.PropertyType = "";            // 获取或设置当前属性的类型
    this.CurrentObject = null;         // 获取或设置当前正在编辑的对象
    this.Layout = layout;              // 获取当前布局对象
    this.WorkflowDocument = workflowDocument;  // 流程对象模型
    this.Controls = {
        PropertyTable: $(".PropertyTable"),
        PropertyTableTR: $(".PropertyTable>tbody>tr"),
        PropertyValue: $(".PropertyValue"),
        divPropertyContainer: $("#divPropertyContainer"),
        PropertyGroup: $("td[group]"),
        BizEvents: $(".BizEvents"),             // 事件处理
        BizData: $(".BizData"),                 // 数据项选择
        RichText: $(".RichText"),                // 富文本框控件，弹出编辑界面
        TimeSpan: $(".TimeSpan"),                //时间段选择控件
        ListBizActions: $("select[multiple].biz-actions-list"),   //选择业务动作
        ListUser: $(".PropertyTable").find("ul.user-list"),              //选人控件
        ActionLabel: $(".Action-Label")          //操作权限
    }

    this.Multi = {
        //是否多选
        IsMulti: false,
        //源状态集合<PropertyName,Value>
        SourceStatus: {
        },
        CurrentObjects: []
    }

    this.Controls.ActionLabel.unbind("click").bind("click", function () {
        var check = $(this).parent().find("input");
        $(check).click();
    });

    //公式编辑器
    $(".FormulaEditable").each(function () {
        $(this).attr("title", $(this).parent().prev().text()).FormulaEditable();
    });

    $("input[type=text],textarea").attr("spellcheck", false);

    //设置tabindex使编辑控件可以被选中
    $("ul").each(function () { $(this).attr("tabindex", "99"); });

    //初始化时全隐藏
    this.Controls.PropertyTableTR.hide();

    //初始化属性列表
    for (_ElementType in WorkflowProperties) {
        $(WorkflowProperties[_ElementType]).each(function () {
            if (this.Group != "DataItem" && this.Group != "Operation" && !this.Properties) {
                var thisProperties = this.Properties = [];
                $("tr[group='" + this.Group + "']").each(function () {
                    var _PropertyName = $(this).attr("property");
                    if (_PropertyName)
                        thisProperties.push(_PropertyName);
                });
            }
        });
    }

    //复选框使用Chosen事件
    {
        var _thisWorkflowProperty = this;
        this.Controls.ListBizActions
            //初始化选项
            .each(function () {
                $(this).find("option").remove();
                var thisListBizActions = $(this);
                if (typeof (BizMethods) != "undefined" && BizMethods) {
                    $(BizMethods).each(function () {
                        $("<option></option>").text(this.Text).val(this.Value).appendTo(thisListBizActions);
                    });
                }
            })
            //启用选择插件
            .chosen()
            //改变时
            .unbind("change.Property").bind("change.Property", function (e, data) {
                var _PropertyName = $(this).parents("tr[group][property]").attr("property");
                if (!wp.CurrentObject[_PropertyName])
                    wp.CurrentObject[_PropertyName] = [];
                //选中新项
                if (data.selected) {
                    wp.CurrentObject[_PropertyName].push(data.selected);
                }
                    //删除项
                else if (data.deselected) {
                    for (var index = wp.CurrentObject[_PropertyName].length - 1 ; index >= 0; index--) {
                        if (wp.CurrentObject[_PropertyName][index] == data.deselected) {
                            wp.CurrentObject[_PropertyName].splice(index, 1);
                            break;
                        }
                    }
                }
            });
        //初始化宽度
        this.Controls.PropertyTable.find("select[multiple].biz-actions-list").each(function () { $(this).parent().find("div.chosen-container-multi").width("94%"); });
    }

    var _DataItems = PackageManager.GetDataItems();
    //数据权限
    if (_DataItems && _DataItems.length > 0) {
        //全选中
        var _DataItemTable = $("[property=DataPermissions]").find("table:first");

        //初始化数据权限编辑控件
        var _DataRow = $("<tr></tr>");
        $("<td></td>").addClass("PropertyRow").appendTo(_DataRow);
        $("<td></td>").addClass("PropertyTitle").text(this).appendTo(_DataRow);
        for (var i = 0 ; i < 5; i++) {
            if (i == 0)
                $("<td></td>").addClass("PropertyDataItem").append("<input type='checkbox' checked='true' />").appendTo(_DataRow);
            else
                $("<td></td>").addClass("PropertyDataItem").append("<input type='checkbox' />").appendTo(_DataRow);
        }
        $(_DataItems).each(function () {
            var _NewRow = _DataRow.clone().attr("item-name", this.Value);
            _NewRow.appendTo(_DataItemTable).find("td:eq(1)").text(this.Text).attr("title", this.Text);
            if (this.ItemType) {
                //标记是否子表头
                _NewRow.attr("ItemType", this.ItemType);
                _NewRow.addClass("SubTableHeader");
            }
        });

        //首行全选事件
        _DataItemTable.find("tr:has('input[type=checkbox]'):first").find("input[type=checkbox]").each(function () {
            $(this).unbind("change.SelectAllDataItem").bind("change.SelectAllDataItem", function (e) {
                var cellIndex = $(e.target).parents("td:first").index();
                var checked = $(e.target).prop("checked");
                $(e.target).parents("table:first").find("tr").each(function (index) {
                    if (index != 0) {
                        var _CheckBox = $(this).find("td:eq(" + cellIndex + ")").find("input[type=checkbox]")
                        _CheckBox.prop("checked", checked);
                        _CheckBox.trigger("change", true);
                    }
                });
            });
        });

        //首行全选事件
        _DataItemTable.find("tr:has('input[type=checkbox]')").each(function (n, o) {
            var checkboxs = $(this).find("input[type=checkbox]");
            checkboxs.eq(0).unbind("click.Property" + n).bind("click.Property" + n, checkboxs, function (e) {
                if (!this.checked) { // 不可见则不可写/必填/痕迹
                    checkboxs[1].checked = false;
                    checkboxs[2].checked = false;
                    checkboxs[3].checked = false
                    checkboxs.eq(1).change();
                    checkboxs.eq(2).change();
                    checkboxs.eq(3).change();
                }
            });
            checkboxs.eq(1).unbind("click.Property" + n).bind("click.Property" + n, checkboxs, function (e) {
                if (this.checked) { // 可见则可写
                    checkboxs[0].checked = true;
                    checkboxs.eq(0).change();
                }
                else { // 不可见则不必填
                    checkboxs[2].checked = false;
                    checkboxs.eq(2).change();
                }
            });
            checkboxs.eq(2).unbind("click.Property" + n).bind("click.Property" + n, checkboxs, function (e) {
                if (this.checked) { // 必填则可见并可写
                    checkboxs[0].checked = true;
                    checkboxs[1].checked = true;
                    checkboxs.eq(0).change();
                    checkboxs.eq(1).change();
                }
            });
        });

        //子表首行CheckBox长摁时全选
        _DataItemTable.find("tr.SubTableHeader").find("input[type=checkbox]")
            .unbind("mousedown").bind("mousedown", function (e) {
                BatchSubColumnState = false;

                //长摁500毫秒,启用全选模式
                SubTableTimeHandler = setTimeout(function (_CheckBox) {
                    BatchSubColumnState = true;

                    var _Cell = $(_CheckBox).parents("td:first");
                    _Cell.addClass("BatchColumn");

                    var _Row = $(_CheckBox).parents("tr:first");
                    var _CellIndex = _Cell.index();
                    $(_Cell).parents("table:first").find("tr[item-name*='" + _Row.attr("item-name") + ".']").each(function () {
                        $(this).find("td:eq(" + _CellIndex + ")").addClass("BatchColumn");
                    });
                }, 500, e.target);

                $(this).one("mouseup mouseout", function (e2) {
                    $(".BatchColumn").removeClass("BatchColumn");
                    if (SubTableTimeHandler)
                        clearTimeout(SubTableTimeHandler);
                });
            })
        _DataItemTable.find("tr.SubTableHeader").each(function () {
            $(this).find("input[type=checkbox]:gt(1)").attr("title", _WorkflowDesigner_GlobalString.Porperty_LeftKey);
        });

        //数据权限改变时
        _DataItemTable.find("tr:has('input[type=checkbox]'):not(':eq(0)')").find("input[type=checkbox]")
            .unbind("change.DataPermission")
            //_ChangeSelfOnly时,用于代码直接调用Change事件
            .bind("change.DataPermission", function (e, _ChangeSelfOnly) {
                var _Value = $(e.target).prop("checked");
                var _CurrentItemName = $(e.target).parents("tr:first").attr("item-name");
                var _CellIndex = $(e.target).parents("td:first").index()
                //数据权限类型
                var _DataPermissionType;
                switch (_CellIndex) {
                    case 2:
                        _DataPermissionType = "Visible";
                        break;
                    case 3:
                        _DataPermissionType = "Editable";
                        break;
                    case 4:
                        _DataPermissionType = "Required";
                        break;
                    case 5:
                        _DataPermissionType = "TrackVisible";
                        break;
                    case 6:
                        _DataPermissionType = "MobileVisible";
                        break;
                    default:
                        break;
                }
                if (!_DataPermissionType)
                    return;

                var set = false;
                var _Activities = wp.CurrentObject;
                if (wp.Multi.IsMulti) {
                    _Activities = wp.Multi.CurrentObjects;
                }
                $(_Activities).each(function () {
                    $(this.DataPermissions).each(function () {
                        if (this.ItemName == _CurrentItemName) {
                            this[_DataPermissionType] = _Value;
                            set = true;
                        }
                    });
                    if (!set) {
                        if (!this.DataPermissions)
                            this.DataPermissions = [];
                        this.DataPermissions.push({ ItemName: _CurrentItemName });
                        this.DataPermissions[this.DataPermissions.length - 1][_DataPermissionType] = _Value;
                    }
                });

                $(".BatchColumn").removeClass("BatchColumn");

                if (!_ChangeSelfOnly) {
                    //子表列选中可见、可写时,将子表头选中
                    if ((_DataPermissionType == "Visible" || _DataPermissionType == "Editable")
                        && _CurrentItemName.indexOf(".") > -1 && _Value) {
                        var _SubTableName = _CurrentItemName.substring(0, _CurrentItemName.indexOf("."));
                        var _HeaderCheckBox = $(e.target).parents("table:first").find("tr[item-name=" + _SubTableName + "]").find("td:eq(" + _CellIndex + ")").find("input[type=checkbox]");
                        if (!_HeaderCheckBox.prop("checked")) {
                            _HeaderCheckBox.prop("checked", true);
                            _HeaderCheckBox.trigger("change", [true]);
                        }
                    }
                    else {
                        var _thisRow = $(e.target).parents("tr:first");
                        //若当前是表头
                        if (_thisRow.hasClass("SubTableHeader")
                            //表头是全选模式
                            && ((_DataPermissionType == "Visible" || _DataPermissionType == "Editable") || BatchSubColumnState)) {
                            $(e.target).parents("table:first").find("tr[item-name*='" + _CurrentItemName + "." + "']").each(function () {
                                var _CheckBox = $(this).find("td:eq(" + _CellIndex + ")").find("input[type=checkbox]:first");
                                _CheckBox.prop("checked", _Value);
                                _CheckBox.trigger("change", [true]);
                            });
                        }
                    }
                }

                // 设置首行的对应的checkbox是否选中
                var table = $(e.target).parents("table:first");
                var hasUnChecked = false;
                var trs = table.find("tr:gt(0)");
                for (var i = 0, len = trs.length; i < len; i++) {
                    var td = $(trs[i]).find("td:eq(" + _CellIndex + ")");
                    var checkbox = td.find("input[type=checkbox]");
                    if (!checkbox.prop("checked")) {
                        hasUnChecked = true;
                        break;
                    }
                }
                table.find("tr:eq(0)").find("td:eq(" + _CellIndex + ")")
                    .find("input[type=checkbox]").prop("checked", !hasUnChecked);
            });
    }

    this.DataItem = new DataItem(workflowDocument);             // 数据项初始化器
    this.ActivityEventEditor = new ActivityEventEditor();          // 获取或设置当前正在编辑的活动的事件
    DataMapSettings.SubInstanceDataMapInit();                   //初始化子流程数据映射编辑控件

    //初始化活动事件编辑控件
    $("#divEventNotification,#divEventDataMap,#divEventBizActions,#divSubInstanceDataMaps").BuildPanel({ leftSpace: false });
    $("#divSubInstanceDataMaps").find("[h3panelid]").css("height", "314px").css("overflow", "auto");

    this.init();
}

// 属性类初始化事件
WorkflowProperty.prototype.init = function () {
    // 设置属性区域高度
    this.Controls.divPropertyContainer.css("overflow-x", "hidden").css("overflow-y", "auto").css("height", this.Controls.divPropertyContainer.parent().height() - this.PropertyTitleBarHeight);
    // 绑定分组显示事件
    this.Controls.PropertyGroup.PropertyGroupBind();
    // 属性控件值改变事件
    this.Controls.PropertyTable.find("input")
            .unbind("change.Property")
            .bind("change.Property", function () {
                var propertyValue = $(this).parent().parent().find(".PropertyValue");
                propertyValue.html(this.value);//.show();
            });
}

// 根据对象类型，构造属性显示界面
WorkflowProperty.prototype.DisplayProperties = function (obj, display) {  //display 设置属性显示
    // 设置所有属性不可见
    this.Controls.PropertyTableTR.hide();

    var _PropertyType;
    wp.Multi = {};

    //如果当前显示的是活动并且有其他活动被选中,则启用多选模式
    //显示共同属性【数据权限】【允许的操作】【样式】编辑
    if (workflowMode == WorkflowMode.Designer && obj.WorkflowElementType == WorkflowElementType.Activity
        && workflow.selectedActivities && workflow.selectedActivities.length > 1) {
        wp.Multi.IsMulti = true;
        //将要显示的活动移到首位
        if (obj.SwitchToFirst)
            obj.SwitchToFirst();
        wp.Multi.CurrentObjects = workflow.selectedActivities;
        //批量编辑【样式】
        //wp.PropertyTable.find("tr[Group=Style]").show();
        //全是手工或审批活动,批量编辑【允许的操作】【数据权限】
        if ($(workflow.selectedActivities).filter(function () { return this.ToolTipText != "FillSheet" && this.ToolTipText != "Approve"; }).length == 0) {
            wp.Multi.isAllParticipative = true;
            ////源状态
            //wp.Multi.SourceStatus = {};

            ////拷贝数据权限
            //$(workflow.selectedActivities).each(function (index) {
            //    wp.Multi.SourceStatus[this.ID] = {};
            //    var _DataPermissions = [];
            //    //保存源数据权限
            //    $(this.DataPermissions).each(function () {
            //        var _D = {};
            //        for (p in this) {
            //            if (typeof (this[p]) != "object")
            //                _D[p] = this[p];
            //        }
            //        _DataPermissions.push(_D);
            //    });
            //    wp.Multi.SourceStatus[this.ID]["DataPermissions"] = _DataPermissions;

            //    var _P = {};
            //    //保存允许的操作
            //    if (this.PermittedActions) {
            //        for (p in this.PermittedActions) {
            //            if (typeof (this.PermittedActions[p]) != "object" && p != "RejectToFixed" && p != "RejectToActivityCodes") {
            //                _P[p] = this.PermittedActions[p];
            //            }
            //        }
            //    }
            //    wp.Multi.SourceStatus[this.ID]["DataPermissions"] = _P;
            //});
        }
    }

    // 记录需要显示属性的元素类型
    if (obj.WorkflowElementType == WorkflowElementType.Activity) {
        _PropertyType = obj.ToolTipText;
        this.ObjectID = obj.ID;

        //传阅隐藏:可写\必填
        if (_PropertyType == "Circulate") {
            $("tr[group=DataItem][property=DataPermissions]").find("table").find("tr").each(function () {
                $(this).find("td:eq(3),td:eq(4)").hide();
            });
        }
        else {
            $("tr[group=DataItem][property=DataPermissions]").find("table").find("tr").each(function () {
                $(this).find("td:eq(3),td:eq(4)").show();
            });
        }

        //活动排序默认为1
        if (isNaN(obj.SortKey)) {
            obj.SortKey = 1;
        }
    }
    else {
        _PropertyType = obj.WorkflowElementType;
        this.ObjectID = -1;
    }

    this.CurrentObject = obj;
    this.PropertyType = _PropertyType;

    this.SetTitle();

    //流程模板编码不可编辑
    if (_PropertyType == WorkflowElementType.Workflow) {
        $("tr[group='WorkflowBasic'][property='WorkflowCode']").find("td:last").find("span").text(this.CurrentObject.WorkflowCode);
    }

    if (!WorkflowProperties[_PropertyType]) {
        return;
    }
    else {
        var _Properties = [];

        // 如果是多选模式,只显示公共属性
        if (wp.Multi.IsMulti) {
            var HasSheet = false;
            $(wp.Multi.CurrentObjects).each(function () {
                $(WorkflowProperties[this.ToolTipText]).each(function () {
                    if (this.Group == 'ActivityBasic' && $.inArray('SheetCode', this.Properties) > -1) {
                        HasSheet = true;
                        return false;
                    }
                });
            });

            var _filterProperties = [];
            $(wp.Multi.CurrentObjects).each(function () {
                _filterProperties = $(WorkflowProperties[_PropertyType]).filter(function () {
                    return (HasSheet && this.Group == 'ActivityBasic') || this.Group == "Style" || (wp.Multi.isAllParticipative && (this.Group == "DataItem" || this.Group == "Operation"));
                });

                $(_filterProperties).each(function () {
                    if (this.Group == 'ActivityBasic') {
                        _Properties.push({ Group: 'ActivityBasic', Display: true, Properties: ['SheetCode'] });
                    }
                    else {
                        _Properties.push(this);
                    }
                })
            });
        }
        else {
            _Properties = WorkflowProperties[_PropertyType];
        }

        $.each(_Properties, function (p) {
            var header = p.Controls.PropertyTable.find("tr[group='" + this.Group + "']:first").show();
            header.find("td:first").trigger("InitHeader", [wp.Multi.IsMulti]);

            if (this.Properties) {
                for (var i = 0; i < this.Properties.length; i++) {
                    p.Controls.PropertyTable.find("tr[property='" + this.Properties[i] + "']")
                          .filter("[group='" + this.Group + "']")
                          .PropertyControlValueBind(obj, this.Properties[i]);
                }
            }
        }, [this]);
        //// 根据类型显示不同的属性
        //$(_Properties).each(function (index) {
        //    var header = wp.Controls.PropertyTable.find("tr[group='" + this.Group + "']:first").show();
        //    header.find("td:first").trigger("InitHeader");

        //    if (this.Properties) {
        //        for (var i = 0; i < this.Properties.length; i++) {
        //            wp.Controls.PropertyTable.find("tr[property='" + this.Properties[i] + "']")
        //                  .filter("[group='" + this.Group + "']")
        //                  .PropertyControlValueBind(obj, this.Properties[i]);
        //        }
        //    }
        //});
    }

    this.Controls.ListUser.unbind("change.SelectUser").bind("change.SelectUser", function (e) {
        //编辑的对象的属性名称
        var _Participants = _ReadDisplayUsers(this);
        var _PropertyName = $(this).parents("property:first").attr("property");
        if (wp.CurrentObject && _PropertyName) {
            wp.CurrentObject[_PropertyName] = _Participants;
        }
    });

    // 绑定事件处理器
    this.Controls.BizEvents.BizEventsBind(this);
    // 绑定数据项选择控件
    this.Controls.BizData.DataItemsBind();
    // 绑定富文本框编辑控件
    this.Controls.RichText.RichTextBind(this);
    // 绑定时间段选择控件
    this.Controls.TimeSpan.TimeSpanBind(this);
    {
        $("#sltTimeSpanType").unbind("change").change(function () {
            if ($(this).val() == "input") {
                $(this).closest('tr').next().show();
                $(this).closest('tr').next().next().hide();
            }
            else {
                $(this).closest('tr').next().hide();
                $(this).closest('tr').next().next().show();
            }
        })
    }
    // 设置属性显示
    if (display) {
        this.SetPropertyDisplay(true);
    }

    //点击生成代码
    $("#btnActivityCode").unbind("click").click(function (e) {
        $(ActivityModelSettings.ActivityModels).each(function () {
            if (this.ToolTipText == wp.CurrentObject.ToolTipText) {
                var _CustomCode = this.CustomCode.replace(/{ClassName}/g, wp.CurrentObject.ActivityCode);
                $(e.target).parents("tr:first").next().find("textarea").val(_CustomCode).change();
            }
        });
    });
}

WorkflowProperty.prototype.SetTitle = function () {
    //ERROR:这个Header有什么更可靠的查找方式
    var _PropertyTitle = $(".l-layout-header-inner");
    if (this.CurrentObject && this.CurrentObject.WorkflowElementType) {
        switch (this.CurrentObject.WorkflowElementType) {
            case WorkflowElementType.Activity:
                if (wp.Multi.IsMulti) {
                    _PropertyTitle.text(_WorkflowDesigner_GlobalString.Porperty_Activity + ":" + this.CurrentObject.DisplayName + "[" + this.CurrentObject.ActivityCode + "]..." + _WorkflowDesigner_GlobalString.Porperty_More + workflow.selectedActivities.length + _WorkflowDesigner_GlobalString.Poeperty_One);
                }
                else {
                    //显示属性主体
                    _PropertyTitle.text(_WorkflowDesigner_GlobalString.Porperty_Activity + ":" + this.CurrentObject.DisplayName + "[" + this.CurrentObject.ActivityCode + "]");
                }
                ////选中活动
                //obj.Select();
                break;
            case WorkflowElementType.Workflow:
                {
                    _PropertyTitle.text(_WorkflowDesigner_GlobalString.Porperty_WokflowTempalte + ":");
                    var _WorkflowDisplayName = $("<input type='text' id='txtWorkflowDisplayName' style='height:19px;' />");
                    if (typeof (ClauseName) != typeof (undefined)) {
                        _WorkflowDisplayName.val(ClauseName);
                    }
                    _WorkflowDisplayName.unbind("change").bind("change", function (e) {
                        //环境变量
                        ClauseName = $(e.target).val();
                        //左侧
                        WorkflowDocument.DisplayWorkflowFullName();
                        //更新后台
                        WorkflowDocument.UpdateClauseName($(e.target).val());
                        //更新标签标题
                        WorkflowDocument.DisplayTabName();
                        //刷新左侧树
                        top.ReloadNode(workflow.SchemaCode);
                    });
                    _PropertyTitle.append(_WorkflowDisplayName);
                }
                break;
            case WorkflowElementType.Line:
                //obj.Select();
                _PropertyTitle.text(_WorkflowDesigner_GlobalString.Porperty_Line + ":" + this.CurrentObject.startActivity.DisplayName + "->" + this.CurrentObject.endActivity.DisplayName);
                break;
            default:
                _PropertyTitle.text(_WorkflowDesigner_GlobalString.Porperty_Attribute);
                break;
        }
    }
}

// 设置属性区域是否显示
WorkflowProperty.prototype.SetPropertyDisplay = function (display) {
    this.Layout.setRightCollapse(!display);
}

/*
JQuery扩展方法
*/
// 绑定当前行编辑和显示控件的值
/*
    obj:图像对象,流程、节点、线条
    name:属性名称
*/
// 设置允许的操作绑定权限
var PermittedActions = function (obj, parent) {
    if (wp.Multi.IsMulti && wp.Multi.isAllParticipative) {
        $("td[permitted-action]").find("input[type=checkbox]").attr("data-batch", true)
    }
    else {
        $("td[permitted-action]").find("input[type=checkbox]").removeAttr("data-batch");
        //传阅活动只显示再传阅
        if (wp.CurrentObject.ToolTipText == "Circulate") {
            var _tdRecirculate = $("td[permitted-action=Recirculate]");
            $("td[permitted-action]").hide();
            _tdRecirculate.show();

            //$("tr[group=Operation][property=PermittedActions]").hide();
            //_tdRecirculate.parents("tr[group=Operation]:first").show();

            _tdRecirculate.find("input[type=checkbox]").prop("checked", (wp.CurrentObject["PermittedActions"] && wp.CurrentObject["PermittedActions"].Recirculate) ? true : false)
                .unbind("change.PermittedActions").bind("change.PermittedActions", function () {
                    if (!wp.CurrentObject["PermittedActions"]) {
                        wp.CurrentObject["PermittedActions"] = {};
                    }
                    wp.CurrentObject["PermittedActions"].Recirculate = $(this).prop("checked");
                });
            return;
        }
    }
    $("td[permitted-action]").show();

    $("td[permitted-action]").each(function () {
        var _ActionName = $(this).attr("permitted-action");
        //批处理、邮件通知、短信审批、移动办公
        if (_ActionName == "BatchProcessing" || _ActionName == "EmailNotification" || _ActionName == "SMSApprove" || _ActionName == "MobileProcessing") {
            $(this).find("input[type=checkbox]").prop("checked", obj[_ActionName] ? true : false)
                .unbind("change.PermittedActions")
                .bind("change.PermittedActions", function () {
                    var thisActionName = $(this).parents("td[permitted-action]:first").attr("permitted-action");
                    if (thisActionName) {
                        if (wp.Multi.IsMulti) {
                            $(wp.Multi.CurrentObjects).each(function () {
                                wp.CurrentObject[thisActionName] = $(this).prop("checked");
                            });
                        }
                        else {
                            wp.CurrentObject[thisActionName] = $(this).prop("checked");
                        }
                    }
                });
        }
            //驳回到指定的活动
        else if (_ActionName == "RejectToFixed" || _ActionName == "RejectToActivityCodes") {
            if (_ActionName == "RejectToFixed") {
                //复选模式,不显示驳回到指定的活动
                if (wp.Multi.IsMulti) {
                    $("td[permitted-action='RejectToFixed'],td[permitted-action='RejectToActivityCodes']").hide();
                    return;
                }
                // 自动保存
                $(this).find("input[type=checkbox]").prop("checked", obj["PermittedActions"] && obj["PermittedActions"][_ActionName] ? true : false)
                    .unbind("change.PermittedActions")
                    .bind("change.PermittedActions", function () {
                        //初始化允许的操作
                        if (!wp.CurrentObject["PermittedActions"])
                            wp.CurrentObject["PermittedActions"] = {};

                        wp.CurrentObject["PermittedActions"]["RejectToFixed"] = $(this).prop("checked");

                        //隐藏选择活动控件
                        var _RejectToActivityCodesRow = $("td[permitted-action='RejectToActivityCodes']");

                        if ($(this).prop("checked")) {
                            //显示选择活动控件
                            _RejectToActivityCodesRow.show();
                            var _sltRejectActivityCodes = _RejectToActivityCodesRow.find("select");
                            _sltRejectActivityCodes.find("option").remove();

                            //初始化所有可选活动
                            $(workflow.activities).each(function () {
                                var _option = $("<option></option>");
                                if (this.ToolTipText == "Start"
                                    || this.ToolTipText == "End"
                                    || this.ActivityCode == wp.CurrentObject["ActivityCode"])
                                    _option.attr("disabled", "disabled");

                                _option.val(this.ActivityCode)
                                    .text(this.DisplayName + "[" + this.ActivityCode + "]").appendTo(_sltRejectActivityCodes);
                            });

                            //已选中的活动
                            var _ReturnActivityCodes = obj.PermittedActions["RejectToActivityCodes"];
                            if (_ReturnActivityCodes && _ReturnActivityCodes.length > 0) {
                                $(_ReturnActivityCodes).each(function () {
                                    _sltRejectActivityCodes.find("option[value='" + this + "']").attr("selected", "selected");
                                });
                            }

                            //改变时
                            _sltRejectActivityCodes.chosen()
                                .unbind("change.Property").bind("change.Property", function (e, data) {
                                    if (!wp.CurrentObject.PermittedActions["RejectToActivityCodes"])
                                        wp.CurrentObject.PermittedActions["RejectToActivityCodes"] = [];
                                    //选中新项
                                    if (data.selected) {
                                        wp.CurrentObject.PermittedActions["RejectToActivityCodes"].push(data.selected);
                                    }
                                        //删除项
                                    else if (data.deselected) {
                                        for (var index = wp.CurrentObject.PermittedActions["RejectToActivityCodes"].length - 1 ; index >= 0; index--) {
                                            if (wp.CurrentObject.PermittedActions["RejectToActivityCodes"][index] == data.deselected) {
                                                wp.CurrentObject.PermittedActions["RejectToActivityCodes"].splice(index, 1);
                                                break;
                                            }
                                        }
                                    }
                                });

                            _sltRejectActivityCodes.trigger("chosen:updated");
                            //初始化宽度
                            _sltRejectActivityCodes.parent().find("div.chosen-container-multi").width("94%");
                        }
                        else {
                            _RejectToActivityCodesRow.hide();
                            wp.CurrentObject["PermittedActions"]["RejectToActivityCodes"] = [];
                        }
                    });

                //触发改变事件,显示/隐藏选择驳回的活动
                $(this).find("input[type=checkbox]").change();
            }
        }
        else {
            $(this).find("input[type=checkbox]").prop("checked", obj["PermittedActions"] && obj["PermittedActions"][_ActionName] ? true : false)
                .unbind("change.PermittedActions")
                .bind("change.PermittedActions", function () {
                    var thisActionName = $(this).parents("td[permitted-action]:first").attr("permitted-action");
                    if (thisActionName) {
                        var _Activities = wp.CurrentObject;
                        if (wp.Multi.IsMulti) {
                            _Activities = wp.Multi.CurrentObjects;
                        }
                        var _val = $(this).prop("checked")
                        $(_Activities).each(function () {
                            if (!this["PermittedActions"])
                                this["PermittedActions"] = {};

                            this["PermittedActions"][thisActionName] = _val;
                        });
                    }
                });
        }
    });
}

// 设置数据项的权限
var DataPermissions = function (obj, parent) {
    //所有Checkbox,包括头行的全选框
    var headerAndRowCheckboxes = $("tr[group=DataItem][property=DataPermissions]").find("input[type=checkbox]")
    if (wp.Multi.IsMulti) {
        //点击启用
        headerAndRowCheckboxes.attr("data-batch", true);
    }
    else {
        headerAndRowCheckboxes.removeAttr("data-batch")
    }

    _DataItems = PackageManager.GetDataItems()
    if (!_DataItems || _DataItems.length == 0)
        return;

    if (!obj["DataPermissions"])
        obj["DataPermissions"] = [];

    var DataPermissionRows = $("tr[group=DataItem][property=DataPermissions]").find("tr:has('input[type=checkbox]')").not(":first");
    //若数据权限为空,则初始化为全部只读
    if (!obj["DataPermissions"] || obj["DataPermissions"].length == 0) {
        obj["DataPermissions"] = [];
        $(_DataItems).each(function () {
            obj["DataPermissions"].push({
                ItemName: this.Value,
                Visible: true,
                MobileVisible: true
            });
        });
    }

    if (DataPermissionRows && DataPermissionRows.length > 0 && obj["DataPermissions"] && obj["DataPermissions"].length > 0) {
        $(obj["DataPermissions"]).each(function () {
            if (this.ItemName) {
                var _ItemName = this.ItemName;
                var _CurrentRow = $(DataPermissionRows).filter(function () {
                    return $(this).attr("item-name") == _ItemName;
                });

                //显示属性
                _CurrentRow.find("input[type=checkbox]:eq(0)").prop("checked", this.Visible ? true : false);
                _CurrentRow.find("input[type=checkbox]:eq(1)").prop("checked", this.Editable ? true : false);
                _CurrentRow.find("input[type=checkbox]:eq(2)").prop("checked", this.Required ? true : false);
                _CurrentRow.find("input[type=checkbox]:eq(3)").prop("checked", this.TrackVisible ? true : false);
                _CurrentRow.find("input[type=checkbox]:eq(4)").prop("checked", this.MobileVisible ? true : false);
            }
        });
    }

    // 设置第一行的checkbox是否选中
    var table = $("tr[group=DataItem][property=DataPermissions]").find("table");
    var firstRow = table.find("tr:eq(0)");
    var otherRows = table.find("tr:gt(0)");
    var tds = firstRow.find("td");
    for (var i = 0, len = tds.length; i < len; i++) {
        if ($(tds[i]).find("input[type=checkbox]").length === 0) {
            continue;
        }
        var hasUnChecked = false;
        for (var j = 0, len2 = otherRows.length; j < len2; j++) {
            var checkbox = $(otherRows[j]).find("td:eq(" + i + ")").find("input[type=checkbox]");
            if (!checkbox.prop("checked")) {
                hasUnChecked = true;
                break;
            }
        }
        firstRow.find("td:eq(" + i + ")").find("input[type=checkbox]").prop("checked", !hasUnChecked);
    }
}

// 设置控件绑定对象的属性
$.fn.PropertyControlValueBind = function (obj, _PropertyName) {
    if (!_PropertyName)
        return;

    var o = $(this);

    // 显示只读属性(当前只有流程模板编码)
    if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Workflow && _PropertyName == "WorkflowCode") {
        o.find("span.PropertyValue").html(val);
        return o;
    }
        //字体样式,字体大小
    else if (_PropertyName == "FontSize") {
        if (wp.CurrentObject.GetFontSize)
            o.find("input[type=text],input[type=number]").val(wp.CurrentObject.GetFontSize());
    }
    else if (_PropertyName == "FontColor") {
        if (wp.CurrentObject.GetFontColor)
            o.find("input[type=text]").val(wp.CurrentObject.GetFontColor());
    }
        // 允许的操作
    else if (_PropertyName == "PermittedActions") {
        return PermittedActions(obj, o);
    }
        // 数据项权限
    else if (_PropertyName == "DataPermissions") {
        return DataPermissions(obj, o);
    }
        // 子流程数据映射
    else if (_PropertyName == "DataMaps") {
        return DataMapSettings.SubInstanceDataMapsBind(_PropertyName);
    }
        //事件
    else if (o.find("div.BizEvents").length > 0) {
        if (wp.CurrentObject[_PropertyName] && wp.CurrentObject[_PropertyName].Configured) {
            o.find("div.BizEvents").text(_WorkflowDesigner_GlobalString.ActivityEvent_Set);
        }
        else {
            o.find("div.BizEvents").text("");
        }
        return o;
    }
        //业务动作复选框,使用chosen事件处理
    else if (o.find("select[multiple].biz-actions-list").length > 0) {
        var _Chosen = o.find("select[multiple].biz-actions-list");
        if (!wp.CurrentObject[_PropertyName])
            wp.CurrentObject[_PropertyName] = [];

        _Chosen.find("option").removeAttr("selected");
        $(wp.CurrentObject[_PropertyName]).each(function () {
            var _thisAction = this;
            _Chosen.find("option").filter(function () {
                return $(this).val() == _thisAction;
            }).attr("selected", "selected");
        });
        _Chosen.trigger("chosen:updated");
        return o;
    }
    //    //计划时长:时间段
    //else if (_PropertyName == "PlanUsedTime") {
    //    var _numbers = o.find("input[type=number]");
    //    _numbers.val("");
    //    var usedTime = wp.CurrentObject[_PropertyName];
    //    var days = 0, hours = 0, minutes = 0, seconds = 0;
    //    if (usedTime) {
    //        if (usedTime.indexOf(".") > -1) {
    //            days = parseInt(usedTime.substring(0, usedTime.indexOf(".")));
    //            usedTime = usedTime.substring(usedTime.indexOf(".") + 1);
    //        }
    //        times = usedTime.split(":");
    //        hours = parseInt(times[0]);
    //        minutes = parseInt(times[1]);
    //        seconds = parseInt(times[2]);
    //    }
    //    _numbers.eq(0).val(days);
    //    _numbers.eq(1).val(hours);
    //    _numbers.eq(2).val(minutes);
    //    _numbers.eq(3).val(seconds);
    //    _numbers.unbind("change").bind("change", function () {
    //        var _t = function (_i) {
    //            if (_i) {
    //                if (_i.length == 1) {
    //                    return "0" + _i;
    //                }
    //                return _i;
    //            }
    //            else { return "00"; }
    //        };
    //        wp.CurrentObject[_PropertyName] = _t(parseInt(_numbers.eq(0).val()) || 0) + "." + _t(parseInt(_numbers.eq(1).val()) || 0) + ":" + _t(parseInt(_numbers.eq(2).val()) || 0) + ":" + _t(parseInt(_numbers.eq(3).val()) || 0);
    //    });
    //    return o;
    //}
    //流程模板选择控件
    var val = wp.CurrentObject[_PropertyName];
    if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity && _PropertyName == "WorkflowCode") {
        //WorkflowCode
        o.find("input[type=hidden]").val(val);
        if (val) {
            o.find("input[type=text]").val(PackageManager.GetWorkflowDisplayName(val));
        }
        else {
            //ERROR:显示名称
            o.find("input[type=text]").val(PackageManager.GetWorkflowDisplayName(val));
        }

        o.find("input[type=hidden]").unbind("change").bind("change", function () {
            var _WorkflowCode = $(this).val();
            wp.CurrentObject[_PropertyName] = _WorkflowCode;

            //更新缓存
            if (_WorkflowCode)
                PackageManager.WorkflowNameCache[_WorkflowCode.toLowerCase()] = $(this).parent().find("input[type=text]").val();
        });

        return;
    }
    // 文本框，下拉框，富文本框
    var ctls = o.find("input[type=text],input[type=number],textarea");
    if (ctls.length > 0) {
        ctls.val(val);

        //如果是公式,同时设置显示文字
        if (o.find("div.formula-display").length > 0) {
            //显示公式HTML
            FormulaEditableStack.ShowFormulaHtml(val, o.find("div.formula-display"));
        }

        //显示名称时改变时
        if (_PropertyName == "DisplayName" && wp.CurrentObject.SetText) {
            ctls.unbind("change.NameChanged").bind("change.NameChanged", function (e) {
                if (wp && wp.CurrentObject && wp.CurrentObject.SetText) {
                    //原名称
                    var _Source = wp.CurrentObject.DisplayName;

                    wp.CurrentObject.DisplayName = $(e.target).val();
                    wp.CurrentObject.SetText();
                    wp.SetTitle();

                    if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity) {
                        TraceManager.AddTrace(TraceManager.TraceType.Activity.TextChange, wp.CurrentObject, _Source);
                    }
                    else if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Line) {
                        TraceManager.AddTrace(TraceManager.TraceType.Line.TextChange, wp.CurrentObject, _Source);
                    }
                }
            });
        }
            //文字大小改变时
        else if (_PropertyName == "FontSize" && wp.CurrentObject.SetFontSize) {
            ctls.unbind("change.FontSizeChanged").bind("change.FontSizeChanged", function (e) {
                if (wp) {
                    //多选模式
                    if (wp.Multi.IsMulti) {
                        var _Sources = [];
                        $(wp.Multi.CurrentObjects).each(function () {
                            _Sources.push(this.FontSize);
                        });

                        var _FontSize = $(e.target).val();
                        if (_FontSize)
                            _FontSize = _FontSize.replace("px", "");
                        if (!isNaN(_FontSize)) {
                            //转为Int
                            _FontSize = parseInt(_FontSize);

                            $(wp.Multi.CurrentObjects).each(function () {
                                this.FontSize = parseInt(_FontSize);
                                this.SetFontSize();
                            });
                        }
                        $(e.target).val(wp.Multi.CurrentObjects[0].FontSize);

                        TraceManager.AddTrace(TraceManager.TraceType.Multi.ActivitiesTextSizeChange, wp.Multi.CurrentObjects, _Sources);
                    }
                    else if (wp.CurrentObject && wp.CurrentObject.SetFontSize) {
                        var _Source = wp.CurrentObject.FontSize;

                        var _FontSize = $(e.target).val();
                        if (_FontSize)
                            _FontSize = _FontSize.replace("px", "");
                        if (!isNaN(_FontSize)) {
                            //转为Int
                            _FontSize = parseInt(_FontSize);
                            wp.CurrentObject.FontSize = parseInt(_FontSize);
                            wp.CurrentObject.SetFontSize();
                        }
                        $(e.target).val(wp.CurrentObject.FontSize);

                        if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity) {
                            TraceManager.AddTrace(TraceManager.TraceType.Activity.TextSizeChange, wp.CurrentObject, _Source);
                        }
                        else if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Line) {
                            TraceManager.AddTrace(TraceManager.TraceType.Line.TextSizeChange, wp.CurrentObject, _Source);
                        }
                    }
                }
            });
        }
            //文字颜色改变时
        else if (_PropertyName == "FontColor" && wp.CurrentObject.SetFontColor) {
            ctls.unbind("change.FontColorChanged").bind("change.FontColorChanged", function (e) {
                if (wp) {
                    //多选模式
                    if (wp.Multi.IsMulti) {
                        var _Sources = [];
                        $(wp.Multi.CurrentObjects).each(function () {
                            _Sources.push(this.FontColor);
                        });

                        var _FontColor = $(e.target).val();
                        $(wp.Multi.CurrentObjects).each(function () {
                            this.FontColor = _FontColor;
                            this.SetFontColor();
                        });
                        $(e.target).val(wp.Multi.CurrentObjects[0].FontColor);

                        TraceManager.AddTrace(TraceManager.TraceType.Multi.ActivitiesTextColorChange, wp.Multi.CurrentObjects, _Sources);
                    }
                    else if (wp.CurrentObject && wp.CurrentObject.SetFontColor) {
                        var _Source = wp.CurrentObject.FontColor;

                        wp.CurrentObject["FontColor"] = $(e.target).val();
                        wp.CurrentObject.SetFontColor();
                        $(e.target).val(wp.CurrentObject.FontColor);

                        if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity) {
                            TraceManager.AddTrace(TraceManager.TraceType.Activity.TextColorChange, wp.CurrentObject, _Source);
                        }
                        else if (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Line) {
                            TraceManager.AddTrace(TraceManager.TraceType.Line.TextColorChange, wp.CurrentObject, _Source);
                        }
                    }
                }
            });
        }
            //线条公式改变时
        else if (_PropertyName == "Formula") {
            ctls.unbind("change.FormulaChanged").bind("change.FormulaChanged", function (e) {
                if (wp && wp.CurrentObject) {
                    wp.CurrentObject["Formula"] = $(e.target).val();
                    if (wp.CurrentObject.SetLineStyle)
                        wp.CurrentObject.SetLineStyle();
                }
            });
        }
        else ctls.unbind("change").bind("change", function (e) {
            if (wp && wp.CurrentObject) {
                var _thisValue = $(this).val();
                //格式验证
                //数字
                if (_PropertyName == "SortKey" || _PropertyName == "PlanRecurrences") {
                    if (!isNaN(_thisValue)) {
                        _thisValue = parseInt(_thisValue);

                        wp.CurrentObject[_PropertyName] = parseInt(_thisValue);
                        $(this).val(_thisValue);
                    }
                    else {
                        wp.CurrentObject[_PropertyName] = 0;
                        $(this).val("0");
                    }
                }
                else {
                    wp.CurrentObject[_PropertyName] = _thisValue;
                    //活动编码改变时,修改属性标题
                    if (_PropertyName == "ActivityCode") {
                        wp.SetTitle();
                    }
                }
            }
        });

        return o;
    }

    //如果是select,并且值为空,默认选中第一个
    var slt = o.find("select");
    if (slt && slt.length > 0) {
        var _Found = false;
        slt.find("option").each(function () {
            if ($(this).val() == wp.CurrentObject[_PropertyName]) {
                $(this).prop("selected", true);
                _Found = true;
            }
        });
        if (!_Found)
            slt.find("option:first").prop("selected", true);

        slt.unbind("change.Property").bind("change.Property", function () {

            var _Value = $(this).val();
            if (wp.Multi.IsMulti) {
                _Activities = wp.Multi.CurrentObjects;
                $(_Activities).each(function () {
                    this[_PropertyName] = _Value;
                });
            }
            else
                wp.CurrentObject[_PropertyName] = $(this).val();

            if (_PropertyName == "LockPolicy") {
                if ($(this).find("option:first").prop("selected")) {
                    $(this).parents("tr[group][property]:first").next().hide();
                }
                else if ($(this).is(":visible")) {
                    $(this).parents("tr[group][property]:first").next().show();
                }
            }
        });

        if (!wp.Multi.IsMulti)  //多个节点时不调用change改变其他节点的值
            slt.change();
    }

    // radio选框
    ctls = o.find("input[type='radio']");
    if (ctls.length > 0) {
        o.find("input[type='radio']").unbind("change.Property").bind("change.Property", function () {
            wp.CurrentObject[_PropertyName] = $(this).parents("tr[group][property]:first").find("input[type=radio]").filter(function () {
                return $(this).prop("checked");
            }).val();

            //是否多人
            if (_PropertyName == "ParticipateType") {
                var _Group = $(this).parents("tr[group]:first").attr("group");
                if ($(this).parents("tr[group][property]:first").is(":hidden")
                    || $(this).parents("tr[group][property]:first").find("input[type=radio]:first").prop("checked")) {
                    var _Group = $(this).parents("tr[group]:first").attr("group");
                    $("tr[group=" + _Group + "][property=ParticipateMethod]").hide();
                    $("tr[group=" + _Group + "][property=FinishExit]").hide();
                    $("tr[group=" + _Group + "][property=ApproveExit]").hide();
                    $("tr[group=" + _Group + "][property=DisapproveExit]").hide();
                }
                else {
                    $(WorkflowProperties[wp.CurrentObject.ToolTipText]).each(function () {
                        if (this.Group == _Group) {
                            $(this.Properties).each(function () {
                                if (this == "ParticipateMethod" || this == "FinishExit" || this == "ApproveExit" || this == "DisapproveExit") {
                                    $("tr[group=" + _Group + "][property=" + this + "]").show();
                                }
                            });
                        }
                    });
                }
            }
        });

        //选中的项
        var selectedItem = $(ctls).filter(function () {
            return $(this).val() == val + "";
        });

        if (selectedItem.length > 0)
            selectedItem.prop("checked", true);
        else
            o.find("input[type='radio']:first").prop("checked", true);

        o.find("input[type='radio']").change();

        return o;
    }

    // 勾选框
    ctls = o.find("input[type='checkbox']");
    if (ctls.length > 0) {
        if (val)
            ctls.prop("checked", true);
        else
            ctls.prop("checked", false);

        o.find("input[type=checkbox]").unbind("change.Property").bind("change.Property", function () {
            wp.CurrentObject[_PropertyName] = $(this).prop("checked");

            //线条使用ELSE
            if (_PropertyName == "UtilizeElse") {
                //隐藏公式
                if ($(this).parents("tr:first").is(":visible") && !$(this).prop("checked")) {
                    $(this).parents("tr:first").next().show();
                }
                else {
                    $(this).parents("tr:first").next().hide();
                }

                if (wp.CurrentObject.SetLineStyle) {
                    wp.CurrentObject.SetLineStyle();
                }
            }

                //是否使用自定义代码
            else if (_PropertyName == "Custom") {
                if (!wp.CurrentObject[_PropertyName] || $(this).parents("tr[group][property]:first").is(":hidden")) {
                    $("#btnActivityCode").hide();
                    $(this).parents("tr:first").next().hide();
                }
                else {
                    $("#btnActivityCode").show();
                    $(this).parents("tr:first").next().show();
                }
            }
        });
        o.find("input[type=checkbox]").change();

        return o;
    }

    return o;
}

// 属性面板分组的展现/隐藏事件
$.fn.PropertyGroupBind = function () {
    //标题行样式
    $("td[group]").parent().css("background-color", "#eae5e5");

    //初始化组标题行
    $("td[group]").unbind("InitHeader").bind("InitHeader", function (Header, IsMulti) {
        //组名称
        var _Group = $(this).attr("Group");
        if ($(this).hasClass("Expanded")) {
            //隐藏所有属性行
            $("tr[group='" + _Group + "']").each(function (index) {
                if (index != 0) $(this).hide();
            });

            if (_Group == "ActivityBasic" && IsMulti) {
                var HasSheet = false;
                $(wp.Multi.CurrentObjects).each(function () {
                    $(WorkflowProperties[this.ToolTipText]).each(function () {
                        if (this.Group == _Group && $.inArray('SheetCode', this.Properties) > -1) {
                            HasSheet = true;
                            return false;
                        }
                    });
                });

                if (HasSheet)
                    $("tr[group='" + _Group + "'][Property='SheetCode']").show();
                else
                    $("tr[group='" + _Group + "']").hide();
            }
            else
                //显示当前属性行
                $(WorkflowProperties[wp.PropertyType]).each(function () {
                    if (this.Group == _Group)
                        $(this.Properties).each(function () {
                            var _thisRow = $("tr[group='" + _Group + "'][Property='" + this + "']");
                            var _prevRow = _thisRow.prev();

                            if (this == "CustomCode") {
                                if (_prevRow.is(":visible")
                                    && _prevRow.find("input[type=checkbox]").prop("checked")) {
                                    _prevRow.find("input[type=button]").show();
                                    _thisRow.show();
                                }
                                else {
                                    _prevRow.find("input[type=button]").hide();
                                    _thisRow.hide();
                                }
                            }
                                //锁级别与锁类型
                            else if (this == "LockLevel" && (_prevRow.is(":hidden") || _prevRow.find("option:first").prop("selected"))) {
                                _thisRow.hide();
                            }
                            else if (this == "Formula" && (_prevRow.is(":hidden") || _prevRow.find("input[type=checkbox]").prop("checked"))) {
                                _thisRow.hide();
                            }
                                //参与类型与参与方式、完成出口、同意出口、否决出口
                            else if ((this == "ParticipateMethod" || this == "FinishExit" || this == "ApproveExit" || this == "DisapproveExit")
                                && ($("tr[group='" + _Group + "'][Property=ParticipateType]").is(":hidden") || $("tr[group='" + _Group + "'][Property=ParticipateType]").find("input[type=radio]:first").prop("checked"))) {
                                _thisRow.hide();
                            }
                            else
                                _thisRow.show();

                        });
                });

        }
        else {
            //隐藏子行
            $("tr[group='" + _Group + "']").each(function (index) {
                if (index != 0)
                    $(this).hide();
            });
        }
    });

    $("tr[group]").filter(function () { return $(this).children("[colspan=3]").length == 1 && $(this).children(":last").has("table"); })
        .css("cursor", "pointer")
        .unbind("click dblclick").bind("click dblclick", function (e) {
            if ($(e.target).is("input[type=checkbox]")) return;

            e.preventDefault();
            e.stopPropagation();
            //组名称
            var _Td = $(this).find("td[group]");
            var _Group = _Td.attr("Group");
            //折叠
            if ($(_Td).hasClass("Expanded")) {
                $(_Td).removeClass("Expanded").addClass("Fold");
            }
                //展开
            else {
                $(_Td).removeClass("Fold").addClass("Expanded");
            }

            $(_Td).trigger("InitHeader", [wp.Multi.IsMulti]);;
        });

    $("td[group]").addClass("Fold").trigger("InitHeader");
}

// 活动事件选择器的绑定
$.fn.BizEventsBind = function (_WorkflowProperty) {

    $(this).unbind("click").click(function () {
        var displayControl = $(this).parents("tr:first").find("span");
        var _EventName = $(this).parents("[property]:first").attr("property");
        var _Activity = _WorkflowProperty.CurrentObject;  // 当前正在编辑的对象

        wp.ActivityEventEditor.Bind(_Activity, _EventName);

        $.ligerDialog.open({
            title: $(this).parents("td:first").prev().text(),
            target: $("#divBizEvents"),
            height: 390,
            width: 600,
            buttons: [
                {
                    text: _WorkflowDesigner_GlobalString.Button_Add, onclick: function (item, dialog) {
                        wp.ActivityEventEditor._AddNewRow();
                    }
                },
               {
                   text: _WorkflowDesigner_GlobalString.DataItem_Confirm, onclick: function (item, dialog) {
                       wp.ActivityEventEditor.SetActivity();

                       dialog.close();
                   }
               },
               {
                   text: _WorkflowDesigner_GlobalString.Button_Cancel, onclick: function (item, dialog) {
                       dialog.close();
                   }
               }],
        });

        $("#divBizEvents").ligerTab().selectTabItem("tabitem1");
    });

    return $(this);
}

// 长文本框绑定
$.fn.RichTextBind = function (p) {
    $(this).unbind("click").click(function () {
        var displayControl = $(this).parent().find("textarea");
        var pro = $(this).parent().parent().attr("property");
        var o = p.CurrentObject;  // 当前正在编辑的对象

        $("#divRichText textarea").val(displayControl.val());
        $.ligerDialog.open({
            title: $(this).parents("td:first").prev().text(),
            target: $("#divRichText"),
            height: 390,
            width: 600,
            buttons: [
               {
                   text: _WorkflowDesigner_GlobalString.DataItem_Confirm, onclick: function (item, dialog) {
                       displayControl.val($("#divRichText textarea").val()).change();
                       dialog.close();
                   }
               },
               {
                   text: _WorkflowDesigner_GlobalString.Button_Cancel, onclick: function (item, dialog) {
                       dialog.close();
                   }
               }]
        });

        $("#divRichText textarea").focus();
    });

    return $(this);
}

// 时间段绑定
$.fn.TimeSpanBind = function () {
    var divTimeSpan = $("#divTimeSpan");
    var _inputType = divTimeSpan.find("select");
    var _numbers = divTimeSpan.find("input[type=number]");
    var _dataitem = divTimeSpan.find("input[type=text]");
    $(this).unbind("click").click(function () {
        var displayControl = $(this);

        _numbers.val("0");
        _dataitem.val("");

        //显示值
        var v = $(displayControl).val();
        if (!v || !v.trim()) {
            _inputType.val("input").change();
        }
        else {
            v = v.trim();

            //选择数据项
            if (v.replace(/[ 0-9\.\:]*/g, "") != "") {
                _inputType.val("choose").change();
                _numbers.closest("tr").hide();
                _dataitem.closest("tr").show();
                _dataitem.val(v);
            }
            else {
                _inputType.val("input").change();
                _numbers.closest("tr").show();
                _dataitem.closest("tr").hide();

                var days = 0, hours = 0, minutes = 0, seconds = 0;
                if (v) {
                    if (v.indexOf(".") > -1) {
                        days = parseInt(v.substring(0, v.indexOf(".")));
                        v = v.substring(v.indexOf(".") + 1);
                    }
                    times = v.split(":");
                    hours = parseInt(times[0]);
                    minutes = parseInt(times[1]);
                    seconds = parseInt(times[2]);

                    _numbers.eq(0).val(days);
                    _numbers.eq(1).val(hours);
                    _numbers.eq(2).val(minutes);
                    _numbers.eq(3).val(seconds);
                }
            }
        }

        $.ligerDialog.open({
            title: $(this).parents("td:first").prev().text(),
            target: $("#divTimeSpan"),
            height: 390,
            width: 600,
            buttons: [
               {
                   text: _WorkflowDesigner_GlobalString.DataItem_Confirm, onclick: function (item, dialog) {

                       var _v = "";
                       if (_inputType.val() == "choose") {
                           _v = _dataitem.val();
                       }
                       else {
                           var _t = function (_i) {
                               if (_i) {
                                   if (_i.length == 1) {
                                       return "0" + _i;
                                   }
                                   return _i;
                               }
                               else { return "00"; }
                           };
                           _v = _t(parseInt(_numbers.eq(0).val()) || 0) + "." + _t(parseInt(_numbers.eq(1).val()) || 0) + ":" + _t(parseInt(_numbers.eq(2).val()) || 0) + ":" + _t(parseInt(_numbers.eq(3).val()) || 0);
                       }
                       displayControl.val(_v).change();

                       dialog.close();
                   }
               },
               {
                   text: _WorkflowDesigner_GlobalString.Button_Cancel, onclick: function (item, dialog) {
                       dialog.close();
                   }
               }]
        });

        $("#divTimeSpan textarea").focus();
    });

    return $(this);
}

var SubTableTimeHandler;
var BatchSubColumnState = false;