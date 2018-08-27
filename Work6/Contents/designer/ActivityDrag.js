/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//调整大小堆栈
ActivityResizeStack = {
    Resizing: false,
    //当前调整的Activity
    CurrentActivity: undefined,
    //当前调整大小的控制点
    CurrentResizer: undefined,
    //调整的方向
    Direction: undefined,
    StartPoint: {
        x: 0,
        y: 0
    },
    PrePoint: {
        x: 0,
        y: 0
    },

    WorkspaceMinRight: 0,
    WorkspaceMinBottom: 0,

    WorkflowCurrentRight: 0,
    WorkflowCurrentBottom: 0,

    //源状态
    SourceStates: undefined
}

//拖拽设置
ActivityDragSettings = {
    //.拖动事件的命名空间
    EventNameSpace: ".ActivityDraggable",
    //停靠尺寸
    DockSize: 10
}

//拖拽堆栈
ActivityDragStack = {
    //拖动停靠计算线程
    ActivityDockCalculaterWorker: undefined,

    //是否在拖拽状态
    IsDragging: false,
    //拖拽中的活动集合
    DraggingActivities: undefined,
    //活动的拖拽HTML副本集合
    DraggingProxy: undefined,
    //拖拽开始时鼠标的位置（相对于流程图原点）
    DragStartPoint: {
        x: 0, y: 0
    },

    //上次计算时鼠标的位置（相对于流程图原点）
    PreDragPoint: {
        x: 0, y: 0
    },

    CreateDragProxy: function (_activity) {
        ActivityDragStack.DraggingActivities.push(_activity);
        ActivityDragStack.DraggingProxy.push($(_activity.htmlObject).clone()
            .removeClass(ActivityStyleClassName.ActivitySelectedFirst)
            .removeClass(ActivityStyleClassName.ActivitySelected)
            .addClass(ActivityStyleClassName.ActivityDragProxy)
            .hide()
            .appendTo($(_activity.htmlObject).parent()));

        ActivityDragStack.DraggingProxy[ActivityDragStack.DraggingProxy.length - 1].left = _activity.left;
        ActivityDragStack.DraggingProxy[ActivityDragStack.DraggingProxy.length - 1].top = _activity.top;
    }
}