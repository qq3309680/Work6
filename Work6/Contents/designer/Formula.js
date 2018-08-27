/// <reference path="../jquery/jquery.min.js" />
/// "+-*/()<> !&|".match(/[+\-/*/()<>\s!&|]+/)
/// 输入 #a01214
/// 函数 #0001F4

//var _Formula_GlobalString = {
//    "Description": "描述",
//    "Formula_FunctionName": "函数名称:",
//    "Formula_NoClosed": "存在未关闭的",
//    "Formula_TestFailed": "检验失败",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "Description,Formula_FunctionName,Formula_NoClosed,Formula_TestFailed" }, function (data) {
//    if (data.IsSuccess) {
//        _Formula_GlobalString = data.TextObj;
//    }
//}, "json");


DocumentRange = {
    //禁用Enter键自动
    ForbidIntelligentWhenEnter: false,
    getSelection: function () {
        if (window.getSelection)
            return window.getSelection();
        return document.getSelection();
    },
    getRange: function (_Selection) {
        _Selection = _Selection || DocumentRange.getSelection();
        try {
            if (_Selection.getRangeAt)
                return _Selection.getRangeAt(0);
            else {
                var _Range = document.createRange();
                _Range.setStart(_Selection.anchorNode, _Selection.anchorOffset);
                _Range.setEnd(_Selection.focusNode, _Selection.focusOffset);
                return _Range;
            }
        }
        catch (e) {
            FormulaStack.CatchErrorOnRange = true;
        }
    }
}

ExecutionTypes = {
    Function: "function",
    User: "user",
    Input: "input",
    Varible: "varible"
}

