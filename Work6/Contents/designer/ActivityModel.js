
/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />
/// <reference path="WorkflowTrace.js" />

//活动模板
ActivityModelSettings = {
    //活动模板定义的Xml
    ActivityModels: [],
    //活动模板DOM保存活动模板JS对象的属性名
    ActivityDataProperty: "ActivityModel",

    //.拖动事件的命名空间
    EventNameSpace: ".ActivityModelDraggable",

    GetActivityModelByType: function (_ActivityType) {
        if (ActivityModelSettings.ActivityModels) {
            return $(ActivityModelSettings.ActivityModels).filter(function () {
                return this.ActivityType == _ActivityType;
            })[0];
        }
    },

    GetActivityModelByTypeName: function (_ToolTipText) {
        if (ActivityModelSettings.ActivityModels) {
            return $(ActivityModelSettings.ActivityModels).filter(function () {
                return this.ToolTipText == _ToolTipText;
            })[0];
        }
    }
}

//活动模板的样式名称
ActivityModelStyleClassName = {
    //活动模板放置的容器
    ActivityModelContainer: "model_container",

    //活动模板
    ActivityModel: "activity_model",
    //活动模板拖动样式
    ActivityModelDragProxy: "activity_model_proxy",
    //Logo所在的Div
    ActivityModelLogoDiv: "activity_model_logo",
    ////Logo图片
    //ActivityModelLogo: "activity_model_img",
    //Label
    ActivityModelLabel: "activity_model_label",

    //图标字体内容
    LogoFontContent: {
        "Start": "e751",
        "End": "e753",
        "FillSheet": "e7f8",
        "Approve": "e64c",
        "Circulate": "e7b4",
        "Notify": "e75c",
        "Connection": "e7cd",
        "Wait": "e68f",
        "BizAction": "e6d7",
        "SubInstance": "e700"
    }
}

//活动模板
//selector          :DOM对象选择器
var ActivityModel = function (_selector) {
    //DOM对象
    this.htmlObject = undefined;
    this.compatibleTypes = undefined;

    this.init(_selector);
    return this;
}

