
/*
    数据项选择控件的脚本库
*/

//var _DataItem_GlobalString = {
//    "DataItem_ChooseDataItem": "选择数据项",
//    "DataItem_Confirm": "确定",
//    "Button_Cancel": "取消",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "DataItem_ChooseDataItem,DataItem_Confirm,Button_Cancel" }, function (data) {
//    if (data.IsSuccess) {
//        _DataItem_GlobalString = data.TextObj;
//    }
//}, "json");

var DataItem = function (workflowDocument) {
    this.WorkflowDocument = workflowDocument;
    this.Controls = {
        treeDataItems: $("#treeDataItems")    // 树形容器
    };

    this.init();
}

var DataItemPermission = function () {
    this.Visible = true;
    this.Editable = false;
    this.Required = false;
    this.TrackVisible = false;
    this.MobileVisible = true;
    this.ViewName = undefined;
}

DataItem.prototype.init = function () {

    this.Controls.treeDataItems.css("width", "300px");
};

// 数据项选择控件绑定
/*
    @o : Workflow 节点对象
    @p : Porperty 对象的实例
    @d : DataItem 对象的实例
*/

var DataItemStack = {
    //数据项选择窗口
    DataItemDialog: undefined,

    //编辑中的文本控件
    TextControl: undefined,
    //选中的文本
    SelectedText: "",
    //选中的值
    SelectedValue: ""
}

$.fn.DataItemsBind = function () {
    $(this).unbind("click").click(function () {
        DataItemStack.TextControl = $(this).parent().find("input[type=text],input[type=hidden],textarea");

        //是在选择流程编码
        DataItemStack.ReplaceMode = $(this).attr("data-select-mode") == "replace";

        //清空已选值
        DataItemStack.SelectedText = "";
        DataItemStack.SelectedValue = "";

        // 选择数据项后的事件
        DataItemStack.DataItemDialog = $.ligerDialog.open({
            title: _WorkflowDesigner_GlobalString.DataItem_ChooseDataItem,
            target: $("#divDataItems"),
            height: 510,
            width: 460,
            buttons: [
               {
                   text: _WorkflowDesigner_GlobalString.DataItem_Confirm, onclick: function (item, dialog) {
                       if (DataItemStack.ReplaceMode) {
                           DataItemStack.TextControl.val(DataItemStack.SelectedValue).change();
                       }
                       else {
                           DataItemStack.TextControl.val(DataItemStack.TextControl.val() + DataItemStack.SelectedValue);
                       }
                       //触发文本框改变事件
                       DataItemStack.TextControl.change();
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

    return $(this);
}

var DataItemSelected = function (_Text, _Value) {
    DataItemStack.SelectedText = _Text;
    DataItemStack.SelectedValue = _Value;

    if (DataItemStack.ReplaceMode) {
        DataItemStack.TextControl.val(DataItemStack.SelectedValue);
    }
    else {
        DataItemStack.TextControl.val(DataItemStack.TextControl.val() + DataItemStack.SelectedValue);
    }

    //触发文本框改变事件
    DataItemStack.TextControl.change();
    DataItemStack.DataItemDialog.close();
}