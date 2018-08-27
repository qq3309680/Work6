/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//var _WorkflowDocument_GlobalString = {
//    "WorkflowDocument_Internal": "服务器内部错误",
//    "Msg_SaveSuccess": "保存成功",
//    "Msg_SaveFailed": "保存失败",
//    "WorkflowDocument_WorkflowName": "流程模板名称",
//    "WorkflowVersion": "版本号",
//    "PortalPageManage_Design": "设计",
//    "WorkflowDocument_ActivityCode": "活动编码重复",
//    "WorkflowDocument_TestSuccessful": "检验成功",
//    "WorkflowDocument_TestFailed": "检验失败",
//    "WorkflowDocument_ConfirmRelease": "确定发布吗?",
//    "WorkflowDocument_FailedRelease": "发布失败",
//    "WorkflowDocument_Playback": "点击流程回放",
//    "WorkflowDocument_FormartValid": "文件格式不正确，导入失败",
//    "WorkflowDocument_Specification": "正在加载版本兼容性说明文件...",
//    "WorkflowDocument_ImportSuccessful": "导入文件成功",
//    "WorkflowDocument_ImportFailed": "导入失败:无法识别版本",
//    "Button_Cancel": "取消",
//    "WorkflowDocument_FileFormart": "文件格式非",
//    "WorkflowDocument_Mssg": "无法导入，您的浏览器不支持文件读取，建议使用Chrome、FireFox、IE 9及以上版本、Opera",
//    "WorkflowDocument_ExportSuccessful": "导出成功",
//    "WorkflowDocument_ExportFailed": "尚未保存,导出失败",
//    "WorkflowDocument_ViewPicture": "查看图片",
//    "WorkflowDocument_RefreshedSuccessful": "刷新成功",
//    "WorkflowDocument_Empty": "流程图已清空",
//};

$(function () {
    ////获取本地化字符串
    //var url = _PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx";
    //$.get(url, { "Code": "WorkflowDocument_Replay" }, function (data) {
    //    console.dir(data);
    //    if (data.IsSuccess) {
    //        $("#btnReplay").text(data.TextObj.WorkflowDocument_Replay);
    //    }
    //}, "json");
});

WorkflowDocumentStyleClassName = {
    //处理结果
    DealResult: "workflow_result",
    //遮罩层
    RevealDiv: "reveal",
    //导入文件DIV
    ImportDiv: "import_div",
    //取消按钮
    CancelButton: "button_cancel"
}

WorkflowColor = {
    Default: "white",
    Finished: "#6dbacc",
    Working: "#FFFF00",
    Exception: "red"
}

WorkflowDocumentSettings = {
    //流程模板AJAX的URL
    WorklfowHandlerAjaxUrl: "../Ajax/Designer/WorkflowHandler.ashx",

    //锁定流程图的事件命名空间
    LockEventNamespace: ".lock"
}

var WorkflowMode = {
    Designer: 1,
    ViewWithProperty: 2,
    ViewOnly: 3,
    MobileView: 4
}
var InstanceState = {
    Running: 2,
    Finished: 4,
    Canceled: 5
}
//令牌状态
//ERROR:这个应等同于后台TokenState枚举类,可以从后台输出
var TokenState = {
    //运行中
    Running: 0,
    //完成
    Finished: 1,
    //废弃
    Dropped: 2
}
//工作项状态
var WorkItemState = {
    //等待
    Waiting: 0,
    //进行中
    Working: 1,
    //完成
    Finished: 2,
    //取消
    Canceled: 3
}


WorkflowDocumentStack = {
    //对应后台流程模板对象
    Workflow: undefined,
    //结果展示DIV
    ResultDiv: undefined,
    //遮罩层DIV
    RevealDiv: undefined,
    //兼容说明文件是否已加载
    CompatibleTypeLoaded: false,
    //取消导入按钮
    CancelImportButton: undefined,
    //导入文件框
    ImportDiv: undefined,

    //已锁定
    IsLocked: false,

    //显示加载中... 的div
    LoadingDiv: undefined
}