ActivityModel.prototype = {
    init: function (_selector) {
        this.htmlObject = $(_selector)[0];
        if (this.htmlObject) {
            //在DOM中保存当前模板
            $(this.htmlObject).data(ActivityModelSettings.ActivityDataProperty, this);
            this.initActions();
        }
    },

    initActions: function () {
        $(this.htmlObject).bind("mousedown" + ActivityModelSettings.EventNameSpace, function (e) {
            e.preventDefault();
            //左键
            if ($.fn.isOffsetLeftMouseDown(e)) {
                workflow.setMultiActionFlag(WorkflowMultiActionType.ModelDrag);

                //初始化设置
                ActivityModelDragStack = {};

                if ($(e.target).hasClass(ActivityModelStyleClassName.ActivityModel))
                    ActivityModelDragStack.DraggingActivityModel = $(e.target).data(ActivityModelSettings.ActivityDataProperty);
                else if ($(e.target).parents("." + ActivityModelStyleClassName.ActivityModel).length > 0)
                    ActivityModelDragStack.DraggingActivityModel = $(e.target).parents("." + ActivityModelStyleClassName.ActivityModel + ":first").data(ActivityModelSettings.ActivityDataProperty);

                if (!ActivityModelDragStack.DraggingActivityModel)
                    return;

                //拖动代理
                ActivityModelDragStack.DraggingProxy = $(ActivityModelDragStack.DraggingActivityModel.htmlObject).clone()
                    .addClass(ActivityModelStyleClassName.ActivityModelDragProxy)
                    .css("left", $(ActivityModelDragStack.DraggingActivityModel.htmlObject).offset().left)
                    .css("top", $(ActivityModelDragStack.DraggingActivityModel.htmlObject).offset().top)
                    .bind("mousedown" + ActivityModelSettings.EventNameSpace, function (e) { e.preventDefault(); })
                    .appendTo(body);

                //初始点
                ActivityModelDragStack.DragStartPoint = ActivityModelDragStack.LastDragPoint = {
                    x: e.pageX,
                    y: e.pageY
                }

                $("." + ActivityModelStyleClassName.ActivityModel).each(function (index) {
                    if (this == $(ActivityModelDragStack.DraggingActivityModel.htmlObject)[0])
                        ActivityModelDragStack.ModelType = index;
                });

                $(document).bind("mousemove" + ActivityModelSettings.EventNameSpace, function (e) {
                    $(ActivityModelDragStack.DraggingProxy).move({
                        x: e.pageX - ActivityModelDragStack.LastDragPoint.x,
                        y: e.pageY - ActivityModelDragStack.LastDragPoint.y
                    });
                    ActivityModelDragStack.LastDragPoint = {
                        x: e.pageX,
                        y: e.pageY
                    }
                });
                $(document).one("mouseup" + ActivityModelSettings.EventNameSpace, function (e) {
                    workflow.setMultiActionFlag(WorkflowMultiActionType.None);
                    //放置在流程图内
                    if ($(ActivityModelDragStack.DraggingProxy).inRangeOf(workflow.workspace)
                        || (e.pageX >= $(workflow.workspace).offset().left && e.pageX <= $(workflow.workspace).offset().left + $(workflow.workspace).outerWidth()
                              && e.pageY >= $(workflow.workspace).offset().top && e.pageY <= $(workflow.workspace).offset().top + $(workflow.workspace).outerHeight())) {
                        $(ActivityModelDragStack.DraggingProxy)
                               .css("left", $(ActivityModelDragStack.DraggingProxy).offset().left - $(workflow.workspace).innerOffsetLeft())
                               .css("top", $(ActivityModelDragStack.DraggingProxy).offset().top - $(workflow.workspace).innerTop())
                               .appendTo(workflow.workspace)
                               .removeClass(ActivityModelStyleClassName.ActivityModelDragProxy);
                        //保存活动
                        var activity = workflow.addActivity(ActivityModelDragStack.DraggingProxy, ActivityModelDragStack.DraggingActivityModel);
                        if (!activity.width || activity.width < ActivitySettings.MinOuterWidth) {
                            $(activity.htmlObject).outerWidth(ActivitySettings.MinOuterWidth);
                        }
                        if (!activity.height || activity.height < ActivitySettings.MinOuterHeight) {
                            $(activity.htmlObject).outerHeight(ActivitySettings.MinOuterHeight);
                        }
                        if (activity.left < ActivityMovingStack.WorkflowContentEdgeLeft)
                            $(activity.htmlObject).css("left", ActivityMovingStack.WorkflowContentEdgeLeft);
                        if (activity.top < ActivityMovingStack.WorkflowContentEdgeTop)
                            $(activity.htmlObject).css("top", ActivityMovingStack.WorkflowContentEdgeTop);
                        activity.savePosition();

                        //初始化属性
                        activity.getPropertyFromModel();

                        //workflow.autoFit(activity);
                        workflow.autoFit();
                        $(workflow.workspace).focus();

                        TraceManager.AddTrace(TraceManager.TraceType.Activity.Add, activity);

                        //设为唯一选中
                        activity.Select(true);
                        wp.DisplayProperties(activity);
                    }
                    else
                        //回转并消失
                        $(ActivityModelDragStack.DraggingProxy).animate(
                            {
                                "left": $(ActivityModelDragStack.DraggingProxy).css("left").parsePxToFloat() + ActivityModelDragStack.DragStartPoint.x - e.pageX,
                                "top": $(ActivityModelDragStack.DraggingProxy).css("top").parsePxToFloat() + ActivityModelDragStack.DragStartPoint.y - e.pageY
                            }, function () {
                                $(ActivityModelDragStack.DraggingProxy).remove();
                            });

                    $(document).unbind(ActivityModelSettings.EventNameSpace);
                });
            }
        })
    }
}

