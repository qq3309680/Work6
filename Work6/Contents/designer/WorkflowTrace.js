/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//var _WorkflowTrace_GlobalString = {
//    "WorkflowTrace_AddActivity": "添加活动",
//    "WorkflowTrace_AddLine": "添加线条",
//    "WorkflowTrace_ChangeText": "修改活动文字",
//    "WorkflowTrace_ChangeTextSize": "修改活动文字大小",
//    "WorkflowTrace_ChangeTextColor": "修改活动文字颜色",
//    "WorkflowTrace_ChangeLineText": "修改线条文字",
//    "WorkflowTrace_ChangeLineTextSize": "修改线条文字大小",
//    "WorkflowTrace_ChangeLineTextColor": "修改线条文字颜色",
//    "WorkflowTrace_AdjustLine": "线条调整",
//    "WorkflowTrace_RemoveActivity": "活动删除",
//    "WorkflowTrace_RemoveLine": "线条删除",
//    "WorkflowTrace_ChangeActivitySize": "活动调整大小",
//    "WorkflowTrace_MoveActivity": "活动移动",
//    "Button_Heigth": "等高度",
//    "Button_Width": "等宽度",
//    "Button_Size": "等大小",
//    "Button_Vertical": "竖排等距",
//    "Button_Horizontal": "横排等距",
//    "WorkflowTrace_MoveActivityMulti": "(多)活动移动",
//    "WorkflowTrace_ActivitySize": "(多)活动文字大小",
//    "WorkflowTrace_ActivityColor": "(多)活动文字颜色",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "WorkflowTrace_AddActivity,WorkflowTrace_AddLine,WorkflowTrace_ChangeText,WorkflowTrace_ChangeTextSize,WorkflowTrace_ChangeTextColor,WorkflowTrace_ChangeLineText,WorkflowTrace_ChangeLineTextSize,WorkflowTrace_ChangeLineTextColor,WorkflowTrace_AdjustLine,WorkflowTrace_RemoveActivity,WorkflowTrace_RemoveLine,WorkflowTrace_ChangeActivitySize,WorkflowTrace_MoveActivity,Button_Heigth,Button_Width,Button_Vertical,Button_Horizontal,WorkflowTrace_MoveActivityMulti,WorkflowTrace_ActivitySize,WorkflowTrace_ActivityColor" }, function (data) {
//    if (data.IsSuccess) {
//        _WorkflowTrace_GlobalString = data.TextObj;
//    }
//}, "json");


