// <reference path="Activity.js" />
// <reference path="ActivityDrag.js" />
// <reference path="ActivityDock.js" />
// <reference path="ActivityModel.js" />
// <reference path="Line.js" />
// <reference path="misc.js" />
// <reference path="Workflow.js" />
// <reference path="EditTrace.js" />
/// <reference path="WorkflowTrace.js" />

//var _ContextMenu_GlobalString = {
//    "ContextMenu_Attribute": "属性",
//    "ContextMenu_SetTemplate": "设为模板",
//    "Button_Remove": "删除",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "ContextMenu_Attribute,ContextMenu_SetTemplate,Button_Remove" }, function (data) {
//    if (data.IsSuccess) {
//        _ContextMenu_GlobalString = data.TextObj;
//    }
//}, "json");

//右侧菜单设置
ContextMenuSettings = {
    //菜单事件命名空间
    EventNameSpace: ".ContextMenu"
}

//右侧菜单堆栈
ContextMenuStack = {
    Target: undefined,
    TargetType: WorkflowElementType.Unspecified,
    ContenxtMenu: undefined,
    ContenxtMenuItem_Edit: undefined,
    ContenxtMenuItem_Delete: undefined
}

//显示右侧菜单
/*
        e   : 事件
    _Target : 目标
*/
ShowContextMenu = function (e, _Target) {
    //上下文菜单对应的目标
    ContextMenuStack.Target = _Target;

    switch (_Target.WorkflowElementType) {
        case WorkflowElementType.Activity:
            break;
        case WorkflowElementType.Line:
            break;
        case WorkflowElementType.Workflow:
            break;
        default:
            return;
    }

    //菜单
    if (!ContextMenuStack.ContenxtMenu) {
        ContextMenuStack.ContenxtMenu = $("<ul class='context-menu-list context-menu-root'></ul>");

        //编辑
        ContextMenuStack.ContenxtMenuItem_Edit = $("<li class='context-menu-item icon icon-edit'><span>" + _WorkflowDesigner_GlobalString.ContextMenu_Attribute + "</span></li>").appendTo(ContextMenuStack.ContenxtMenu);
        ContextMenuStack.ContenxtMenuItem_Edit.bind("click" + ContextMenuSettings.EventNameSpace, function () {
            wp.DisplayProperties(ContextMenuStack.Target, true);
        });

        //设为模板
        ContextMenuStack.ContenxtMenuItem_SaveAs = $("<li class='context-menu-item icon icon-edit'><span>" + _WorkflowDesigner_GlobalString.ContextMenu_SetTemplate + "</span></li>").appendTo(ContextMenuStack.ContenxtMenu);
        ContextMenuStack.ContenxtMenuItem_SaveAs.bind("click" + ContextMenuSettings.EventNameSpace, function () {
            if (ContextMenuStack.Target && ContextMenuStack.Target.savePropertyAsModel)
                ContextMenuStack.Target.savePropertyAsModel();
        });

        //删除
        ContextMenuStack.ContenxtMenuItem_Delete = $("<li class='context-menu-item icon icon-delete'><span>" + _WorkflowDesigner_GlobalString.Button_Remove + "</span></li>").appendTo(ContextMenuStack.ContenxtMenu);
        ContextMenuStack.ContenxtMenuItem_Delete.bind("click" + ContextMenuSettings.EventNameSpace, function () {
            if (ContextMenuStack.Target) {
                if (ContextMenuStack.Target.WorkflowElementType == WorkflowElementType.Activity) {
                    workflow.removeActivity(ContextMenuStack.Target.ID);
                }
                else if (ContextMenuStack.Target.WorkflowElementType == WorkflowElementType.Line) {
                    TraceManager.AddTrace(TraceManager.TraceType.Line.Remove, ContextMenuStack.Target);
                    workflow.removeLine(ContextMenuStack.Target.ID);
                }
            }
        });

        ContextMenuStack.ContenxtMenu.appendTo(workflow.workspace);

        //点击隐藏菜单
        $(document).bind("click" + ContextMenuSettings.EventNameSpace, function () {
            ContextMenuStack.ContenxtMenu.hide();
        });
    }

    //活动、线条显示删除菜单
    if ((_Target.WorkflowElementType == WorkflowElementType.Activity && ContextMenuStack.Target.ToolTipText != "Start"
            && ContextMenuStack.Target.ToolTipText != "End") || _Target.WorkflowElementType == WorkflowElementType.Line) {
        ContextMenuStack.ContenxtMenuItem_Delete.show();
    }
    else ContextMenuStack.ContenxtMenuItem_Delete.hide();

    //设为模板
    if (_Target.WorkflowElementType == WorkflowElementType.Activity)
        ContextMenuStack.ContenxtMenuItem_SaveAs.show();
    else ContextMenuStack.ContenxtMenuItem_SaveAs.hide();

    ContextMenuStack.ContenxtMenu.css("left", e.pageX - $(svg)._offset().left)
        .css("top", e.pageY - $(svg)._offset().top)
        .show();
}