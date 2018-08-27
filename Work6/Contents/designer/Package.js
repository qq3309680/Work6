/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />
/// <reference path="Package.js" />

//var _Package_GlobalString = {
//    "Package_Failed": "获取数据项失败",
//    "Package_Mssg": "当前数据模型已修改,保存并刷新以进行编辑?",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "Package_Failed,Package_Mssg" }, function (data) {
//    if (data.IsSuccess) {
//        _Package_GlobalString = data.TextObj;
//    }
//}, "json");


PackageManager = {
    //缓存 : 流程模板编码\显示名称
    WorkflowNameCache: {

    },

    //缓存 : 流程编码\数据模型编码
    WorkflowCodeSchemaPairCache: {
    },
    //缓存 : 数据模型编码\数据模型
    SchemaCache: {
    },

    GetWorkflowDisplayName: function (_WorkflowCode) {
        if (!_WorkflowCode)
            return "";
        return PackageManager.WorkflowNameCache[_WorkflowCode.toLowerCase()];
    },

    //根据流程模板编码获取数据项
    //_LoadFinished: 数据项加载完成事件
    GetDataItemByWorkflowCode: function (_WorkflowCode, _LoadFinished) {
        if (!_WorkflowCode)
            return [];
        var _SchemaCode = PackageManager.WorkflowCodeSchemaPairCache[_WorkflowCode.toLowerCase()];
        if (_SchemaCode) {
            return PackageManager.SchemaCache[_SchemaCode.toLowerCase()];
        }
        else {
            //从服务器获取数据项列表
            $.ajax({
                type: "post",
                url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
                cache: false,
                async: false,
                dataType: "json",
                data: {
                    Command: "GetDataItemsByWorkflowCode",
                    WorkflowCode: _WorkflowCode
                },
                success: function (result) {
                    if (result == "PortalSessionOut") {
                        WorkflowDocument.ShowLogin();
                        return;
                    }
                    if (result && result.SchemaCode) {
                        //添加到缓存
                        _SchemaCode = PackageManager.WorkflowCodeSchemaPairCache[_WorkflowCode.toLowerCase()] = result.SchemaCode.toLowerCase();
                        PackageManager.SchemaCache[result.SchemaCode.toLowerCase()] = result.DataItems;
                    }

                    //数据项加载完成事件
                    if (_LoadFinished && typeof (_LoadFinished) == "function") {
                        _LoadFinished();
                    }
                },
                error: function (msg) {
                    //alert(msg.responseText);
                    WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.Package_Failed);
                }
            });
        }
        if (_SchemaCode && PackageManager.SchemaCache[_SchemaCode.toLowerCase()])
            return PackageManager.SchemaCache[_SchemaCode.toLowerCase()];
        return [];
    },

    //获取当前数据模型编码
    GetPackage: function () {
        if (typeof (Package) != "undefined" && Package)
            return Package.SchemaCode;
    },
    //获取流程模板包里的表单编码
    GetSheets: function () {
        if (typeof (Package) != "undefined" && Package) {
            return Package.Sheets;
        }
        return [];
    },
    //获取流程模板包里的表单编码
    GetBizObjectSchemaCode: function () {
        if (typeof (Package) != "undefined" && Package) {
            return Package.SchemaCode;
        }
    },
    GetDataItems: function () {
        if (typeof (DataItems) != "undefined")
            return DataItems;
    },

    GetDataItemDisplayName: function (_Item) {
        if (typeof (DataItems) != "undefined" && _Item) {
            for (var i = 0; i < DataItems.length; i++) {
                if (DataItems[i] && DataItems[i].Value == _Item)
                    return DataItems[i].Text;
            }
        }
        return _Item;
    }
}

var BizObjectSchemaChanged = false;
var OnBizObjectSchemaChanged = function (_SchameCode) {
    //如果缓存中存在该数据模型编码,则从服务器重新获取
    if (_SchameCode) {
        //当前数据模型编码 被变更,提示刷新
        if (workflowMode == WorkflowMode.Designer && PackageManager.GetPackage() && PackageManager.GetPackage().toLowerCase() == _SchameCode.toLowerCase()) {
            BizObjectSchemaChanged = true;
        }
    }
}

var OnPageShown = function () {
    if (BizObjectSchemaChanged) {
        $.ligerDialog.confirm(_WorkflowDesigner_GlobalString.Package_Mssg, function (result) {
            if (result) {
                WorkflowDocument.SaveWorkflow();
                //刷新当前标签页
                top.workTab.reload(top.workTab.getSelectedTabItemID());
            }
        });
    }
    BizObjectSchemaChanged = false;
}