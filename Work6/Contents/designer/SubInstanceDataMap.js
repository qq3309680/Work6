/// <reference path="Package.js" />

//var _SubInstanceDataMap_GlobalString = {
//    "Button_Remove": "删除",
//    "DataItem_Confirm": "确定",
//    "Button_Cancel": "取消",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "Button_Remove,DataItem_Confirm,Button_Cancel" }, function (data) {
//    if (data.IsSuccess) {
//        _SubInstanceDataMap_GlobalString = data.TextObj;
//    }
//}, "json");

//子流程数据映射
var DataMapSettings = {
    DataModelCache: {},
    //数据映射编辑容器
    divSubInstanceDataMaps: undefined,
    //选中列表
    SelectedList: undefined,
    //选中的所有数据映射
    ulSelectedSubInstanceDataMaps: undefined,
    //下拉框:选择数据项
    ddlDataItems2: undefined,
    //下拉框:选择映射类型
    ddlInOutTypes: undefined,
    //输入框:输入子流程数据项
    txtSubInstanceDataItem: undefined,

    //初始化
    SubInstanceDataMapInit: function () {
        //编辑窗口
        DataMapSettings.divSubInstanceDataMaps = $("div#divSubInstanceDataMaps");
        //选中的列表
        DataMapSettings.SelectedList = $("ul#ulSelectedSubInstanceDataMaps");
        //选择数据项的下拉框
        DataMapSettings.ddlDataItems2 = $("select.ddlDataItems2");
        //选择映射类型的下拉框
        DataMapSettings.ddlInOutTypes = $("select.ddlInOutTypes");
        //输入框:输入子流程数据项
        DataMapSettings.txtSubInstanceDataItem = $("input#txtSubInstanceDataItem[type=text]");

        //缓存:流程模板编码\显示名称
        if (typeof (WorkflowNames) != "undefined" && WorkflowNames) {
            for (p in WorkflowNames) {
                PackageManager.WorkflowNameCache[p.toLowerCase()] = WorkflowNames[p];
            }
        }

        //点击子流程数据映射弹出编辑窗口
        $("ul.SubInstanceDataMap-list")
            .unbind("click.Property")
            .bind("click.Property", function () {
                var _DisplayControl = this;
                var _PropertyName = $(this).parents("td[property]:first").attr("property");

                //重置控件
                DataMapSettings.divSubInstanceDataMaps.find("tr").not(":has('th')").remove();

                //选项
                var _Option = $("<option></option>");
                //选择父数据项的控件
                //var _ParentSelector = $("<select></select>");
                //var _DataItems = PackageManager.GetDataItems();
                ////数据权限
                //if (_DataItems && _DataItems.length > 0) {
                //    $(_DataItems).each(function () {
                //        if (this.Value.indexOf(".") < 0) {
                //            _Option.clone().text(this.Text).val(this.Value).appendTo(_ParentSelector);
                //        }
                //    });
                //}
                // 父流程数据项映射
                var _ParentSelector = $("<input type=\"text\" class=\"propertyTree\">");

                //数据映射类型
                var _MapTypeSelector = $("<select></select>");
                if (typeof (MapTypes) != "undefined" && MapTypes) {
                    $(MapTypes).each(function () {
                        _Option.clone().text(this.Text).val(this.Value).appendTo(_MapTypeSelector);
                    });
                }

                //子数据项选择控件
                var _WorkflowCode = wp.CurrentObject["WorkflowCode"];
                var _ChildSelector = $("<select data-target='ChildDataItem'></select>");
                if (_WorkflowCode) {
                    //流程编码来自于数据项
                    if (_WorkflowCode.match(/{[^}]*}/)) {
                        _ChildSelector = $("<input type='text' data-target='ChildDataItem' />");
                    }
                    else {
                        var _ChildDataItems = PackageManager.GetDataItemByWorkflowCode(wp.CurrentObject["WorkflowCode"]);
                        if (_ChildDataItems && _ChildDataItems.length > 0) {
                            $(_ChildDataItems).each(function () {
                                _Option.clone().text(this.Text+"["+this.Value+"]").val(this.Value).appendTo(_ChildSelector);
                            });
                        }
                    }
                }

                //删除按钮
                var _DeleteButton = $("<input type='button' value='" + _WorkflowDesigner_GlobalString.Button_Remove + "' />");

                var _tr = $("<tr></tr>");
                var _td = $("<td style=\"text-align:center;\"></td>");
                //添加新行
                var _AddNewRow = function (_DataMap) {
                    var _CurrentRow = _tr.clone().append($(_td).clone().append(_ParentSelector.clone().width("98%")))
                           .append($(_td).clone().append(_MapTypeSelector.clone().width("98%")))
                           .append($(_td).clone().append(_ChildSelector.clone().width("98%")))
                           .append($(_td).clone().append(_DeleteButton.clone().attr("onclick", "$(this).parents('tr:first').remove();")));

                    if (_DataMap && _DataMap.ParentDataName) {
                        var _ParentDataName = PackageManager.GetDataItemDisplayName(_DataMap.ParentDataName) + "[" + _DataMap.ParentDataName + "]";
                        _CurrentRow.find(".propertyTree").val(_ParentDataName);
                        _CurrentRow.find("select:eq(0)").val(_DataMap.Type);
                        _CurrentRow.find("[data-target='ChildDataItem']").val(_DataMap.ChildDataName);
                    }

                    var _PrevRow = DataMapSettings.divSubInstanceDataMaps.find("tr:has('select'):last");
                    if (!_PrevRow || _PrevRow.length == 0)
                        _PrevRow = DataMapSettings.divSubInstanceDataMaps.find("tr:first");

                    _PrevRow.after(_CurrentRow);

                    _CurrentRow.find(".propertyTree").ligerComboBox({
                        selectBoxWidth: 360,
                        selectBoxHeight: 260, valueField: 'text',
                        tree: {
                            url: "../Ajax/TreeDataHandler/PropertyTreeHandler.ashx?SchemaCode=" + WorkflowDocumentStack.Workflow.BizObjectSchemaCode,
                            checkbox: false,
                            isExpand: 2,
                            ajaxType: 'get'
                        },
                        treeLeafOnly: true
                    });
                };

                var rowIndex = 0;
                //显示到编辑列表
                if (wp.CurrentObject["DataMaps"]) {
                    //展示现有数据
                    $(wp.CurrentObject["DataMaps"]).each(function (index) {
                        if (this.ParentDataName) {
                            _AddNewRow(this);
                            rowIndex++;
                        }
                    });
                }
                if (rowIndex == 0) {
                    for (var i = rowIndex; i < 9; i++) {// 默认添加9行数据
                        _AddNewRow(this);
                    }
                }
                // 添加按钮
                /*
                DataMapSettings.divSubInstanceDataMaps.find("tr:last").
                    after($(_tr).clone().append($(_td).clone().attr("colspan", "4").
                    append($("<input type='button' value='添加' />").bind("click", _AddNewRow))));
                */
                $.ligerDialog.open({
                    target: DataMapSettings.divSubInstanceDataMaps,
                    title: "数据映射关系设置",
                    height: 390,
                    width: 600,
                    buttons: [
                        {
                            text: "添加",
                            onclick: function (item, dialog) {
                                _AddNewRow();
                            }
                        },
                       {
                           text: _WorkflowDesigner_GlobalString.DataItem_Confirm, onclick: function (item, dialog) {
                               $(_DisplayControl).find("li").remove();
                               wp.CurrentObject["DataMaps"] = [];

                               $(DataMapSettings.divSubInstanceDataMaps).find("tr:has('select')").each(function () {
                                   var _ParentDataName = $(this).find(".propertyTree").val();// $(this).find("select:eq(0)").val();
                                   var _Type = $(this).find("select:eq(0)").val();
                                   var _ChildDataCode = $(this).find("[data-target='ChildDataItem']").val();
                                   var _ParentDataCode = _ParentDataName.substring(_ParentDataName.indexOf('[') + 1, _ParentDataName.indexOf(']'));
                                   var _ChildDataName = $(this).find("[data-target='ChildDataItem']").find("option:selected").text();
                                   // _ChildDataName = _ChildDataName + "[" + _ChildDataCode + "]";
                                   if (!_ParentDataCode)
                                       _ParentDataCode = _ParentDataName;
                                   // 只有设置了值才能保存
                                   if (_ParentDataName && _ChildDataCode) {
                                       wp.CurrentObject["DataMaps"].push({
                                           ParentDataName: _ParentDataCode,
                                           Type: _Type,
                                           ChildDataName: _ChildDataCode
                                       });

                                       var MapType = "->";
                                       if (_Type == "1")
                                           MapType = "<-";
                                       else if (_Type == "2")
                                           MapType = "<->";

                                       // 在属性窗口中显示
                                       $("<li></li>")
                                           .text(_ParentDataName + MapType + _ChildDataName)
                                           .attr("DataItem", _ParentDataCode)
                                           .attr("Type", _Type)
                                           .attr("ChildDataName", _ChildDataCode)
                                           .appendTo(_DisplayControl);
                                   }
                               });

                               dialog.close();
                           }
                       },
{
    text: _WorkflowDesigner_GlobalString.Button_Cancel, onclick: function (item, dialog) {
        dialog.close();
    }
}]
                });
            });
    },

    //绑定显示
    SubInstanceDataMapsBind: function (_PropertyName) {
        //显示子流程数据映射到属性栏
        var _DisplayControl = $("tr[group='SubInstanceDataMaps'][property='" + _PropertyName + "']").find("ul");
        _DisplayControl.find("li").remove();

        var _ChildDataItems = PackageManager.GetDataItemByWorkflowCode(wp.CurrentObject["WorkflowCode"]);
        if (wp.CurrentObject[_PropertyName]) {
            $(wp.CurrentObject[_PropertyName]).each(function () {
                if (this.ParentDataName) {
                    var MapType = "->";
                    if (this.Type == "1")
                        MapType = "<-";
                    else if (this.Type == "2")
                        MapType = "<->";
                    var _ChildDataName = this.ChildDataName;
                    for (var i = 0; i < _ChildDataItems.length; i++) {
                        if (this.ChildDataName == _ChildDataItems[i].Value)
                            _ChildDataName = _ChildDataItems[i].Text + "[" + this.ChildDataName + "]";
                    }

                    var _ParentDataName = PackageManager.GetDataItemDisplayName(this.ParentDataName) + "[" + this.ParentDataName + "]";
                    $("<li></li>")
                        .text(_ParentDataName + MapType + _ChildDataName)
                        .attr("DataItem", this.ParentDataName)
                        .attr("Type", this.Type)
                        .attr("ChildDataName", this.ChildDataName)
                        .appendTo(_DisplayControl);
                }
            });
        }
    }
}