FormulaSettings = {
    FormulaHandlerAjaxUrl: "../Ajax/FormulaHandler.ashx",

    //用户表达式属性名称
    ExpressionAttrName: "expression",
    //公式类型属性名称
    ExecutionTypeName: "ExecutionType",

    //是否编辑器
    IsEditor: function (_Seletor) {
        return $(_Seletor).hasClass(FormulaStyleClassName.Editor);
    },

    //是否函数名
    IsFunctionName: function (_Text) {
        if (typeof (MathFunctions) != undefined && MathFunctions) {
            for (var i = 0 ; i < MathFunctions.length; i++) {
                if (MathFunctions[i].FunctionName == _Text)
                    return true;
            }
        }
        if (typeof (ParticipantFunctions) != undefined && ParticipantFunctions) {
            for (var i = 0 ; i < ParticipantFunctions.length; i++) {
                if (ParticipantFunctions[i].FunctionName == _Text)
                    return true;
            }
        }
        return false;
    },

    //删除前面的元素
    deleteBefore: function (_Node) {
        if (!FormulaSettings.IsEditor(_Node)) {
            var parentNode = $(_Node).parent()[0];
            for (; ;) {
                if (parentNode.childNodes[0] != _Node) {
                    $(parentNode.childNodes[0]).remove();
                }
                else {
                    break;
                }
            }
            //删除上级前面的元素
            FormulaSettings.deleteBefore(parentNode);
        }
    },

    //删除后面的元素
    deleteBehind: function (_Node) {
        if (_Node && !FormulaSettings.IsEditor(_Node)) {
            var parentNode = _Node.parentNode;
            if (!parentNode) {
                return;
            }
            for (var i = parentNode.childNodes.length - 1; i >= 0 ; i--) {
                if (parentNode.childNodes[i] != _Node) {
                    $(parentNode.childNodes[i]).remove();
                }
                else {
                    break;
                }
            }
            //删除上级后面的元素
            FormulaSettings.deleteBehind(parentNode);
        }
    },

    //获取直属于Editor的节点
    getEditorChildNode: function (_CurrentNode) {
        if (_CurrentNode) {
            //获取直属于Editor的节点
            if (FormulaSettings.IsEditor(_CurrentNode.parentNode)) {
                return _CurrentNode;
            }
            return FormulaSettings.getEditorChildNode(_CurrentNode.parentNode);
        }
    },

    Intelligent: function (_TextElement, _CursorOffset) {
        var _FormulaType = $(_TextElement).parent().attr(FormulaSettings.ExecutionTypeName);
        if (_FormulaType == ExecutionTypes.User || _FormulaType == ExecutionTypes.Input) {
            return;
        }

        //隐藏感知框
        FormulaSettings.HideIntelligent();

        FormulaStack.IntelligentString = FormulaStack.IntelligentString || "";

        //用于智能感知的片段
        //隐藏所有项
        FormulaStack.IntelligentList.find("li").hide();
        FormulaStack.IntelligentList.find("li." + FormulaStyleClassName.ItemSelected).removeClass(FormulaStyleClassName.ItemSelected);

        //显示相关项
        var _IsFirst = true;
        var _MostSuitableFound = false;
        var _VisibleItems
        //感知字符是空格,显示全部
        if (FormulaStack.IntelligentString
            && FormulaStack.IntelligentString.length > 0
            && FormulaStack.IntelligentString.substring(FormulaStack.IntelligentString.length - 1, FormulaStack.IntelligentString.length).trim() == "") {
            _VisibleItems = FormulaStack.IntelligentList.find("li");

            //默认选中第一项
            FormulaStack.IntelligentList.find("li." + FormulaStyleClassName.ItemSelected).removeClass(FormulaStyleClassName.ItemSelected);
            FormulaStack.IntelligentList.find("li:first").addClass(FormulaStyleClassName.ItemSelected);

            //更新感知字符串为""
            FormulaStack.IntelligentString = "";

            _VisibleItems.show();
        }
        else _VisibleItems = FormulaStack.IntelligentList.find("li").filter(function () {
            var _IntelligentKeyWord = $(this).attr("IntelligentKeyWord");
            if (_IntelligentKeyWord && _IntelligentKeyWord.toLowerCase().indexOf(FormulaStack.IntelligentString.toLowerCase()) > -1) {
                //默认选中首项
                if (_IsFirst) {
                    _IsFirst = false;
                    $(this).addClass(FormulaStyleClassName.ItemSelected);
                }

                //寻找最优项
                if (!_MostSuitableFound && _IntelligentKeyWord.toLowerCase().indexOf(FormulaStack.IntelligentString.toLowerCase()) == 0) {
                    FormulaStack.IntelligentList.find("li." + FormulaStyleClassName.ItemSelected).removeClass(FormulaStyleClassName.ItemSelected);
                    $(this).addClass(FormulaStyleClassName.ItemSelected);
                    _MostSuitableFound = true;
                }
                $(this).show();
                return true;
            }
        });

        if (!_VisibleItems || _VisibleItems.length == 0)
            return;

        //定位感知框
        var _Range = document.createRange();
        _Range.setStart(_TextElement, _CursorOffset);
        _Range.setEnd(_TextElement, _CursorOffset);

        var _FocusFlag = document.createElement("input");
        $(_FocusFlag).css("type", "text").css("width", "1px");
        _Range.insertNode(_FocusFlag);

        FormulaSettings.ShowIntelligent(
                $(_FocusFlag).position().left + 2,
                $(_FocusFlag).position().top + $(_FocusFlag).outerHeight());

        $(_FocusFlag).remove();

        //FormulaSettings.FocusRange(_Range);

        FormulaSettings.LiSelected();
    },

    //显示智能感知
    ShowIntelligent: function (_X, _Y) {
        _X = _X - FormulaStack.Editor.scrollLeft();
        _Y = _Y - FormulaStack.Editor.scrollTop();

        FormulaStack.Container.css("left", _X).css("top", _Y).show();
        if (FormulaStack.Container.offset().left + FormulaStack.Container.outerWidth() > $(FormulaStack.Editor).parent().offset().left + $(FormulaStack.Editor).parent().outerWidth()) {
            FormulaStack.Container.css("left", FormulaStack.Container.position().left - FormulaStack.Container.outerWidth());
        }

        //显示描述
        FormulaSettings.ShowDescription();
    },

    //隐藏感知框
    HideIntelligent: function () {
        FormulaStack.Container.hide();
        FormulaStack.Description.hide();
    },

    //显示智能感知描述
    ShowDescription: function () {
        var _SelectedLi = $("." + FormulaStyleClassName.ItemSelected);
        if (_SelectedLi && _SelectedLi.length > 0) {
            //只显示参与者函数描述
            if (_SelectedLi.hasClass(FormulaStyleClassName.ParticipantFunctionItem)) {
                var _FunctionName = _SelectedLi.text();
                if (typeof (ParticipantFunctions) != "undefined" && ParticipantFunctions.length > 0) {
                    for (var i = 0; i < ParticipantFunctions.length ; i++) {
                        if (ParticipantFunctions[i].FunctionName == _FunctionName && ParticipantFunctions[i].Helper) {
                            FormulaStack.Description.text(_Formula_GlobalString.Description + ":" + (ParticipantFunctions[i].Helper.Description ? ParticipantFunctions[i].Helper.Description : ""))
                                .css("left", FormulaStack.Container.position().left + FormulaStack.Container.outerWidth() + "px")
                                .css("top", FormulaStack.Container.position().top + _SelectedLi.offset().top - FormulaStack.Container.offset().top)
                                .show();
                        }
                    }
                }
            }
            else if (typeof (LogicTypes) != typeof (undefined) && _SelectedLi.attr("LogicType")) {
                // 数据项,显示字段类型
                FormulaStack.Description.text(_SelectedLi.text() + ":" + LogicTypes[_SelectedLi.attr("LogicType")].DisplayName)
                    .css("left", FormulaStack.Container.position().left + FormulaStack.Container.outerWidth() + "px")
                            .css("top", FormulaStack.Container.position().top + _SelectedLi.offset().top - FormulaStack.Container.offset().top)
                            .show();
            }
            else {
                //FormulaStack.Description.hide();
                //其他内容,显示全文本即可
                FormulaStack.Description.text(_SelectedLi.text())
                            .css("left", FormulaStack.Container.position().left + FormulaStack.Container.outerWidth() + "px")
                            .css("top", FormulaStack.Container.position().top + _SelectedLi.offset().top - FormulaStack.Container.offset().top)
                            .show();
            }
        }

        if (FormulaStack.Description.offset().left + FormulaStack.Description.outerWidth() > $(FormulaStack.Editor).parent().offset().left + $(FormulaStack.Editor).parent().outerWidth()) {
            FormulaStack.Description.css("left", FormulaStack.Container.position().left - FormulaStack.Description.outerWidth());
            //变换位置后宽度会变,重调一次
            FormulaStack.Description.css("left", FormulaStack.Container.position().left - FormulaStack.Description.outerWidth());
        }
    },

    //显示参数描述
    ShowArgDescription: function (_FunctionName, _ArgIndex) {
        if (_FunctionName && !isNaN(_ArgIndex)) {
            FormulaStack.ArgDescription.children().remove();
            FormulaStack.ArgDescription.append($("<p>Function Name:" + _FunctionName + "</p>"));
            FormulaStack.ArgDescription.append($("<p>Function Args 1:Some Text About Args 1...</p>"));
            var _Range = DocumentRange.getRange();

            var _TmpInput = document.createElement("input");
            $(_TmpInput).width("1px");
            _Range.insertNode(_TmpInput);
            FormulaStack.ArgDescription
                .css("left", $(_TmpInput).position().left + "px")
                .css("top", $(_TmpInput).position().top + $(_TmpInput).outerHeight() + 10 + "px")
                .show();
            $(_TmpInput).remove();
        }
        else
            FormulaStack.ArgDescription.hide();
    },

    //隐藏参数描述
    HideArgDescription: function () {
        FormulaStack.ArgDescription.hide();
    },

    //聚焦到元素后
    FocusAfter: function (_Element) {
        var _Range = document.createRange();
        _Range.setStartAfter(_Element);
        _Range.setEndAfter(_Element);

        FormulaSettings.FocusRange(_Range);

        //FormulaStack.Editor.focus();
    },

    //聚焦到选择区
    FocusRange: function (_Range) {
        var _Selection = DocumentRange.getSelection();
        try {
            _Selection.removeAllRanges();
            _Selection.addRange(_Range);
            FormulaStack.Range = _Range;
        }
        catch (ex) {
            FormulaStack.Range = _Selection.getRangeAt(0);
            FormulaStack.Range.setStart(_Range.startContainer, _Range.startOffset);
            FormulaStack.Range.setEnd(_Range.endContainer, _Range.endOffset);
        }
    },

    BeforeInsert: function () {
        if (!FormulaStack.Range.collapsed) {
            FormulaStack.Range.deleteContents();
            FormulaStack.Editor.focus();
        }
    },
    GetInsertLink: function (_Context) {
        if (_Context && _Context.PrevText && _Context.PrevText.trim()
            && (_Context.PrevText.trim().split("").reverse()[0] == "}" || _Context.PrevText.trim().split("").reverse()[0] == ")")) {
            return "+";
        }
        return "";
    },
    //插入输入常量
    InsertInput: function () {
        FormulaSettings.BeforeInsert();

        var _Context = FormulaSettings.GetContext(FormulaStack.Range.endContainer, FormulaStack.Range.endOffset);
        FormulaSettings.ResetAll(false, _Context.PrevText + "\"", "\"" + _Context.NextText, true, true);
    },
    //插入块
    InsertBlock: function (_BlockText, _IsIntelligent) {
        FormulaSettings.BeforeInsert();

        var _Context = FormulaSettings.GetContext(FormulaStack.Range.endContainer, FormulaStack.Range.endOffset, _IsIntelligent);
        FormulaSettings.ResetAll(false, _Context.PrevText + _BlockText, _Context.NextText, true, true);
    },
    //插入变量
    InsertVariable: function (_VariableName, _IsIntelligent) {
        FormulaSettings.BeforeInsert();

        var _Context = FormulaSettings.GetContext(FormulaStack.Range.endContainer, FormulaStack.Range.endOffset, _IsIntelligent);
        if (_Context.NextText && _Context.NextText.indexOf("}") == 0) {
            _Context.NextText = _Context.NextText.replace("}", "");
        }
        FormulaSettings.ResetAll(false, _Context.PrevText + FormulaSettings.GetInsertLink(_Context) + "{" + _VariableName + "}", _Context.NextText, true, true);
    },
    //插入用户
    //_UserFlag:用户标识(Code或ID)
    InsertUser: function (_UserName, _UserFlag) {
        if (_UserFlag) {
            //添加到缓存
            FormulaStack.UnitCache[_UserFlag.toLowerCase()] = _UserName;
        }

        FormulaSettings.BeforeInsert();

        var _Context = FormulaSettings.GetContext(FormulaStack.Range.endContainer, FormulaStack.Range.endOffset);
        //FormulaSettings.ResetAll(false, _Context.PrevText + "U(" + _UserFlag + ");", _Context.NextText, true, true);
        FormulaSettings.ResetAll(false, _Context.PrevText + FormulaSettings.GetInsertLink(_Context) + "U(" + _UserFlag + ") ", _Context.NextText, true, true);
    },
    //插入函数
    //在感知中
    InsertFunction: function (_FunctionName, _IsIntelligent) {
        FormulaSettings.BeforeInsert();

        var _Context = FormulaSettings.GetContext(FormulaStack.Range.startContainer, FormulaStack.Range.startOffset, _IsIntelligent);

        FormulaSettings.ResetAll(false, _Context.PrevText + FormulaSettings.GetInsertLink(_Context) + _FunctionName + "(", ")" + _Context.NextText, true, true);

        //显示函数帮助
        FormulaSettings.ShowFunctionHelper(_FunctionName, 0);
    },
    //获取数据类型数组的字符串
    GetLogicTypesString: function (_LogicTypes) {
        if (typeof (LogicTypes) != "undefined" && _LogicTypes && _LogicTypes.length > 0) {
            var LogicTypesString = "";
            $(_LogicTypes).each(function (index) {
                if (LogicTypes[this]) {
                    LogicTypesString += LogicTypes[this].Name + ";"
                }
            });

            return LogicTypesString;
        }
        else
            return _LogicTypes + "";
    },
    //显示函数帮助
    ShowFunctionHelper: function (_FunctionName, _ParamIndex) {
        _ParamIndex = _ParamIndex || 0;
        $("." + FormulaStyleClassName.HelperName).text(_Formula_GlobalString.Formula_FunctionName + _FunctionName);

        var _ClearParameters = function () {
            $("." + FormulaStyleClassName.HelperParameters).find("tr").each(function () {
                if ($(this).find("td").length > 0)
                    $(this).remove();
            });
        }

        //限制参数的显示列表
        var _RestrictIntelligent = function (_Parameter) {
            //过滤掉返回类型不一样的函数
            var _SelectedIndexChanged = false;
            FormulaStack.IntelligentList.find("li:visible").each(function () {
                var _LogicTypeAttr = $(this).attr("LogicType");
                if (_LogicTypeAttr) {
                    var _LogicTypes = _LogicTypeAttr.split(",");
                    if (_Parameter && _Parameter.LogicTypes) {
                        var _match = false;
                        for (var i = 0; i < _Parameter.LogicTypes.length; i++) {
                            if ($.inArray(_Parameter.LogicTypes[i].toString(), _LogicTypes) > -1) {
                                _match = true;
                                break;
                            }
                        }
                        if (!_match) {
                            $(this).hide();
                            if ($(this).hasClass(FormulaStyleClassName.ItemSelected)) {
                                $(this).removeClass(FormulaStyleClassName.ItemSelected);
                                _SelectedIndexChanged = true;
                            }
                        }
                    }
                }
            });
            if (_SelectedIndexChanged) {
                var visibleLi = FormulaStack.IntelligentList.find("li:visible:first");
                if (visibleLi.length == 1) {

                    visibleLi.addClass(FormulaStyleClassName.ItemSelected);

                    FormulaSettings.LiSelected();
                    FormulaSettings.ShowDescription();
                }
                else {
                    FormulaSettings.HideIntelligent();
                }
            }
        }

        var _RowParameter = $("<tr><td></td><td></td><td></td><td></td></tr>");
        //当前参数
        var _CurrentParameter = undefined;
        for (var index = 0; index < MathFunctions.length; index++) {
            if (MathFunctions[index].FunctionName == _FunctionName) {
                var _Helper = MathFunctions[index].Helper;

                $("." + FormulaStyleClassName.HelperName).text(_FunctionName);
                _ClearParameters();

                if (_Helper) {
                    $("." + FormulaStyleClassName.HelperDescription).text(_Helper.Description);
                    $("." + FormulaStyleClassName.HelperExample).text(_Helper.Example);
                    //当前参数
                    _CurrentParameter = _Helper.Parameters[_ParamIndex];
                    $(_Helper.Parameters).each(function (_ParameterIndex) {
                        var _CurrentRowParameter = _RowParameter.clone();
                        if (_ParameterIndex == _ParamIndex) {
                            _CurrentRowParameter.css("font-weight", "bold").css("color", "blue");
                        }
                        _CurrentRowParameter.find("td:eq(0)").text(_ParameterIndex + 1);
                        _CurrentRowParameter.find("td:eq(1)").text(this.Name);
                        _CurrentRowParameter.find("td:eq(2)").text(FormulaSettings.GetLogicTypesString(this.LogicTypes));
                        if (this.Description)
                            _CurrentRowParameter.find("td:eq(3)").text(this.Description);

                        $("." + FormulaStyleClassName.HelperParameters).find("tr:last").after(_CurrentRowParameter);
                    });
                }
                //限制感知列表
                _RestrictIntelligent(_CurrentParameter);
                return;
            }
        }
        for (var index = 0; index < ParticipantFunctions.length; index++) {
            if (ParticipantFunctions[index].FunctionName == _FunctionName) {
                var _Helper = ParticipantFunctions[index].Helper;

                $("." + FormulaStyleClassName.HelperName).text(_FunctionName);
                _ClearParameters();

                //返回类型
                var _ReturnTypeString = "";
                if (ParticipantFunctions[index].ReturnType) {
                    _ReturnTypeString = FormulaSettings.GetLogicTypesString([ParticipantFunctions[index].ReturnType]);
                }
                $("." + FormulaStyleClassName.HelperReturnType).text(_ReturnTypeString);

                ParticipantFunctions[index].FunctionName
                if (_Helper) {
                    $("." + FormulaStyleClassName.HelperDescription).text(_Helper.Description);
                    $("." + FormulaStyleClassName.HelperExample).text(_Helper.Example);
                    //当前参数
                    _CurrentParameter = _Helper.Parameters[_ParamIndex];
                    $(_Helper.Parameters).each(function (_ParameterIndex) {
                        var _CurrentRowParameter = _RowParameter.clone();
                        if (_ParameterIndex == _ParamIndex) {
                            _CurrentRowParameter.css("font-weight", "bold").css("color", "blue");
                        }
                        _CurrentRowParameter.find("td:eq(0)").text(_ParameterIndex + 1);
                        _CurrentRowParameter.find("td:eq(1)").text(this.Name);
                        _CurrentRowParameter.find("td:eq(2)").text(FormulaSettings.GetLogicTypesString(this.LogicTypes));
                        if (this.Description)
                            _CurrentRowParameter.find("td:eq(3)").text(this.Description);

                        $("." + FormulaStyleClassName.HelperParameters).find("tr:last").after(_CurrentRowParameter);
                    });
                }
                //限制感知列表
                _RestrictIntelligent(_CurrentParameter);
                return;
            }
        }
    },
    //检验是否正确
    Validate: function () {
        var _Expression = FormulaSettings.ReadExpression();
        //空,直接通过
        if (!_Expression || _Expression.length == 0) {
            return true;
        }
        //将"xxx"替换为""进行检验
        _Expression = _Expression.replace(/"[^"]+"/g, "\"\"");

        //暂时禁用,测试后台验证
        //验证 ""
        if (_Expression.match(/"/g) && _Expression.match(/"/g).length % 2 == 1) {
            var _e = _Expression;
            _e = _e.replace(/"[^"]+"/g, "\"\"");
            if (_e.match(/"/g) && _e.match(/"/g).length % 2 == 1) {
                window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: _Formula_GlobalString.Formula_NoClosed + "\"" }] });
                return;
            }
        }
        ////验证()
        //if (_Expression.match(/\(/g) || _Expression.match(/\)/g)) {
        //    var _LeftCount = 0;
        //    if (_Expression.match(/\(/)) {
        //        _LeftCount = _Expression.match(/\(/g).length;
        //    }
        //    var _RightCount = 0;
        //    if (_Expression.match(/\)/)) {
        //        _RightCount = _Expression.match(/\)/g).length;
        //    }
        //    if (_LeftCount > _RightCount) {
        //        window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: "存在未关闭的(" }] });
        //        return;
        //    }
        //    else if (_LeftCount < _RightCount) {
        //        window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: "存在多余的)" }] });
        //        return;
        //    }
        //}
        ////验证{}
        //if (_Expression.match(/\{/g) || _Expression.match(/\}/g)) {
        //    var _LeftCount = 0;
        //    if (_Expression.match(/\{/)) {
        //        _LeftCount = _Expression.match(/\{/g).length;
        //    }
        //    var _RightCount = 0;
        //    if (_Expression.match(/\}/)) {
        //        _RightCount = _Expression.match(/\}/g).length;
        //    }
        //    if (_LeftCount > _RightCount) {
        //        window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: "存在未关闭的{" }] });
        //        return;
        //    }
        //    else if (_LeftCount < _RightCount) {
        //        window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: "存在多余的}" }] });
        //        return;
        //    }
        //}
        ////验证是否存在空{}
        //if (_Expression.match(/{}/g)) {
        //    window.parent.$.H3Dialog.AlertMultiMsg({ content: [{ status: "error", text: "存在空变量表达式{}" }] });
        //    return;
        //}

        var _Valid = false;
        var _Errors = [];
        //服务器检验
        $.ajax({
            type: "post",
            url: FormulaSettings.FormulaHandlerAjaxUrl,
            cache: false,
            async: false,
            dataType: "json",
            data: {
                Command: "Validate",
                Formula: $.fn.htmlEscape(FormulaSettings.ReadExpression()),
                SchemaCode: SchemaCode,
                RuleCode: RuleCode
            },
            success: function (result) {
                if (result == "LoginFaild") {
                    //显示或者打开登录对话框
                    var loginWin = top.$.ligerui.get('LoginWinID');
                    if (loginWin) {
                        loginWin.show();
                    }
                    else {
                        loginWin = top.$.ligerDialog.open({
                            id: 'LoginWinID',
                            url: LoginUrl,
                            isHidden: false,
                            width: top.$('body').outerWidth(true),
                            height: top.$('body').outerHeight(true) + 20,
                            onClosed: function () {
                                location.reload();
                            }
                        });
                    }
                    loginWin.hideTitle();
                    return;
                }
                if (result.Result) {
                    _Valid = true;
                }
                else {
                    _Errors = result.Errors;
                }
            },
            error: function (msg) {

            }
        });

        if (_Valid) {
            return true;
        }
        else if (window.parent && window.parent.$ && window.parent.$.H3Dialog && window.parent.$.H3Dialog.AlertMultiMsg) {
            var _Content = [];
            if (!_Errors || _Errors.length == 0) {
                _Content.push({ status: "error", text: _Formula_GlobalString.Formula_TestFailed });
            }
            else {
                $(_Errors).each(function (index) {
                    _Content.push({ status: "error", text: this });
                });
            }
            window.parent.$.H3Dialog.AlertMultiMsg({ content: _Content });
        }
    },
    //读取完整表达式
    ReadExpression: function () {
        var _Expression = "";

        var _Editor = FormulaStack.Editor[0];
        $(_Editor.childNodes).each(function (index) {
            var _FragExpression = "";
            if ($(this).attr(FormulaSettings.ExpressionAttrName))
                _FragExpression = $(this).attr(FormulaSettings.ExpressionAttrName);
            else
                _FragExpression = $(this).text();

            ////两个表达式,中间如果没有空格,则补充
            //if (this.nodeType != "3" && _Expression[_Expression.length - 1] != " ") {
            //    _FragExpression = " " + _FragExpression;
            //}

            _Expression += _FragExpression;
        });

        return _Expression;
    },

    //读取完整显示文本
    ReadText: function () {
        var _Text = "";

        var _Editor = FormulaStack.Editor[0];
        $(_Editor.childNodes).each(function (index) {
            var _FragText = "";
            if ($(this).attr("expresion-text")) {
                _FragText = $(this).attr("expresion-text");
            }
            else {
                _FragText = $(this).text();
            }

            _Text += _FragText;
        });

        return _Text;
    },

    //选择项
    DoLiSelect: function (_Li) {
        //ERROR:替换FormulaStack.IntelligentString
        if (typeof (FormulaStack.IntelligentString) != "undefined") {
            //如果是函数,显示帮助
            if ($(_Li).hasClass(FormulaStyleClassName.FunctionItem)) {
                FormulaSettings.InsertFunction($(_Li).text(), true);
            }
            else if ($(_Li).hasClass(FormulaStyleClassName.ConstItem)) {
                FormulaSettings.InsertBlock($(_Li).text(), true);
            }
            else {
                FormulaSettings.InsertVariable($(_Li).text(), true);
            }

            FormulaSettings.HideIntelligent();

            FormulaSettings.ResetAll(false);
        }
    },

    //项选中时:滚动显示
    LiSelected: function () {
        var _SelectedLi = $("li." + FormulaStyleClassName.ItemSelected + ":visible:first");
        if (_SelectedLi.length > 0) {
            var _ItemBottom = _SelectedLi.offset().top + _SelectedLi.outerHeight();
            var _ContainerBottom = FormulaStack.Container.offset().top + FormulaStack.Container.height();
            //18是下滚动条的高度
            if (_ItemBottom + 18 > _ContainerBottom) {
                FormulaStack.Container.scrollTop(FormulaStack.Container.scrollTop() + _ItemBottom + 18 - _ContainerBottom);
            }
            else if (FormulaStack.Container.scrollTop() && _SelectedLi.offset().top < FormulaStack.Container.offset().top) {
                FormulaStack.Container.scrollTop(FormulaStack.Container.scrollTop() + _SelectedLi.offset().top - FormulaStack.Container.offset().top)
            }
        }
    },

    //获取元素的值
    GetElementExpression: function (_Selector) {
        var _Clone = $("<div></div>").append($(_Selector).clone());
        _Clone.find("[" + FormulaSettings.ExpressionAttrName + "]").each(function () {
            $(this).text($(this).attr(FormulaSettings.ExpressionAttrName));
        });
        return _Clone.text();
    },

    //_PrevTextSuffix: _PrevText的后缀
    GetPrevText: function (_Node, _PrevTextSuffix) {
        if (typeof (_PrevTextSuffix) == "undefined") {
            _PrevTextSuffix = "";
        }
        //如果当前节点是Editor
        if (FormulaSettings.IsEditor(_Node)) {
            return _PrevTextSuffix;
        }
        else {
            var _PrevText = "";
            for (var i = 0; i < _Node.parentNode.childNodes.length; i++) {
                if (_Node != _Node.parentNode.childNodes[i])
                    _PrevText += FormulaSettings.GetElementExpression(_Node.parentNode.childNodes[i]);
                else
                    break;
            }
            _PrevTextSuffix = _PrevText + _PrevTextSuffix;

            if (FormulaSettings.IsEditor(_Node.parentNode)) {
                return _PrevTextSuffix;
            }
            else {
                return FormulaSettings.GetPrevText(_Node.parentNode, _PrevTextSuffix);
            }
        }
    },

    //_NextTextPrefix: _NextText的前缀
    GetNextText: function (_Node, _NextTextPrefix) {
        if (typeof (_NextTextPrefix) == "undefined") {
            _NextTextPrefix = "";
        }
        //如果当前节点是Editor
        if (FormulaSettings.IsEditor(_Node)) {
            return _NextTextPrefix;
        }
        else {
            var _NextText = "";
            for (var i = _Node.parentNode.childNodes.length - 1; i >= 0; i--) {
                if (_Node != _Node.parentNode.childNodes[i])
                    _NextText = FormulaSettings.GetElementExpression(_Node.parentNode.childNodes[i]) + _NextText;
                else
                    break;
            }
            _NextTextPrefix += _NextText;

            if (FormulaSettings.IsEditor(_Node.parentNode)) {
                return _NextTextPrefix;
            }
            else {
                return FormulaSettings.GetNextText(_Node.parentNode, _NextTextPrefix);
            }
        }
    },

    //获取选中区域的上下文
    //_IsIntelligent:在感知中
    GetContext: function (_Container, _Offset, _IsIntelligent) {
        var _PrevText = "";
        var _NextText = "";

        //_Container是文本
        if (_Container.nodeType == 3) {
            _PrevText = $(_Container).text().substring(0, _Offset)
            _NextText = $(_Container).text().substring(_Offset, $(_Container).text().length);

            _PrevText = FormulaSettings.GetPrevText(_Container, _PrevText);
            _NextText = FormulaSettings.GetNextText(_Container, _NextText);
        }
            //如果_Container是编辑器
        else if (FormulaSettings.IsEditor(_Container)) {
            for (var i = 0; i < _Offset; i++) {
                _PrevText += FormulaSettings.GetElementExpression(FormulaStack.Editor[0].childNodes[i]);
            }
            for (var i = _Offset ; i < FormulaStack.Editor[0].childNodes.length; i++) {
                _NextText += FormulaSettings.GetElementExpression(FormulaStack.Editor[0].childNodes[i]);
            }
        }
            //如果Container不是文本也不是编辑器
        else {
            if (_Container.childNodes.length > 0) {
                if (_Offset > 0) {
                    _PrevText = FormulaSettings.GetElementExpression(_Container.childNodes[_Offset - 1]);

                    _PrevText = FormulaSettings.GetPrevText(_Container.childNodes[_Offset - 1], _PrevText);
                    _NextText = FormulaSettings.GetNextText(_Container.childNodes[_Offset - 1], _NextText);
                }
                else {
                    _NextText = FormulaSettings.GetElementExpression(_Container.childNodes[0]);

                    _PrevText = FormulaSettings.GetPrevText(_Container.childNodes[0], _PrevText);
                    _NextText = FormulaSettings.GetNextText(_Container.childNodes[0], _NextText);
                }
            }
            else {
                _PrevText = FormulaSettings.GetPrevText(_Container, _PrevText);
                _NextText = FormulaSettings.GetNextText(_Container, _NextText);
            }
        }

        //如果在感知中,前面的文本应去除感知片段长度
        if (_IsIntelligent && FormulaStack.IntelligentString) {
            _PrevText = _PrevText.substring(0, _PrevText.length - FormulaStack.IntelligentString.length)
        }

        return {
            PrevText: _PrevText,
            NextText: _NextText
        }
    },

    GetDisplayHtml: function (_Formula) {
        var Offset = 0;
        var NextChar;
        var Html = $("<div></div>");

        while (Offset < _Formula.length) {
            //剩下的公式
            var _RemainFormula = _Formula.substring(Offset, _Formula.length);
            //下一个字符
            NextChar = _RemainFormula[0];

            //是分隔符
            var _Dividers = _RemainFormula.match(/[+\-/*/()<>\s!&|=]+/);
            if (_Dividers && _Dividers.length > 0 && _RemainFormula.indexOf(_Dividers[0]) == 0) {
                Html.append($("<span></span>").text(_Dividers[0]));

                Offset += _Dividers[0].length;
                continue;
            }
                //不是分隔符
            else {
                //双引号打头
                if (NextChar == '"') {
                    //关闭双引号
                    var CloseQuotationIndex = _RemainFormula.indexOf('"', 1);
                    if (CloseQuotationIndex > -1) {
                        Html.append($("<span></span>").attr(FormulaSettings.ExecutionTypeName, ExecutionTypes.Input).text(_RemainFormula.substring(0, CloseQuotationIndex + 1)));
                        Offset += CloseQuotationIndex + 1;
                    }
                    else {
                        //双引号未关闭,后面全改为输入样式
                        Html.append($("<span></span>").attr(FormulaSettings.ExecutionTypeName, ExecutionTypes.Input).text(_RemainFormula));
                        break;
                    }
                }
                    //变量
                else if (NextChar == '{') {
                    //关闭变量标记
                    var CloseVaribleIndex = _RemainFormula.indexOf('}', 1);
                    if (CloseVaribleIndex > -1) {
                        var _VaribleText = _RemainFormula.substring(0, CloseVaribleIndex + 1);
                        Html.append($("<span></span>").attr(FormulaSettings.ExecutionTypeName, ExecutionTypes.Varible).text(_VaribleText));
                        Offset += CloseVaribleIndex + 1;
                    }
                    else {
                        //ERROR:'{'未关闭,后面全改为变量输入样式
                        Html.append($("<span></span>").text(_RemainFormula));
                        break;
                    }
                }
                    //逗号
                else if (NextChar == ',' || NextChar == ';') {
                    Html.append($("<span></span>").text(NextChar));
                    Offset++;
                }
                    //字符块
                else {
                    //如果字符块有结束
                    if (_RemainFormula.match(/[+\-/*/()<>\s!&|]+/)) {
                        //字符块长度
                        var _BlockLength = _RemainFormula.indexOf(_RemainFormula.match(/[+\-/*/()<>\s!&|]+/));
                        var _BlockText = _RemainFormula.substring(0, _BlockLength);
                        var _Block = $("<span></span>").text(_BlockText);

                        //如果是U结构
                        if (_BlockText == "U") {
                            //获取 U ( UserCode ) 结构
                            //var _UserExpressions = _RemainFormula.match(/U[\s]*[(][\s]*[0-9A-z\-]+[\s]*[)]/);
                            //编码允许中文
                            var _UserExpressions = _RemainFormula.match(/U[\s]*[(][^)]*[)]/)
                            if (_UserExpressions && _UserExpressions[0]) {
                                //获取 UserCode 
                                //左右括号位置
                                var _LeftParIndex = _UserExpressions[0].indexOf("(");
                                var _RightParIndex = _UserExpressions[0].indexOf(")");
                                if (_LeftParIndex < _RightParIndex) {
                                    var _UserKey = _UserExpressions[0].substring(_LeftParIndex + 1, _RightParIndex).trim();
                                    if (_UserKey && FormulaStack.UnitCache[_UserKey.toLowerCase()]) {
                                        var _fontSize = FormulaStack.Editor.css("font-size");
                                        var _fontFamily = FormulaStack.Editor.css("font-family");
                                        var _fontNumber = parseInt(_fontSize.replace("px", ""));
                                        _Block.text(FormulaStack.UnitCache[_UserKey.toLowerCase()])
                                            .css("font-size", _fontSize).css("font-family", _fontFamily)
                                            .appendTo("body:first");

                                        $('<canvas width="' + _Block.width() + 'px" height="' + (_fontNumber + 4) + 'px"></canvas>').appendTo("body:first");
                                        var c = $("canvas")[0];
                                        var ctx = c.getContext("2d");
                                        ctx.font = _fontSize + " " + _fontFamily;
                                        ctx.fillText(_Block.text(), 0, _fontNumber - 2);
                                        $("<img src='" + c.toDataURL() + "'>")
                                            .attr("expresion-text", FormulaStack.UnitCache[_UserKey.toLowerCase()])
                                            .attr(FormulaSettings.ExpressionAttrName, _UserExpressions[0])
                                            .attr(FormulaSettings.ExecutionTypeName, ExecutionTypes.User)
                                            .css("vertical-align", "middle")
                                            .appendTo(Html);

                                        _Block.remove();
                                        $(c).remove();

                                        Offset += _UserExpressions[0].length;
                                        continue;
                                    }
                                }
                            }
                        }
                        //如果是函数名称
                        if (FormulaSettings.IsFunctionName(_BlockText)) {
                            //函数 
                            _Block.attr(FormulaSettings.ExecutionTypeName, ExecutionTypes.Function);
                        }

                        Html.append(_Block);

                        Offset += _BlockLength;
                    }
                    else {
                        //字符块未结束,后面全改为字符块输入样式
                        Html.append($("<span></span>").text(_RemainFormula));
                        break;
                    }
                }
            }
        }
        return Html.html();
    },

    //编辑过程中重设全部
    //  _TriggerIntelligent 是否触发感知事件
    //  _PrevText和_NextText用于更新光标位置
    //  _ForceReset:考虑性能可能延时处理,若使用_ForceReset则强制立即处理
    //  _ResetCursor:重设光标
    ResetAll: function (_TriggerIntelligent, _PrevText, _NextText, _ForceReset, _ResetCursor) {
        if (FormulaStack.Editor[0].childNodes.length == 0) {
            var _span = document.createElement("span");
            FormulaStack.Editor.append(_span);
            FormulaSettings.FocusAfter(_span);
            FormulaStack.Editor.focus();
            return;
        }

        //已测试,持续重新调整会引发性能问题,其中两次粘贴间至少40毫秒,此处取200
        //如果200毫秒秒内处理过,延后处理
        var _CurrentTime = (new Date()).getTime();
        if (!FormulaStack.LatestResetTime) {
            FormulaStack.LatestResetTime = _CurrentTime;
        }
        else if (!_ForceReset && _CurrentTime - FormulaStack.LatestResetTime < 200) {
            //更新最后请求时间
            FormulaStack.LatestRequestTime = _CurrentTime;
            setTimeout(function (_SetTime) {
                //不是最新请求,不处理
                if (_SetTime != FormulaStack.LatestRequestTime) {
                    return;
                }
                //重设全部内容
                FormulaSettings.ResetAll();
            }, 200, _CurrentTime);
            return;
        }

        if (_PrevText || _NextText) { }
        else
        {
            var _TextContext = FormulaSettings.GetContext(FormulaStack.Range.endContainer, FormulaStack.Range.endOffset);
            _PrevText = _TextContext.PrevText;
            _NextText = _TextContext.NextText;
        }
        var _Formula = _PrevText + _NextText;

        //两次文本一样,不重设
        if (!_ForceReset && _Formula == FormulaStack.LastText) {
            return;
        }
        else {
            FormulaStack.LastText = _Formula;
        }

        var _ContainerClone = $("<div></div>");
        _ContainerClone.html(FormulaSettings.GetDisplayHtml(_Formula));

        if (_ResetCursor
            //|| (_ForceReset && _TriggerIntelligent)
            || FormulaStack.Range.startOffset == 0
            //前面文本为空或分隔符,直接重置
            || !_PrevText || _PrevText.substring(_PrevText.length - 1, _PrevText.length).match(/[=+\-/*/()<>\s!&|",}]+/g)
            //如果startContainer 是空<span><span>
            || (FormulaStack.Range.startContainer && FormulaStack.Range.startContainer.tagName && FormulaStack.Range.startContainer.childNodes.length == 0 && FormulaStack.Range.startContainer.tagName.toLowerCase() == "span")) {
            FormulaStack.Editor.html(_ContainerClone.html());
            var _PreCharCount = 0;
            //重置光标
            for (var i = 0; i < FormulaStack.Editor[0].childNodes.length; i++) {
                var _CurrentValueLength = FormulaSettings.GetElementExpression(FormulaStack.Editor[0].childNodes[i]).length;
                _PreCharCount += _CurrentValueLength;
                if (_PreCharCount >= _PrevText.length) {
                    if (_PreCharCount == _PrevText.length) {
                        FormulaSettings.FocusAfter(FormulaStack.Editor[0].childNodes[i]);

                        // 感知框
                        if (_TriggerIntelligent && _PrevText && _PrevText[_PrevText.length - 1].match(/\s/)) {
                            FormulaStack.IntelligentString = "";
                            FormulaSettings.Intelligent(FormulaStack.Editor[0].childNodes[i].childNodes[0], $(FormulaStack.Editor[0].childNodes[i].childNodes[0]).text().length);
                        }
                        else {
                            FormulaSettings.HideIntelligent();
                        }
                    }
                    else {
                        var _Range = document.createRange();
                        _Range.setStart(FormulaStack.Editor[0].childNodes[i].childNodes[0], _PrevText.length - (_PreCharCount - _CurrentValueLength));
                        _Range.setEnd(FormulaStack.Editor[0].childNodes[i].childNodes[0], _PrevText.length - (_PreCharCount - _CurrentValueLength));
                        FormulaSettings.FocusRange(_Range);

                        // 感知框
                        if (_TriggerIntelligent && _PrevText && _PrevText[_PrevText.length - 1].match(/\s/)) {
                            FormulaStack.IntelligentString = "";
                            FormulaSettings.Intelligent(FormulaStack.Editor[0].childNodes[i].childNodes[0], _PrevText.length - (_PreCharCount - _CurrentValueLength));
                        }
                        else {
                            FormulaSettings.HideIntelligent();
                        }
                    }

                    break;
                }
            }
            FormulaStack.Editor.focus();
        }
        else {
            if (!_ForceReset && FormulaStack.Range.startContainer.nodeType == 3 && _PrevText && _PrevText[_PrevText.length - 1].match(/[A-z]/)) {
                //获得感知字符串
                var _PreCharCount = 0;
                for (var i = 0; i < _ContainerClone[0].childNodes.length; i++) {
                    var _CurrentValueLength = FormulaSettings.GetElementExpression(_ContainerClone[0].childNodes[i]).length;
                    _PreCharCount += _CurrentValueLength;
                    if (_PreCharCount >= _PrevText.length) {
                        FormulaStack.IntelligentString = _PrevText.substring(_PreCharCount - _CurrentValueLength, _PrevText.length);
                        break;
                    }
                }
                FormulaSettings.Intelligent(FormulaStack.Range.startContainer, FormulaStack.Range.startOffset);
            }
            else {
                var _PrevContainer = $("<div></div>");
                var _NextContainer = $("<div></div>");
                //当前节点副本
                var _CurrentNodeClone;
                //
                var _PreCharCount = 0;
                //光标在当前元素上的位置
                var _CursorOffset;
                var _PrevNode;
                var _CurrentNode;
                var _NextNode;

                //文本节点
                if (FormulaStack.Range.startContainer.nodeType == 3) {
                    _CursorOffset = FormulaStack.Range.startOffset;
                    _PrevNode = _CurrentNode = _NextNode = FormulaStack.Range.startContainer;
                }
                    //Editor
                else if (FormulaSettings.IsEditor(FormulaStack.Range.startContainer)) {
                    if (FormulaStack.Range.startContainer.childNodes[FormulaStack.Range.startOffset - 1].nodeType == 3) {
                        _CursorOffset = $(FormulaStack.Range.startContainer.childNodes[i]).text().length;
                        _PrevNode = _CurrentNode = _NextNode = FormulaStack.Range.startContainer.childNodes[i];
                    }
                    else {
                        var _span = FormulaStack.Range.startContainer.childNodes[FormulaStack.Range.startOffset - 1];
                        _PrevNode = _CurrentNode = _NextNode = _span.childNodes[_span.childNodes.length - 1];
                        _CursorOffset = $(_PrevNode).text().length;
                    }
                }
                    //span
                else {
                    _CursorOffset = $(FormulaStack.Range.startContainer.childNodes[FormulaStack.Range.startOffset - 1]).text().length;
                    _PrevNode = _CurrentNode = _NextNode = FormulaStack.Range.startContainer.childNodes[FormulaStack.Range.startOffset - 1];
                }

                //感知字符串
                for (var i = 0; i < _ContainerClone[0].childNodes.length; i++) {
                    var _CurrentValueLength = FormulaSettings.GetElementExpression(_ContainerClone[0].childNodes[i]).length;
                    _PreCharCount += _CurrentValueLength;
                    if (!_CurrentNodeClone) {
                        if (_PreCharCount >= _PrevText.length) {
                            //感知字符串
                            FormulaStack.IntelligentString = _PrevText.substring(_PreCharCount - _CurrentValueLength, _PrevText.length);

                            //目标样式
                            _CurrentNodeClone = _ContainerClone[0].childNodes[i];
                            //复制span属性
                            $(_PrevNode).parent()
                                .removeAttr(FormulaSettings.ExpressionAttrName)
                                .removeAttr(FormulaSettings.ExecutionTypeName)
                                .attr(FormulaSettings.ExecutionTypeName, $(_CurrentNodeClone).attr(FormulaSettings.ExecutionTypeName))
                                .attr(FormulaSettings.ExpressionAttrName, $(_CurrentNodeClone).attr(FormulaSettings.ExpressionAttrName));

                            /***修改当前节点的内容***/
                            var _Range = document.createRange();

                            {
                                //如果文本后侧长度超过应有
                                if ($(_PrevNode).text().length - _CursorOffset > _PreCharCount - _PrevText.length) {
                                    //删减多余尾部
                                    _Range.setStart(_PrevNode, _CursorOffset + (_PreCharCount - _PrevText.length));
                                    _Range.setEnd(_PrevNode, $(_PrevNode).text().length);
                                    _Range.deleteContents();
                                }
                                    //如果文本后侧短于应有
                                else if ($(_PrevNode).text().length - _CursorOffset + _PrevText.length < _PreCharCount) {
                                    _Range.setStart(_PrevNode, _PrevNode.length);
                                    _Range.setEnd(_PrevNode, _PrevNode.length);

                                    //尾部添加额外文本
                                    var _Text = document.createTextNode(_Formula.substring(_PrevText.length + ($(_PrevNode).text().length - _CursorOffset), _PreCharCount));
                                    $(_CurrentNode).after(_Text);

                                    //记录后元素
                                    _NextNode = _Text;
                                }

                                //前段应有长度
                                var _ShouldLength = _PrevText.length - (_PreCharCount - _CurrentValueLength);

                                //前段文本长于应有
                                if (_CursorOffset > _ShouldLength) {
                                    //删除前段多余文本

                                    //冗余长度
                                    var _RedudanceLength = _CursorOffset - _ShouldLength;
                                    _PrevNode.deleteData(0, _RedudanceLength);

                                    //记录新的偏移位置
                                    _CursorOffset -= _RedudanceLength;
                                }
                                    //前端文本少于应有
                                else if (_CursorOffset < _ShouldLength) {
                                    //缺少长度
                                    var _LackLength = _ShouldLength - _CursorOffset;

                                    //前端添加额外文本
                                    _Range.setStart(_PrevNode, 0);
                                    _Range.setEnd(_PrevNode, 0);

                                    var _Text = document.createTextNode(_PrevText.substring(_PreCharCount - _CurrentValueLength, _PrevText.length - _CursorOffset));
                                    _Range.insertNode(_Text);

                                    //记录前元素
                                    _PrevNode = _Text;
                                }
                            }
                        }
                        else {
                            $(_ContainerClone[0].childNodes[i]).clone().appendTo(_PrevContainer);
                        }
                    }
                    else {
                        $(_ContainerClone[0].childNodes[i]).clone().appendTo(_NextContainer);
                    }
                }

                //TODO:删除前后所有节点
                FormulaSettings.deleteBefore(_PrevNode);
                FormulaSettings.deleteBehind(_NextNode);

                //添加副本元素到前\后
                if (_PrevContainer.html()) {
                    $(FormulaSettings.getEditorChildNode(_PrevNode)).before(_PrevContainer.html());
                }
                if (_NextContainer.html()) {
                    $(FormulaSettings.getEditorChildNode(_NextNode)).after(_NextContainer.html());
                }
                //TODO:触发智能感知事件
                FormulaSettings.Intelligent(_CurrentNode, _CursorOffset);
            }
        }

        //函数感知
        if (typeof (ParticipantFunctions) != typeof (undefined) && _PrevText && _PrevText.trim() && _PrevText.trim().length >= 2
            //非输入模式
            && (_PrevText.match(/"/g) == null || _PrevText.match(/"/g).length % 2 == 0)) {
            // 翻转的前段文本
            var _ReversePrevString = _PrevText.trim().split("").reverse().join("");
            //从后往前匹配符号
            //若当前位置的前一个符号是, 则当前位于函数输入
            //若当前位置前一个符号是( 则【可能】当前位于函数输入的第一个参数
            var _Symbols = _ReversePrevString.match(/[,\(\)\+\-\*\\=><!&\|]/);
            if (!_Symbols)
                return;
            //前一符号是(
            if (_Symbols[0] == "(") {
                //去掉(后所有内容
                _ReversePrevString = _ReversePrevString.substring(_ReversePrevString.indexOf("("), _ReversePrevString.length);
                //去掉所有(
                _ReversePrevString = _ReversePrevString.replace(/\(+/, " ").trim();
                //函数名称
                var _FunctionName = _ReversePrevString.match(/[_A-z0-9]*[_A-z]+/);
                if (_FunctionName && _ReversePrevString.indexOf(_FunctionName[0]) == 0) {
                    _FunctionName = _FunctionName[0].split("").reverse().join("");
                    //描述区域显示函数
                    FormulaSettings.ShowFunctionHelper(_FunctionName, 0);
                }
            }
            else if (_Symbols[0] == ",") {
                if (_ReversePrevString) {
                    //去掉,后所有内容
                    _ReversePrevString = _ReversePrevString.substring(_ReversePrevString.indexOf(","), _ReversePrevString.length);
                    //去掉成对的括号
                    _ReversePrevString = _ReversePrevString.replace(/\)[^\(\)]*\(/g, " ");
                    var i = _ReversePrevString.indexOf("(");
                    if (i > 0) {
                        //当前参数序号,第一个序号为0
                        var _ParamIndex = _ReversePrevString.substring(0, i).match(/,/g).length;
                        _ReversePrevString = _ReversePrevString.substring(_ReversePrevString.indexOf("(") + 1, _ReversePrevString.length).trim();
                        if (_ReversePrevString) {
                            //函数名称
                            var _FunctionName = _ReversePrevString.match(/[_A-z0-9]*[_A-z]+/);
                            if (_FunctionName && _ReversePrevString.indexOf(_FunctionName[0]) == 0) {
                                _FunctionName = _FunctionName[0].split("").reverse().join("");
                                //描述区域显示函数信息
                                FormulaSettings.ShowFunctionHelper(_FunctionName, _ParamIndex);
                            }
                        }
                    }
                }
            }
        }
    }
}

FormulaStack = {
    //编辑框
    Editor: undefined,
    //智能感知框
    Container: undefined,
    //智能感知列表ul
    IntelligentList: undefined,
    //描述框
    Description: undefined,

    //参数描述
    ArgDescription: undefined,

    //选择区
    Range: undefined,

    //智能感知字符串
    IntelligentString: "",

    //用户缓存, < Code/ID , UserName >
    UnitCache: {
    },

    //上次处理时的文本,用于避免重复处理
    LastText: undefined,
    //最后请求调整时间
    LatestRequestTime: undefined,
    //最后调整时间
    LatestResetTime: undefined
}

//编辑器事件
FormulaEditorEvent = {
    //键按下
    DoKeyDown: function (e) {
        //上/下箭头 , 若智能感知框可见,选中智能感知中的项
        if ((e.which == 38 || e.which == 40)) {
            if (FormulaStack.Container.is(":visible")) {
                var _SelectedLi = $("li." + FormulaStyleClassName.ItemSelected + ":first");
                //向上
                if (e.which == 38) {
                    var _FindPrevVisbleLi = function (_CurrentLi, _FilterString) {
                        var _TargetLi = $(_CurrentLi).prev();
                        for (; ;) {
                            if (!$(_TargetLi) || $(_TargetLi).length == 0) {
                                break;
                            }
                            if ($(_TargetLi).is(_FilterString)) {
                                return _TargetLi;
                            }
                            _TargetLi = $(_TargetLi).prev();
                        }
                    }
                    var _PrevLi = _FindPrevVisbleLi(_SelectedLi, ":visible");
                    if (_PrevLi && _PrevLi.length > 0 && _PrevLi[0] && _PrevLi[0].tagName && _PrevLi[0].tagName.toLocaleLowerCase() == "li") {
                        _SelectedLi.removeClass(FormulaStyleClassName.ItemSelected);
                        _PrevLi.addClass(FormulaStyleClassName.ItemSelected);

                        FormulaSettings.LiSelected();

                        FormulaSettings.ShowDescription();
                    }
                }
                //向下
                if (e.which == 40) {
                    var _FindNextVisbleLi = function (_CurrentLi, _FilterString) {
                        var _TargetLi = $(_CurrentLi).next();
                        for (; ;) {
                            if (!$(_TargetLi) || $(_TargetLi).length == 0) {
                                break;
                            }
                            if ($(_TargetLi).is(_FilterString)) {
                                return _TargetLi;
                            }
                            _TargetLi = $(_TargetLi).next();
                        }
                    }
                    var _NextLi = _FindNextVisbleLi(_SelectedLi, ":visible");
                    if (_NextLi && _NextLi.length > 0 && _NextLi[0] && _NextLi[0].tagName && _NextLi[0].tagName.toLocaleLowerCase() == "li") {
                        _SelectedLi.removeClass(FormulaStyleClassName.ItemSelected);
                        _NextLi.addClass(FormulaStyleClassName.ItemSelected);

                        FormulaSettings.LiSelected();

                        FormulaSettings.ShowDescription();
                    }
                }

                e.preventDefault();
                return;
            }
        }
            //ENTER
        else if (e.which == 13) {
            e.stopPropagation();
            e.preventDefault();
        }
    },

    //键放开
    DoKeyUp: function (e) {
        FormulaStack.Range = DocumentRange.getRange();

        //ESC , 若智能感知框可见,隐藏智能感知框
        if (e.which == 27) {
            if (FormulaStack.Container.is(":visible")) {
                FormulaSettings.HideIntelligent();

                e.preventDefault();
                e.stopPropagation();
            }
            return;
        }

        //上/下箭头 , 若智能感知框可见,选中智能感知中的项
        if ((e.which == 38 || e.which == 40) && FormulaStack.Container.is(":visible")) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        //ENTER
        if (e.which == 13 && $("li." + FormulaStyleClassName.ItemSelected + ":visible").length > 0) {
            FormulaSettings.DoLiSelect("li." + FormulaStyleClassName.ItemSelected + ":first");
            FormulaSettings.HideIntelligent();
            e.preventDefault();
            return;
        }

        //当前选中点
        if (!FormulaStack.Range || !FormulaStack.Range.collapsed || !FormulaStack.Range.startContainer)
            return;

        //任何副键已放开,重置
        if (!e.ctrlKey && !e.shiftKey && !e.altKey)
            FormulaSettings.ResetAll(true);
    },

    //鼠标放开
    DoMouseUp: function (e) {
        FormulaStack.Range = DocumentRange.getRange();
        if (e.target && e.target.tagName && (e.target.tagName.toLocaleLowerCase() == "a" || e.target.tagName.toLocaleLowerCase() == "span")) {
            FormulaStack.Range.setStartAfter(e.target);
            FormulaStack.Range.setEndAfter(e.target);
        }
    },

    //粘贴
    DoPaste: function (e) {
        //jquery未传入粘贴事件参数
        e = event;

        e.preventDefault();

        var _ClipboardData = e.clipboardData || window.clipboardData;
        if (_ClipboardData) {
            //剪贴版文本
            var _ClontText = _ClipboardData.getData("Text");
            var _Range = DocumentRange.getRange();
            if (_Range) {
                _Range.deleteContents();
            }

            FormulaSettings.InsertBlock(_ClontText);

            //添加延时调整请求
            FormulaSettings.ResetAll(true);
        }
    },

    //复制
    DoCopy: function (e) {
        //jquery未传入粘贴事件参数
        e = event;
        //若包含用户,将用户改为表达式
        var _Range = DocumentRange.getRange();
        if (_Range.collapsed) {
            return;
        }
        else {
            e.preventDefault();

            var _StartContext = FormulaSettings.GetContext(_Range.startContainer, _Range.startOffset);
            var _EndContext = FormulaSettings.GetContext(_Range.endContainer, _Range.endOffset);
            var _Formula = _StartContext.PrevText + _StartContext.NextText;

            var _SelectedText = _Formula.substring(Math.min(_StartContext.PrevText.length, _EndContext.PrevText.length), Math.max(_StartContext.PrevText.length, _EndContext.PrevText.length));

            //剪贴板
            var _ClipboardData = window.clipboardData || event.clipboardData;
            _ClipboardData.setData("Text", _SelectedText);
        }
    },

    //剪切
    DoCut: function (e) {
        //jquery未传入粘贴事件参数
        e = event;

        e.preventDefault();

        //执行复制动作
        FormulaEditorEvent.DoCopy();

        //删除选中内容
        var _Range = DocumentRange.getRange();
        _Range.deleteContents();

        //添加延时调整请求
        FormulaSettings.ResetAll(true);
    },

    //点击
    DoClick: function (e) {
        if (e && e.target && $(e.target).attr(FormulaSettings.ExecutionTypeName) == ExecutionTypes.Function) {
            FormulaSettings.ShowFunctionHelper($(e.target).text());
        }
    }
}

//编辑器样式名称
FormulaStyleClassName = {
    //公式编辑器
    Editor: "formula-editor",
    //智能感知浮出框
    IntelligentContainer: "div-intelligent-container",
    //项选中时
    ItemSelected: "intelligent-li-selected",

    //函数
    FunctionItem: "item-function",
    MathFunctionItem: "item-function-math",
    ParticipantFunctionItem: "item-function-participant",

    //常量
    ConstItem: "item-const",

    //全局变量
    GlobalVariableItem: "item-global-variable",
    //流程实例变量
    InstanceVariableItem: "item-instance",
    //数据项
    DataItem: "item-dataitem",

    //项的描述
    ItemDescription: "item-description",

    //参数描述
    ArgDescription: "arg-description",

    //函数帮助
    Helper: "function-description",
    //函数名称
    HelperName: "helper-name",
    //函数描述
    HelperDescription: "helper-description",
    //返回值类型
    HelperReturnType: "helper-return-type",
    //函数示例
    HelperExample: "helper-example",
    //函数参数表
    HelperParameters: "helper-parameters"
}

var FormulaEditorLoaded = function () {
    //公式编辑控件
    FormulaStack.Editor = $("." + FormulaStyleClassName.Editor);
    //初始化焦点
    {
        if (FormulaStack.Editor.children().length == 0) {
            FormulaStack.Editor.append($("<span></span>"));

            var _Input = $("<input type='text' />");
            _Input.appendTo(FormulaStack.Editor);

            FormulaSettings.FocusAfter(_Input[0]);

            FormulaStack.Editor.focus();

            _Input.remove();
        }
        try {
            //判断是否支持某些特性
            window.getSelection().getRangeAt(0);
        }
        catch (e) {
            DocumentRange.ForbidIntelligentWhenEnter = true;
        }
    }
    //感知显示控件
    FormulaStack.Container = $("." + FormulaStyleClassName.IntelligentContainer);
    //函数描述
    FormulaStack.Description = $("<div></div>").addClass(FormulaStyleClassName.ItemDescription);
    FormulaStack.Description.appendTo(FormulaStack.Container.parent()).hide();
    //函数参数描述
    FormulaStack.ArgDescription = $("<div></div>").addClass(FormulaStyleClassName.ArgDescription);
    FormulaStack.ArgDescription.appendTo(FormulaStack.Container.parent()).hide();

    FormulaStack.IntelligentList = FormulaStack.Container.find("ul");

    //初始化感知列表
    FormulaStack.IntelligentList.find("li").remove();
    var _Lis = [];
    //常量 
    if (typeof (Consts != typeof (undefined))) {
        $(Consts).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", this.Value).text(this.Text)
                .addClass(FormulaStyleClassName.ConstItem);
            if (this.LogicType) {
                _Li.attr("LogicType", this.LogicType);
            }
            _Lis.push(_Li);
        });
    }
    //科学函数
    if (typeof (MathFunctions) != "undefined") {
        $(MathFunctions).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", this.FunctionName).text(this.FunctionName)
                .attr("LogicType", this.ReturnType.join(","))
                .addClass(FormulaStyleClassName.FunctionItem).addClass(FormulaStyleClassName.MathFunctionItem);
            _Lis.push(_Li);
        });
    }
    //参与者函数
    if (typeof (ParticipantFunctions) != "undefined") {
        $(ParticipantFunctions).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", this.FunctionName).text(this.FunctionName)
                .attr("LogicType", this.ReturnType.join(","))
                .addClass(FormulaStyleClassName.FunctionItem).addClass(FormulaStyleClassName.ParticipantFunctionItem);
            _Lis.push(_Li);
        });
    }
    //全局变量
    if (typeof (GlobalVariables) != "undefined") {
        $(GlobalVariables).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", this).text(this)
                .addClass(FormulaStyleClassName.GlobalVariableItem);
            _Lis.push(_Li);
        });
    }
    //流程实例变量
    if (typeof (InstanceVariables) != "undefined") {
        $(InstanceVariables).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", "{" + this + "}").text(this)
                .addClass(FormulaStyleClassName.InstanceVariableItem);
            _Lis.push(_Li);
        });
    }
    //数据项
    if (typeof (DataItems) != "undefined") {
        $(DataItems).each(function () {
            var _Li = $("<li></li>");
            _Li.attr("IntelligentKeyWord", "{" + this.Name + "}").text(this.Name).attr("LogicType", this.LogicType)
                .addClass(FormulaStyleClassName.DataItem);
            _Lis.push(_Li);
        });
    }
    //排序
    var _SortedLis = _Lis.sort(function (a, b) {
        return $(a).text().toLocaleLowerCase() > $(b).text().toLocaleLowerCase() ? 1 : -1;
    })
    $(_SortedLis).each(function () { $(this).appendTo(FormulaStack.IntelligentList); })

    //鼠标移动时,设置项选中样式
    FormulaStack.IntelligentList.unbind("mousemove").bind("mousemove", function (e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() == "li") {
            FormulaStack.IntelligentList.find("li." + FormulaStyleClassName.ItemSelected).removeClass(FormulaStyleClassName.ItemSelected);
            $(e.target).addClass(FormulaStyleClassName.ItemSelected);

            FormulaSettings.LiSelected();

            //显示描述
            FormulaSettings.ShowDescription();
        }
    });
    //鼠标点击项,选中
    FormulaStack.IntelligentList.unbind("click").bind("click", function (e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() == "li") {
            FormulaSettings.DoLiSelect(e.target);
            e.preventDefault();
            e.stopPropagation();
        }
    });

    //编辑器全局事件
    FormulaStack.Editor.unbind("mouseup.global")
        .bind("mouseup.global", FormulaEditorEvent.DoMouseUp);

    FormulaStack.IntelligentList.unbind("keyup.intelligent")
        .bind("keyup.intelligent", function (e) {
            //ENTER
            if (e.which == 13 && $("li." + FormulaStyleClassName.ItemSelected + ":visible").length > 0) {
                FormulaSettings.DoLiSelect("li." + FormulaStyleClassName.ItemSelected + ":first");
                FormulaSettings.HideIntelligent();
                e.preventDefault();
            }
        });

    FormulaStack.Editor.unbind("keydown.intelligent")
        .bind("keydown.intelligent", FormulaEditorEvent.DoKeyDown);

    //编辑器keyup时感知
    FormulaStack.Editor.unbind("keyup.intelligent")
        .bind("keyup.intelligent", FormulaEditorEvent.DoKeyUp);

    //文档任意点击,隐藏弹出框
    $(document).unbind("mouseup.intelligent")
        .bind("mouseup.intelligent", function (e) {
            if (FormulaStack.IntelligentList.is(":visible")) {
                FormulaSettings.HideIntelligent();
            }
        })

    //粘贴
    FormulaStack.Editor.unbind("paste.intelligent")
        .bind("paste.intelligent", FormulaEditorEvent.DoPaste);
    //复制
    FormulaStack.Editor.unbind("copy.intelligent")
        .bind("copy.intelligent", FormulaEditorEvent.DoCopy);
    //剪切
    FormulaStack.Editor.unbind("cut.intelligent")
        .bind("cut.intelligent", FormulaEditorEvent.DoCut);

    //点击:显示说明
    FormulaStack.Editor.unbind("click.intelligent")
        .bind("click.intelligent", FormulaEditorEvent.DoClick);
}