WorkflowDocument = {
    //最后保存的痕迹
    LastSavedTrace: undefined,
    //最后保存的痕迹的序号
    LastSavedTraceIndex: -1,
    //是否在保存后变更了
    ChangedAfterSave: function () {
        if (TraceManager && TraceManager.TraceStack
            && (this.LastSavedTraceIndex != TraceManager.LastTraceIndex
                || this.LastSavedTrace != TraceManager.TraceStack[TraceManager.LastTraceIndex])) {
            return true;
        }
    },
    OnSave: function () {
        this.LastSavedTraceIndex = TraceManager.LastTraceIndex + 0;
        this.LastSavedTrace = TraceManager.TraceStack[this.LastSavedTraceIndex];
    },

    ShowDealResult: function (msg) {
        if (typeof (msg) == "string")
            $.H3Dialog.Warn({ content: msg });
        else if (typeof (msg) == "object" && msg.length > 0) {
            $.H3Dialog.AlertMultiMsg({ content: msg });
        }
    },

    OnBeginAjax: function () {
        if (!WorkflowDocumentStack.LoadingDiv) {
            WorkflowDocumentStack.LoadingDiv = $("<div class='l-tab-loading' style='display:block;'></div>").css("background-color", "transparent");
            WorkflowDocumentStack.LoadingDiv.appendTo($("body:first"));
        }
        WorkflowDocumentStack.LoadingDiv.show();
    },

    OnEndAjax: function () {
        setTimeout(function () {
            if (WorkflowDocumentStack.LoadingDiv)
                WorkflowDocumentStack.LoadingDiv.hide();
        }, 300);
    },

    ShowAjaxErrors: function (msg, title) {
        if (msg.status == "500") {
            WorkflowDocument.ShowDealResult(title + ":" + _WorkflowDesigner_GlobalString.WorkflowDocument_Internal);
        }
        else {
            WorkflowDocument.ShowDealResult(title + ":" + msg.statusText);
        }
    },

    ShowLogin: function () {
        //显示或者打开登录对话框
        var loginWin = top.$.ligerui.get('LoginWinID');
        if (loginWin) {
            loginWin.show();
        }
        else {
            loginWin = top.$.ligerDialog.open({
                id: 'LoginWinID',
                url: '../Login.aspx?LoginModal=ModalShow&LoginIsRefresh=false',
                isHidden: false,
                width: top.$('body').outerWidth(true),
                height: top.$('body').outerHeight(true) + 20,
                onClosed: function () {
                    location.reload();
                }
            });
        }
        // 隐藏登录对话框的标题
        loginWin.hideTitle();
    },

    ShowErrorList: function (_ErrorList) {
        if (_ErrorList && _ErrorList.length > 0) {
            var msg = "";
            $(_ErrorList).each(function () {
                msg += this + ";";
            });
            alert(msg);
        }
    },
    //流程文档保存事件
    SaveWorkflow: function () {
        if (!WorkflowDocument.PartValidateWorkflow())
            return;

        //loading
        WorkflowDocument.OnBeginAjax();

        this.OnSave();
        //console.dir(WorkflowDocument.GetWorkflowPostData("SaveWorkflow", true));
        $.ajax({
            type: "post",
            url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
            cache: false,
            async: true,
            dataType: "json",
            data: WorkflowDocument.GetWorkflowPostData("SaveWorkflow", true),
            success: function (result) {
                if (result == "PortalSessionOut") {
                    WorkflowDocument.ShowLogin();
                    return;
                }

                if (result.Result) {
                    WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.Msg_SaveSuccess);
                }
                else {
                    var _Content = [{
                        status: "error", text: _WorkflowDesigner_GlobalString.Msg_SaveFailed
                    }];

                    if (result.Errors && result.Errors.length > 0) {
                        _Content.push({
                            status: "error", text: result.Errors[0]
                        });
                        WorkflowDocument.ShowDealResult(_Content);
                    };
                }
            },
            error: function (msg) {
                WorkflowDocument.ShowAjaxErrors(msg, _WorkflowDesigner_GlobalString.Msg_SaveFailed);
            }
        });

        WorkflowDocument.OnEndAjax();
    },

    DisplayWorkflowFullName: function () {
        var _WorkflowTitle = _WorkflowDesigner_GlobalString.WorkflowDocument_WorkflowName + ":" + (ClauseName || workflow.WorkflowCode) + ","
        if (!isNaN(parseInt(workflow.WorkflowVersion)) && parseInt(workflow.WorkflowVersion) > 0) {
            _WorkflowTitle += _WorkflowDesigner_GlobalString.WorkflowVersion + ":" + workflow.WorkflowVersion;
        }
        else {
            _WorkflowTitle += _WorkflowDesigner_GlobalString.PortalPageManage_Design;
        }

        $(".l-layout-header:first").text(_WorkflowTitle);
    },
    DisplayTabName: function () {
        var _TabName = (ClauseName || workflow.WorkflowCode);
        if (!isNaN(parseInt(workflow.WorkflowVersion)) && parseInt(workflow.WorkflowVersion) > 0) {
            _TabName += "[" + workflow.WorkflowVersion + "]";
        }
        else {
            _TabName += _WorkflowDesigner_GlobalString.PortalPageManage_Design;
        }
        //更新标签页
        top.workTab.setHeader(top.workTab.getSelectedTabItemID(), _TabName);
    },
    UpdateClauseName: function (_ClauseName) {
        $.ajax({
            type: "post",
            url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
            cache: false,
            async: true,
            dataType: "json",
            data: {
                Command: "UpdateClauseName",
                WorkflowCode: workflow.WorkflowCode,
                ClauseName: _ClauseName
            },
            success: function (result) {
                if (result == "PortalSessionOut") {
                    WorkflowDocument.ShowLogin();
                    return;
                }

                //if (result.Result) {
                //    WorkflowDocument.ShowDealResult("保存成功");
                //}
                //else {
                //    var _Content = [{
                //        status: "error", text: "保存失败"
                //    }];

                //    if (result.Errors && result.Errors.length > 0) {
                //        _Content.push({
                //            status: "error", text: result.Errors[0]
                //        });
                //        WorkflowDocument.ShowDealResult(_Content);
                //    };
                //}
            },
            error: function (msg) {
                //WorkflowDocument.ShowAjaxErrors(msg, "保存失败");
            }
        });
    },

    GetWorkflowPostData: function (_Command, _ContainsWorkflow) {
        var _Data = { Command: _Command };
        if (!WorkflowDocumentStack.Workflow) {
            WorkflowDocumentStack.Workflow = {};
            WorkflowDocumentStack.Workflow.BizObjectSchemaCode = PackageManager.GetBizObjectSchemaCode();
        }

        var _Workflow = WorkflowDocumentStack.Workflow;
        //console.dir(_Workflow);
        if (_ContainsWorkflow) {
            $(WorkflowProperties["Workflow"]).each(function () {
                if (this && this.Properties) {
                    $(this.Properties).each(function () {
                        _Workflow[this] = workflow[this];
                    });
                }
            });

            var _Activities = [];
            //var _EndActivities = [];
            //var _FillSheetActivities = [];
            //var _ApproveActivities = [];
            //var _CirculateActivities = [];
            //var _NotifyActivities = [];
            //var _WaitActivities = [];
            //var _ConnectionActivities = [];
            //var _BizActionActivities = [];
            //var _SubInstanceActivities = [];
            //console.dir(workflow.activities);
            $(workflow.activities).each(function () {
                var thisActivity = this;
                var _activity = { ID: thisActivity.ID };
                $(WorkflowProperties[thisActivity.ToolTipText]).each(function () {
                    //console.dir(this.Properties);
                    $(this.Properties).each(function () {
                        //console.dir(thisActivity[this]);
                        _activity[this] = thisActivity[this];
                    });
                });

                _activity.ActivityType = this.ToolTipText;
                _activity.Width = parseInt(this.width);
                _activity.Height = parseInt(this.height);
                _activity.X = parseInt(this.width / 2 + this.left);
                _activity.Y = parseInt(this.height / 2 + this.top);
                _activity.FontSize = parseInt(this.FontSize);

                _Activities.push(_activity);



                ////允许的操作里的特殊属性
                //if (this.ToolTipText == "FillSheet" || this.ToolTipText == "Approve" || this.ToolTipText == "Circulate") {
                //    _activity["BatchProcessing"] = thisActivity["BatchProcessing"];
                //    _activity["EmailNotification"] = thisActivity["EmailNotification"];
                //    _activity["SMSApprove"] = thisActivity["SMSApprove"];
                //    _activity["MobileProcessing"] = thisActivity["MobileProcessing"];
                //}

                //switch (this.ToolTipText) {
                //    case "Start":
                //        _StartActivities.push(_activity);
                //        break;
                //    case "End":
                //        _EndActivities.push(_activity);
                //        break;
                //    case "FillSheet":
                //        _FillSheetActivities.push(_activity);
                //        break;
                //    case "Approve":
                //        _ApproveActivities.push(_activity);
                //        break;
                //    case "Circulate":
                //        _CirculateActivities.push(_activity);
                //        break;
                //    case "Notify":
                //        _NotifyActivities.push(_activity);
                //        break;
                //    case "Wait":
                //        _WaitActivities.push(_activity);
                //        break;
                //    case "Connection":
                //        _ConnectionActivities.push(_activity);
                //        break;
                //    case "BizAction":
                //        _BizActionActivities.push(_activity);
                //        break;
                //    case "SubInstance":
                //        _SubInstanceActivities.push(_activity);
                //        break;
                //}


            });
            //console.dir(_ApproveActivities);
            //路由
            _Workflow.Rules = [];
            $(workflow.lines).each(function () {
                var thisLine = this;
                var _line = { ID: thisLine.ID };
                if (thisLine.DisplayName && !isNaN(parseInt(thisLine.TextX)) && !isNaN(parseInt(thisLine.TextY))) {
                    _line.TextX = parseInt(thisLine.TextX);
                    _line.TextY = parseInt(thisLine.TextY);
                }
                if (thisLine.FixedPoint)
                    _line.FixedPoint = thisLine.FixedPoint;
                $(WorkflowProperties[thisLine.WorkflowElementType]).each(function () {
                    $(this.Properties).each(function () {
                        _line[this] = thisLine[this];
                    });
                });

                if (this.FontSize)
                    _line.FontSize = parseInt(this.FontSize);

                _line.PreActivityCode = this.startActivity.ActivityCode;
                _line.PostActivityCode = this.endActivity.ActivityCode;

                _line.Points = [];
                $(this.Points).each(function (pointIndex) {
                    _line.Points.push(this.x + "," + this.y);
                });

                _Workflow.Rules.push(_line);
            });

            ////移除头信息
            //delete _Workflow["Creator"];
            //delete _Workflow["ModifiedBy"];
            //delete _Workflow["CreatedTime"];
            //delete _Workflow["ModifiedTime"];
            _Workflow["Activities"] = _Activities;
            _Data.WorkflowTemplate = _Workflow;

            console.dir(_Data);
            //_Data.EndActivities = $.fn.htmlEscape(JSON.stringify(_EndActivities));
            //_Data.FillSheetActivities = $.fn.htmlEscape(JSON.stringify(_FillSheetActivities));
            //_Data.ApproveActivities = $.fn.htmlEscape(JSON.stringify(_ApproveActivities));
            //_Data.CirculateActivities = $.fn.htmlEscape(JSON.stringify(_CirculateActivities));
            //_Data.NotifyActivities = $.fn.htmlEscape(JSON.stringify(_NotifyActivities));
            //_Data.WaitActivities = $.fn.htmlEscape(JSON.stringify(_WaitActivities));
            //_Data.ConnectionActivities = $.fn.htmlEscape(JSON.stringify(_ConnectionActivities));
            //_Data.BizActionActivities = $.fn.htmlEscape(JSON.stringify(_BizActionActivities));
            //_Data.SubInstanceActivities = $.fn.htmlEscape(JSON.stringify(_SubInstanceActivities));
        }
        return _Data;
    },

    //部分检验:仅检验是否可以保存
    PartValidateWorkflow: function () {
        var _IdTable = {};
        var _ActivityCodeTable = {};
        var _ErrorList = [];

        $(workflow.activities).each(function () {
            //如果ID对应的对象已存在,那么将ID改为新ID
            if (_IdTable[this.ID]) {
                this.ID = workflow.getNewShapeID();
            }
            _IdTable[this.ID] = this;

            if (_ActivityCodeTable[this.ActivityCode]) {
                _ErrorList.push(_WorkflowDesigner_GlobalString.WorkflowDocument_ActivityCode + ":" + _ActivityCodeTable[this.ActivityCode].DisplayName + "," + this.DisplayName);
            }
            else
                _ActivityCodeTable[this.ActivityCode] = this;
        });

        $(workflow.lines).each(function () {
            //如果ID对应的对象已存在,那么将ID改为新ID
            if (_IdTable[this.ID]) {
                this.ID = workflow.getNewShapeID();
            }

            _IdTable[this.ID] = this;
        });

        if (_ErrorList && _ErrorList.length > 0) {
            WorkflowDocument.ShowErrorList(_ErrorList);
            return false;
        }

        return true;
    },

    //完整检验
    FullValidateWorkflow: function () {
        if (!WorkflowDocument.PartValidateWorkflow())
            return;

        WorkflowDocument.OnBeginAjax();
        //this.OnSave();
        $.ajax({
            type: "post",
            url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
            cache: false,
            async: true,
            dataType: "json",
            data: WorkflowDocument.GetWorkflowPostData("ValidateWorkflow", true),
            success: function (result) {
                if (result == "PortalSessionOut") {
                    WorkflowDocument.ShowLogin();
                    return;
                }

                var _Content = [];

                if (result.Result) {
                    _Content.push({ status: "success", text: _WorkflowDesigner_GlobalString.WorkflowDocument_TestSuccessful });
                }
                else {
                    _Content.push({ status: "error", text: _WorkflowDesigner_GlobalString.WorkflowDocument_TestFailed });
                }

                $(result.Errors).each(function (index) {
                    _Content.push({ status: "error", text: this });
                });
                $(result.Warnings).each(function (index) {
                    _Content.push({ status: "warn", text: this });
                });
                $.H3Dialog.AlertMultiMsg({ content: _Content });
            },
            error: function (msg) {
                WorkflowDocument.ShowAjaxErrors(msg, _WorkflowDesigner_GlobalString.WorkflowDocument_TestFailed);
            }
        });
        WorkflowDocument.OnEndAjax();
    },

    PublishWorkflow: function () {
        if (!WorkflowDocument.PartValidateWorkflow())
            return;

        $.ligerDialog.confirm(_WorkflowDesigner_GlobalString.WorkflowDocument_ConfirmRelease, function (result) {
            if (!result) {
                return;
            }
            WorkflowDocument.OnBeginAjax();
            WorkflowDocument.OnSave();
            $.ajax({
                type: "post",
                url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
                cache: false,
                async: true,
                dataType: "json",
                data: WorkflowDocument.GetWorkflowPostData("PublishWorkflow", true),
                success: function (result) {
                    if (result == "PortalSessionOut") {
                        WorkflowDocument.ShowLogin();
                        return;
                    }

                    var _Content = [];

                    if (result.Result) {
                        _Content.push({ status: "success", text: result.Message });
                    }
                    else {
                        _Content.push({ status: "error", text: _WorkflowDesigner_GlobalString.WorkflowDocument_FailedRelease });
                    }

                    $(result.Errors).each(function (index) {
                        _Content.push({ status: "error", text: this });
                    });
                    $(result.Warnings).each(function (index) {
                        _Content.push({ status: "warn", text: this });
                    });
                    $.H3Dialog.AlertMultiMsg({ content: _Content });
                },
                error: function (msg) {
                    WorkflowDocument.ShowAjaxErrors(msg, _WorkflowDesigner_GlobalString.WorkflowDocument_FailedRelease);
                }
            });
            WorkflowDocument.OnEndAjax();
        });
    },

    InitWorkflow: function (_WorkflowCode) {
        if (!_WorkflowCode) {
            return;
        }

        workflow.BizObjectSchemaCode = PackageManager.GetBizObjectSchemaCode();
        workflow.WorkflowCode = _WorkflowCode;
        //console.dir(workflow);
        //初始化四个活动节点
        var _Start = ActivityModelSettings.GetActivityModelByTypeName("Start");
        var _FillSheet = ActivityModelSettings.GetActivityModelByTypeName("FillSheet");
        var _Approve = ActivityModelSettings.GetActivityModelByTypeName("Approve");
        var _End = ActivityModelSettings.GetActivityModelByTypeName("End");
        if (_Start && _End && _FillSheet && _Approve) {
            workflow.addActivity($(_Start.htmlObject).clone().appendTo(workflow.workspace).css("left", 200).css("top", 70).show(), _Start).getPropertyFromModel();
            workflow.addActivity($(_FillSheet.htmlObject).clone().appendTo(workflow.workspace).css("left", 200).css("top", 170).show(), _FillSheet).getPropertyFromModel();
            //第一个环节参与者为发起人
            {
                workflow.activities[1].Participants = "{Originator}";
            }
            workflow.addActivity($(_Approve.htmlObject).clone().appendTo(workflow.workspace).css("left", 200).css("top", 270).show(), _Approve).getPropertyFromModel();
            workflow.addActivity($(_End.htmlObject).clone().appendTo(workflow.workspace).css("left", 200).css("top", 370).show(), _End).getPropertyFromModel();

            var _Line1 = new Line({
                ID: workflow.getNewShapeID(),
                //开始活动
                startActivity: workflow.activities[0],
                //起点
                startPoint: { x: workflow.activities[0].center, y: workflow.activities[0].bottom },
                //画线开始时的方向
                startDirection: LineArrowDirection.Down,
                //结束活动
                endActivity: workflow.activities[1],
                //结束方向
                endDirection: LineArrowDirection.Up,
                //结束点
                endPoint: { x: workflow.activities[1].center, y: workflow.activities[1].top }
            });
            _Line1.setPoints();
            _Line1.draw();
            workflow.lines.push(_Line1);

            var _Line2 = new Line({
                ID: workflow.getNewShapeID(),
                //开始活动
                startActivity: workflow.activities[1],
                //起点
                startPoint: { x: workflow.activities[1].center, y: workflow.activities[1].bottom },
                //画线开始时的方向
                startDirection: LineArrowDirection.Down,
                //结束活动
                endActivity: workflow.activities[2],
                //结束方向
                endDirection: LineArrowDirection.Up,
                //结束点
                endPoint: { x: workflow.activities[2].center, y: workflow.activities[2].top }
            });
            _Line2.setPoints();
            _Line2.draw();
            workflow.lines.push(_Line2);

            var _Line3 = new Line({
                ID: workflow.getNewShapeID(),
                //开始活动
                startActivity: workflow.activities[2],
                //起点
                startPoint: { x: workflow.activities[2].center, y: workflow.activities[2].bottom },
                //画线开始时的方向
                startDirection: LineArrowDirection.Down,
                //结束活动
                endActivity: workflow.activities[3],
                //结束方向
                endDirection: LineArrowDirection.Up,
                //结束点
                endPoint: { x: workflow.activities[3].center, y: workflow.activities[3].top }
            });
            _Line3.setPoints();
            _Line3.draw();
            workflow.lines.push(_Line3);

            $(workflow.lines).each(function () {
                this.SetFontColor();
                this.SetFontSize();
                this.SetLineStyle();
            });
        }
        workflow.autoFit();
    },

    //从服务器加载流程模板
    LoadWorkflowFromServer: function (_WorkflowCode) {
        if (!_WorkflowCode) {
            return;
        }

        workflow.WorkflowCode = _WorkflowCode;

        $.ajax({
            type: "post",
            url: WorkflowDocumentSettings.WorklfowHandlerAjaxUrl,
            cache: false,
            async: true,
            dataType: "json",
            data: {
                Command: "GetWorkflow",
                WorkflowCode: _WorkflowCode
            },
            success: function (result) {
                if (result == "PortalSessionOut") {
                    WorkflowDocument.ShowLogin();
                    return;
                }

                if (!result)
                    return;
                WorkflowDocumentStack.Workflow = result;
                WorkflowDocument.LoadWorkflow(result);
            },
            error: function (msg) {
                //alert(msg.responseText);
            }
        });
    },

    //_PlayAble:允许播放
    //_RemoveLeftSpace:移除左上侧空白
    LoadWorkflow: function (_Content, _PlayAble, _RemoveLeftTopSpace) {

        if (!_Content)
            return;

        // 左侧保留的最小空白宽度
        var _MinLeftSpace = 45;
        //上侧保留的最小空白宽度
        var _MinTopSpace = 45;

        //从后台获取的流程模板对象
        WorkflowDocumentStack.Workflow = {};
        $.extend(WorkflowDocumentStack.Workflow, WorkflowDocumentStack.Workflow, _Content);
        //时间类型不能读取后保存
        delete WorkflowDocumentStack.Workflow["ModifiedTime"];
        delete WorkflowDocumentStack.Workflow["CreatedTime"];
        //去除活动\线条
        delete WorkflowDocumentStack.Workflow["Activities"];
        delete WorkflowDocumentStack.Workflow["Rules"];
        delete WorkflowDocumentStack.Workflow["StartActivity"];

        //用于编辑的前台流程模板对象
        workflow.WorkflowCode = _Content.WorkflowCode;
        workflow.NewShapeID = _Content.CurrentNewShapeID;

        //获取流程图属性
        for (var _Property in _Content) {
            if (_Property != "Activities" && _Property != "Rules")
                workflow[_Property] = _Content[_Property];
        }

        var _LeftSpace = Number.POSITIVE_INFINITY;
        var _TopSpace = Number.POSITIVE_INFINITY;
        $(_Content.Activities).each(function () {
            _LeftSpace = Math.min(this.X - this.Width / 2, _LeftSpace);
            _TopSpace = Math.min(this.Y - this.Height / 2, _TopSpace);
        });
        $(_Content.Rules).each(function () {
            $(this.Points).each(function () {
                var x = parseInt(this.split(",")[0]);
                var y = parseInt(this.split(",")[1]);
                _LeftSpace = Math.min(x, _LeftSpace);
                _TopSpace = Math.min(y, _TopSpace);
            });
        });

        //移除左上空白
        if (_RemoveLeftTopSpace
            //兼容旧版本升级的流程,左上元素在边框外时
            || _LeftSpace < 0 || _TopSpace < 0) {
            //是否左移
            var moveLeft = _LeftSpace != Number.POSITIVE_INFINITY && (_LeftSpace > _MinLeftSpace || _LeftSpace < 0);
            //是否上移
            var moveTop = _TopSpace != Number.POSITIVE_INFINITY && (_TopSpace > _MinTopSpace || _TopSpace < 0);
            if (moveLeft || moveTop) {
                if (moveLeft) {
                    _LeftSpace -= _MinLeftSpace;
                }
                if (moveTop) {
                    _TopSpace -= _MinTopSpace;
                }
                $(_Content.Activities).each(function () {
                    if (moveLeft) {
                        this.X -= _LeftSpace;
                    }
                    if (moveTop) {
                        this.Y -= _TopSpace;
                    }
                });
                $(_Content.Rules).each(function () {
                    for (var i = 0; i < this.Points.length; i++) {
                        var x = parseInt(this.Points[i].split(",")[0]);
                        var y = parseInt(this.Points[i].split(",")[1]);
                        if (moveLeft) {
                            x -= _LeftSpace;
                        }
                        if (moveTop) {
                            y -= _TopSpace;
                        }
                        this.Points[i] = x + "," + y;
                    }
                });
            }
        }

        //绘制活动
        $(_Content.Activities).each(function () {
            //活动模板
            var modelHtml = ActivityModelSettings.GetActivityModelByType(this.ActivityType).htmlObject;

            //绘制图形
            var activity = workflow.addActivity($(modelHtml)
               .clone()
               .appendTo(workflow.workspace).show()
               .css("left", this.X - this.Width / 2)
               .css("top", this.Y - this.Height / 2), ActivityModelSettings.GetActivityModelByType(this.ActivityType), this.ObjectID);
            //高
            if (this.Height) {
                $(activity.htmlObject).outerHeight(this.Height < ActivitySettings.MinOuterHeight ? this.Height < ActivitySettings.MinOuterHeight : this.Height);
            }
            //宽
            if (this.Width)
                $(activity.htmlObject).outerWidth(this.Width);
            //文字
            activity.DisplayName = this.DisplayName;
            activity.SetText();
            //颜色
            activity.FontColor = this.FontColor
            activity.SetFontColor();
            //文字大小
            activity.FontSize = this.FontSize;
            activity.SetFontSize();

            //位置
            activity.savePosition();

            //获取属性
            $.extend(activity, activity, this);
        });

        var getDirection = function (_xOffset, _yOffset, _activity) {
            if (Math.abs(_xOffset - 0) <= 2) {
                return LineArrowDirection.Left;
            }
            else if (Math.abs(_yOffset - 0) <= 2)
                return LineArrowDirection.Up;
            else if (Math.abs(_xOffset - _activity.width) <= 2) {
                return LineArrowDirection.Right;
            }
            else
                return LineArrowDirection.Down;
        }
        //绘制线条
        $(_Content.Rules).each(function () {
            if (this.ID == "80") {
                console.log(80);
            }
            var _StartActivity = workflow.getActivityByCode(this.PreActivityCode);
            var _EndActivity = workflow.getActivityByCode(this.PostActivityCode);
            if (_StartActivity && _EndActivity) {
                var _StartPoint = {
                    x: parseInt(this.Points[0].split(",")[0]),
                    y: parseInt(this.Points[0].split(",")[1])
                };
                //第二点
                var _SecondPoint = {
                    x: parseInt(this.Points[1].split(",")[0]),
                    y: parseInt(this.Points[1].split(",")[1])
                }
                //倒数第二点
                var _PenultimatePoint = {
                    x: parseInt(this.Points[this.Points.length - 2].split(",")[0]),
                    y: parseInt(this.Points[this.Points.length - 2].split(",")[1])
                }
                var _EndPoint = {
                    x: parseInt(this.Points[this.Points.length - 1].split(",")[0]),
                    y: parseInt(this.Points[this.Points.length - 1].split(",")[1])
                }

                var _StartDirection = LineArrowDirection.Unspecified;
                var _EndDirection = LineArrowDirection.Unspecified;

                //用第二个点判断起始方向
                if (_SecondPoint.x > _StartActivity.left && _SecondPoint.x < _StartActivity.right) {
                    if (_SecondPoint.y < _StartActivity.top) {
                        _StartDirection = LineArrowDirection.Up;
                        _StartPoint.y = _StartActivity.top;
                    }
                    else {
                        _StartDirection = LineArrowDirection.Down;
                        _StartPoint.y = _StartActivity.bottom;
                    }
                }
                else if (_SecondPoint.y > _StartActivity.top && _SecondPoint.y < _StartActivity.bottom) {
                    if (_SecondPoint.x < _StartActivity.left) {
                        _StartDirection = LineArrowDirection.Left;
                        _StartPoint.x = _StartActivity.left;
                    }
                    else {
                        _StartDirection = LineArrowDirection.Right;
                        _StartPoint.x = _StartActivity.right;
                    }
                }
                else {
                    _StartDirection = getDirection(_StartPoint.x - _StartActivity.left, _StartPoint.y - _StartActivity.top, _StartActivity);
                }

                //用倒数第二个点判断结束方向
                if (_PenultimatePoint.x > _EndActivity.left && _PenultimatePoint.x < _EndActivity.right) {
                    if (_PenultimatePoint.y < _EndActivity.top) {
                        _EndDirection = LineArrowDirection.Up;
                        _EndPoint.y = _EndActivity.top;
                    }
                    else {
                        _EndDirection = LineArrowDirection.Down;
                        _EndPoint.y = _EndActivity.bottom;
                    }
                }
                else if (_PenultimatePoint.y > _EndActivity.top && _PenultimatePoint.y < _EndActivity.bottom) {
                    if (_PenultimatePoint.x < _EndActivity.left) {
                        _EndDirection = LineArrowDirection.Left;
                        _EndPoint.x = _EndActivity.left;
                    }
                    else {
                        _EndDirection = LineArrowDirection.Right;
                        _EndPoint.x = _EndActivity.right;
                    }
                }
                else {
                    _EndDirection = getDirection(_EndPoint.x - _EndActivity.left, _EndPoint.y - _EndActivity.top, _EndActivity);
                }

                var line = new Line({
                    ID: this.ObjectID,

                    startActivity: _StartActivity,
                    startPoint: _StartPoint,
                    startDirection: getDirection(_StartPoint.x - _StartActivity.left, _StartPoint.y - _StartActivity.top, _StartActivity),

                    endActivity: _EndActivity,
                    endPoint: _EndPoint,
                    endDirection: getDirection(_EndPoint.x - _EndActivity.left, _EndPoint.y - _EndActivity.top, _EndActivity)
                });

                line.Points = [];
                var _PointCount = this.Points.length;
                $(this.Points).each(function (index) {
                    if (index == 0) {
                        line.Points.push(_StartPoint);
                    }
                    else if (index == _PointCount - 1) {
                        line.Points.push(_EndPoint);
                    }
                    else if (index == 1) {
                        line.Points.push(_SecondPoint);
                    }
                    else if (index == _PointCount - 2) {
                        line.Points.push(_PenultimatePoint);
                    }
                    else {
                        line.Points.push({
                            x: parseInt(this.split(",")[0]),
                            y: parseInt(this.split(",")[1])
                        });
                    }
                });

                if (this.Points.length == 0)
                    this.setPoints();

                workflow.lines.push(line);

                //
                delete this["Points"];
                $.extend(line, line, this);
            }
        });

        //如果使用SVG,才计算交叉点
        if (workflow.UtilizeSvg) {
            $(workflow.lines).each(function () {
                this.calculateCrossPoints();
            });
        }
        $(workflow.lines).each(function () {
            this.draw(true);
            this.SetText();
            this.SetFontColor();
            this.SetFontSize();
            this.SetLineStyle();
        });

        workflow.autoFit();

        //计算下一个ID
        if (!workflow.NewShapeID)
            workflow.NewShapeID = 1;
        {
            $(workflow.activities).each(function () {
                if (!isNaN(this.ID) && this.ID >= workflow.NewShapeID) {
                    workflow.NewShapeID = this.ID + 1;
                }
            });

            $(workflow.lines).each(function () {
                if (!isNaN(this.ID) && this.ID >= workflow.NewShapeID) {
                    workflow.NewShapeID = this.ID + 1;
                }
            });
        }

        //显示流程状态
        if (typeof (InstanceContext) != "undefined" && InstanceContext) {
            //流程有异常
            var InstanceExceptional = false
            if (typeof (UnfixedExceptionLogs) != "undefined" && UnfixedExceptionLogs.length > 0) {
                InstanceExceptional = true;
            }

            for (var i = 0; i < workflow.activities.length; i++) {
                if (workflow.activities[i].ToolTipText == "Start") {
                    WorkflowPlayStack.StartActivityCode = workflow.activities[i].ActivityCode;
                    break;
                }
            }
            if (WorkflowPlayStack.StartActivityCode) {
                //插入开始Token
                InstanceContext.Tokens.splice(0, 0, {
                    Activity: WorkflowPlayStack.StartActivityCode,
                    CreatedTime: InstanceContext.CreatedTime,
                    FinishedTime: InstanceContext.CreatedTime,
                    State: TokenState.Finished,
                    TokenId: -1
                });
            }

            $(InstanceContext.Tokens).each(function () {
                //从WorkItems修正Token的StartTime、FinishTime、CancelTime、State
                if (typeof (WorkItems) != "undefined") {
                    var _thisToken = this;
                    this.WorkItems = $(WorkItems).filter(function () {
                        return this.TokenId == _thisToken.TokenId;
                    });
                    if (this.WorkItems.length > 0) {
                        //如果当前Token的状态是Running(0),判断是否有未完成的任务,若有,返回;若无,取最后一个FinishTime\CancelTime为Token的FinishTime\CancelTime,并修改State为Finished\Canceled
                        if (this.State == TokenState.Running) {
                            var _ExistUnfinished = false;
                            var _ExistFinished = false;
                            var _LastFinishTime = undefined;
                            var _LastCancelTime = undefined;
                            $(this.WorkItems).each(function () {
                                if (this.State == WorkItemState.Waiting || this.State == WorkItemState.Working) {
                                    _ExistUnfinished = true;
                                }
                                else if (this.State == WorkItemState.Finished) {
                                    _ExistFinished = true;
                                    if (!_LastFinishTime || _LastFinishTime < this.FinishTime)
                                        _LastFinishTime = this.FinishTime;
                                }
                                else if (this.State == WorkItemState.Canceled) {
                                    if (!_LastCancelTime || _LastCancelTime < this.CancelTime)
                                        _LastCancelTime = this.CancelTime;
                                }
                            });
                            //如果不存在未完成的
                            if (!_ExistUnfinished) {
                                //存在已完成的
                                if (_ExistFinished) {
                                    _thisToken.State = TokenState.Finished;
                                    _thisToken.FinishedTime = _LastFinishTime;
                                }
                                    //不存在已完成的
                                else {
                                    _thisToken.State = TokenState.Dropped;
                                    _thisToken.CanceledTime = _LastCancelTime;
                                }
                            }
                        }
                            //如果当前Token的状态是Dropped,取最后一个CancelTime为Token的CancelTime
                        else if (this.State == TokenState.Dropped) {
                            this.CanceledTime = undefined;
                            $(this.WorkItems).each(function () {
                                if (this.State == WorkItemState.Canceled && (!_thisToken.CanceledTime || _thisToken.CanceledTime < this.CancelTime)) {
                                    _thisToken.CanceledTime = this.CancelTime;
                                }
                            });
                        }
                    }
                }
            });

            $(workflow.activities).each(function () {
                var _thisActivity = this;

                var _ExistUnfinished = false;
                var _ExistFinished = false;
                var _Exceptional = false;

                //出现过异常
                if (typeof (ExceptionActivities) != "undefined" && $(ExceptionActivities).filter(function () {
                        return this.toString() == _thisActivity.ActivityCode
                }).length > 0) {
                    _Exceptional = true;
                    ExceptionActivityCode = _thisActivity.ActivityCode;
                }
                else {
                    $(InstanceContext.Tokens).each(function () {
                        if (this.Activity == _thisActivity.ActivityCode) {
                            //只有流程在进行中才显示进行中的任务
                            if (!InstanceExceptional && InstanceContext.State == InstanceState.Running && this.State == TokenState.Running)
                                _ExistUnfinished = true;
                                //已完成
                            else if (this.State == TokenState.Finished)
                                _ExistFinished = true;
                        }
                    });
                }
                //ERROR:异常已修复\未修复未显示
                //TODO: 异常已修复\未修复显示
                if (_Exceptional) {
                    $(this.htmlObject).addClass("ActivityException");
                }
                else if (_ExistUnfinished)
                    $(this.htmlObject).addClass("ActivityWorking").addClass("ActivityBreathe");
                else if (_ExistFinished)
                    $(this.htmlObject).addClass("ActivityFinished");

                if (_PlayAble && $("#btnReplay").length == 0 && $("#lblWorkflowTitle").length == 1) {
                    $("#lblWorkflowTitle").append('<span>[</span><a id="btnReplay" style="cursor: pointer;">' + _WorkflowDesigner_GlobalString.WorkflowDocument_Playback + '</a><span>]</span>');
                    var StartButton = $("#btnReplay");
                    StartButton.click(function (e) {
                        WorkflowDocument.Play();
                        e.stopPropagation();
                    });
                }

                if ($("#btnImage").length == 0 && window.applicationCache) {
                    setTimeout(function () { WorkflowDocument.SaveAsImage(); }, 3000);
                    $("#lblWorkflowTitle").append('<span>[</span><a id="btnImage" style="cursor: pointer;">' + _WorkflowDesigner_GlobalString.Button_SaveImage + '</a><span>]</span>');
                    var ImageButton = $("#btnImage");
                    ImageButton.click(function (e) {
                        WorkflowDocument.StopProp();
                        e.stopPropagation();
                    });
                }
            });
        }
    },

    StopProp: function () {
        //if (event.stopPropagation) {
        //    event.stopPropagation();
        //}
        //else {
        //    event.cancelBubble = true;
        //}
        $('#divImage').modal('show');
    },

    LoadFromXml: function (_xmlDoc) {
        if (!_xmlDoc)
            return WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_FormartValid);

        var parseXmlToWorkflow = function (_version) {
            _version = parseFloat(_version);

            //导入旧版本，需先加载资源
            if (!WorkflowDocumentStack.CompatibleTypeLoaded && !isNaN(_version) && _version <= 8.3) {
                WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_Specification);
                $.ajax({
                    url: "Resource/ActivityModels.xml",
                    cache: true,
                    dataType: "xml",
                    async: true,
                    success: function (activityModelDefineXml) {
                        if (activityModelDefineXml == "PortalSessionOut") {
                            WorkflowDocument.ShowLogin();
                            return;
                        }

                        //解析和初始化活动模板区域
                        $(activityModelDefineXml).find("ActivityModel").each(function () {
                            var _type = $(this).children("Type").text()
                            var _compatibleTypes = [];

                            $(this).find("CompatibleTypes>CompatibleType").each(function () {
                                _compatibleTypes.push($(this).text());
                            });

                            for (var modelIndex = 0; modelIndex < ActivityModelSettings.ActivityModels.length; modelIndex++) {
                                if (ActivityModelSettings.ActivityModels[modelIndex].Name == _type) {
                                    ActivityModelSettings.ActivityModels[modelIndex].compatibleTypes = _compatibleTypes;
                                }
                            }
                        });

                        WorkflowDocumentStack.CompatibleTypeLoaded = true;
                    },
                    error: function (msg) {
                        //加载模板兼容性说明文件失败

                    }
                });
            }

            //try 
            {
                WorkflowDocument.ClearWorkflowContent();

                //活动无版本区别
                if (true) {
                    //活动
                    var activity_model = $("." + ActivityModelStyleClassName.ActivityModel + ":first");

                    var getCurrentActivityModel = function (_compatibleType) {
                        for (var index = 0 ; index < ActivityModelSettings.ActivityModels.length; index++) {
                            for (var j = 0; j < ActivityModelSettings.ActivityModels[index].compatibleTypes.length; j++) {
                                if (ActivityModelSettings.ActivityModels[index].compatibleTypes[j] == _compatibleType) {
                                    typeFound = true;
                                    return ActivityModelSettings.ActivityModels[index];
                                }
                            }
                        }
                    }

                    $(_xmlDoc).find("Activities>Activity").each(function () {
                        var sourceType = $(this).children("ShapeType").text();
                        var activityModel = getCurrentActivityModel(sourceType);
                        var activityHtml = $(activityModel.htmlObject).clone();
                        var _width = parseFloat($(this).children("WIDTH").text());
                        if (_width < ActivitySettings.MinOuterWidth)
                            _width = ActivitySettings.MinOuterWidth;
                        var _height = parseFloat($(this).children("HEIGHT").text());
                        if (_height < ActivitySettings.MinOuterHeight)
                            _height = ActivitySettings.MinOuterHeight;

                        $(activityHtml).addClass(ActivityStyleClassName.Activity)
                             .appendTo(workflow.workspace)
                             .css("left", parseFloat($(this).children("X").text()) - _width / 2)
                             .css("top", parseFloat($(this).children("Y").text()) - _height / 2)
                             .outerWidth(_width)
                             .outerHeight(_height)
                             .find("." + ActivityStyleClassName.ActivityLabel + ":first").text($(this).children("Text").text());

                        workflow.addActivity(activityHtml, activityModel, workflow.getNewShapeID()).sourceId = $(this).children("ID").text();
                    });

                    //任何活动的左、上侧小于最小值，则对流程整体进行移动
                    var _offsetX = 0;
                    var _offsetY = 0;
                    $(workflow.activities).each(function () {
                        if (this.left + _offsetX < ActivityMovingStack.WorkflowContentEdgeLeft)
                            _offsetX = ActivityMovingStack.WorkflowContentEdgeLeft - this.left;
                        if (this.top + _offsetY < ActivityMovingStack.WorkflowContentEdgeTop)
                            _offsetY = ActivityMovingStack.WorkflowContentEdgeTop - this.top;
                    });

                    $(workflow.activities).each(function () {
                        $(this.htmlObject).move({
                            x: _offsetX,
                            y: _offsetY
                        });
                        this.savePosition();
                    });

                    workflow.autoFit();

                    var isOldVersion = (_version <= 8.3);

                    //线
                    $(_xmlDoc).find("Lines>Line").each(function () {
                        var _from = parseFloat($(this).children().filter(function () { return this.tagName == "From"; }).text());
                        var _to = parseFloat($(this).children().filter(function () { return this.tagName == "To"; }).text());

                        var _StartActivitySourceId = parseInt((_from - 20000) / 500);
                        var _StartActivity = $(workflow.activities).filter(function () { return this.sourceId == _StartActivitySourceId })[0];
                        var _StartPointCode = _from % 500;
                        var _StartDirection = LineArrowDirection.Unspecified;
                        var _StartPoint = { x: _StartActivity.left, y: _StartActivity.top }
                        //左边
                        if (_StartPointCode >= 0 && _StartPointCode <= 9) {
                            _StartDirection = LineArrowDirection.Left;
                            _StartPoint.y += _StartPointCode / 9 * _StartActivity.height;
                        }
                            //右边
                        else if (_StartPointCode >= 10 && _StartPointCode <= 19) {
                            _StartDirection = LineArrowDirection.Right;
                            _StartPoint.x = _StartActivity.right;
                            _StartPoint.y += (_StartPointCode - 9) / 9 * _StartActivity.height;
                        }
                            //上边
                        else if (_StartPointCode >= 20 && _StartPointCode <= 44) {
                            _StartDirection = LineArrowDirection.Up;
                            _StartPoint.x += (_StartPointCode - 20) / 24 * _StartActivity.width;
                        }
                            //下边
                        else if (_StartPointCode >= 45) {
                            _StartDirection = LineArrowDirection.Down;
                            _StartPoint.x += (_StartPointCode - 45) / 24 * _StartActivity.width;
                            _StartPoint.y = _StartActivity.bottom;
                        }
                        else
                            throw "From Invalid";

                        var _EndActivitySourceId = parseInt((_to - 20000) / 500);
                        var _EndActivity = $(workflow.activities).filter(function () { return this.sourceId == _EndActivitySourceId })[0];
                        var _EndPointCode = _to % 500;
                        var _EndDirection = LineArrowDirection.Unspecified;
                        var _EndPoint = { x: _EndActivity.left, y: _EndActivity.top }
                        //左边
                        if (_EndPointCode >= 0 && _EndPointCode <= 9) {
                            _EndDirection = LineArrowDirection.Left;
                            _EndPoint.y += _EndPointCode / 9 * _EndActivity.height;
                        }
                            //右边
                        else if (_EndPointCode >= 10 && _EndPointCode <= 19) {
                            _EndDirection = LineArrowDirection.Right;
                            _EndPoint.x = _EndActivity.right;
                            _EndPoint.y += (_EndPointCode - 9) / 9 * _EndActivity.height;
                        }
                            //上边
                        else if (_EndPointCode >= 20 && _EndPointCode <= 44) {
                            _EndDirection = LineArrowDirection.Up;
                            _EndPoint.x += (_EndPointCode - 20) / 24 * _EndActivity.width;
                        }
                            //下边
                        else if (_EndPointCode >= 45) {
                            _EndDirection = LineArrowDirection.Down;
                            _EndPoint.x += (_EndPointCode - 45) / 24 * _EndActivity.width;
                            _EndPoint.y = _EndActivity.bottom;
                        }
                        else
                            throw "To Invalid";

                        var line = new Line({
                            ID: workflow.getNewShapeID(),
                            startPoint: _StartPoint,
                            startDirection: _StartDirection,
                            startActivity: _StartActivity,

                            endPoint: _EndPoint,
                            endDirection: _EndDirection,
                            endActivity: _EndActivity
                        });
                        workflow.lines.push(line);

                        if (isOldVersion)
                            line.setPoints();
                            //新版本记录了折点信息
                        else {
                            line.setArrowTailPoint();
                            var pointXmls = $(this).find("Point");
                            if (pointXmls && pointXmls.length > 0) {
                                line.Points = [];
                                pointXmls.each(function (pointIndex) {
                                    var _point = {
                                        x: parseFloat($(this).text().split(",")[0]),
                                        y: parseFloat($(this).text().split(",")[1])
                                    };

                                    if (pointIndex == 0)
                                        line.startPoint = _point;
                                    else if (pointIndex == pointXmls.length - 1)
                                        line.endPoint = _point;

                                    line.Points.push(_point);
                                });
                                line.setArrowTailPoint();
                            }
                            else
                                line.setPoints();
                        }
                    });

                    $(workflow.lines).each(function () {
                        this.calculateCrossPoints();
                    });
                    $(workflow.lines).each(function () {
                        this.draw(true);
                    });
                }
                    //
                else {
                }
            }
            //catch (ex) {
            //    alert("文件读取错误，可能文件已损伤");
            //}
        }

        //判断版本
        var version;
        var strVersion = $(_xmlDoc).find("Workflow>Version").text();
        if (strVersion) {
            //得到版本号前两节，例如 8.3
            version = parseFloat(strVersion.match(/^[0-9]*.[0-9]*/));
            if (version && !isNaN(version)) {
                parseXmlToWorkflow(version);
            }
            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_ImportSuccessful);
        }
        //版本号不正确
        if (!version) {
            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_ImportFailed);
            return;
        }
        if (WorkflowDocumentStack.RevealDiv)
            WorkflowDocumentStack.RevealDiv.hide();
    },

    ImportWorkflow: function () {
        if (window.File && window.FileReader) {
            //初始化
            if (!WorkflowDocumentStack.ImportDiv) {
                WorkflowDocumentStack.ImportDiv = $("<div></div>").addClass(WorkflowDocumentStyleClassName.ImportDiv).appendTo(body);
                WorkflowDocumentStack.CancelImportButton = $('<input class="button_cancel" type="button" value="' + _WorkflowDesigner_GlobalString.Button_Cancel + '" />').appendTo(WorkflowDocumentStack.ImportDiv);

                WorkflowDocumentStack.CancelImportButton.click(function () {
                    WorkflowDocumentStack.ImportDiv.hide();
                    WorkflowDocumentStack.RevealDiv.hide();
                });
            }
            //显示上传框
            WorkflowDocumentStack.ImportDiv.show();

            //显示遮罩层
            if (!WorkflowDocumentStack.RevealDiv)
                WorkflowDocumentStack.RevealDiv = $("<div class='" + WorkflowDocumentStyleClassName.RevealDiv + "'></div>").appendTo(body);
            WorkflowDocumentStack.RevealDiv.show();

            WorkflowDocumentStack.ImportDiv.children("input[type=file]").remove();
            //显示上传框
            $("<input type='file' />")
                .insertBefore("." + WorkflowDocumentStyleClassName.CancelButton)
                .change(function (e) {
                    if (e.target.files && e.target.files.length > 0) {
                        var file = e.target.files[0];
                        //后缀名为.hbp
                        if (file.name && file.name.match(/.hbp$/)) {
                            var reader = new FileReader();

                            reader.onload = (function (theFile) {
                                return function (e) {
                                    var xmlDoc = $.parseXML(e.target.result);
                                    if (xmlDoc) {
                                        WorkflowDocument.LoadFromXml(xmlDoc);
                                    }
                                };
                            })(file);

                            // Read in the image file as a data URL.
                            reader.readAsText(file);
                        }
                        else
                            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_FileFormart + ".hbp");

                        $(e.target).remove();
                        WorkflowDocumentStack.RevealDiv.hide();
                        WorkflowDocumentStack.ImportDiv.hide();
                    }
                });
        }
        else
            //不可在Safari里使用
            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_Mssg);
    },

    ExportWorkflow: function () {
        if (workflow.WorkflowCode) {
            window.frames["ifrmExport"].location.assign("WorkflowExport.aspx?WorkflowCode=" + workflow.WorkflowCode);
            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_ExportSuccessful);
        }
        else
            WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_ExportFailed);
    },

    SaveAsImage: function () {
        var canvas = $("<canvas></canvas>");

        var _height = 0; var _width = 0;
        $(workflow.activities).each(function () {
            if (this.right > _width)
                _width = this.right;
            if (this.bottom > _height)
                _height = this.bottom;
        });
        $(workflow.lines).each(function () {
            $(this.Points).each(function () {
                if (this.x > _width)
                    _width = this.x;
                if (this.y > _height)
                    _height = this.y;
            });
        });
        _height += 100;
        _width += 100;
        canvas.attr("width", _width).attr("height", _height).css("width", _width + "px").css("height", _height + "px");
        var context = canvas[0].getContext('2d');

        var _WorkflowOffset = $(workflow.workspace).offset();
        $(workflow.lines).each(function (_lineIndex) {
            if (_lineIndex == 3 || _lineIndex == 7 || _lineIndex == 8) {
                console.log(this.Points);
            }

            var _pointCount = this.Points.length;
            for (var index = 0; index < this.Points.length; index++) {
                if (index == 0) {
                    context.beginPath();
                    context.moveTo(this.Points[index].x, this.Points[index].y);
                }
                else {
                    context.lineTo(this.Points[index].x, this.Points[index].y);
                    if (index >= _pointCount - 1) {
                        context.strokeStyle = LineSettings.LineColor;
                        context.stroke();
                        context.restore();

                        //箭头
                        context.beginPath();
                        context.moveTo(this.Points[index].x, this.Points[index].y);
                        switch (this.endDirection) {
                            case LineArrowDirection.Up:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowWidth, this.Points[index].y - LineSettings.ArrowLength);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowWidth, this.Points[index].y - LineSettings.ArrowLength);
                                break;
                            case LineArrowDirection.Down:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowWidth, this.Points[index].y + LineSettings.ArrowLength);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowWidth, this.Points[index].y + LineSettings.ArrowLength);
                                break;
                            case LineArrowDirection.Left:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowLength, this.Points[index].y - LineSettings.ArrowWidth);
                                context.lineTo(this.Points[index].x - LineSettings.ArrowLength, this.Points[index].y + LineSettings.ArrowWidth);
                                break;
                            case LineArrowDirection.Right:
                                context.lineTo(this.Points[index].x + LineSettings.ArrowLength, this.Points[index].y - LineSettings.ArrowWidth);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowLength, this.Points[index].y + LineSettings.ArrowWidth);
                                break;
                        }
                        context.lineTo(this.Points[index].x, this.Points[index].y);
                        context.closePath();
                        context.strokeStyle = LineSettings.ArrowFillColor;
                        context.stroke();
                        context.fillStyle = LineSettings.ArrowFillColor;
                        context.fill();
                        context.restore();
                    }
                }
            }

            //文字
            if (this.Label && $(this.Label).text()) {
                var _label = $(this.Label);
                context.font = _label.css("font-size") + " " + _label.css("font-family");
                context.fillStyle = _label.css("color");
                context.textAlign = "center";
                context.fillText(_label.text(), _label.offset().left - _WorkflowOffset.left + _label.outerWidth() / 2 + 2, _label.offset().top - _WorkflowOffset.top + _label.outerHeight() / 2 + 2, _label.outerWidth());
                context.restore();
            }
        });

        var _LogoPath = "..\\..\\WFRes\\_Content\\designer\\image\\activity_model\\";

        //活动总数
        var _ActivityCount = workflow.activities.length;
        //记录已加载的Logo数量
        var _LogoCount = 0
        $(workflow.activities).each(function () {
            context.clearRect(this.left + 1, this.top + 1, this.width - 2, this.height - 2);
            context.fillStyle = $(this.htmlObject).css("background-color");
            context.fillRect(this.left + 1, this.top + 1, this.width - 2, this.height - 2);
            context.rect(this.left, this.top, this.width, this.height);
            context.lineWidth = 1;
            context.stroke();
            context.restore();

            //文字
            var _label = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLabel);
            context.font = _label.css("font-size") + " " + _label.css("font-family");
            context.fillStyle = _label.css("color");
            context.textAlign = "center";
            context.fillText(_label.text(), _label.offset().left - _WorkflowOffset.left + _label.outerWidth() / 2 + 2, _label.offset().top - _WorkflowOffset.top + _label.outerHeight() / 2 + 2, _label.outerWidth());
            context.restore();

            //图标
            var _logoText = ActivityModelStyleClassName.LogoFontContent[this.ToolTipText];
            if (_logoText) {
                _logoText = String.fromCharCode(parseInt(_logoText, 16));
                var _logoDiv = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLogo);
                var _logoLeft = _logoDiv.offset().left - _WorkflowOffset.left;
                var _logoTop = _logoDiv.offset().top - _WorkflowOffset.top;
                context.font = _logoDiv.css("font-size") + " " + _logoDiv.css("font-family");
                context.fillStyle = _logoDiv.css("color");
                context.textAlign = "center";
                context.fillText(_logoText, _logoLeft + 2, _logoTop + _logoDiv.outerHeight(), _logoDiv.outerWidth());
                context.restore();
            }

            ////图标
            //var _logo = new Image();
            //_logo.src = _LogoPath + this.ToolTipText + ".png";
            //var _logoDiv = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLogo);
            //var _logoLeft = _logoDiv.offset().left - _WorkflowOffset.left;
            //var _logoTop = _logoDiv.offset().top - _WorkflowOffset.top;
            //_logo.onload = function () {
            //    _LogoCount++;
            //    context.drawImage(_logo, _logoLeft, _logoTop, _logoDiv.width(), _logoDiv.height());
            //    context.restore();
            //
            //    if (_LogoCount >= _ActivityCount) {
            //        $("#divImage img").attr("src", canvas[0].toDataURL("image/png").toString());
            //        $("#divImage img").parent().css("height", "100%").css("width", "100%").css("overflow", "auto");
            //
            //        $.ligerDialog.open({
            //            title: "查看图片",
            //            target: $("#divImage"),
            //            height: $("body").height(),
            //            width: $("body").width()
            //        });
            //    }
            //};
        });
        $("#divImage img").attr("src", canvas[0].toDataURL("image/png").toString());
        $("#divImage img").parent().css("height", "100%").css("width", "100%").css("overflow", "auto");

        if ($.ligerDialog)
            $.ligerDialog.open({
                title: _WorkflowDesigner_GlobalString.WorkflowDocument_ViewPicture,
                target: $("#divImage"),
                height: $("body").height(),
                width: $("body").width()
            });
    },

    ViewAsImage: function () {
        var canvas = $("<canvas></canvas>");

        var _height = 0; var _width = 0;

        //左边最小距离
        var _MinLeft = Number.POSITIVE_INFINITY;
        var _MinTop = Number.POSITIVE_INFINITY;
        $(workflow.activities).each(function () {
            if (this.right > _width)
                _width = this.right;
            if (this.bottom > _height)
                _height = this.bottom;

            if (this.left < _MinLeft) {
                _MinLeft = this.left;
            }
            if (this.top < _MinTop) {
                _MinTop = this.top;
            }
        });
        $(workflow.lines).each(function () {
            $(this.Points).each(function () {
                if (this.x > _width)
                    _width = this.x;
                if (this.y > _height)
                    _height = this.y;

                if (this.x < _MinLeft) {
                    _MinLeft = this.x;
                }
                if (this.y < _MinTop) {
                    _MinTop = this.y;
                }
            });
        });

        _width = _width + 10 - _MinLeft;
        _height = _height + 10 - _MinTop;

        var _L = 5 - _MinLeft;
        var _T = 5 - _MinTop;

        canvas.attr("width", _width).attr("height", _height).css("width", _width + "px").css("height", _height + "px");

        var context = canvas[0].getContext('2d');

        var _WorkflowOffset = $(workflow.workspace).offset();

        $(workflow.lines).each(function () {
            $(this.Points).each(function () {
                this.x = this.x + _L;
                this.y = this.y + _T;
            })
        })
        $(workflow.activities).each(function () {
            this.left += _L;
            this.top += _T;
        })

        $(workflow.lines).each(function (_lineIndex) {
            if (_lineIndex == 3 || _lineIndex == 7 || _lineIndex == 8) {
                console.log(this.Points);
            }

            var _pointCount = this.Points.length;
            for (var index = 0; index < this.Points.length; index++) {
                if (index == 0) {
                    context.beginPath();
                    context.moveTo(this.Points[index].x, this.Points[index].y);
                }
                else {
                    context.lineTo(this.Points[index].x, this.Points[index].y);
                    if (index >= _pointCount - 1) {
                        context.strokeStyle = LineSettings.LineColor;
                        context.stroke();
                        context.restore();

                        //箭头
                        context.beginPath();
                        context.moveTo(this.Points[index].x, this.Points[index].y);
                        switch (this.endDirection) {
                            case LineArrowDirection.Up:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowWidth, this.Points[index].y - LineSettings.ArrowLength);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowWidth, this.Points[index].y - LineSettings.ArrowLength);
                                break;
                            case LineArrowDirection.Down:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowWidth, this.Points[index].y + LineSettings.ArrowLength);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowWidth, this.Points[index].y + LineSettings.ArrowLength);
                                break;
                            case LineArrowDirection.Left:
                                context.lineTo(this.Points[index].x - LineSettings.ArrowLength, this.Points[index].y - LineSettings.ArrowWidth);
                                context.lineTo(this.Points[index].x - LineSettings.ArrowLength, this.Points[index].y + LineSettings.ArrowWidth);
                                break;
                            case LineArrowDirection.Right:
                                context.lineTo(this.Points[index].x + LineSettings.ArrowLength, this.Points[index].y - LineSettings.ArrowWidth);
                                context.lineTo(this.Points[index].x + LineSettings.ArrowLength, this.Points[index].y + LineSettings.ArrowWidth);
                                break;
                        }
                        context.lineTo(this.Points[index].x, this.Points[index].y);
                        context.closePath();
                        context.strokeStyle = LineSettings.ArrowFillColor;
                        context.stroke();
                        context.fillStyle = LineSettings.ArrowFillColor;
                        context.fill();
                        context.restore();
                    }
                }
            }

            //文字
            if (this.Label && $(this.Label).text()) {
                var _label = $(this.Label);
                context.font = _label.css("font-size") + " " + _label.css("font-family");
                context.fillStyle = _label.css("color");
                context.textAlign = "center";
                context.fillText(_label.text(), _label.offset().left - _WorkflowOffset.left + _label.outerWidth() / 2 + 2, _label.offset().top - _WorkflowOffset.top + _label.outerHeight() / 2 + 2, _label.outerWidth());
                context.restore();
            }
        });

        var _LogoPath = "..\\WFRes\\_Content\\designer\\image\\activity_model\\";

        //活动总数
        var _ActivityCount = workflow.activities.length;
        //记录已加载的Logo数量
        var _LogoCount = 0
        $(workflow.activities).each(function () {
            context.clearRect(this.left + 1, this.top + 1, this.width - 2, this.height - 2);
            context.rect(this.left, this.top, this.width, this.height);
            context.lineWidth = 1;
            context.stroke();
            context.restore();

            context.fillStyle = $(this.htmlObject).css("background-color");
            context.fillRect(this.left, this.top, this.width, this.height);
            context.restore();

            //文字
            var _label = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLabel);
            context.font = _label.css("font-size") + " " + _label.css("font-family");
            context.fillStyle = _label.css("color");
            context.textAlign = "center";
            context.fillText(_label.text(), _label.offset().left - _WorkflowOffset.left + _label.outerWidth() / 2 + 2 + _L, _label.offset().top - _WorkflowOffset.top + _label.outerHeight() / 2 + 2 + _T, _label.outerWidth());
            context.restore();

            //图标
            var _logoText = ActivityModelStyleClassName.LogoFontContent[this.ToolTipText];
            if (_logoText) {
                _logoText = String.fromCharCode(parseInt(_logoText, 16));
                var _logoDiv = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLogo);
                var _logoLeft = _logoDiv.offset().left - _WorkflowOffset.left;
                var _logoTop = _logoDiv.offset().top - _WorkflowOffset.top;
                context.font = _logoDiv.css("font-size") + " " + _logoDiv.css("font-family");
                context.fillStyle = _logoDiv.css("color");
                context.textAlign = "center";
                context.fillText(_logoText, _logoLeft + 2 + _L, _logoTop + _logoDiv.outerHeight() + _T, _logoDiv.outerWidth());
                context.restore();
            }
            ////图标
            //var _logo = new Image();
            //_logo.src = _LogoPath + this.ToolTipText + ".png";
            //var _logoDiv = $(this.htmlObject).find("." + ActivityStyleClassName.ActivityLogo);
            //var _logoLeft = _logoDiv.offset().left - _WorkflowOffset.left + _L;
            //var _logoTop = _logoDiv.offset().top - _WorkflowOffset.top + _T;
            //_logo.onload = function () {
            //    _LogoCount++;
            //    context.drawImage(_logo, _logoLeft, _logoTop, _logoDiv.width(), _logoDiv.height());
            //    context.restore();

            //    if (_LogoCount >= _ActivityCount) {
            //        var _WorkSpace = $(".workspace").empty();
            //        var _Img = $("<img>").attr("src", canvas[0].toDataURL("image/png").toString());
            //        _Img.appendTo(_WorkSpace);
            //    }
            //};
        });

        var _WorkSpace = $(".workspace").empty();
        var _Img = $("<img>").attr("src", canvas[0].toDataURL("image/png").toString());
        _Img.appendTo(_WorkSpace);
    },

    RefreshWorkflow: function () {
        WorkflowDocument.ClearWorkflowContent();
        WorkflowDocument.LoadWorkflow(workflow.WorkflowCode);
        WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_RefreshedSuccessful);
    },

    ClearWorkflowContent: function () {
        $(workflow.activities).each(function () {
            $(this.htmlObject).remove();
        });

        $(workflow.lines).each(function () {
            $(this.Path).remove();
            $(this.Arrow).remove();
            this.Unselect();
        });

        $("." + WorkflowStyleClassName.WorkflowAotuArrow).hide();
        workflow.activities = [];
        workflow.lines = [];
        workflow.selectedActivities = [];

        WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_Empty);
    },
    //启用行为
    EnableActions: function () {
        WorkflowDocumentStack.IsLocked = false;

        $("#ToolBar").show();
        //活动
        $(workflow.activities).each(function () {
            $(this.htmlObject).unbind(WorkflowDocumentSettings.LockEventNamespace);
            this.initActions();
        });

        //流程图
        $(workflow.workspace).unbind(WorkflowDocumentSettings.LockEventNamespace);
        workflow.initActions();

        //活动模板
        $(ActivityModelSettings.ActivityModels).each(function () {
            $(this.htmlObject).unbind(WorkflowDocumentSettings.LockEventNamespace);
            this.initActions();
        });
    },
    //禁止行为
    DisableActions: function () {
        WorkflowDocumentStack.IsLocked = true;

        var doLock = function (e) {
            e.preventDefault();
        };

        $("#ToolBar").hide();

        $(workflow.workspace).find("." + WorkflowStyleClassName.WorkflowAotuArrow).hide();

        //流程图
        $(workflow.workspace).unbind(WorkflowSettings.EventNameSpace)
            .unbind(WorkflowSettings.MultiSelectEventNameSpace)
            .bind("mousedown" + WorkflowDocumentSettings.LockEventNamespace, doLock);

        //活动
        $(workflow.activities).each(function () {
            this.Unselect();

            $(this.htmlObject).unbind(ActivitySettings.EventNameSpace)
                .unbind(ActivitySettings.ResizeEventNameSpace)
                .bind("mousedown" + WorkflowDocumentSettings.LockEventNamespace, doLock);;
        });

        $(workflow.lines).each(function () {
            this.Unselect();
        });

        //活动模板
        $(ActivityModelSettings.ActivityModels).each(function () {
            $(this.htmlObject).unbind(ActivityModelSettings.EventNameSpace)
                .bind("mousedown" + WorkflowDocumentSettings.LockEventNamespace, doLock);;
        });
    },

    InitStage: function () {
        WorkflowPlayStack.AllActions = [];
        $(InstanceContext.Tokens).each(function () {
            //添加激活动作
            if (this.State == TokenState.Running || this.State == TokenState.Finished || (this.State == TokenState.Dropped && this.CanceledTime)) {
                WorkflowPlayStack.AllActions.push(new PlayAction(this.CreatedTime, this.Activity, WorkflowPlaySettings.ActionType.Active, this.TokenId));

                if (this.State == TokenState.Finished)
                    WorkflowPlayStack.AllActions.push(new PlayAction(this.FinishedTime, this.Activity, WorkflowPlaySettings.ActionType.Finish, this.TokenId));
                else if (this.State == TokenState.Dropped)
                    WorkflowPlayStack.AllActions.push(new PlayAction(this.CanceledTime, this.Activity, WorkflowPlaySettings.ActionType.Cancel, this.TokenId));
            }
        });
        //播放动作排序
        WorkflowPlayStack.AllActions.sort(function (a, b) {
            if (a.ActionTime != b.ActionTime) {
                return parseFloat(a.ActionTime.match(/[0-9]+/)) > parseFloat(b.ActionTime.match(/[0-9]+/)) ? 1 : -1;
            }
            else if (a.TokenId != b.TokenId) {
                return a.TokenId > b.TokenId ? 1 : -1;
            }
            else if (a.ActionType != b.ActionType) {
                return b.ActionType == WorkflowPlaySettings.ActionType.Active ? 1 : -1;
            }
        });

        //如果流程异常,添加一帧
        if (ExceptionActivityCode)
            WorkflowPlayStack.AllActions.push(new PlayAction(null, ExceptionActivityCode, WorkflowPlaySettings.ActionType.Exception, null))

        //舞台模板
        $(".Stage,.Dancer").remove();
        var StageModel = $("<div></div>").addClass("Stage");
        var DancerModel = $("<div></div>").addClass("Dancer");
        //为每一个活动添加舞台帧和表演帧
        $(workflow.activities).each(function () {
            StageModel.clone().appendTo(this.htmlObject);
            DancerModel.clone().appendTo(this.htmlObject);
        });

        //切换到下一帧
        WorkflowPlaySettings.PlayNextFrame = function () {
            //摁下暂停
            if (WorkflowPlayStack.PlayFlag == WorkflowPlaySettings.PlayFlag.Pause) {
                return;
            }
                //继续播放
            else if (WorkflowPlayStack.PlayFlag == WorkflowPlaySettings.PlayFlag.Playing) {
                //如果从0帧开始播放
                if (WorkflowPlayStack.NextFrameIndex == 0) {
                    $(".Stage").removeAttr("style").css("background-color", WorkflowColor.Default);
                    $(".Dancer").removeAttr("style");
                }
                else if (WorkflowPlayStack.NextFrameIndex >= WorkflowPlayStack.AllActions.length) {
                    //结束播放
                    $(".ActivityWorking").addClass("ActivityBreathe");
                    $(".Stage,.Dancer").removeAttr("style").hide();
                    WorkflowPlayStack.NextFrameIndex = 0;
                    WorkflowPlayStack.PlayFlag = WorkflowPlaySettings.PlayFlag.End;
                    return;
                }
                if (typeof (WorkflowPlayStack.CurrentFrame) == "undefined" || WorkflowPlayStack.CurrentFrame) {
                    if (WorkflowPlayStack.NextFrameIndex != 0) {
                        $(WorkflowPlayStack.CurrentActions).each(function () {
                            this.SaveStage();
                        });
                    }
                    //当前时刻的动作集合
                    WorkflowPlayStack.CurrentActions = [];

                    //单个动作依次播放
                    WorkflowPlayStack.CurrentActions.push(WorkflowPlayStack.AllActions[WorkflowPlayStack.NextFrameIndex]);
                    WorkflowPlayStack.NextFrameIndex++;

                    $(WorkflowPlayStack.CurrentActions).each(function (index) {
                        if (index == 0)
                            WorkflowPlayStack.Controler = this;
                        this.Play();
                    });
                }
            }
        }

        //开始表演
        WorkflowPlaySettings.StartPlay = function () {
            $(".ActivityWorking").removeClass("ActivityBreathe");
            $(".Stage,.Dancer").show();

            WorkflowPlayStack.PlayFlag = WorkflowPlaySettings.PlayFlag.Playing;
            WorkflowPlaySettings.PlayNextFrame();
        }
        //暂停
        WorkflowPlaySettings.PausePlay = function () {
            WorkflowPlayStack.PlayFlag = WorkflowPlaySettings.PlayFlag.Pause;
        }
        //结束播放
        WorkflowPlaySettings.EndPlay = function () {
            WorkflowPlayStack.PlayFlag = WorkflowPlaySettings.PlayFlag.End;
            WorkflowPlayStack.NextFrameIndex = 0;
            $(".Stage,.Dancer").removeAttr("style").hide();
        }
    },

    Play: function () {
        if (typeof (InstanceContext) != "undefined" && InstanceContext) {
            //加载舞台
            if (!WorkflowDocument.StartPlay)
                WorkflowDocument.InitStage();

            WorkflowPlaySettings.StartPlay();
        }
    }
}