//活动模板拖拽设置
ActivityModelDragSettings = {
    //拖入时是否检测并停靠到活动
    Dockable: false
}

//活动模板拖拽栈
ActivityModelDragStack = {
    //拖拽的模板JS对象
    DraggingActivityModel: undefined,
    //拖拽的副本
    DraggingProxy: undefined,

    //拖拽开始时鼠标的位置（相对于文档原点）
    DragStartPoint: {
        x: 0, y: 0
    },

    //记录计算过的最新的鼠标的位置（相对于文档原点）
    LastDragPoint: {
        x: 0, y: 0
    },
    //模板类型
    ModelType: undefined
}

ActivityTemplateConfigs = [
{
    "ActivityType": 0,
    "NameSpace": "OThinker.H3.BPM",
    "ClassName": "",
    "FullClassName": "OThinker.H3.BPM.",
    "Custom": false,
    "CustomCode": null,
    "DisplayName": "开始",
    "ToolTipText": "Start",
    "ActivityCode": "",
    "SortKey": 0,
    "Description": "",
    "ExpectedDuration": "",
    "OvertimeDisposal": null,
    "BeforeDisposal": null,
    "ActivatedDisposal": null,
    "AsyncEndedDisposal": null,
    "ApprovedDisposal": null,
    "RejectedDisposal": null,
    "AfterDisposal": null,
    "CancelledDisposal": null,
    "InstanceProgress": 0,
    "PlanUsedTime": "",
    "AllowedTime": "",
    "OvertimePolicy": 0,
    "Recurrence": 0,
    "ShortText1": "",
    "ShortText2": "",
    "ShortText3": "",
    "ShortText4": "",
    "ShortText5": "",
    "LongText6": "",
    "LongText7": "",
    "Height": 0,
    "Width": 0,
    "X": 0,
    "Y": 0,
    "IsActivity": true,
    "IsRule": false,
    "IsEnd": false,
    "IsApproveActivity": false,
    "IsClient": false,
    "EntryCondition": 0,
    "FullName": "开始[]",
    "FontSize": 0,
    "FontColor": "",
    "ID": 0
},
{
        "ActivityType": 1,
        "NameSpace": "OThinker.H3.BPM",
        "ClassName": "",
        "FullClassName": "OThinker.H3.BPM.",
        "Custom": false,
        "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : SmartActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t\t// 请不要在这里填写代码，因为在执行这段代码的时候会阻塞引擎的某些组件\r\n\t\t}\r\n\t}\r\n}",
        "DisplayName": "结束",
        "ToolTipText": "End",
        "ActivityCode": "",
        "SortKey": 0,
        "Description": "",
        "ExpectedDuration": "",
        "OvertimeDisposal": null,
        "BeforeDisposal": null,
        "ActivatedDisposal": null,
        "AsyncEndedDisposal": null,
        "ApprovedDisposal": null,
        "RejectedDisposal": null,
        "AfterDisposal": null,
        "CancelledDisposal": null,
        "InstanceProgress": 0,
        "PlanUsedTime": "",
        "AllowedTime": "",
        "OvertimePolicy": 0,
        "Recurrence": 0,
        "ShortText1": "",
        "ShortText2": "",
        "ShortText3": "",
        "ShortText4": "",
        "ShortText5": "",
        "LongText6": "",
        "LongText7": "",
        "Height": 0,
        "Width": 0,
        "X": 0,
        "Y": 0,
        "IsActivity": true,
        "IsRule": false,
        "IsEnd": true,
        "IsApproveActivity": false,
        "IsClient": false,
        "EntryCondition": 0,
        "FullName": "结束[]",
        "FontSize": 0,
        "FontColor": "",
        "ID": 0
},
{
    "ActivityType": 3,
    "FinishExit": "1",
    "Assistants": "",
    "Circulatees": "",
    "Consultants": "",
    "SMSApprove": false,
    "PermittedActions": {
        "Flag": 2049,
        "Forward": true,
        "Consult": false,
        "Backward": false,
        "Choose": false,
        "Jump": false,
        "RejectToStart": false,
        "Reject": false,
        "RejectToAny": false,
        "RejectToFixed": false,
        "SubmitToRejectedActivity": false,
        "RejectToActivityCodes": [],
        "CancelIfUnfinished": false,
        "CancelIfFinished": false,
        "Retrieve": false,
        "Cancel": false,
        "Suspend": false,
        "ViewInstanceState": true,
        "AdjustParticipant": false,
        "Circulate": false,
        "Recirculate": false,
        "ViewData": false,
        "Assist": false,
        "FinishInstance": false,
        "PreviewParticipant": false
    },
    "LockLevel": 1,
    "LockPolicy": 0,
    "SubmittingValidation": 0,
    "RequireGroup": false,
    "RequirePost": false,
    "ParticipateMethod": 0,
    "WorkItemDisplayName": "",
    "DataPermissions": [],
    "BatchProcessing": false,
    "EmailNotification": true,
    "MobileProcessing": true,
    "NoParPolicy": 0,
    "DupParPolicy": 0,
    "OriginatorParPolicy": 0,
    "ParticipatedParPolicy": 0,
    "SheetCode": "",
    "WorkItemFlag": "",
    "Summary": "",
    "PageScript": "",
    "Participants": "",
    "ParticipateType": 1,
    "NameSpace": "OThinker.H3.BPM",
    "ClassName": "",
    "FullClassName": "OThinker.H3.BPM.",
    "Custom": false,
    "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : FillSheetActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n           //这里不要写代码\r\n\t\t}\r\n       public override bool OnExecute(Messages.ActivateActivityMessage Message)\r\n\t\t{\r\n           //在这里写代码\r\n           return base.OnExecute(Message);\r\n\t\t}\r\n\t}\r\n}",
    "DisplayName": "手工",
    "ToolTipText": "FillSheet",
    "ActivityCode": "",
    "SortKey": 0,
    "Description": "",
    "ExpectedDuration": "",
    "OvertimeDisposal": null,
    "BeforeDisposal": null,
    "ActivatedDisposal": null,
    "AsyncEndedDisposal": null,
    "ApprovedDisposal": null,
    "RejectedDisposal": null,
    "AfterDisposal": null,
    "CancelledDisposal": null,
    "InstanceProgress": 0,
    "PlanUsedTime": "",
    "AllowedTime": "",
    "OvertimePolicy": 0,
    "Recurrence": 0,
    "ShortText1": "",
    "ShortText2": "",
    "ShortText3": "",
    "ShortText4": "",
    "ShortText5": "",
    "LongText6": "",
    "LongText7": "",
    "Height": 0,
    "Width": 0,
    "X": 0,
    "Y": 0,
    "IsActivity": true,
    "IsRule": false,
    "IsEnd": false,
    "IsApproveActivity": false,
    "IsClient": true,
    "EntryCondition": 0,
    "FullName": "手工[]",
    "FontSize": 0,
    "FontColor": "",
    "ID": 0
},
{
        "ActivityType": 4,
        "ApproveExit": "100%",
        "DisapproveExit": "1",
        "ApprovalDataItem": "",
        "CommentDataItem": "",
        "FinishExit": "1",
        "Assistants": "",
        "Circulatees": "",
        "Consultants": "",
        "SMSApprove": false,
        "PermittedActions": {
    "Flag": 67585,
    "Forward": true,
    "Consult": false,
    "Backward": false,
    "Choose": false,
    "Jump": false,
    "RejectToStart": false,
    "Reject": true,
    "RejectToAny": false,
    "RejectToFixed": false,
    "SubmitToRejectedActivity": false,
    "RejectToActivityCodes": [],
    "CancelIfUnfinished": false,
    "CancelIfFinished": false,
    "Retrieve": false,
    "Cancel": false,
    "Suspend": false,
    "ViewInstanceState": true,
    "AdjustParticipant": false,
    "Circulate": false,
    "Recirculate": false,
    "ViewData": false,
    "Assist": false,
    "FinishInstance": false,
    "PreviewParticipant": false
},
        "LockLevel": 1,
        "LockPolicy": 0,
        "SubmittingValidation": 0,
        "RequireGroup": false,
        "RequirePost": true,
        "ParticipateMethod": 0,
        "WorkItemDisplayName": "",
        "DataPermissions": [],
        "BatchProcessing": false,
        "EmailNotification": true,
        "MobileProcessing": true,
        "NoParPolicy": 0,
        "DupParPolicy": 0,
        "OriginatorParPolicy": 0,
        "ParticipatedParPolicy": 0,
        "SheetCode": "",
        "WorkItemFlag": "",
        "Summary": "",
        "PageScript": "",
        "Participants": "",
        "ParticipateType": 1,
        "NameSpace": "OThinker.H3.BPM",
        "ClassName": "",
        "FullClassName": "OThinker.H3.BPM.",
        "Custom": false,
        "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : FillSheetActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n           //这里不要写代码\r\n\t\t}\r\n       public override bool OnExecute(Messages.ActivateActivityMessage Message)\r\n\t\t{\r\n           //在这里写代码\r\n           return base.OnExecute(Message);\r\n\t\t}\r\n\t}\r\n}",
        "DisplayName": "审批",
        "ToolTipText": "Approve",
        "ActivityCode": "",
        "SortKey": 0,
        "Description": "",
        "ExpectedDuration": "",
        "OvertimeDisposal": null,
        "BeforeDisposal": null,
        "ActivatedDisposal": null,
        "AsyncEndedDisposal": null,
        "ApprovedDisposal": null,
        "RejectedDisposal": null,
        "AfterDisposal": null,
        "CancelledDisposal": null,
        "InstanceProgress": 0,
        "PlanUsedTime": "",
        "AllowedTime": "",
        "OvertimePolicy": 0,
        "Recurrence": 0,
        "ShortText1": "",
        "ShortText2": "",
        "ShortText3": "",
        "ShortText4": "",
        "ShortText5": "",
        "LongText6": "",
        "LongText7": "",
        "Height": 40,
        "Width": 146,
        "X": 0,
        "Y": 0,
        "IsActivity": true,
        "IsRule": false,
        "IsEnd": false,
        "IsApproveActivity": true,
        "IsClient": true,
        "EntryCondition": 0,
        "FullName": "审批[]",
        "FontSize": 18,
        "FontColor": "blue",
        "ID": 0
},
{
    "ActivityType": 25,
    "ParticipateType": 3,
    "WorkItemDisplayName": "",
    "DataPermissions": [],
    "BatchProcessing": false,
    "EmailNotification": true,
    "MobileProcessing": true,
    "NoParPolicy": 0,
    "DupParPolicy": 0,
    "OriginatorParPolicy": 0,
    "ParticipatedParPolicy": 0,
    "SheetCode": "",
    "WorkItemFlag": "",
    "Summary": "",
    "PageScript": "",
    "Participants": "",
    "NameSpace": "OThinker.H3.BPM",
    "ClassName": "",
    "FullClassName": "OThinker.H3.BPM.",
    "Custom": false,
    "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : FillSheetActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n           //这里不要写代码\r\n\t\t}\r\n       public override bool OnExecute(Messages.ActivateActivityMessage Message)\r\n\t\t{\r\n           //在这里写代码\r\n           return base.OnExecute(Message);\r\n\t\t}\r\n\t}\r\n}",
    "DisplayName": "传阅",
    "ToolTipText": "Circulate",
    "ActivityCode": "",
    "SortKey": 0,
    "Description": "",
    "ExpectedDuration": "",
    "OvertimeDisposal": null,
    "BeforeDisposal": null,
    "ActivatedDisposal": null,
    "AsyncEndedDisposal": null,
    "ApprovedDisposal": null,
    "RejectedDisposal": null,
    "AfterDisposal": null,
    "CancelledDisposal": null,
    "InstanceProgress": 0,
    "PlanUsedTime": "",
    "AllowedTime": "",
    "OvertimePolicy": 0,
    "Recurrence": 0,
    "ShortText1": "",
    "ShortText2": "",
    "ShortText3": "",
    "ShortText4": "",
    "ShortText5": "",
    "LongText6": "",
    "LongText7": "",
    "Height": 0,
    "Width": 0,
    "X": 0,
    "Y": 0,
    "IsActivity": true,
    "IsRule": false,
    "IsEnd": false,
    "IsApproveActivity": false,
    "IsClient": true,
    "EntryCondition": 0,
    "FullName": "传阅[]",
    "FontSize": 0,
    "FontColor": "",
    "ID": 0
},
//{
//        "ActivityType": 15,
//        "NotifyType": -1,
//        "Receivers": "",
//        "Sender": null,
//        "Title": "",
//        "Content": "",
//        "NameSpace": "OThinker.H3.BPM",
//        "ClassName": "",
//        "FullClassName": "OThinker.H3.BPM.",
//        "Custom": false,
//        "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\r\n\tpublic class {ClassName} : NotifyActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t}\t}\r\n}",
//        "DisplayName": "消息",
//        "ToolTipText": "Notify",
//        "ActivityCode": "",
//        "SortKey": 0,
//        "Description": "",
//        "ExpectedDuration": "",
//        "OvertimeDisposal": null,
//        "BeforeDisposal": null,
//        "ActivatedDisposal": null,
//        "AsyncEndedDisposal": null,
//        "ApprovedDisposal": null,
//        "RejectedDisposal": null,
//        "AfterDisposal": null,
//        "CancelledDisposal": null,
//        "InstanceProgress": 0,
//        "PlanUsedTime": "",
//        "AllowedTime": "",
//        "OvertimePolicy": 0,
//        "Recurrence": 0,
//        "ShortText1": "",
//        "ShortText2": "",
//        "ShortText3": "",
//        "ShortText4": "",
//        "ShortText5": "",
//        "LongText6": "",
//        "LongText7": "",
//        "Height": 0,
//        "Width": 0,
//        "X": 0,
//        "Y": 0,
//        "IsActivity": true,
//        "IsRule": false,
//        "IsEnd": false,
//        "IsApproveActivity": false,
//        "IsClient": false,
//        "EntryCondition": 0,
//        "FullName": "消息[]",
//        "FontSize": 0,
//        "FontColor": "",
//        "ID": 0
//},
//{
//    "ActivityType": 7,
//    "IntervalByMinute": 0,
//    "WaitCondition": "",
//    "NameSpace": "OThinker.H3.BPM",
//    "ClassName": "",
//    "FullClassName": "OThinker.H3.BPM.",
//    "Custom": false,
//    "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : WaitActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t}\r\n\t\tprotected override bool OnExecute(Messages.ActivateActivityMessage Message)\r\n\t\t{\r\n                  base.OnExecute(Message);\t\t}\r\n\t}\r\n}",
//    "DisplayName": "等待",
//    "ToolTipText": "Wait",
//    "ActivityCode": "",
//    "SortKey": 0,
//    "Description": "",
//    "ExpectedDuration": "",
//    "OvertimeDisposal": null,
//    "BeforeDisposal": null,
//    "ActivatedDisposal": null,
//    "AsyncEndedDisposal": null,
//    "ApprovedDisposal": null,
//    "RejectedDisposal": null,
//    "AfterDisposal": null,
//    "CancelledDisposal": null,
//    "InstanceProgress": 0,
//    "PlanUsedTime": "",
//    "AllowedTime": "",
//    "OvertimePolicy": 0,
//    "Recurrence": 0,
//    "ShortText1": "",
//    "ShortText2": "",
//    "ShortText3": "",
//    "ShortText4": "",
//    "ShortText5": "",
//    "LongText6": "",
//    "LongText7": "",
//    "Height": 0,
//    "Width": 0,
//    "X": 0,
//    "Y": 0,
//    "IsActivity": true,
//    "IsRule": false,
//    "IsEnd": false,
//    "IsApproveActivity": false,
//    "IsClient": false,
//    "EntryCondition": 0,
//    "FullName": "等待[]",
//    "FontSize": 0,
//    "FontColor": "",
//    "ID": 0
//},
{
        "ActivityType": 2,
        "NameSpace": "OThinker.H3.BPM",
        "ClassName": "",
        "FullClassName": "OThinker.H3.BPM.",
        "Custom": false,
        "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : ConnectionActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t\t// 请不要在这里填写代码，因为在执行这段代码的时候会阻塞引擎的某些组件\r\n\t\t}\r\n\t}\r\n}",
        "DisplayName": "连接点",
        "ToolTipText": "Connection",
        "ActivityCode": "",
        "SortKey": 0,
        "Description": "",
        "ExpectedDuration": "",
        "OvertimeDisposal": null,
        "BeforeDisposal": null,
        "ActivatedDisposal": null,
        "AsyncEndedDisposal": null,
        "ApprovedDisposal": null,
        "RejectedDisposal": null,
        "AfterDisposal": null,
        "CancelledDisposal": null,
        "InstanceProgress": 0,
        "PlanUsedTime": "",
        "AllowedTime": "",
        "OvertimePolicy": 0,
        "Recurrence": 0,
        "ShortText1": "",
        "ShortText2": "",
        "ShortText3": "",
        "ShortText4": "",
        "ShortText5": "",
        "LongText6": "",
        "LongText7": "",
        "Height": 0,
        "Width": 0,
        "X": 0,
        "Y": 0,
        "IsActivity": true,
        "IsRule": false,
        "IsEnd": false,
        "IsApproveActivity": false,
        "IsClient": false,
        "EntryCondition": 0,
        "FullName": "连接点[]",
        "FontSize": 0,
        "FontColor": "",
        "ID": 0
},
{
    "ActivityType": 28,
    "BizActions": [],
    "NameSpace": "OThinker.H3.BPM",
    "ClassName": "",
    "FullClassName": "OThinker.H3.BPM.",
    "Custom": false,
    "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : BizActionActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t}\r\n\t}\r\n}",
    "DisplayName": "业务动作",
    "ToolTipText": "BizAction",
    "ActivityCode": "",
    "SortKey": 0,
    "Description": "",
    "ExpectedDuration": "",
    "OvertimeDisposal": null,
    "BeforeDisposal": null,
    "ActivatedDisposal": null,
    "AsyncEndedDisposal": null,
    "ApprovedDisposal": null,
    "RejectedDisposal": null,
    "AfterDisposal": null,
    "CancelledDisposal": null,
    "InstanceProgress": 0,
    "PlanUsedTime": "",
    "AllowedTime": "",
    "OvertimePolicy": 0,
    "Recurrence": 0,
    "ShortText1": "",
    "ShortText2": "",
    "ShortText3": "",
    "ShortText4": "",
    "ShortText5": "",
    "LongText6": "",
    "LongText7": "",
    "Height": 0,
    "Width": 0,
    "X": 0,
    "Y": 0,
    "IsActivity": true,
    "IsRule": false,
    "IsEnd": false,
    "IsApproveActivity": false,
    "IsClient": false,
    "EntryCondition": 0,
    "FullName": "业务动作[]",
    "FontSize": 0,
    "FontColor": "",
    "ID": 0
}
//,
//{
//        "ActivityType": 9,
//        "WorkflowCode": "",
//        "WorkflowVersion": 0,
//        "Sync": false,
//        "FinishStartActivity": false,
//        "ParticipateMethod": 0,
//        "ApprovalDataItem": "",
//        "CommentDataItem": "",
//        "DataMaps": [],
//        "ApproveExit": "100%",
//        "DisapproveExit": "1",
//        "FinishExit": "1",
//        "Participants": null,
//        "ParticipateType": 2,
//        "NameSpace": "OThinker.H3.BPM",
//        "ClassName": "",
//        "FullClassName": "OThinker.H3.BPM.",
//        "Custom": false,
//        "CustomCode": "using System;\r\nusing OThinker.H3.SmartFlow;\r\nusing OThinker.H3;\r\n\r\nnamespace OThinker.H3.BPM\r\n{\r\n\tpublic class {ClassName} : SubInstanceActivity\r\n\t{\r\n\t\tpublic {ClassName}()\r\n\t\t{\r\n\t\t}\r\n\t}\r\n}",
//        "DisplayName": "子流程",
//        "ToolTipText": "SubInstance",
//        "ActivityCode": "",
//        "SortKey": 0,
//        "Description": "",
//        "ExpectedDuration": "",
//        "OvertimeDisposal": null,
//        "BeforeDisposal": null,
//        "ActivatedDisposal": null,
//        "AsyncEndedDisposal": null,
//        "ApprovedDisposal": null,
//        "RejectedDisposal": null,
//        "AfterDisposal": null,
//        "CancelledDisposal": null,
//        "InstanceProgress": 0,
//        "PlanUsedTime": "",
//        "AllowedTime": "",
//        "OvertimePolicy": 0,
//        "Recurrence": 0,
//        "ShortText1": "",
//        "ShortText2": "",
//        "ShortText3": "",
//        "ShortText4": "",
//        "ShortText5": "",
//        "LongText6": "",
//        "LongText7": "",
//        "Height": 0,
//        "Width": 0,
//        "X": 0,
//        "Y": 0,
//        "IsActivity": true,
//        "IsRule": false,
//        "IsEnd": false,
//        "IsApproveActivity": false,
//        "IsClient": false,
//        "EntryCondition": 0,
//        "FullName": "子流程[]",
//        "FontSize": 0,
//        "FontColor": "",
//        "ID": 0
//}
];
//活动模板初始化
ActivityModelInit = function () {
    //加载模板定义
    if (ActivityTemplateConfigs && ActivityTemplateConfigs.length > 0) {
        //活动模板的容器
        var container = $("." + ActivityModelStyleClassName.ActivityModelContainer);

        var modelDiv = $("<div ></div>").addClass(ActivityModelStyleClassName.ActivityModel);
        var modelContent = $("<div><div>").addClass(ActivityStyleClassName.ActivityContent);
        //图标
        var logoDiv = $("<div></div>").addClass(ActivityModelStyleClassName.ActivityModelLogoDiv);
        modelContent.append(logoDiv);
        modelDiv.append(modelContent);

        //文字
        modelContent.append($("<div></div>").addClass(ActivityModelStyleClassName.ActivityModelLabel));
        ActivityModelSettings.ActivityModels = [];

        //活动模板按SortKey排序
        ActivityTemplateConfigs.sort(function (a, b) {
            if (a && b && !isNaN(a.SortKey) && !isNaN(b.SortKey)) {
                return a.SortKey > b.SortKey;
            }
        });

        //初始化各模板
        $(ActivityTemplateConfigs).each(function () {
            if (this.ToolTipText) {
                //解析和初始化活动模板区域
                var currentModelHtml = modelDiv.clone();
                currentModelHtml.find("." + ActivityModelStyleClassName.ActivityModelLogoDiv).addClass("activity_logo_" + this.ToolTipText);
                currentModelHtml.find("." + ActivityModelStyleClassName.ActivityModelLabel).text(this.DisplayName);
                currentModelHtml.appendTo(container);

                var activitymodel = new ActivityModel(currentModelHtml)
                ActivityModelSettings.ActivityModels.push(activitymodel);

                //隐藏开始、结束
                if (this.ToolTipText == "Start" || this.ToolTipText == "End") {
                    currentModelHtml.hide();
                }

                $.extend(activitymodel, activitymodel, this);
                activitymodel.ToolTipText = this.ToolTipText;
            }
        });
    }
}