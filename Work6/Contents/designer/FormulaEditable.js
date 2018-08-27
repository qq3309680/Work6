/// <reference path="../jquery/jquery.min.js" />
/// <reference path="Formula.js" />

//var _FormulaEditable_GlobalString = {
//    "FormulaEditable_EditFormul": "编辑公式",
//};
////获取本地化字符串
//$.get(_PORTALROOT_GLOBAL + "/Ajax/GlobalHandler.ashx", { "Code": "FormulaEditable_EditFormul" }, function (data) {
//    if (data.IsSuccess) {
//        _FormulaEditable_GlobalString = data.TextObj;
//    }
//}, "json");


//公式编辑器堆栈
FormulaEditableStack = {
    //显示控件
    DisplayControl: undefined,
    //值控件
    ValueControl: undefined,
    ////编辑窗口
    //EditorWindow: undefined,

    //客户端公式集:用于保存客户端的表达式和显示Html,而不用每次显示都从服务器解析
    ClientFormulaTextCache: {

    },

    //组织缓存
    UnitCache: {
    },

    GetDisplayControl: function (_InputSelector) {
        return $(_InputSelector).parent().find("div.formula-display");
    },

    GetDisplayText: function (_Formula) {
        if (!_Formula)
            return "";
        //取缓存
        if (FormulaEditableStack.ClientFormulaTextCache && FormulaEditableStack.ClientFormulaTextCache[_Formula]) {
            return FormulaEditableStack.ClientFormulaTextCache[_Formula];
        }

        var Offset = 0;
        var NextChar;
        var Html = $("<div></div>");

        while (Offset < _Formula.length) {
            //剩下的公式
            var _RemainFormula = _Formula.substring(Offset, _Formula.length);
            //下一个字符
            NextChar = _RemainFormula[0];

            //是分隔符
            var _Dividers = _RemainFormula.match(/[+\-/*/()<>\s!&|=,]+/);
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
                        Html.append($("<span></span>").text(_RemainFormula.substring(0, CloseQuotationIndex + 1)));
                        Offset += CloseQuotationIndex + 1;
                    }
                    else {
                        //双引号未关闭,后面全改为输入样式
                        Html.append($("<span></span>").text(_RemainFormula));
                        break;
                    }
                }
                    //变量
                else if (NextChar == '{') {
                    //关闭变量标记
                    var CloseVaribleIndex = _RemainFormula.indexOf('}', 1);
                    if (CloseVaribleIndex > -1) {
                        var _VaribleText = _RemainFormula.substring(0, CloseVaribleIndex + 1);
                        Html.append($("<span></span>").text(_VaribleText));
                        Offset += CloseVaribleIndex + 1;
                    }
                    else {
                        //ERROR:'{'未关闭,后面全改为变量输入样式
                        Html.append($("<span></span>").text(_RemainFormula));
                        break;
                    }
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
                            var _UserExpressions = _RemainFormula.match(/U[\s]*[(][^)]*[)]/);
                            if (_UserExpressions && _UserExpressions[0]) {
                                //获取 UserCode 
                                //左右括号位置
                                var _LeftParIndex = _UserExpressions[0].indexOf("(");
                                var _RightParIndex = _UserExpressions[0].indexOf(")");
                                if (_LeftParIndex < _RightParIndex) {
                                    var _UserKey = _UserExpressions[0].substring(_LeftParIndex + 1, _RightParIndex).trim();
                                    if (_UserKey && FormulaEditableStack.UnitCache[_UserKey.toLowerCase()]) {
                                        _Block.text(FormulaEditableStack.UnitCache[_UserKey.toLowerCase()])
                                            .appendTo(Html);
                                        Offset += _UserExpressions[0].length;
                                        continue;
                                    }
                                }
                            }
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
        FormulaEditableStack.ClientFormulaTextCache[_Formula] = Html.text();
        return FormulaEditableStack.ClientFormulaTextCache[_Formula];
    },

    //保存值
    SaveValue: function (_Expression, _Text) {
        if (_Expression && _Text) {
            _Expression = _Expression.trim();
            _Text = _Text.trim();
        }

        if (FormulaEditableStack.ValueControl) {
            FormulaEditableStack.ValueControl.val(_Expression);
            FormulaEditableStack.DisplayControl.text(_Text);

            //FormulaEditableStack.DisplayControl.find("a").attr("javascript:void(0)");
            //触发改变事件
            FormulaEditableStack.ValueControl.change();

            //更新缓存
            FormulaEditableStack.ClientFormulaTextCache[_Expression] = _Text;
        }

        //关闭窗口
        H3DialogManger.Cancel();
    },

    Clear: function (_InputSelector) {
        $(_InputSelector).val("");
        $(_InputSelector).parent().find("div.formula-display").text("");
    },

    ///显示公式HTML
    ShowFormulaHtml: function (_Formula, _DivSelector) {
        //显示控件
        var _DisplayDiv = $(_DivSelector);

        //空公式
        if (!_Formula) {
            _DisplayDiv.text("");
            return;
        }

        //缓存
        if (!FormulaEditableStack.ClientFormulaTextCache)
            FormulaEditableStack.ClientFormulaTextCache = {};
        if (FormulaEditableStack.ClientFormulaTextCache[_Formula]) {
            _DisplayDiv.text(FormulaEditableStack.ClientFormulaTextCache[_Formula]);
            return;
        }

        //U表达式
        //var _UExpressions = _Formula.match(/(([+\-/*/(<>\s!&|,]+U)|^U)[\s]*[(][\s]*[0-9A-z\-]+[\s]*[)]/g);
        var _UExpressions = _Formula.match(/U[\s]*[(][^)]*[)]/g);
        if (!_UExpressions || _UExpressions.length == 0) {
            _DisplayDiv.text(_Formula);

            FormulaEditableStack.ClientFormulaTextCache[_Formula] = _DisplayDiv.text();
            return;
        }

        //从U(xxx)表达式中提取xxx
        var _GetUnitKey = function (_UExpression) {
            var _LeftParIndex = _UExpression.indexOf("(", 0);
            var _RightParIndex = _UExpression.indexOf(")");
            if (_RightParIndex > _LeftParIndex) {
                return _UExpression.substring(_LeftParIndex + 1, _RightParIndex).trim();
            }
        }

        //需要从服务器解析的组织关键字
        var _UnitKeys = [];

        var _GetText = function () {
            var _Offset = 0;
            var _Html = $("<div></div>");
            $(_UExpressions).each(function () {
                var _UExpression = this.toString();
                var _UExpressionIndex = _Formula.indexOf(_UExpression, _Offset) + _UExpression.indexOf("U");

                _Html.append($("<span></span>").text(_Formula.substring(_Offset, _Offset + _UExpressionIndex)));

                var _PrevQuotations = _Formula.substring(0, _UExpressionIndex).match(/"/g);
                if (!_PrevQuotations || _PrevQuotations.length % 2 == 0) {
                    var _UnitKey = _GetUnitKey(_UExpression);
                    if (_UnitKey) {
                        if (FormulaEditableStack.UnitCache[_UnitKey.toLowerCase()]) {
                            //解析为用户
                            _Html.append($("<span></span>").text(FormulaEditableStack.UnitCache[_UnitKey.toLowerCase()]));
                            _Offset += _UExpressionIndex + _UExpression.length;

                            return;
                        }
                        else {
                            //添加到解析列表
                            _UnitKeys.push(_UnitKey);
                        }
                    }
                }
                //直接显示
                _Html.append($("<span></span>").text(_UExpression.substring(_UExpressionIndex, _UExpression.length)));
                _Offset += _UExpressionIndex + _UExpression.length;
            });
            return _Html.text();
        }

        //显示
        _DisplayDiv.text(_GetText());

        //从服务器上获取组织信息
        if (_UnitKeys.length == 0) {
            //添加到缓存
            if (!FormulaEditableStack.ClientFormulaTextCache[_Formula]) {
                FormulaEditableStack.ClientFormulaTextCache[_Formula] = _DisplayDiv.text();
            }
        }
        else {
            //从服务器解析之前的Html
            var _PText = _DisplayDiv.text();
            $.ajax({
                type: "post",
                url: "../Ajax/FormulaHandler.ashx",
                cache: false,
                async: false,
                dataType: "json",
                data: { Command: "GetUnitNames", UnitKeys: JSON.stringify(_UnitKeys) },
                success: function (_UnitCache) {
                    //更新缓存
                    if (_UnitCache && _UnitCache.length > 0) {
                        $(_UnitCache).each(function () {
                            if (this["Key"])
                                FormulaEditableStack.UnitCache[this["Key"].toLowerCase()] = this["Name"];
                        });

                        _DisplayDiv.text(FormulaEditableStack.GetDisplayText(_Formula));
                    }

                    //如果当前显示的值是之前的公式
                    if (_DisplayDiv.text() == _PText) {
                        _DisplayDiv.text(_GetText());
                        //添加到缓存
                        if (!FormulaEditableStack.ClientFormulaTextCache[_Formula]) {
                            FormulaEditableStack.ClientFormulaTextCache[_Formula] = _DisplayDiv.text();
                        }
                    }
                },
                error: function (msg) {
                }
            });
        }
    }
}
//_DisplayStyle:显示样式
$.fn.FormulaEditable = function (_DisplayStyle) {
    $(this).each(function () {
        var _DisplayDiv;
        if (this.tagName.toLowerCase() == "input" || this.tagName.toLowerCase() == "textarea") {
            _DisplayDiv = $("<div></div>").appendTo($(this).parent());
            $(this).hide();
        }
        else {
            _DisplayDiv = $(this);
        }
        if (_DisplayStyle) {
            _DisplayDiv.attr("style", _DisplayStyle);
        }
        _DisplayDiv.addClass("formula-display").css("word-break", "break-all").css("-ms-word-break", "break-all");
        if ($(this).attr("formula-button")) {
            var icondiv = $("<div></div>").addClass("FormulaEditable-div");
            $("<a></a>").addClass("icon-facebook").css("line-height", "2.9").appendTo($(icondiv));
            $(this).parent().append(icondiv);
            _DisplayDiv.addClass("formula-choose-div").css("float", "left");
        }
        FormulaEditableStack.ShowFormulaHtml($(this).val(), $(this).parent().find("div:not(.FormulaEditable-div)"));
    });

    $(".formula-display").each(function () {
        var isButton = $(this).parent().find("input").attr("formula-button");
        if (isButton) {
            $(this).parent().find(".FormulaEditable-div").unbind("click.FormulaEditable").bind("click.FormulaEditable", function (e) {
                FormulaEditableStack.DisplayControl = $(this).parent().find(".formula-display");
                FormulaEditableStack.ValueControl = $(this).parent().find("input[type=text],textarea");

                var _Url = "../Designer/FormulaEditor.aspx?1=1";
                if ($.fn.getUrlParam("WorkflowCode")) {
                    _Url += "&WorkflowCode=" + $.fn.getUrlParam("WorkflowCode");
                }
                if ($.fn.getUrlParam("SchemaCode")) {
                    _Url += "&SchemaCode=" + $.fn.getUrlParam("SchemaCode");
                }
                if ($.fn.getUrlParam("RuleCode")) {
                    _Url += "&RuleCode=" + $.fn.getUrlParam("RuleCode");
                }

                var _FormulaType = FormulaEditableStack.ValueControl.attr("formula-type");
                if (_FormulaType) {
                    _Url += "&FormulaType=" + _FormulaType;
                }

                var _title = FormulaEditableStack.ValueControl.attr("title") || "" //|| _WorkflowDesigner_GlobalString.FormulaEditable_EditFormul;
                _title += ":" + (_FormulaType || "");
                ShowDialog(_title, _Url + "&Formula=" + escape(FormulaEditableStack.ValueControl.val()));
            });
        }
        else {
            $(this).unbind("click.FormulaEditable").bind("click.FormulaEditable", function (e) {
                FormulaEditableStack.DisplayControl = $(this);
                FormulaEditableStack.ValueControl = $(this).parent().find("input[type=text],textarea");

                var _Url = "../Designer/FormulaEditor.aspx?1=1";
                if ($.fn.getUrlParam("WorkflowCode")) {
                    _Url += "&WorkflowCode=" + $.fn.getUrlParam("WorkflowCode");
                }
                if ($.fn.getUrlParam("SchemaCode")) {
                    _Url += "&SchemaCode=" + $.fn.getUrlParam("SchemaCode");
                }
                if ($.fn.getUrlParam("RuleCode")) {
                    _Url += "&RuleCode=" + $.fn.getUrlParam("RuleCode");
                }

                var _FormulaType = FormulaEditableStack.ValueControl.attr("formula-type");
                if (_FormulaType) {
                    _Url += "&FormulaType=" + _FormulaType;
                }

                var _title = FormulaEditableStack.ValueControl.attr("title") || "" //|| _WorkflowDesigner_GlobalString.FormulaEditable_EditFormul;
                _title += ":" + (_FormulaType || "");
                ShowDialog(_title, _Url + "&Formula=" + escape(FormulaEditableStack.ValueControl.val()));
            });
        }
    });    
}