//播放动作
var PlayAction = function (_ActionTime, _ActivityCode, _ActionType, _TokenId) {
    //表演时间
    this.ActionTime = _ActionTime;
    //活动编码
    this.ActivityCode = _ActivityCode;
    //动作类型
    this.ActionType = _ActionType;
    //TokenId
    this.TokenId = _TokenId;
}
//播放
//_IsControler:判断是否在控制下一帧
PlayAction.prototype.Play = function () {
    var _Activity = workflow.getActivityByCode(this.ActivityCode);
    if (_Activity) {
        var _Dancer = $(_Activity.htmlObject).find(".Dancer");
        var _DancerStyles;
        switch (this.ActionType) {
            case WorkflowPlaySettings.ActionType.Active:
                //播放激活动作
                _Dancer.css("background-color", WorkflowColor.Working);
                _DancerStyles = { height: "100%" };
                break;
            case WorkflowPlaySettings.ActionType.Finish:
                //播放完成动作
                _Dancer.css("background-color", WorkflowColor.Finished);
                _DancerStyles = { height: "100%" };
                break;
            case WorkflowPlaySettings.ActionType.Cancel:
                _Dancer.css("background-color", WorkflowColor.Default);
                _DancerStyles = { height: "100%" };
                break;
            case WorkflowPlaySettings.ActionType.Exception:
                _Dancer.css("background-color", WorkflowColor.Exception);
                _DancerStyles = { height: "100%" };
                break;
        }
        if (_DancerStyles) {
            if (this == WorkflowPlayStack.Controler) {
                _Dancer.animate(_DancerStyles, undefined, undefined, function () {
                    //播放下一帧
                    WorkflowPlaySettings.PlayNextFrame();
                });
            }
            else {
                _Dancer.animate(_DancerStyles);
            }
        }
    }
}
//将舞者动作保存为舞台的状态,并初始化舞者
PlayAction.prototype.SaveStage = function () {
    var _Activity = workflow.getActivityByCode(this.ActivityCode);
    if (_Activity) {
        switch (this.ActionType) {
            case WorkflowPlaySettings.ActionType.Active:
                $(_Activity.htmlObject).find(".Stage").css("background-color", WorkflowColor.Working);
                break;
            case WorkflowPlaySettings.ActionType.Finish:
                $(_Activity.htmlObject).find(".Stage").css("background-color", WorkflowColor.Finished);
                break;
            case WorkflowPlaySettings.ActionType.Cancel:
                $(_Activity.htmlObject).find(".Stage").css("background-color", WorkflowColor.Default);
                break;
            case WorkflowPlaySettings.ActionType.Exception:
                $(_Activity.htmlObject).find(".Stage").css("background-color", WorkflowColor.Exception);
                break;
        }
        $(_Activity.htmlObject).find(".Dancer").removeAttr("style");
    }
}

var WorkflowPlaySettings = {
    StartPlay: undefined,
    PausePlay: undefined,
    EndPlay: undefined,
    PlayNextFrame: undefined,
    //播放标识
    PlayFlag: {
        //播放中
        Playing: 1,
        //暂停
        Pause: 2,
        //结束
        End: 3
    },
    //动作类型
    ActionType: {
        //激活
        Active: 1,
        //完成
        Finish: 2,
        //取消
        Cancel: 3,
        //异常
        Exception: 4
    }
}

var WorkflowPlayStack = {
    //开始活动编码
    StartActivityCode: undefined,

    //所有动作
    AllActions: [],
    StageModel: undefined,
    DancerModel: undefined,

    //播放标识
    PlayFlag: undefined,
    //当前控制帧
    Controler: undefined,
    //当前表演帧
    CurrentFrame: undefined,
    //下一帧索引
    NextFrameIndex: 0,
    //当前正在播放的多个动作
    CurrentActions: undefined
}

var ExceptionActivityCode = undefined;