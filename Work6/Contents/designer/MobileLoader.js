var workflow;
var svg;
var workflowMode

//获取本地化字符串
var _WorkflowDesigner_GlobalString = "";
var _WorkflowDesigner_params;

var MobileLoader = {
    ShowWorkflow: function () {
        workflowMode = WorkflowMode.MobileView;

        ActivityModelInit();

        if (typeof (WorkflowTemplate) != "undefined" && WorkflowTemplate) {
            if (!workflow) {
                workflow = new Workflow(".workspace", WorkflowTemplate.WorkflowCode);

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

                _WorkflowDesigner_params = "Activity_SaveSuccess,Activity_SaveFailed,ActivityEvent_Set,ContextMenu_Attribute,ContextMenu_SetTemplate,"
                + "DataItem_ChooseDataItem,DataItem_Confirm,Formula_FunctionName,Formula_NoClosed,Formula_TestFailed,"
                + "FormulaEditable_EditFormul,Package_Failed,Package_Mssg,Porperty_LeftKey,Porperty_Activity,Porperty_WokflowTempalte,"
                + "Porperty_Line,Porperty_Attribute,Porperty_More,Poeperty_One,Workflow_StratNode,Workflow_EndNode,Workflow_Estimate,"
                + "WorkflowDocument_Internal,WorkflowDocument_WorkflowName,WorkflowDocument_ActivityCode,WorkflowDocument_TestSuccessful,"
                + "WorkflowDocument_TestFailed,WorkflowDocument_ConfirmRelease,WorkflowDocument_FailedRelease,WorkflowDocument_Playback,"
                + "WorkflowDocument_FormartValid,WorkflowDocument_Specification,WorkflowDocument_ImportSuccessful,WorkflowDocument_ImportFailed,"
                + "WorkflowDocument_FileFormart,WorkflowDocument_Mssg,WorkflowDocument_ExportSuccessful,WorkflowDocument_ExportFailed,"
                + "WorkflowDocument_ViewPicture,WorkflowDocument_RefreshedSuccessful,WorkflowDocument_Empty,WorkflowTrace_AddActivity,"
                + "WorkflowTrace_AddLine,WorkflowTrace_ChangeText,WorkflowTrace_ChangeTextSize,WorkflowTrace_ChangeTextColor,"
                + "WorkflowTrace_ChangeLineText,WorkflowTrace_ChangeLineTextSize,WorkflowTrace_ChangeLineTextColor,WorkflowTrace_AdjustLine,"
                + "WorkflowTrace_RemoveActivity,WorkflowTrace_RemoveLine,WorkflowTrace_ChangeActivitySize,WorkflowTrace_MoveActivity,"
                + "WorkflowTrace_MoveActivityMulti,WorkflowTrace_ActivitySize,WorkflowTrace_ActivityColor,Button_Remove,Button_Cancel,"
                + "Description,Msg_SaveSuccess,Msg_SaveFailed,WorkflowVersion,PortalPageManage_Design,Button_Heigth,Button_Width,"
                + "Button_Size,Button_Vertical,Button_Horizontal";
                var url = _PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx";
                $.get(url, { "Code": _WorkflowDesigner_params }, function (data) {
                    if (data.IsSuccess) {
                        _WorkflowDesigner_GlobalString = data.TextObj;
                        $(workflow.workspace).prepend(svg);
                        WorkflowDocument.LoadWorkflow(WorkflowTemplate, false, true);

                        var zoomMin = $(workflow.outerContainer).width() / $(workflow.workspace).outerWidth();
                        if (zoomMin > 1) {
                            zoomMin = 1;
                        }
                        window.workflowScroll = new IScroll($(workflow.outerContainer).get(0),
                                {
                                    zoom: true,
                                    zoomMin: zoomMin,
                                    zoomMax: 1,
                                    scrollX: true,
                                    scrollY: false
                                });
                        window.workflowScroll.on("refresh", function () {
                            $(workflow.outerContainer).height(window.workflowScroll.scale * $(workflow.workspace).outerHeight());
                            if (window.instanceScroll) {
                                window.instanceScroll.refresh();
                            }
                        })
                        window.workflowScroll.zoom(zoomMin);

                        window.instanceScroll = new IScroll("#divInstanceState",
                                {
                                    scrollX: false,
                                    scrollY: true
                                });

                        setTimeout(function () {
                            window.instanceScroll.refresh();
                        }, 200)
                    }
                }, "json");

                //WorkflowDocument.ViewAsImage();
            }
        }
    }
}