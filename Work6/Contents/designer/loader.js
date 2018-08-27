/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />
/// <reference path="WorkflowDocument.js" />
/// <reference path="Package.js" />
/// <reference path="TraceManager.js" />
/// <reference path="Property.js" />
//流程全局静态字段
var _WorkflowDesigner_GlobalString = { "Activity_SaveSuccess": "保存成功", "Activity_SaveFailed": "保存失败", "ActivityEvent_Set": "已设置", "ContextMenu_Attribute": "属性", "ContextMenu_SetTemplate": "设为模板", "DataItem_ChooseDataItem": "选择数据项", "DataItem_Confirm": "确定", "Formula_FunctionName": "函数名称:", "Formula_NoClosed": "存在未关闭的", "Formula_TestFailed": "检验失败", "FormulaEditable_EditFormul": "编辑公式", "Package_Failed": "获取数据项失败", "Package_Mssg": "当前数据模型已修改,保存并刷新以进行编辑?", "Porperty_LeftKey": "左键按住编辑子项", "Porperty_Activity": "活动", "Porperty_WokflowTempalte": "流程模板", "Porperty_Line": "线条", "Porperty_Attribute": "属性", "Porperty_More": "等", "Poeperty_One": "个", "Workflow_StratNode": "开始节点不允许删除", "Workflow_EndNode": "结束节点不允许删除", "Workflow_Estimate": "预估处理人", "WorkflowDocument_Internal": "服务器内部错误", "WorkflowDocument_WorkflowName": "流程模板名称", "WorkflowDocument_ActivityCode": "活动编码重复", "WorkflowDocument_TestSuccessful": "检验成功", "WorkflowDocument_TestFailed": "检验失败", "WorkflowDocument_ConfirmRelease": "确定发布吗?", "WorkflowDocument_FailedRelease": "发布失败", "WorkflowDocument_Playback": "点击流程回放", "WorkflowDocument_FormartValid": "文件格式不正确，导入失败", "WorkflowDocument_Specification": "正在加载版本兼容性说明文件...", "WorkflowDocument_ImportSuccessful": "导入文件成功", "WorkflowDocument_ImportFailed": "导入失败:无法识别版本", "WorkflowDocument_FileFormart": "文件格式非", "WorkflowDocument_Mssg": "无法导入，您的浏览器不支持文件读取，建议使用Chrome、FireFox、IE 9及以上版本、Opera", "WorkflowDocument_ExportSuccessful": "导出成功", "WorkflowDocument_ExportFailed": "尚未保存,导出失败", "WorkflowDocument_ViewPicture": "查看图片", "WorkflowDocument_RefreshedSuccessful": "刷新成功", "WorkflowDocument_Empty": "流程图已清空", "WorkflowTrace_AddActivity": "添加活动", "WorkflowTrace_AddLine": "添加线条", "WorkflowTrace_ChangeText": "修改活动文字", "WorkflowTrace_ChangeTextSize": "修改活动文字大小", "WorkflowTrace_ChangeTextColor": "修改活动文字颜色", "WorkflowTrace_ChangeLineText": "修改线条文字", "WorkflowTrace_ChangeLineTextSize": "修改线条文字大小", "WorkflowTrace_ChangeLineTextColor": "修改线条文字颜色", "WorkflowTrace_AdjustLine": "线条调整", "WorkflowTrace_RemoveActivity": "活动删除", "WorkflowTrace_RemoveLine": "线条删除", "WorkflowTrace_ChangeActivitySize": "活动调整大小", "WorkflowTrace_MoveActivity": "活动移动", "WorkflowTrace_MoveActivityMulti": "(多)活动移动", "WorkflowTrace_ActivitySize": "(多)活动文字大小", "WorkflowTrace_ActivityColor": "(多)活动文字颜色", "Button_Remove": "删除", "Button_Cancel": "取消", "Description": "描述", "Msg_SaveSuccess": "保存成功", "Msg_SaveFailed": "保存失败", "WorkflowVersion": "版本号", "PortalPageManage_Design": "设计", "Button_Heigth": "等高度", "Button_Width": "等宽度", "Button_Size": "等大小", "Button_Vertical": "竖排等距", "Button_Horizontal": "横排等距" };
//流程名称
var ClauseName = "测试测试";