var TraceManager = {
    //痕迹类型
    TraceType: {
        //添加活动
        Activity: {
            Add: 1,
            Remove: 2,
            TextChange: 3,
            TextSizeChange: 4,
            TextColorChange: 5,
            Move: 6,
            Resize: 7
        },
        Line: {
            Add: 10,
            Remove: 11,
            TextChange: 12,
            TextSizeChange: 13,
            TextColorChange: 14,
            PointChange: 15
        },
        Multi: {
            ActivitiesMove: 20,
            SameHeight: 22,
            SameWidth: 23,
            SameSize: 24,
            //竖排等间距
            VerticalDistance: 25,
            //横排等间距
            HorizontalDistance: 26,
            //多活动文字大小改变
            ActivitiesTextSizeChange: 27,
            //多活动文字颜色改变
            ActivitiesTextColorChange: 28,
        }
    },
    //原子痕迹
    //_Source: 记录_Target原来的状态,可选
    AtomicTrace: function (_TraceType, _Target, _Source) {
        switch (_TraceType) {
            case TraceManager.TraceType.Activity.Add:
                {
                    this.Activity = _Target;
                    this.Html = $(_Target.htmlObject).clone();
                    this.Redo = function () {
                        var _ID = this.Activity.ID;
                        if ($(workflow.activities).filter(function () { return this.ID == _ID; }).length == 0) {
                            this.Activity.htmlObject = this.Html.clone()[0];
                            $(this.Activity.htmlObject).appendTo(workflow.workspace);
                            workflow.activities.push(this.Activity);

                            $(this.Activity.htmlObject).data(ActivitySettings.ActivityDataProperty, this.Activity);
                            this.Activity.savePosition(true);
                        }
                    }
                    this.Undo = function () {
                        if (this.Activity.isSelected) {
                            this.Activity.Unselect();
                        }
                        var _ID = this.Activity.ID;
                        var _index = 0;
                        $(workflow.activities).each(function (i) {
                            if (this.ID == _ID) {
                                $(this.htmlObject).remove();
                                _index = i;
                            }
                        });
                        workflow.activities.splice(_index, 1);
                    }
                }
                break;
            case TraceManager.TraceType.Activity.Remove:
                //活动移除/所有线条移除
                {
                    this.Activity = _Target;
                    this.Html = $(_Target.htmlObject).clone();
                    this.Redo = function () {
                        var _ID = this.Activity.ID;
                        var _index = 0;
                        if (this.Activity.isSelected) {
                            this.Activity.Unselect();
                        }
                        $(workflow.activities).each(function (i) {
                            if (this.ID == _ID) {
                                $(this.htmlObject).remove();
                                _index = i;
                            }
                        });
                        workflow.activities.splice(_index, 1);
                    }
                    this.Undo = function () {
                        var _ID = this.Activity.ID;
                        if ($(workflow.activities).filter(function () { return this.ID == _ID; }).length == 0) {
                            this.Activity.htmlObject = this.Html.clone()[0];
                            $(this.Activity.htmlObject).appendTo(workflow.workspace);
                            workflow.activities.push(this.Activity);

                            $(this.Activity.htmlObject).data(ActivitySettings.ActivityDataProperty, this.Activity);
                            this.Activity.savePosition(true);
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Activity.TextChange:
                {
                    this.Activity = _Target;
                    this.SourceDisplayName = _Source || "";
                    this.TargetDisplayName = _Target.DisplayName || "";
                    this.Redo = function () {
                        this.Activity.DisplayName = this.TargetDisplayName;
                        if (this.Activity.SetText) {
                            this.Activity.SetText();
                        }
                    }
                    this.Undo = function () {
                        this.Activity.DisplayName = this.SourceDisplayName;
                        if (this.Activity.SetText) {
                            this.Activity.SetText();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Activity.TextSizeChange:
                {
                    this.Activity = _Target;
                    this.SourceSize = _Source;
                    this.TargetSize = _Target.FontSize;
                    this.Redo = function () {
                        this.Activity.FontSize = this.TargetSize;
                        if (this.Activity.SetFontSize) {
                            this.Activity.SetFontSize();
                        }
                    }
                    this.Undo = function () {
                        this.Activity.FontSize = this.SourceSize;
                        if (this.Activity.SetFontSize) {
                            this.Activity.SetFontSize();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Activity.TextColorChange:
                {
                    this.Activity = _Target;
                    this.SourceColor = _Source || "";
                    this.TargetColor = _Target.FontColor || "";
                    this.Redo = function () {
                        this.Activity.FontColor = this.TargetColor;
                        if (this.Activity.SetFontColor) {
                            this.Activity.SetFontColor();
                        }
                    }
                    this.Undo = function () {
                        this.Activity.FontColor = this.SourceColor;
                        if (this.Activity.SetFontColor) {
                            this.Activity.SetFontColor();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Activity.Move:
                {
                    this.Activity = _Target;
                    this.SourceState = _Source;
                    this.TargetState = TraceManager.GetWorkflowElementProperties(_Target);
                    this.Redo = function () {
                        $(this.Activity.htmlObject)
                            .outerWidth(this.TargetState.width)
                            .outerHeight(this.TargetState.height)
                            .css("left", this.TargetState.left)
                            .css("top", this.TargetState.top);
                        this.Activity.savePosition(true);
                    }
                    this.Undo = function () {
                        $(this.Activity.htmlObject)
                            .outerWidth(this.SourceState.width)
                            .outerHeight(this.SourceState.height)
                            .css("left", this.SourceState.left)
                            .css("top", this.SourceState.top);
                        this.Activity.savePosition(true);
                    }
                }
                break;
            case TraceManager.TraceType.Activity.Resize:
                break;
            case TraceManager.TraceType.Line.Add:
                {
                    this.Line = _Target;
                    this.Redo = function () {
                        var _ID = this.Line.ID;
                        if ($(workflow.lines).filter(function () { return this.ID == _ID; }).length == 0) {
                            workflow.lines.push(this.Line);
                            if (this.Line.Path) {
                                $(this.Line.Path).appendTo(svg);
                            }
                            if (this.Line.Arrow) {
                                $(this.Line.Arrow).appendTo(svg);
                            }
                            if (this.Line.Label) {
                                $(this.Line.Label).appendTo(workflow.workspace);
                            }
                            this.Line.draw();
                        }
                    }
                    this.Undo = function () {
                        this.Line.Unselect();
                        var index = $.inArray(this.Line, workflow.lines);
                        if (index > -1) {
                            $(workflow.lines[index].Path).remove();
                            $(workflow.lines[index].Arrow).remove();
                            $(workflow.lines[index].Label).remove();
                            workflow.lines.splice(index, 1);
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Line.Remove:
                {
                    this.Line = _Target;
                    if (_Source) {
                        this.SourceState = _Source;
                    }
                    else {
                        this.SourceState = TraceManager.GetWorkflowElementProperties(_Target);
                    }
                    this.Redo = function () {
                        this.Line.Unselect();
                        var index = $.inArray(this.Line, workflow.lines);
                        if (index > -1) {
                            $(workflow.lines[index].Path).remove();
                            $(workflow.lines[index].Arrow).remove();
                            $(workflow.lines[index].Label).remove();
                            workflow.lines.splice(index, 1);
                        }
                    }
                    this.Undo = function () {
                        var _ID = this.Line.ID;
                        var _StartActivityID = this.SourceState.startActivityID;
                        var _EndActivityID = this.SourceState.endActivityID;
                        this.Line.startActivity = $(workflow.activities).filter(function () { return this.ID == _StartActivityID; })[0];
                        this.Line.endActivity = $(workflow.activities).filter(function () { return this.ID == _EndActivityID; })[0];
                        //起止活动都存在
                        if (this.Line.startActivity && this.Line.endActivity) {
                            this.Line.startDirection = this.SourceState.startDirection;
                            this.Line.endDirection = this.SourceState.endDirection;
                            this.Line.Points = TraceManager.CopyLinePoints(this.SourceState.Points);
                            this.Line.endPoint = this.Line.Points[this.Line.Points.length - 1];

                            this.Line.TextX = this.SourceState.TextX;
                            this.Line.TextY = this.SourceState.TextY;
                            this.Line.FixedPoint = this.SourceState.FixedPoint;

                            workflow.lines.push(this.Line);
                            if (this.Line.Path) {
                                $(this.Line.Path).appendTo(svg);
                            }
                            if (this.Line.Arrow) {
                                $(this.Line.Arrow).appendTo(svg);
                            }
                            if (this.Line.Label) {
                                $(this.Line.Label).appendTo(workflow.workspace);
                            }
                            this.Line.draw();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Line.TextChange:
                {
                    this.Line = _Target;
                    this.SourceDisplayName = _Source || "";
                    this.TargetDisplayName = _Target.DisplayName || "";
                    this.Redo = function () {
                        this.Line.DisplayName = this.TargetDisplayName;
                        if (this.Line.SetText) {
                            this.Line.SetText();
                        }
                    }
                    this.Undo = function () {
                        this.Line.DisplayName = this.SourceDisplayName;
                        if (this.Line.SetText) {
                            this.Line.SetText();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Line.TextSizeChange:
                {
                    this.Line = _Target;
                    this.SourceSize = _Source;
                    this.TargetSize = _Target.FontSize;
                    this.Redo = function () {
                        this.Line.FontSize = this.TargetSize;
                        if (this.Line.SetFontSize) {
                            this.Line.SetFontSize();
                        }
                    }
                    this.Undo = function () {
                        this.Line.FontSize = this.SourceSize;
                        if (this.Line.SetFontSize) {
                            this.Line.SetFontSize();
                        }
                    }
                }
                break;
            case TraceManager.TraceType.Line.TextColorChange:
                {
                    this.Line = _Target;
                    this.SourceColor = _Source || "";
                    this.TargetColor = _Target.FontColor || "";
                    this.Redo = function () {
                        this.Line.FontColor = this.TargetColor;
                        if (this.Line.SetFontColor) {
                            this.Line.SetFontColor();
                        }
                    }
                    this.Undo = function () {
                        this.Line.FontColor = this.SourceColor;
                        if (this.Line.SetFontColor) {
                            this.Line.SetFontColor();
                        }
                    }
                }
                break;
                //点改变
            case TraceManager.TraceType.Line.PointChange:
                {
                    this.Line = _Target;
                    this.SourceState = _Source;
                    this.TargetState = TraceManager.GetWorkflowElementProperties(this.Line);
                    this.TargetState.startActivityID = this.Line.startActivity.ID;
                    this.TargetState.endActivityID = this.Line.endActivity.ID;
                    this.Redo = function () {
                        this.Line.Unselect();
                        var _ID = this.Line.ID;
                        var _StartActivityID = this.TargetState.startActivityID;
                        var _EndActivityID = this.TargetState.endActivityID;
                        this.Line.startActivity = $(workflow.activities).filter(function () { return this.ID == _StartActivityID; })[0];
                        this.Line.endActivity = $(workflow.activities).filter(function () { return this.ID == _EndActivityID; })[0];
                        //起止活动都存在
                        if (this.Line.startActivity && this.Line.endActivity) {
                            this.Line.startDirection = this.TargetState.startDirection;
                            this.Line.endDirection = this.TargetState.endDirection;
                            this.Line.Points = TraceManager.CopyLinePoints(this.TargetState.Points);
                            this.Line.endPoint = this.Line.Points[this.Line.Points.length - 1];
                            this.Line.TextX = this.TargetState.TextX;
                            this.Line.TextY = this.TargetState.TextY;
                            this.Line.FixedPoint = this.TargetState.FixedPoint;
                            this.Line.draw();
                        }
                    }
                    this.Undo = function () {
                        this.Line.Unselect();
                        var _ID = this.Line.ID;
                        var _StartActivityID = this.SourceState.startActivityID;
                        var _EndActivityID = this.SourceState.endActivityID;
                        this.Line.startActivity = $(workflow.activities).filter(function () { return this.ID == _StartActivityID; })[0];
                        this.Line.endActivity = $(workflow.activities).filter(function () { return this.ID == _EndActivityID; })[0];
                        //起止活动都存在
                        if (this.Line.startActivity && this.Line.endActivity) {
                            this.Line.startDirection = this.SourceState.startDirection;
                            this.Line.endDirection = this.SourceState.endDirection;
                            this.Line.Points = this.SourceState.Points.slice();
                            this.Line.TextX = this.SourceState.TextX;
                            this.Line.TextY = this.SourceState.TextY;
                            this.Line.FixedPoint = this.SourceState.FixedPoint;
                            this.Line.endPoint = this.Line.Points[this.Line.Points.length - 1];
                            this.Line.draw();
                        }
                    }
                }
                break;
        }
    },

    //痕迹中只记录HTML相关属性,不记录活动\线条\流程的功能属性
    //每一条痕迹可能包含多个原子操作
    //_ActionType:
    //_Target   :目标对象
    //_Source: 记录_Target原来的状态,可选
    Trace: function (_TraceType, _Target, _Source) {
        switch (_TraceType) {
            //原子痕迹
            //活动
            case TraceManager.TraceType.Activity.Add:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_AddActivity;
                }
            case TraceManager.TraceType.Line.Add:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_AddLine;
                }
            case TraceManager.TraceType.Activity.TextChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeText;
                }
            case TraceManager.TraceType.Activity.TextSizeChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeTextSize;
                }
            case TraceManager.TraceType.Activity.TextColorChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeTextColor;
                }
                //线条
            case TraceManager.TraceType.Line.TextChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeLineText;
                }
            case TraceManager.TraceType.Line.TextSizeChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeLineTextSize;
                }
            case TraceManager.TraceType.Line.TextColorChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeLineTextColor;
                }
                {
                    this.AtomicTrace = new TraceManager.AtomicTrace(_TraceType, _Target, _Source);
                    this.Redo = function () {
                        this.AtomicTrace.Redo();
                    }
                    this.Undo = function () {
                        this.AtomicTrace.Undo();
                    };
                }
                break;
            case TraceManager.TraceType.Line.PointChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_AdjustLine;
                    this.Line = _Target;
                    this.AtomicTrace = new TraceManager.AtomicTrace(_TraceType, _Target, _Source);
                    this.Redo = function () {
                        this.AtomicTrace.Redo();

                        TraceManager.RedrawLineCrossPoints([this.Line]);
                    };
                    this.Undo = function () {
                        this.AtomicTrace.Undo();

                        TraceManager.RedrawLineCrossPoints([this.Line]);
                    };
                }
                break;
            case TraceManager.TraceType.Activity.Remove:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_RemoveActivity;

                    this.Activity = _Target;
                    var _ActivityID = this.Activity.ID;
                    this.RelateLines = $(workflow.lines).filter(function () { return this.startActivity.ID == _ActivityID || this.endActivity.ID == _ActivityID; });
                    this.AtomicTraces = [];
                    this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Activity.Remove, this.Activity, TraceManager.GetWorkflowElementProperties(this.Activity)));
                    for (var i = 0; i < this.RelateLines.length; i++) {
                        this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Line.Remove, this.RelateLines[i], TraceManager.GetWorkflowElementProperties(this.RelateLines[i])));
                    }

                    this.Redo = function () {
                        var _RelateLines = this.RelateLines;
                        $(this.AtomicTraces).each(function () {
                            this.Redo();
                        });

                        //移除与线的交点
                        $(this.RelateLines).each(function () {
                            var _ID = this.ID;
                            $(workflow.lines).each(function () {
                                if (this.ID != _ID) {
                                    this.removeCrossPointToLine(_ID);
                                }
                            });
                        });
                        //重绘线
                        $(workflow.lines).each(function () {
                            if (this.needRedraw)
                                this.draw(true);
                        });
                    }
                    this.Undo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Undo();
                        });

                        //重计算交点
                        TraceManager.RedrawLineCrossPoints(this.RelateLines);
                    }
                }
                break;
            case TraceManager.TraceType.Line.Remove:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_RemoveLine;
                    this.Line = _Target;
                    this.AtomicTrace = new TraceManager.AtomicTrace(_TraceType, _Target, _Source);
                    this.Redo = function () {
                        this.AtomicTrace.Redo();
                        var _ID = this.Line.ID;
                        // 重绘与线条有交点的线条
                        $(workflow.lines).each(function () {
                            if (this.ID != _ID) {
                                this.removeCrossPointToLine(_ID);
                                if (this.needRedraw)
                                    this.draw(true);
                            }
                        });
                    };
                    this.Undo = function () {
                        this.AtomicTrace.Undo();

                        TraceManager.RedrawLineCrossPoints([this.Line]);
                    };
                }
                break;
            case TraceManager.TraceType.Activity.Resize:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ChangeActivitySize;
                }
            case TraceManager.TraceType.Activity.Move:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_MoveActivity;
                }
            case TraceManager.TraceType.Multi.SameHeight:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.Button_Heigth;
                }
            case TraceManager.TraceType.Multi.SameWidth:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.Button_Width;
                }
            case TraceManager.TraceType.Multi.SameSize:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.Button_Size;
                }
            case TraceManager.TraceType.Multi.VerticalDistance:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.Button_Vertical;
                }
            case TraceManager.TraceType.Multi.HorizontalDistance:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.Button_Horizontal;
                }
            case TraceManager.TraceType.Multi.ActivitiesMove:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_MoveActivityMulti;

                    this.SourceStates = _Source;

                    var TargetAndStates = TraceManager.GetMultiObjAndStates(_Target);
                    this.Targets = TargetAndStates.Objects;
                    this.TargetStates = TargetAndStates.States;

                    this.AtomicTraces = [];
                    for (var i = 0; i < this.Targets.length; i++) {
                        if (this.Targets[i].WorkflowElementType == WorkflowElementType.Activity) {
                            this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Activity.Move, this.Targets[i], this.SourceStates[i]));
                        }
                        else if (this.Targets[i].WorkflowElementType == WorkflowElementType.Line) {
                            this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Line.PointChange, this.Targets[i], this.SourceStates[i]));
                        }
                    }
                    this.Redo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Redo();
                        });

                        TraceManager.RedrawLineCrossPoints($(this.Targets).filter(function () { return this.WorkflowElementType == WorkflowElementType.Line; }));
                    }
                    this.Undo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Undo();
                        });

                        TraceManager.RedrawLineCrossPoints($(this.Targets).filter(function () { return this.WorkflowElementType == WorkflowElementType.Line; }));
                    }

                }
                break;
                //多活动文字大小改变
            case TraceManager.TraceType.Multi.ActivitiesTextSizeChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ActivitySize;

                    this.SourceStatus = _Source;
                    this.Activities = _Target;
                    this.AtomicTraces = [];
                    for (var i = 0; i < this.Activities.length; i++) {
                        this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Activity.TextSizeChange, this.Activities[i], _Source[i]));
                    }
                    this.Redo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Redo();
                        });
                    }
                    this.Undo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Undo();
                        });
                    }
                }
                break;
            case TraceManager.TraceType.Multi.ActivitiesTextColorChange:
                {
                    if (!this.TraceText)
                        this.TraceText = _WorkflowDesigner_GlobalString.WorkflowTrace_ActivityColor;

                    this.SourceStatus = _Source;
                    this.Activities = _Target;
                    this.AtomicTraces = [];
                    for (var i = 0; i < this.Activities.length; i++) {
                        this.AtomicTraces.push(new TraceManager.AtomicTrace(TraceManager.TraceType.Activity.TextColorChange, this.Activities[i], _Source[i]));
                    }
                    this.Redo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Redo();
                        });
                    }
                    this.Undo = function () {
                        $(this.AtomicTraces).each(function () {
                            this.Undo();
                        });
                    }
                }
                break;
        }
    },
    //痕迹栈
    TraceStack: [],
    //上一个痕迹序号
    LastTraceIndex: -1,
    //撤销
    Undo: function () {
        if (TraceManager.LastTraceIndex > -1) {
            var _LastTrace = TraceManager.TraceStack[TraceManager.LastTraceIndex];
            if (_LastTrace && _LastTrace.Undo) {
                TraceManager.LastTraceIndex--;
                _LastTrace.Undo();

                workflow.autoFit();
            }
            TraceManager.UlNextTrace.prepend(TraceManager.UlPrevTrace.find("li:first"))

            //更新缩略图
            TraceManager.UpdateThumbnail();

            if (!wp.CurrentObject
                || (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity && $.inArray(wp.CurrentObject, workflow.activities) == -1)
                || (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Line && $.inArray(wp.CurrentObject, workflow.lines) == -1)) {
                wp.DisplayProperties(workflow);
            }
        }
    },
    //重做
    Redo: function () {
        if (TraceManager.LastTraceIndex < TraceManager.TraceStack.length - 1) {
            var _NextTrace = TraceManager.TraceStack[TraceManager.LastTraceIndex + 1];
            if (_NextTrace && _NextTrace.Redo) {
                TraceManager.LastTraceIndex++;
                _NextTrace.Redo();

                workflow.autoFit();
            }
            TraceManager.UlPrevTrace.prepend(TraceManager.UlNextTrace.find("li:first"))

            //更新缩略图
            TraceManager.UpdateThumbnail();

            if (!wp.CurrentObject
                || (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Activity && $.inArray(wp.CurrentObject, workflow.activities) == -1)
                || (wp.CurrentObject.WorkflowElementType == WorkflowElementType.Line && $.inArray(wp.CurrentObject, workflow.lines) == -1)) {
                wp.DisplayProperties(workflow);
            }

        }
    },
    //添加新痕迹
    //_TraceType:痕迹类型
    //_Target   :目标对象
    //_Source   :源状态,可选
    AddTrace: function (_TraceType, _Target, _Source) {
        if (!TraceManager.UlPrevTrace || !TraceManager.UlNextTrace) {
            if (!$("#ulPrevTraces").get(0)) {
                $("<ul>").attr("id", "ulPrevTraces").appendTo("#btnUndo");
            }
            if (!$("#ulNextTraces").get(0)) {
                $("<ul>").attr("id", "ulNextTraces").appendTo("#btnRedo");
            }
            $("#H3ToolBar,#H3ToolBar>div").css("overflow", "visible");

            TraceManager.UlPrevTrace = $("#ulPrevTraces");
            TraceManager.UlNextTrace = $("#ulNextTraces");
        }

        //删除当前序号后的痕迹
        if (TraceManager.LastTraceIndex >= -1 && TraceManager.LastTraceIndex < TraceManager.TraceStack.length - 1) {
            TraceManager.TraceStack.splice(TraceManager.LastTraceIndex + 1, TraceManager.TraceStack.length - (TraceManager.LastTraceIndex + 1));

            //清除重做功能
            TraceManager.UlNextTrace.empty();
        }
        //新痕迹
        var _Trace = new TraceManager.Trace(_TraceType, _Target, _Source);
        TraceManager.TraceStack.push(_Trace);
        TraceManager.LastTraceIndex++;

        //添加痕迹
        TraceManager.UlPrevTrace.prepend("<li>" + TraceManager.TraceStack[TraceManager.LastTraceIndex].TraceText + "</li>");

        //更新缩略图
        TraceManager.UpdateThumbnail();
    },

    //获取痕迹相关对象和状态
    GetMultiObjAndStates: function (_Activities) {
        _Activities = $(_Activities).filter(function () { return this.WorkflowElementType == WorkflowElementType.Activity; });
        var Objects = [];
        var States = [];
        //记录源状态
        $(_Activities).each(function () {
            States.push(TraceManager.GetWorkflowElementProperties(this));
            Objects.push(this);
        });
        $(workflow.lines).each(function () {
            if ($.inArray(this.startActivity, _Activities) > -1 || $.inArray(this.endActivity, _Activities > -1)) {
                States.push(TraceManager.GetWorkflowElementProperties(this));
                Objects.push(this);
            }
        });
        return {
            Objects: Objects,
            States: States
        }
    },
    //获取活动\线条痕迹相关属性
    GetWorkflowElementProperties: function (_WorkflowElement) {
        if (_WorkflowElement.WorkflowElementType == WorkflowElementType.Activity) {
            var _Activity = _WorkflowElement;
            return {
                ID: _Activity.ID,
                width: _Activity.width,
                height: _Activity.height,
                left: _Activity.left,
                top: _Activity.top
            };
        }
        else if (_WorkflowElement.WorkflowElementType == WorkflowElementType.Line) {
            var _Line = _WorkflowElement;

            return {
                ID: _Line.ID,
                startActivityID: _Line.startActivity.ID,
                endActivityID: _Line.endActivity.ID,
                startDirection: _Line.startDirection,
                endDirection: _Line.endDirection,
                Points: TraceManager.CopyLinePoints(_Line.Points),
                TextX: _Line.TextX,
                TextY: _Line.TextY,
                FixedPoint: _Line.FixedPoint
            };
        }
    },
    //重新计算交点并重绘
    RedrawLineCrossPoints: function (_Lines) {
        $(_Lines).each(function () {
            if (this.WorkflowElementType == WorkflowElementType.Line) {
                this.calculateCrossPoints();
            }
        }).each(function () {
            if (this.WorkflowElementType == WorkflowElementType.Line) {
                this.draw(true);
            }
        });
    },

    //复制线的点集
    CopyLinePoints: function (_Points) {
        var _NewPoints = [];
        $(_Points).each(function () {
            _NewPoints.push({
                x: this.x,
                y: this.y
            });
        });
        return _NewPoints;
    },
    //缩略图
    Thumbnail: {
    },
    //缩略图是否准备好
    ThumbnailReady: false,
    //初始化缩略信息
    InitThumbnail: function () {
        if (!TraceManager.ThumbnailReady) {
            var ThumbnailFrame = frames["frmThumbnail"];
            if (ThumbnailFrame) {
                TraceManager.Thumbnail.workspace = $(ThumbnailFrame.document).find(".workspace");
                if (TraceManager.Thumbnail.workspace && TraceManager.Thumbnail.workspace.length == 1) {
                    TraceManager.Thumbnail.Panel = $(".div-thumbnail");
                    //导航器
                    TraceManager.Thumbnail.Nav = $(ThumbnailFrame.document).find(".thumbnail-nav");
                    TraceManager.ThumbnailReady = true;

                    TraceManager.Thumbnail.CloseButton = $("<div></div>").addClass("div_close");
                    TraceManager.Thumbnail.CloseButton.appendTo(TraceManager.Thumbnail.Panel);
                    //是否显示
                    TraceManager.Thumbnail.CloseButton.unbind("click").bind("click", function () {
                        if ($(this).text() == ">") {
                            $(this).text("<");
                            TraceManager.Thumbnail.Shown = false;
                            TraceManager.Thumbnail.Panel.width(0);
                            TraceManager.Thumbnail.Panel.height($(this).outerHeight());
                            TraceManager.Thumbnail.Panel.addClass("thumbnail-close");
                        }
                        else {
                            $(this).text(">");
                            TraceManager.Thumbnail.Shown = true;
                            TraceManager.Thumbnail.Panel.removeClass("thumbnail-close");
                        }
                        TraceManager.UpdateThumbnail();
                    }).click();

                    //滚动流程图容器更新导航器
                    $(workflow.outerContainer).unbind("scroll.Thumbnail").bind("scroll.Thumbnail", function () {
                        TraceManager.UpdateNav();
                    });
                    //点击切换缩略图位置
                    $(".thumbnail-top").unbind("click").bind("click", function (e) {
                        var toggleClass = "toggle-position"
                        if (TraceManager.Thumbnail.Panel.hasClass(toggleClass)) {
                            TraceManager.Thumbnail.Panel.removeClass(toggleClass);
                        }
                        else {
                            TraceManager.Thumbnail.Panel.addClass(toggleClass);
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    //移动导航器,滚动流程图
                    TraceManager.Thumbnail.workspace.unbind("click.Thumbnail").bind("click.Thumbnail", function (e) {
                        //功能没做完
                        return;
                        if (!TraceManager.Thumbnail.p)
                            return;
                        var _WorkspceCenter = {
                            x: TraceManager.Thumbnail.workspace.outerWidth() / 2 + TraceManager.Thumbnail.workspace.offset().left + TraceManager.Thumbnail.workspace.css("left").parsePxToFloat(),
                            y: TraceManager.Thumbnail.workspace.outerHeight() / 2 + TraceManager.Thumbnail.workspace.offset().top + TraceManager.Thumbnail.workspace.css("top").parsePxToFloat()
                        }
                        //相对中心的偏移
                        var _OffsetToCenter = {
                            x: (e.pageX - _WorkspceCenter.x) / TraceManager.Thumbnail.p,
                            y: (e.pageY - _WorkspceCenter.y) / TraceManager.Thumbnail.p
                        }

                        var _Left = _OffsetToCenter.x - TraceManager.Thumbnail.Nav.width() / 2;
                        var _Top = _OffsetToCenter.y - TraceManager.Thumbnail.Nav.height() / 2;

                        TraceManager.Thumbnail.Nav.css("left", _Left).css("top", _Top);
                        $(workflow.outerContainer).scrollLeft(_Left).scrollTop(_Top);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }
        }
    },
    UpdateThumbnail: function () {
        if (!TraceManager.ThumbnailReady)
            TraceManager.InitThumbnail();

        if (TraceManager.ThumbnailReady) {
            //存在滚动条才显示缩略图
            if (workflow.outerContainer.css("overflow-x") == "scroll" || workflow.outerContainer.css("overflow-y") == "scroll") {
                if (!TraceManager.Thumbnail.Shown) {
                    TraceManager.Thumbnail.Panel.show();
                    return;
                }

                var _width = $(workflow.workspace).width();
                var _height = $(workflow.workspace).height();
                var _length = Math.max(_width, _height);
                var p = 200 / _length;

                var _scale = "scale(" + p + ")";
                TraceManager.Thumbnail.workspace
                    .width(_width)
                    .height(_height)
                    .css("-webkit-transform", _scale).css("-webkit-transform", _scale).css("-o-transform", _scale).css("transform", _scale).css("-webkit-transform", _scale).css("-ms-transform", _scale).css("-moz-transform", _scale)
                    .css("left", _width * (p - 1) / 2)
                    .css("top", _height * (p - 1) / 2)
                    .html($(workflow.workspace).html());

                TraceManager.Thumbnail.Panel.width((_width + 60) * p).height((_height + 60) * p).show();
                TraceManager.Thumbnail.p = p;

                TraceManager.UpdateNav();
            }
            else {
                TraceManager.Thumbnail.Panel.hide();
            }
        }
    },
    UpdateNav: function () {
        p = TraceManager.Thumbnail.p;
        if (!p)
            return;
        var _NavWidth = $(workflow.outerContainer).width();
        var _NavHeight = $(workflow.outerContainer).height();
        var _scale = "scale(" + p + ")";
        TraceManager.Thumbnail.Nav
            .css("-webkit-transform", _scale).css("-o-transform", _scale).css("transform", _scale).css("-webkit-transform", _scale).css("-ms-transform", _scale).css("-moz-transform", _scale)
            .width(_NavWidth)
            .height(_NavHeight)
            .css("left", _NavWidth * (p - 1) / 2 + $(workflow.outerContainer).scrollLeft() * p)
            .css("top", _NavHeight * (p - 1) / 2 + $(workflow.outerContainer).scrollTop() * p);
    }
}