var workflow;
var svg;
var body;
var layout;
var wp;
var workflowMode;
var thumbnail_container;
var thumbnail_workspace;
//IE8和IE9不支持console
var console = window.console || { log: function (t) { } };

var ActivityDockCalculaterWorker;
$(function () {
    //加载脚本
    var WorkflowScripts = [
       //流程图
       //    "Workflow.js",
       //    //活动
       //    "Activity.js",
       //    //线条
       //    "Line.js",
       //    //拖拽
       //    "ActivityDrag.js",
       //    //活动模板
       //    "ActivityModel.js",
       ////活动格式
       //"ActivityStyle.js",
       ////杂项
       //"misc.js"
    ]

    //脚本加载完成后事件
    var loadFinished = function () {
        //console.dir(WorkflowMode);
        //编辑模式
        workflowMode = 1;
        if (workflowMode == WorkflowMode.Designer) {
            //初始化流程操作按钮
            $("#ToolBar").AspLinkToolBar({
                items: [
                    { id: "btnSave", text: "保存", click: function (item) { WorkflowDocument.SaveWorkflow(); }, icon: "save" },
                    { id: "btnSave", text: "校验", click: function (item) { WorkflowDocument.FullValidateWorkflow(); }, icon: "Validate" },
                    { id: "btnSave", text: "发布", click: function (item) { WorkflowDocument.PublishWorkflow(); }, icon: "Publish" },
                    //{ id: "btnImport", text: "导入", click: function (item) { WorkflowDocument.ImportWorkflow(); }, icon: "table" },
                    //{ id: "btnExport", text: "导出", click: function (item) { WorkflowDocument.ExportWorkflow(); }, icon: "table" },
                    { id: "btnSaveAsImage", text: "存为图片", click: function (item) { WorkflowDocument.SaveAsImage(); }, icon: "fa fa-picture-o" },
                    //{ line: true },
                    { id: "btnHeight", text: "等高度", icon: "SameHeight", click: function (item) { workflow.setSameStyle(WorkflowSettings.SameStyle.Height); } },
                    { id: "btnWidth", text: "等宽度", icon: "SameWidth", click: function (item) { workflow.setSameStyle(WorkflowSettings.SameStyle.Width); } },
                    { id: "btnSize", text: "等大小", icon: "SameSize", click: function (item) { workflow.setSameStyle(WorkflowSettings.SameStyle.Size); } },
                    { id: "btnVertical", text: "竖排等距", icon: "VEqual", click: function (item) { workflow.setSameStyle(WorkflowSettings.SameStyle.VerticalDistance); } },
                    { id: "btnHorizontal", text: "横排等距", icon: "HEqual", click: function (item) { workflow.setSameStyle(WorkflowSettings.SameStyle.HorizontalDistance); } },
                    { id: "btnUndo", text: "撤销", icon: "Undo", click: function (item) { TraceManager.Undo(); } },
                    { id: "btnRedo", text: "重做", icon: "Redo", click: function (item) { TraceManager.Redo(); } }
                ]
            });

            //提示文字
            $("[toolbarid=btnUndo]").css("overflow", "visible").attr("title", "撤销(Ctrl+Z)")
            $("[toolbarid=btnRedo]").css("overflow", "visible").attr("title", "重做(Ctrl+Y)")

            //显示痕迹
            $("[toolbarid=btnUndo]").append("<ul id='ulPrevTraces'></ul>");
            $("[toolbarid=btnRedo]").append("<ul id='ulNextTraces'></ul>");
        }

        body = $("body:first");
        //流程模板对象
        workflow = new Workflow("div.workspace");
        ////线条画布对象
        //svg = $("svg:first");
        //如果支持SVG
        //ERROR:For Debug
        if (document.implementation.hasFeature("org.w3c.svg", "1.0")) {
            //使用Svg
            workflow.UtilizeSvg = true;
            svg = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
                .addClass("workspace_svg")
                .attr("version", "1.1");
            svg.css("width", "100%").css("height", "100%");
        }
        else {
            //不使用Svg
            workflow.UtilizeSvg = false;
            //使用DIV画线
            svg = $("<div></div>").addClass("workspace_svg");
        }
        $(workflow.workspace).children(":first").before(svg);

        if (workflowMode == WorkflowMode.Designer || workflowMode == WorkflowMode.ViewWithProperty) {

            layout = $("#divDesigner").ligerLayout({ isRightCollapse: true, rightWidth: 380 });
            wp = new WorkflowProperty(layout, WorkflowDocument);
        }
        //活动模板初始化
        ActivityModelInit();

        //宽和高
        $(workflow.workspace).width(WorkflowSettings.MinInnerWidth);
        $(workflow.workspace).height(WorkflowSettings.MinInnerHeight);

        //在流程图中添加点击时自动生成活动和线条的箭头
        if ($(workflow.workspace).find("." + WorkflowStyleClassName.WorkflowAotuArrow).length == 0) {
            var arrow = $("<div class='" + WorkflowStyleClassName.WorkflowAotuArrow + "'></div>");
            arrow.clone().addClass(WorkflowStyleClassName.WorkflowAotuArrowLeft).appendTo(workflow.workspace);
            arrow.clone().addClass(WorkflowStyleClassName.WorkflowAotuArrowUp).appendTo(workflow.workspace);
            arrow.clone().addClass(WorkflowStyleClassName.WorkflowAotuArrowRight).appendTo(workflow.workspace);
            arrow.clone().addClass(WorkflowStyleClassName.WorkflowAotuArrowDown).appendTo(workflow.workspace);
        }

        //在流程图中添加活动移动时对齐的线
        if ($(workflow.workspace).find("." + WorkflowStyleClassName.ActivityDockLine).length == 0) {
            //<div class="dock_line dock_line_horizontal dock_line_top"></div>
            var dockLine = $("<div class='" + WorkflowStyleClassName.ActivityDockLine + "' ></div>");
            var dockLine_horizontal = dockLine.clone().addClass(WorkflowStyleClassName.ActivityDockLineHorizontal);
            dockLine_horizontal.clone().addClass(WorkflowStyleClassName.ActivityDockLineTop).appendTo(workflow.workspace);
            dockLine_horizontal.clone().addClass(WorkflowStyleClassName.ActivityDockLineMiddle).appendTo(workflow.workspace);
            dockLine_horizontal.clone().addClass(WorkflowStyleClassName.ActivityDockLineBottom).appendTo(workflow.workspace);

            var dockLine_vertical = dockLine.clone().addClass(WorkflowStyleClassName.ActivityDockLineVertical);
            dockLine_vertical.clone().addClass(WorkflowStyleClassName.ActivityDockLineOffsetLeft).appendTo(workflow.workspace);
            dockLine_vertical.clone().addClass(WorkflowStyleClassName.ActivityDockLineCenter).appendTo(workflow.workspace);
            dockLine_vertical.clone().addClass(WorkflowStyleClassName.ActivityDockLineRight).appendTo(workflow.workspace);
        }


        //喧嚷流程图:需要指定WorkflowCode参数
        if (typeof (WorkflowTemplate) != "undefined" && WorkflowTemplate) {
            WorkflowDocument.LoadWorkflow(WorkflowTemplate, true);
        }
        else if ($.fn.getUrlParam("WorkflowCode")) {
            WorkflowDocument.InitWorkflow(decodeURI($.fn.getUrlParam("WorkflowCode")));
        }

        if (workflowMode == WorkflowMode.Designer || workflowMode == WorkflowMode.ViewWithProperty) {
            //显示流程标题
            WorkflowDocument.DisplayWorkflowFullName();
        }

        var outerContainerSize = {
            width: $(workflow.outerContainer).css("width"),
            height: $(workflow.outerContainer).css("height")
        }
       
        //开发人员预留接口,在流程加载完成后执行
        if (typeof (LoadWorflowFinished) == "function") {
            LoadWorflowFinished();
        }

        if (workflowMode == WorkflowMode.Designer) {
            thumbnail_container = $(".div-thumbnail");
        }
        var _MonitorWorkflowSize = function () {

            //活动拖动\调整大小时不处理
            if (!ActivityDragStack.IsDragging && !ActivityResizeStack.Resizing
                && (!WorkflowEventStack.CurrentMultiAction || WorkflowEventStack.CurrentMultiAction == WorkflowMultiActionType.None)
                && $(workflow.workspace).is(":visible")) {
                if (outerContainerSize.width != $(workflow.outerContainer).css("width") || outerContainerSize.height != $(workflow.outerContainer).css("height")) {
                    outerContainerSize.width = $(workflow.outerContainer).css("width");
                    outerContainerSize.height = $(workflow.outerContainer).css("height");
                    workflow.autoFit();
                    //更新缩略图
                    if (typeof (TraceManager) != "undefined" && TraceManager.UpdateThumbnail)
                        TraceManager.UpdateThumbnail();
                }
            }
            setTimeout(_MonitorWorkflowSize, 200);
        }

        //监控流程设计区域大小变化
        setTimeout(_MonitorWorkflowSize, 200);
    }
    var scriptIndex = 0;
    var loadJs = function () {
        if (scriptIndex < WorkflowScripts.length)
            $.ajax({
                url: "../../WFRes/_Scripts/designer/" + WorkflowScripts[scriptIndex],
                cache: true,
                dataType: "script",
                success: function (a, b, c) {
                    scriptIndex++;
                    loadJs();
                },
                error: function (a, b, c) {
                }
                //success: loadJs
            });
        else
            $(function () {
                //获取本地化字符串               
                var _WorkflowDesigner_params = "Activity_SaveSuccess,Activity_SaveFailed,ActivityEvent_Set,ContextMenu_Attribute,ContextMenu_SetTemplate,"
                + "DataItem_ChooseDataItem,DataItem_Confirm,Formula_FunctionName,Formula_NoClosed,Formula_TestFailed,"
                + "FormulaEditable_EditFormul,Package_Failed,Package_Mssg,Porperty_LeftKey,Porperty_Activity,Porperty_WokflowTempalte,"
                + "Porperty_Line,Porperty_Attribute,Porperty_More,Poeperty_One,Workflow_StratNode,Workflow_EndNode,Workflow_Estimate,"
                + "WorkflowDocument_Internal,WorkflowDocument_WorkflowName,WorkflowDocument_ActivityCode,WorkflowDocument_TestSuccessful,"
                + "WorkflowDocument_TestFailed,WorkflowDocument_ConfirmRelease,WorkflowDocument_FailedRelease,WorkflowDocument_Playback,Button_SaveImage,"
                + "WorkflowDocument_FormartValid,WorkflowDocument_Specification,WorkflowDocument_ImportSuccessful,WorkflowDocument_ImportFailed,"
                + "WorkflowDocument_FileFormart,WorkflowDocument_Mssg,WorkflowDocument_ExportSuccessful,WorkflowDocument_ExportFailed,"
                + "WorkflowDocument_ViewPicture,WorkflowDocument_RefreshedSuccessful,WorkflowDocument_Empty,WorkflowTrace_AddActivity,"
                + "WorkflowTrace_AddLine,WorkflowTrace_ChangeText,WorkflowTrace_ChangeTextSize,WorkflowTrace_ChangeTextColor,"
                + "WorkflowTrace_ChangeLineText,WorkflowTrace_ChangeLineTextSize,WorkflowTrace_ChangeLineTextColor,WorkflowTrace_AdjustLine,"
                + "WorkflowTrace_RemoveActivity,WorkflowTrace_RemoveLine,WorkflowTrace_ChangeActivitySize,WorkflowTrace_MoveActivity,"
                + "WorkflowTrace_MoveActivityMulti,WorkflowTrace_ActivitySize,WorkflowTrace_ActivityColor,Button_Add,Button_Remove,Button_Cancel,"
                + "Description,Msg_SaveSuccess,Msg_SaveFailed,WorkflowVersion,PortalPageManage_Design,Button_Heigth,Button_Width,"
                + "Button_Size,Button_Vertical,Button_Horizontal";
                //var url = _PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx";
                //$.get(url, { "Code": _WorkflowDesigner_params }, function (data) {
                //    if (data.IsSuccess) {
                //        _WorkflowDesigner_GlobalString = data.TextObj;
                //        loadFinished();
                //    }
                //}, "json");
                loadFinished();
            });
    }
    loadJs();
});

var outerContainerSize = {

}