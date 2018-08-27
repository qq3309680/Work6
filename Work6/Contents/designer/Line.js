/// <reference path="Activity.js" />
/// <reference path="ActivityDrag.js" />
/// <reference path="ActivityDock.js" />
/// <reference path="ActivityModel.js" />
/// <reference path="Line.js" />
/// <reference path="misc.js" />
/// <reference path="Workflow.js" />

//线条设置
LineSettings = {
    // ID 属性名称
    PropertyNameOfID: "line_id",

    //最小线段长
    MinSegementLength: 20,

    //自由画线时停靠到起点的距离
    DockDistanceToStartPoint: 10,
    //接近时停靠到活动的距离
    DockDistanceToEdge: 20,
    //接近活动边的中点时自动停靠的距离
    DockDisntaceToEdgeCenter: 10,
    //线条圆角半径
    CornerRadius: 3,
    //交点半径
    CrossRadius: 5,
    //线条颜色
    LineColor: "black",
    //线条宽度
    LineWidth: 1,

    //线条聚焦颜色
    LineFocusColor: "rgb(52, 203, 200)",
    //线条聚焦宽度
    LineFocusWidth: 2,
    //箭头聚焦颜色
    ArrowFocusColor: "rgb(52, 203, 200)",


    //箭头长
    ArrowLength: 10,
    //箭头宽
    ArrowWidth: 6,
    //箭头填充色
    ArrowFillColor: "black",

    //.线条调整事件的命名空间
    LineHandleEventNamespace: ".linehandle",
    //.线条文字移动事件的命名空间
    LineLabelEventNamespace: ".line_label",
    //线条ID属性名称
    Label_LineIDPropertyName: "Line-ID",

    //寻找最近活动时，垂直距离的权重加成
    VerticalPerceage: 1.1,

    //默认文字颜色
    DefaultFontColor: "black",
    //默认文字大小
    DefaultFontSize: 11,

    //重计算箭尾点
    GetArrowTailPoint: function (_EndPoint, _EndDirection) {
        var _ArrowTailPoint = {
            x: _EndPoint.x,
            y: _EndPoint.y
        };
        //折线的终点(箭尾中点)
        switch (_EndDirection) {
            case LineArrowDirection.Up:
                _ArrowTailPoint.y -= LineSettings.ArrowLength;
                break;
            case LineArrowDirection.Down:
                _ArrowTailPoint.y += LineSettings.ArrowLength;
                break;
            case LineArrowDirection.Left:
                _ArrowTailPoint.x -= LineSettings.ArrowLength;
                break;
            case LineArrowDirection.Right:
                _ArrowTailPoint.x += LineSettings.ArrowLength;
                break;
        }
        return _ArrowTailPoint;
    },

    //根据起始点,计算所有点
    //Return:点集合
    RecalculatePoints: function (_StartDirection, _EndDirection, _StartPoint, _EndPoint) {
        var origin_x = _StartPoint.x;
        var origin_y = _StartPoint.y;
        var target_x = _EndPoint.x;
        var target_y = _EndPoint.y;

        var _Points = [{
            x: _StartPoint.x,
            y: _StartPoint.y
        }];
        if (origin_x == target_x && origin_y == target_y && _StartDirection == _EndDirection) {
            switch (_StartDirection) {
                case LineArrowDirection.Left:
                    _Points.push({
                        x: _StartPoint.x - 20,
                        y: _StartPoint.y
                    });
                    break;
                case LineArrowDirection.Right:
                    _Points.push({
                        x: _StartPoint.x + 20,
                        y: _StartPoint.y
                    });
                    break;
                case LineArrowDirection.Up:
                    _Points.push({
                        x: _StartPoint.x,
                        y: _StartPoint.y - 20
                    });
                    break;
                case LineArrowDirection.Down:
                    _Points.push({
                        x: _StartPoint.x,
                        y: _StartPoint.y + 20
                    });
                    break;
            }
            _Points.push({
                x: _EndPoint.x,
                y: _EndPoint.y
            });
            return _Points;
        }

        switch (_StartDirection) {
            case LineArrowDirection.Up:
                {
                    switch (_EndDirection) {
                        case LineArrowDirection.Left:
                            {
                                //第一象限
                                if (target_y < origin_y && target_x > origin_x)
                                    _Points.push({ x: origin_x, y: target_y });
                                    //第二象限
                                else if (target_y < origin_y && target_x <= origin_x) {
                                    _Points.push({ x: origin_x, y: origin_y / 2 + target_y / 2 });
                                    _Points.push({ x: target_x - LineSettings.MinSegementLength, y: origin_y / 2 + target_y / 2 });
                                    _Points.push({ x: target_x - LineSettings.MinSegementLength, y: target_y });
                                }
                                    //第三象限
                                else if (target_y >= origin_y && target_x <= origin_x) {
                                    _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: target_y });
                                }
                                    //第四象限
                                else {
                                    _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                                }
                            }
                            break;
                        case LineArrowDirection.Down:
                            //第一二象限
                            if (target_y < origin_y - LineSettings.MinSegementLength) {
                                _Points.push({ x: origin_x, y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                                //直线
                            else if (target_x == origin_x && target_y < origin_y) {
                            }
                                //第三四象限
                            else {
                                _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                            break;
                        case LineArrowDirection.Right:
                            {
                                //第一象限
                                if (target_y < origin_y && target_x > origin_x) {
                                    _Points.push({ x: origin_x, y: (origin_y / 2 + target_y / 2) });
                                    _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                    _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: target_y });
                                }
                                    //第二象限
                                else if (target_y < origin_y && target_x <= origin_x) {
                                    _Points.push({ x: origin_x, y: target_y });
                                }
                                    //第三象限
                                else if (target_y >= origin_y && target_x <= origin_x) {
                                    _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                                }
                                    //第四象限
                                else {
                                    _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: target_y });
                                    _Points.push({ x: (target_x + LineSettings.ArrowLength), y: target_y });
                                }
                            }
                            break;
                        case LineArrowDirection.Up:
                            {
                                //第一二象限
                                if (target_y < origin_y) {
                                    _Points.push({ x: origin_x, y: (target_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: (target_x), y: (target_y - LineSettings.MinSegementLength) });
                                }
                                    //第三/四象限
                                else {
                                    _Points.push({ x: origin_x, y: (origin_y - LineSettings.MinSegementLength) });
                                    _Points.push({ x: target_x, y: (origin_y - LineSettings.MinSegementLength) });
                                }
                            }
                            break;
                    }
                    break;
                }
            case LineArrowDirection.Down:
                {
                    switch (_EndDirection) {
                        case LineArrowDirection.Left:
                            //第二象限
                            if (target_x < origin_x && target_y < origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: target_y });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y > origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: target_y });
                            }
                                //第一象限
                            else if (target_x >= origin_x && target_y <= origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: origin_x, y: target_y });
                            }
                            break;
                        case LineArrowDirection.Down:
                            //第一二象限
                            if (target_y < origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (origin_y + LineSettings.MinSegementLength) });
                            }
                                //第三四象限
                            else {
                                _Points.push({ x: origin_x, y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                            break;
                        case LineArrowDirection.Right:
                            //第二象限
                            if (target_x < origin_x && target_y < origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y > origin_y) {
                                _Points.push({ x: origin_x, y: target_y });
                            }
                                //第一象限
                            else if (target_x >= origin_x && target_y <= origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: target_y });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: origin_x, y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: target_y });
                            }
                            break;
                        case LineArrowDirection.Up:
                            //第一二象限
                            if (target_y - LineSettings.MinSegementLength < origin_y) {
                                _Points.push({ x: origin_x, y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (origin_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y - LineSettings.MinSegementLength) });
                            }
                                //直线
                            else if (target_x == origin_x && target_y > origin_y) {
                            }
                                //第三四象限
                            else {
                                _Points.push({ x: origin_x, y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                            break;
                    }
                }
                break;
            case LineArrowDirection.Left:
                {
                    switch (_EndDirection) {
                        case LineArrowDirection.Left:
                            //第二三象限
                            if (target_x < origin_x) {
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: target_y });
                            }
                                //第一四象限
                            else {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: target_y });
                            }
                            break;
                        case LineArrowDirection.Down:
                            //第二象限
                            if (target_x < origin_x && target_y < origin_y) {
                                _Points.push({ x: target_x, y: origin_y });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y >= origin_y) {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                                //第一象限
                            else if (target_x >= origin_x && target_y <= origin_y) {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                            break;
                        case LineArrowDirection.Right:
                            //第二三象限
                            if (target_x < origin_x - LineSettings.MinSegementLength) {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                            }
                                //直线
                            else if (target_x < origin_x && target_y == origin_y) {
                            }
                                //第一四象限
                            else {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: target_y });
                            }
                            break;
                        case LineArrowDirection.Up:
                            //第一象限
                            if (target_x > origin_x && target_y < origin_y) {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: (target_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y - LineSettings.MinSegementLength) });
                            }
                                //第二象限
                            else if (target_x <= origin_x && target_y <= origin_y) {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y - LineSettings.MinSegementLength) });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y > origin_y) {
                                _Points.push({ x: target_x, y: origin_y });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x - LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                            break;
                    }
                }
                break;
            case LineArrowDirection.Right:
                {
                    switch (_EndDirection) {
                        case LineArrowDirection.Left:
                            //第二三象限
                            if (target_x - LineSettings.MinSegementLength < origin_x) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: (target_x - LineSettings.MinSegementLength), y: target_y });
                            }
                                //直线
                            else if (target_x > origin_x && target_y == origin_y) {
                            }
                                //第一四象限
                            else {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: target_y });
                            }
                            break;
                        case LineArrowDirection.Down:
                            //第二象限
                            if (target_x < origin_x && target_y < origin_y) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y >= origin_y) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                                //第一象限
                            else if (target_x >= origin_x && target_y <= origin_y) {
                                _Points.push({ x: target_x, y: origin_y });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y + LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y + LineSettings.MinSegementLength) });
                            }
                            break;
                        case LineArrowDirection.Right:
                            //第二三象限
                            if (target_x < origin_x) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: target_y });
                            }
                                //第一四象限
                            else {
                                _Points.push({ x: (target_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: ((target_x + LineSettings.MinSegementLength)), y: target_y });
                            }
                            break;
                        case LineArrowDirection.Up:
                            //第一象限
                            if (target_x > origin_x && target_y < origin_y) {
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: origin_y });
                                _Points.push({ x: (origin_x / 2 + target_x / 2), y: (target_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y - LineSettings.MinSegementLength) });;
                            }
                                //第二象限
                            else if (target_x <= origin_x && target_y <= origin_y) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: (target_y - LineSettings.MinSegementLength) });
                                _Points.push({ x: target_x, y: (target_y - LineSettings.MinSegementLength) });
                            }
                                //第三象限
                            else if (target_x < origin_x && target_y > origin_y) {
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: origin_y });
                                _Points.push({ x: (origin_x + LineSettings.MinSegementLength), y: (origin_y / 2 + target_y / 2) });
                                _Points.push({ x: target_x, y: (origin_y / 2 + target_y / 2) });
                            }
                                //第四象限
                            else {
                                _Points.push({ x: target_x, y: origin_y });
                            }
                            break;
                    }
                }
                break;
        }
        _Points.push({
            x: target_x,
            y: target_y
        });

        //合并在一条直线上的线段
        for (var i = _Points.length - 1; i >= 2; i--) {
            if ((_Points[i].x == _Points[i - 1].x && _Points[i - 1].x == _Points[i - 2].x)
                || (_Points[i].y == _Points[i - 1].y && _Points[i - 1].y == _Points[i - 2].y)) {
                _Points.splice(i - 1, 1);
            }
        }
        return _Points;
    }
}

//线条的样式名称
LineStyleClassName = {
    //控制点样式
    LineHandler: "line_handler",
    //起点控制样式
    StartPointHandler: "line_handler_start_point",
    //终点控制样式
    EndPointHandler: "line_handler_end_point",
    //水平线段控制样式
    HorizontalSegementHandler: "line_handler_line_horizontal",
    //竖直线段控制样式
    VerticalSegementHandler: "line_handler_line_vertical",

    //标题
    Label: "line_label_div",
    //标题移动样式
    LabelMoving: "line-label-moving"
}

//线条绘制栈
LineDrawStack = {
    //当前调整的线条
    CurrentLine: undefined,
    //当前控制点
    CurrentHandler: undefined,
    //正在绘制
    IsDrawing: false,
    //线条的画布原点
    OriginOffset: {
        x: 0,
        y: 0
    }
}

//线条调整栈
LineResizeStack = {
    //当前调整的线条
    CurrentLine: undefined,
    //当前控制点
    CurrentHandler: undefined,
    //正在绘制
    IsDrawing: false,
    //线条的画布原点
    OriginOffset: {
        x: 0,
        y: 0
    },
    //调整前的状态
    SourceState: undefined
}

//箭头的方向
LineArrowDirection = {
    //未指定
    Unspecified: undefined,
    //下
    Down: 1,
    //上
    Up: -1,
    //左
    Left: 2,
    //右
    Right: -2,

    Opposite: function (_direction) {
        switch (_direction) {
            case LineArrowDirection.Up:
                return LineArrowDirection.Down;
            case LineArrowDirection.Down:
                return LineArrowDirection.Up;
            case LineArrowDirection.Left:
                return LineArrowDirection.Right;
            case LineArrowDirection.Right:
                return LineArrowDirection.Left;
        }
    }
}

//线条类定义
Line = function (lineConfig) {
    // ID
    this.ID = undefined;
    this.WorkflowElementType = WorkflowElementType.Line;
    // 起点活动
    this.startActivity = undefined;
    // 终点活动
    this.endActivity = undefined;

    // 位于起点活动的边的方向
    this.startDirection = LineArrowDirection.Unspecified;
    // 位于终点活动的边的方向
    this.endDirection = LineArrowDirection.Unspecified;

    // 起点相对于开始活动的偏移
    this.offsetToStartActivity = { x: 0, y: 0 };
    // 终点相对于结束活动的偏移
    this.offsetToEndActivity = { x: 0, y: 0 };

    //折线点集，不包含箭头
    this.Points = [];

    //起点
    this.startPoint = { x: 0, y: 0 };
    //结束节点
    this.endPoint = { x: 0, y: 0 };

    //箭头html对象
    this.Arrow;
    //路径html对象
    this.Path;
    //文字
    this.Label;

    //初始化
    this.init(lineConfig);

    this.isSelected = false;

    this.crossPoints = [];

    this.needRedraw = false;

    return this;
}

Line.prototype = {
    //设置点
    //_ResetStartAndEnd:是否重设起止点
    setPoints: function (_ResetStartAndEnd) {
        this.needRedraw = true;
        //重设文字位置
        this.TextX = this.TextY = 0;

        this.FixedPoint = false;
        if (_ResetStartAndEnd) {
            if (this.startActivity)
                this.startPoint = {
                    x: this.startActivity.left + this.offsetToStartActivity.x * this.startActivity.width,
                    y: this.startActivity.top + this.offsetToStartActivity.y * this.startActivity.height
                }
            if (this.endActivity) {
                this.endPoint = {
                    x: this.endActivity.left + this.offsetToEndActivity.x * this.endActivity.width,
                    y: this.endActivity.top + this.offsetToEndActivity.y * this.endActivity.height
                }
            }
        }

        if (this.startDirection == LineArrowDirection.Unspecified && this.endDirection == LineArrowDirection.Unspecified)
            return;

        var getEndDirection = function (_startPoint, _startDirection, _endPoint) {
            var origin_x = _startPoint.x;
            var origin_y = _startPoint.y;
            var target_x = _endPoint.x;
            var target_y = _endPoint.y;
            var _endDirection = LineArrowDirection.Unspecified;
            switch (_startDirection) {
                case LineArrowDirection.Up:
                    if (target_y < origin_y - LineSettings.MinSegementLength) {
                        _endDirection = LineArrowDirection.Down;
                    }
                    else {
                        _endDirection = LineArrowDirection.Up;
                    }
                    break;
                case LineArrowDirection.Down:
                    if (target_y > origin_y + LineSettings.MinSegementLength) {
                        _endDirection = LineArrowDirection.Up;
                    }
                    else {
                        _endDirection = LineArrowDirection.Down;
                    }
                    break;
                case LineArrowDirection.Left:
                    if (target_x < origin_x - LineSettings.MinSegementLength) {
                        _endDirection = LineArrowDirection.Right;
                    }
                    else {
                        _endDirection = LineArrowDirection.Left;
                    }
                    break;
                case LineArrowDirection.Right:
                    if (target_x > origin_x + LineSettings.MinSegementLength) {
                        _endDirection = LineArrowDirection.Left;
                    }
                    else {
                        _endDirection = LineArrowDirection.Right;
                    }
                    break;
            }
            return _endDirection;
        }

        if (this.endDirection == LineArrowDirection.Unspecified)
            this.endDirection = getEndDirection(this.startPoint, this.startDirection, this.endPoint);
        else if (this.startDirection == LineArrowDirection.Unspecified) {
            this.startDirection = getEndDirection(this.endPoint, this.endDirection, this.startPoint);
        }

        //更新线条相对于活动边的位置信息
        this.setOffsetToActivity();

        //计算所有点
        this.Points = LineSettings.RecalculatePoints(this.startDirection, this.endDirection, this.startPoint, this.endPoint);
    },

    //线条平移,不绘制
    DoMove: function (_MoveOffset) {
        if (!_MoveOffset || (_MoveOffset.x == 0 && _MoveOffset.y == 0)) {
            return;
        }
        this.needRedraw = true;
        var _Points = [];
        //设置每个点
        $(this.Points).each(function () {
            _Points.push({ x: this.x + _MoveOffset.x, y: this.y + _MoveOffset.y });
        });
        this.Points = _Points;
        this.startPoint = this.Points[0];
        this.endPoint = this.Points[this.Points.length - 1];

        //移动文本
        if (this.Label) {
            $(this.Label).move(_MoveOffset);
        }
    },
    //移动起点
    MoveStartPoint: function (_MoveOffset) {
        if (!_MoveOffset || (_MoveOffset.x == 0 && _MoveOffset.y == 0)) {
            return;
        }
        this.needRedraw = true;
        var _NewStartPoint = {
            x: this.Points[0].x + _MoveOffset.x,
            y: this.Points[0].y + _MoveOffset.y
        };

        //如果固定点
        if (this.FixedPoint
            //并且移动方向与线条平行
            && ((_MoveOffset.x == 0 && this.Points[1].x == this.Points[0].x && this.Points[1].y != this.Points[0].y && (_NewStartPoint.y - this.Points[1].y) / (this.Points[0].y - this.Points[1].y) > 0)
                || (_MoveOffset.y == 0 && this.Points[1].y == this.Points[0].y && this.Points[1].x != this.Points[0].x && (_NewStartPoint.x - this.Points[1].x) / (this.Points[0].x - this.Points[1].x) > 0))) {
            //必须在比较后才赋值
            this.startPoint = this.Points[0] = _NewStartPoint;
            return;
        }
        else {
            //赋值
            this.startPoint = this.Points[0] = _NewStartPoint;
            this.setPoints();
        }
    },
    //移动终点
    MoveEndPoint: function (_MoveOffset) {
        if (!_MoveOffset || (_MoveOffset.x == 0 && _MoveOffset.y == 0)) {
            return;
        }
        this.needRedraw = true;
        var _NewEndPoint = {
            x: this.Points[this.Points.length - 1].x + _MoveOffset.x,
            y: this.Points[this.Points.length - 1].y + _MoveOffset.y
        };

        //如果固定点
        if (this.FixedPoint
            //并且移动方向与线条平行
            && ((_MoveOffset.x == 0 && this.Points[this.Points.length - 2].x == this.Points[this.Points.length - 1].x && this.Points[this.Points.length - 2].y != this.Points[this.Points.length - 1].y && (_NewEndPoint.y - this.Points[this.Points.length - 2].y) / (this.Points[this.Points.length - 1].y - this.Points[this.Points.length - 2].y) > 0)
                || (_MoveOffset.y == 0 && this.Points[this.Points.length - 2].y == this.Points[this.Points.length - 1].y && this.Points[this.Points.length - 2].x != this.Points[this.Points.length - 1].x && (_NewEndPoint.x - this.Points[this.Points.length - 2].x) / (this.Points[this.Points.length - 1].x - this.Points[this.Points.length - 2].x) > 0))) {
            this.endPoint = this.Points[this.Points.length - 1] = _NewEndPoint;
            return;
        }
        else {
            //必须在比较后才赋值
            this.endPoint = this.Points[this.Points.length - 1] = _NewEndPoint;
            this.setPoints();
        }
    },

    //设置聚焦样式
    SetFocusStyle: function () {
        workflow.FocusLine = this;

        if (this.Path) {
            this.Path.attr("stroke", LineSettings.LineFocusColor).attr("stroke-width", LineSettings.LineFocusWidth);
            this.Arrow.attr("fill", LineSettings.ArrowFocusColor).attr("stroke", LineSettings.LineFocusColor);
        }
    },
    //设置失去焦点样式
    SetBlurStyle: function () {
        workflow.FocusLine = undefined;

        if (this.Path) {
            this.Path.attr("stroke", LineSettings.LineColor).attr("stroke-width", LineSettings.LineWidth);
            this.Arrow.attr("fill", LineSettings.ArrowFillColor).attr("stroke", LineSettings.LineColor);
        }
    },

    //绘制
    //是否绘制交叉点
    draw: function (drawCrossPoints) {
        //如果点已设置,判断点是否在线上,否则重定位
        if (this.TextX || this.TextY) {
            var isOn = false;
            for (i = 0; i < this.Points.length - 1; i++) {
                //水平线
                if (this.Points[i].y == this.Points[i + 1].y) {
                    if (this.TextY == this.Points[i].y && this.TextX >= Math.min(this.Points[i].x, this.Points[i + 1].x) && this.TextX <= Math.max(this.Points[i].x, this.Points[i + 1].x)) {
                        isOn = true;
                        break;
                    }
                }
                    //竖直线
                else {
                    if (this.TextX == this.Points[i].x && this.TextY >= Math.min(this.Points[i].y, this.Points[i + 1].y) && this.TextY <= Math.max(this.Points[i].y, this.Points[i + 1].y)) {
                        isOn = true;
                        break;
                    }
                }
            }
            if (!isOn) {
                this.TextX = this.TextY = 0;
                this.SetText();
            }
        }

        if (drawCrossPoints)
            this.needRedraw = false;
        var thisLine = this;
        if (!this.Points || this.Points.length == 0)
            return;

        //使用SVG绘线
        if (workflow.UtilizeSvg) {
            var pathDefine;
            //结束于箭尾的点集合
            var _PointsEndWithArrowTailPoint = this.Points.slice();
            //当两个交叉点的距离小于拱形半径的两倍时，将其合并为一个交叉点绘制
            var joinToCrossOffsetX = function (_crossOffsetXs, _newOffsetX) {
                //是否已加入
                var inserted = false;
                if (_crossOffsetXs && _crossOffsetXs.length > 0) {
                    for (var _crossIndex = 0 ; _crossIndex < _crossOffsetXs.length; _crossIndex++) {
                        if (_newOffsetX + LineSettings.CrossRadius < _crossOffsetXs[_crossIndex].start) {
                            _crossOffsetXs.splice(_crossIndex, 0, { start: _newOffsetX - LineSettings.CrossRadius, end: _newOffsetX + LineSettings.CrossRadius });

                            inserted = true;
                            break;
                        }
                            //如果可以合入当前范围
                        else if (_newOffsetX >= _crossOffsetXs[_crossIndex].start - LineSettings.CrossRadius && _newOffsetX <= _crossOffsetXs[_crossIndex].end + LineSettings.CrossRadius) {
                            _crossOffsetXs[_crossIndex].start = Math.min(_crossOffsetXs[_crossIndex].start, _newOffsetX - LineSettings.CrossRadius);
                            _crossOffsetXs[_crossIndex].end = Math.max(_crossOffsetXs[_crossIndex].end, _newOffsetX + LineSettings.CrossRadius);

                            //判断合入下一个范围
                            if (_crossIndex < _crossOffsetXs.length - 1 && _crossOffsetXs[_crossIndex].end >= _crossOffsetXs[_crossIndex + 1].start) {
                                _crossOffsetXs[_crossIndex].end = _crossOffsetXs[_crossIndex + 1].end;
                                _crossOffsetXs.splice(_crossIndex + 1, 1);
                            }

                            inserted = true;
                            break;
                        }
                    }
                }
                if (!inserted) {
                    _crossOffsetXs.push({ start: _newOffsetX - LineSettings.CrossRadius, end: _newOffsetX + LineSettings.CrossRadius });
                }
                return _crossOffsetXs;
            }

            //最后一点修正为箭尾
            if (_PointsEndWithArrowTailPoint.length > 0)
                _PointsEndWithArrowTailPoint[_PointsEndWithArrowTailPoint.length - 1] = LineSettings.GetArrowTailPoint(thisLine.endPoint, thisLine.endDirection);

            //画线
            $(_PointsEndWithArrowTailPoint).each(function (index) {
                if (index == 0)
                    pathDefine = "M" + this.x + "," + this.y + " ";
                if (index < _PointsEndWithArrowTailPoint.length - 1) {
                    var thisPoint = _PointsEndWithArrowTailPoint[index];
                    var next = _PointsEndWithArrowTailPoint[index + 1];
                    //绘制交点
                    if (drawCrossPoints
                        //水平线
                        && thisPoint.y == next.y
                        && Math.abs(thisPoint.x - next.x) >= LineSettings.CornerRadius * 2 + LineSettings.CrossRadius * 2) {
                        var crossOffsetXs = [];
                        $(thisLine.crossPoints).each(function () {
                            if (this.y == thisPoint.y
                                && this.x > Math.min(thisPoint.x, next.x) + LineSettings.CornerRadius + LineSettings.CrossRadius
                                && this.x < Math.max(thisPoint.x, next.x) - LineSettings.CornerRadius - LineSettings.CrossRadius) {
                                joinToCrossOffsetX(crossOffsetXs, this.x);
                            }
                        });

                        if (crossOffsetXs && crossOffsetXs.length > 0) {
                            if (this.x < next.x) {
                                //添加拱点
                                for (var crossIndex = 0; crossIndex < crossOffsetXs.length; crossIndex++) {
                                    pathDefine += " H " + crossOffsetXs[crossIndex].start + " a" + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " 0 0 1 " + LineSettings.CrossRadius + " -" + LineSettings.CrossRadius + " H" + (crossOffsetXs[crossIndex].end - LineSettings.CrossRadius) + " a" + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " 0 0 1 " + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " ";
                                }
                            }
                            else {
                                //添加拱点
                                for (var crossIndex = crossOffsetXs.length - 1; crossIndex >= 0 ; crossIndex--) {
                                    pathDefine += " H " + crossOffsetXs[crossIndex].end + " a" + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " 0 0 0 -" + LineSettings.CrossRadius + " -" + LineSettings.CrossRadius + " H" + (crossOffsetXs[crossIndex].start + LineSettings.CrossRadius) + " a" + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " 0 0 0 -" + LineSettings.CrossRadius + " " + LineSettings.CrossRadius + " ";
                                }
                            }
                        };
                    }

                    //绘制到当前线的终点
                    if (index == _PointsEndWithArrowTailPoint.length - 2)
                        pathDefine += "L " + next.x + " " + next.y + " ";
                    else {
                        //更下一个点
                        var nexter = _PointsEndWithArrowTailPoint[index + 2];
                        if (Math.abs(thisPoint.x - next.x) + Math.abs(thisPoint.y - next.y) > LineSettings.CornerRadius * 2
                            && Math.abs(next.x - nexter.x) + Math.abs(next.y - nexter.y) > LineSettings.CornerRadius * 2
                            && (nexter.x - this.x != 0 && nexter.y - this.y != 0)) {
                            var x = LineSettings.CornerRadius * (nexter.x - this.x) / Math.abs(nexter.x - this.x);
                            var y = LineSettings.CornerRadius * (nexter.y - this.y) / Math.abs(nexter.y - this.y);

                            //圆弧方向，默认为逆时针
                            var sweep_flag = 0;
                            if ((thisPoint.x > nexter.x && thisPoint.x == next.x && thisPoint.y < nexter.y)
                                || (thisPoint.x > nexter.x && thisPoint.y == next.y && thisPoint.y > nexter.y)
                                || (thisPoint.x < nexter.x && thisPoint.x == next.x && thisPoint.y > nexter.y)
                                || (thisPoint.x < nexter.x && thisPoint.y == next.y && thisPoint.y < nexter.y)) {
                                sweep_flag = 1;
                            }
                            if (thisPoint.x == next.x) {
                                pathDefine += "L" + thisPoint.x + " " + (next.y - y) + " ";
                            }
                            else {
                                pathDefine += "L" + (next.x - x) + " " + thisPoint.y + " ";
                            }
                            pathDefine += "a" + LineSettings.CornerRadius + " " + LineSettings.CornerRadius + " 0 0 " + sweep_flag + " " + x + " " + y + " ";
                        }
                        else {
                            pathDefine += "L " + next.x + " " + next.y + " ";
                        }
                    }
                }
            });

            if (pathDefine) {
                if (!this.Path) {
                    this.Path = $(document.createElementNS("http://www.w3.org/2000/svg", "path"))
                                .attr("fill", "white").attr("fill-opacity", "0")
                                .attr("stroke", LineSettings.LineColor)
                                .attr("stroke-width", LineSettings.LineWidth)
                                .appendTo(svg);
                }

                this.Path.attr("d", pathDefine);
            }

            //绘制箭头
            var getArrowPoints = function (_point, _direction) {
                var _points = _point.x + "," + _point.y + " ";
                switch (_direction) {
                    case LineArrowDirection.Left:
                        _points += (_point.x - LineSettings.ArrowLength) + "," + (_point.y - LineSettings.ArrowWidth) + " " + (_point.x - LineSettings.ArrowLength) + "," + (_point.y + LineSettings.ArrowWidth);
                        break;
                    case LineArrowDirection.Down:
                        _points += (_point.x - LineSettings.ArrowWidth) + "," + (_point.y + LineSettings.ArrowLength) + " " + (_point.x + LineSettings.ArrowWidth) + "," + (_point.y + LineSettings.ArrowLength);
                        break;
                    case LineArrowDirection.Right:
                        _points += (_point.x + LineSettings.ArrowLength) + "," + (_point.y - LineSettings.ArrowWidth) + " " + (_point.x + LineSettings.ArrowLength) + "," + (_point.y + LineSettings.ArrowWidth);
                        break;
                    case LineArrowDirection.Up:
                        _points += (_point.x - LineSettings.ArrowWidth) + "," + (_point.y - LineSettings.ArrowLength) + " " + (_point.x + LineSettings.ArrowWidth) + "," + (_point.y - LineSettings.ArrowLength);
                        break;
                }
                return _points;
            }
            if (!this.Arrow)
                this.Arrow = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon")).attr("fill-opacity", "1")
                                    .attr("fill", LineSettings.ArrowFillColor)
                                    .attr("stroke", LineSettings.LineColor)
                                    .attr("stroke-width", LineSettings.LineWidth)
                                    .appendTo(svg);
            this.Arrow.attr("points", getArrowPoints(this.Points[this.Points.length - 1], this.endDirection));
        }
            //使用DIV绘线
        else {
            var _PointsEndWithArrowTailPoint = this.Points.slice();

            //画线的最后一点修正为箭尾
            if (_PointsEndWithArrowTailPoint.length > 0)
                _PointsEndWithArrowTailPoint[_PointsEndWithArrowTailPoint.length - 1] = LineSettings.GetArrowTailPoint(thisLine.endPoint, thisLine.endDirection);

            if (this.LineDiv)
                $(this.LineDiv).remove();
            var thisLineDiv = this.LineDiv = $("<div></div>").addClass("LineDiv").appendTo(workflow.workspace);
            var thisPoints = this.Points;
            $(_PointsEndWithArrowTailPoint).each(function (index) {
                if (index > 0)
                    $("<div></div>").addClass("SegementDiv")
                        .css("left", Math.min(this.x, thisPoints[index - 1].x))
                        .css("top", Math.min(this.y, thisPoints[index - 1].y))
                        .width(Math.abs(this.x - thisPoints[index - 1].x))
                        .height(Math.abs(this.y - thisPoints[index - 1].y))
                        .appendTo(thisLineDiv);
            });
            this.LineDiv.appendTo(workflow.workspace);

            if (this.Arrow)
                $(this.Arrow).remove();
            this.Arrow = $("<div></div>").addClass("LineArrow").css("left", this.Points[this.Points.length - 1].x).css("top", this.Points[this.Points.length - 1].y);
            switch (this.endDirection) {
                case LineArrowDirection.Left:
                    this.Arrow.addClass("LineArrow_Left");
                    break;
                case LineArrowDirection.Right:
                    this.Arrow.addClass("LineArrow_Right");
                    break;
                case LineArrowDirection.Up:
                    this.Arrow.addClass("LineArrow_Up");
                    break;
                case LineArrowDirection.Down:
                    this.Arrow.addClass("LineArrow_Down");
                    break;
            }
            this.Arrow.appendTo(workflow.workspace);
        }
        this.SetLineStyle();
        this.SetText();
    },

    SetLineStyle: function () {
        if (workflow.UtilizeSvg) {
            if (this.Formula || this.UtilizeElse) {
                this.Path.attr("stroke-dasharray", "5,3");
            }
            else {
                this.Path.removeAttr("stroke-dasharray");
            }
        }
        else {
            if (this.Formula || this.UtilizeElse) {
                this.LineDiv.css("broder-style", "dotted");
            }
            else {
                this.LineDiv.css("broder-style", "solid");
            };
        }
    },

    SetText: function () {
        if (!this.DisplayName) {
            if (this.Label) {
                this.Label.remove();
                this.Label = undefined;
            }
            return;
        }

        if (!this.Label) {
            this.Label = $("<div class='" + LineStyleClassName.Label + "'></div>").attr(LineSettings.Label_LineIDPropertyName, this.ID).appendTo(workflow.workspace);
            this.Label.bind("mousedown", function (e) { e.preventDefault(); });
        }

        if (this.DisplayName != this.Label.text())
            this.Label.text(this.DisplayName);



        if (this.Points) {
            var _X = this.TextX;
            var _Y = this.TextY;
            if (!_X && !_Y) {
                //如果没有设置文本位置,则显示到中间
                switch (this.Points.length) {
                    case 2:
                        _X = this.Points[0].x / 2 + this.Points[1].x / 2;
                        _Y = this.Points[0].y / 2 + this.Points[1].y / 2;
                        break;
                    case 3:
                        _X = this.Points[1].x / 2 + this.Points[2].x / 2;
                        _Y = this.Points[1].y / 2 + this.Points[2].y / 2;
                        break;
                    case 4:
                        _X = this.Points[1].x / 2 + this.Points[2].x / 2;
                        _Y = this.Points[1].y / 2 + this.Points[2].y / 2;
                        break;
                    case 5:
                        _X = this.Points[2].x / 2 + this.Points[3].x / 2;
                        _Y = this.Points[2].y / 2 + this.Points[3].y / 2;
                        break;
                    case 6:
                        _X = this.Points[2].x / 2 + this.Points[3].x / 2;
                        _Y = this.Points[2].y / 2 + this.Points[3].y / 2;
                        break;
                }
            }
            this.Label.css("left", _X).css("top", _Y);
            if (workflowMode == WorkflowMode.Designer)
                $(this.Label).move({ x: -$(this.Label).outerWidth() / 2, y: -$(this.Label).outerHeight() / 2 });
            else if (this.DisplayName) {
                var _Parent = $(this.Label).parent();
                $(this.Label).css("font-size", $(this.Label).css("font-size")).appendTo($("body:first"));

                var _Width = $(this.Label).outerWidth();
                var _Height = $(this.Label).outerHeight();

                $(this.Label).appendTo(_Parent);
                $(this.Label).move({ x: -_Width / 2, y: -_Height / 2 });
            }
        }
    },

    GetFontColor: function () {
        if (!this.FontColor)
            this.FontColor = LineSettings.DefaultFontColor;
        return this.FontColor;
    },

    SetFontColor: function () {
        var _div = $("<div></div>");
        if (!this.FontColor)
            this.FontColor = LineSettings.LineColor;
        _div.css("color", this.FontColor);
        this.FontColor = _div.css("color");

        if (this.Label) {
            $(this.Label).css("color", this.FontColor);
        }
    },

    GetFontSize: function () {
        if (!this.FontSize) {
            this.FontSize = LineSettings.DefaultFontSize;
        }
        return this.FontSize;
    },

    SetFontSize: function (_Size) {
        if (isNaN(this.FontSize) || parseInt(this.FontSize) <= 0)
            this.FontSize = LineSettings.DefaultFontSize;
        $(this.Label).css("font-size", this.FontSize + "px");

        var _FinialSize = $(this.Label).css("font-size");

        if (_FinialSize)
            this.FontSize = parseInt(_FinialSize.replace(/px/, ""));
    },

    //添加交点
    addCrossPoint: function (x, y, verticalLineId) {
        if (!this.crossPoints)
            this.crossPoints = [];
        this.crossPoints.push({
            x: x,
            y: y,
            verticalLineId: verticalLineId
        });
        this.needRedraw = true;
    },
    //移除与目标线的所有交点
    removeCrossPointToLine: function (lineId) {
        if (this.crossPoints && this.crossPoints.length > 0) {
            for (var index = this.crossPoints.length - 1 ; index >= 0; index--) {
                if (this.crossPoints[index].verticalLineId == lineId) {
                    this.crossPoints.splice(index, 1);
                    this.needRedraw = true;
                }
            }
        }
    },

    init: function (lineConfig) {
        // 线条的ID
        this.ID = lineConfig.ID;

        this.startActivity = lineConfig.startActivity;
        this.startPoint = lineConfig.startPoint;

        //画线开始时的方向
        this.startDirection = lineConfig.startDirection;
        //结束活动
        this.endActivity = lineConfig.endActivity;
        //结束方向
        this.endDirection = lineConfig.endDirection;
        //结束点
        this.endPoint = lineConfig.endPoint;

        //设置相对于活动原点的偏移
        this.setOffsetToActivity();

        this.crossPoints = this.crossPoints || [];

        return this;
    },

    //设置起、终点相对于所在活动的位移
    setOffsetToActivity: function () {
        // 相对于活动的位移百分比
        var offsetToActivity = function (point, activity) {
            if (point && activity)
                return {
                    x: (point.x - activity.left) / activity.width,
                    y: (point.y - activity.top) / activity.height
                };
        };

        if (this.startPoint)
            this.offsetToStartActivity = offsetToActivity(this.startPoint, this.startActivity);
        if (this.endPoint)
            this.offsetToEndActivity = offsetToActivity(this.endPoint, this.endActivity);
    },

    //选中
    Select: function () {
        //取消选中所有活动
        $(workflow.activities).each(function () {
            this.Unselect();
        });

        //取消选中其他线条
        for (var index = 0 ; index < workflow.lines.length; index++) {
            if (workflow.lines[index].ID != this.ID)
                workflow.lines[index].Unselect();
        }

        if (!this.isSelected) {
            this.isSelected = true;

            this.showHandler();
        }
        wp.DisplayProperties(this);
    },

    //选中线条控制点
    selectHandler: function (e) {
        //鼠标对象是线的控制点
        if ($(e.target).hasClass(LineStyleClassName.LineHandler)) {
            workflow.setMultiActionFlag(WorkflowMultiActionType.LineHandle);

            LineResizeStack.CurrentLine = undefined;
            var _SourceState = undefined;
            $(workflow.lines).each(function () {
                if (this.isSelected) {
                    LineResizeStack.CurrentLine = this;
                    _SourceState = TraceManager.GetWorkflowElementProperties(LineResizeStack.CurrentLine);
                }
            });

            if (!LineResizeStack.CurrentLine)
                return;

            LineResizeStack.CurrentHandler = $(e.target);

            $(document).unbind(LineSettings.LineHandleEventNamespace)
                .bind("mousemove" + LineSettings.LineHandleEventNamespace, function (e) {
                    //开始移动
                    if (!LineResizeStack.IsDrawing) {

                        LineResizeStack.IsDrawing = true;
                        //其他线条移除与当前线的交点并重绘
                        $(workflow.lines).each(function () {
                            this.removeCrossPointToLine(LineResizeStack.CurrentLine.ID);
                        });

                        $(workflow.lines).each(function () {
                            if (this.needRedraw)
                                this.draw(true);
                        });
                    }

                    if (LineResizeStack.CurrentHandler) {
                        //控制始、终点
                        if (LineResizeStack.CurrentHandler.hasClass(LineStyleClassName.StartPointHandler) || LineResizeStack.CurrentHandler.hasClass(LineStyleClassName.EndPointHandler)) {
                            //计算停靠信息
                            var dockPosition = workflow.calculateDockActivity(e);
                            var startPoint = LineResizeStack.CurrentLine.Points[0];
                            var endPoint = LineResizeStack.CurrentLine.Points[LineResizeStack.CurrentLine.Points.length - 1];
                            //调整起点
                            if (LineResizeStack.CurrentHandler.hasClass(LineStyleClassName.StartPointHandler)) {
                                if (dockPosition) {
                                    LineResizeStack.CurrentLine.startActivity = dockPosition.Activity;

                                    //起始点停靠到活动
                                    LineResizeStack.CurrentLine.startDirection = dockPosition.DockDirection;
                                    LineResizeStack.CurrentLine.startPoint = {
                                        x: dockPosition.x,
                                        y: dockPosition.y
                                    }
                                }
                                    //不停靠
                                else {
                                    LineResizeStack.CurrentLine.startPoint = {
                                        x: e.pageX - svg._offset().left,
                                        y: e.pageY - svg._offset().top
                                    };
                                    LineResizeStack.CurrentLine.startActivity = undefined;
                                    LineResizeStack.CurrentLine.startDirection = LineArrowDirection.Unspecified;
                                }
                                //移动到startPoint
                                $(LineResizeStack.CurrentHandler)
                                    .css("left", LineResizeStack.CurrentLine.startPoint.x)
                                    .css("top", LineResizeStack.CurrentLine.startPoint.y);
                            }
                            else if (LineResizeStack.CurrentHandler.hasClass(LineStyleClassName.EndPointHandler)) {
                                if (dockPosition) {
                                    LineResizeStack.CurrentLine.endActivity = dockPosition.Activity;

                                    //终点停靠到活动
                                    LineResizeStack.CurrentLine.endDirection = dockPosition.DockDirection;
                                    LineResizeStack.CurrentLine.endPoint = {
                                        x: dockPosition.x,
                                        y: dockPosition.y
                                    }
                                }
                                    //不停靠
                                else {
                                    LineResizeStack.CurrentLine.endActivity = undefined;
                                    LineResizeStack.CurrentLine.endDirection = LineArrowDirection.Unspecified;
                                    LineResizeStack.CurrentLine.endPoint = {
                                        x: e.pageX - svg._offset().left,
                                        y: e.pageY - svg._offset().top
                                    };
                                }
                                //移动到endPoint
                                $(LineResizeStack.CurrentHandler)
                                    .css("left", LineResizeStack.CurrentLine.endPoint.x)
                                    .css("top", LineResizeStack.CurrentLine.endPoint.y);
                            }

                            LineResizeStack.CurrentLine.setPoints();
                            //重新显示线段控制点
                            LineResizeStack.CurrentLine.refreshSegementHandler();
                        }
                            //控制对象是线段
                        else {
                            //固定点
                            LineResizeStack.CurrentLine.FixedPoint = true;

                            var prePointIndex = LineResizeStack.CurrentHandler.data("index");

                            if (prePointIndex) {
                                var x1 = LineResizeStack.CurrentLine.Points[prePointIndex].x;
                                var y1 = LineResizeStack.CurrentLine.Points[prePointIndex].y;
                                var x2 = LineResizeStack.CurrentLine.Points[prePointIndex + 1].x;
                                var y2 = LineResizeStack.CurrentLine.Points[prePointIndex + 1].y;

                                if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)) {
                                    //竖直线
                                    if (x1 == x2) {
                                        LineResizeStack.CurrentLine.Points[prePointIndex].x = e.pageX - svg._offset().left;
                                        LineResizeStack.CurrentLine.Points[prePointIndex + 1].x = e.pageX - svg._offset().left;

                                        //移动当前控制点
                                        $(LineResizeStack.CurrentHandler)
                                            .css("left", x1 / 2 + x2 / 2 - $(svg)._position().left);

                                        //上一条线段，如果不是起点，则将其控制点移到线段中间
                                        if (!$(LineResizeStack.CurrentHandler).prev().hasClass(LineStyleClassName.StartPointHandler))
                                            $(LineResizeStack.CurrentHandler).prev()
                                                .css("left", LineResizeStack.CurrentLine.Points[prePointIndex - 1].x / 2 + LineResizeStack.CurrentLine.Points[prePointIndex].x / 2);
                                        //下一条线段，如果不是终点，则将其控制点移到线段中间
                                        if (!$(LineResizeStack.CurrentHandler).next().hasClass(LineStyleClassName.EndPointHandler))
                                            $(LineResizeStack.CurrentHandler).next()
                                                .css("left", LineResizeStack.CurrentLine.Points[prePointIndex].x / 2 + LineResizeStack.CurrentLine.Points[prePointIndex + 1].x / 2);
                                    }
                                        //水平线
                                    else {
                                        LineResizeStack.CurrentLine.Points[prePointIndex].y = e.pageY - svg._offset().top;
                                        LineResizeStack.CurrentLine.Points[prePointIndex + 1].y = e.pageY - svg._offset().top;

                                        //移动当前控制点
                                        $(LineResizeStack.CurrentHandler).css("top", y1 / 2 + y2 / 2 + $(svg)._position().top);

                                        //上一条线段，如果不是起点，则将其控制点移到线段中间
                                        if (!$(LineResizeStack.CurrentHandler).prev().hasClass(LineStyleClassName.StartPointHandler))
                                            $(LineResizeStack.CurrentHandler).prev()
                                                .css("top", LineResizeStack.CurrentLine.Points[prePointIndex - 1].y / 2 + LineResizeStack.CurrentLine.Points[prePointIndex].y / 2);
                                        //下一条线段，如果不是终点，则将其控制点移到线段中间
                                        if (!$(LineResizeStack.CurrentHandler).next().hasClass(LineStyleClassName.EndPointHandler))
                                            $(LineResizeStack.CurrentHandler).next()
                                                .css("top", LineResizeStack.CurrentLine.Points[prePointIndex + 1].y / 2 + LineResizeStack.CurrentLine.Points[prePointIndex + 2].y / 2);
                                    }
                                }
                            }
                        }
                        //重绘线
                        LineResizeStack.CurrentLine.draw();
                    }
                });
            $(document).one("mouseup" + LineSettings.LineHandleEventNamespace, function (e) {
                workflow.setMultiActionFlag(WorkflowMultiActionType.None);

                $(document).unbind(LineSettings.LineHandleEventNamespace);
                if (LineResizeStack.IsDrawing) {
                    LineResizeStack.IsDrawing = false;
                    //停止画线时，若线条起点或终点未停靠活动，则移除线条
                    if (!LineResizeStack.CurrentLine.startActivity || !LineResizeStack.CurrentLine.endActivity) {
                        //添加线条移除的痕迹
                        TraceManager.AddTrace(TraceManager.TraceType.Line.Remove, LineResizeStack.CurrentLine, _SourceState);

                        workflow.removeLine(LineResizeStack.CurrentLine.ID);
                        $("." + LineStyleClassName.LineHandler).remove();
                    }
                    else {
                        LineResizeStack.CurrentLine.calculateCrossPoints();
                        //重绘交叉的线
                        $(workflow.lines).each(function () {
                            if (this.needRedraw)
                                this.draw(true);
                        });
                        //添加线条调整的痕迹
                        TraceManager.AddTrace(TraceManager.TraceType.Line.PointChange, LineResizeStack.CurrentLine, _SourceState);
                    }
                }
            });
            return false;
        }
    },
    //计算交叉点，并标记需重绘的线段为needRedraw
    calculateCrossPoints: function () {
        var thisLine = this;
        this.crossPoints = [];

        var _ArrowTailPoints = {};
        $(workflow.lines).each(function () {
            this.removeCrossPointToLine(thisLine.ID);

            _ArrowTailPoints[this.ID] = LineSettings.GetArrowTailPoint(this.endPoint, this.endDirection);
        });

        //更新交叉点
        $(thisLine.Points).each(function (indexI) {
            if (indexI > 0) {
                //当前线段起、终点
                var currentSegementStartPoint = thisLine.Points[indexI - 1];
                var currentSegementEndPoint = thisLine.Points[indexI];
                //最末点，以箭尾处进行计算
                if (indexI == thisLine.Points.length - 1)
                    currentSegementEndPoint = _ArrowTailPoints[thisLine.ID];

                //计算与当前线的交叉点，重绘所有交叉线条
                $(workflow.lines).each(function () {
                    if (this.ID != thisLine.ID) {
                        var otherLine = this;
                        $(otherLine.Points).each(function (indexJ) {
                            if (indexJ > 0) {
                                var otherSegementStartPoint = otherLine.Points[indexJ - 1];
                                var otherSegementEndPoint = otherLine.Points[indexJ];
                                if (indexJ == otherLine.Points.length - 1)
                                    otherSegementEndPoint = _ArrowTailPoints[otherLine.ID];

                                //当前线是水平线
                                if (currentSegementStartPoint.y == currentSegementEndPoint.y
                                    //其他线是竖直线
                                    && otherSegementStartPoint.x == otherSegementEndPoint.x
                                    && Math.min(currentSegementStartPoint.x, currentSegementEndPoint.x) + LineSettings.CornerRadius + LineSettings.CrossRadius < otherSegementStartPoint.x
                                    && Math.max(currentSegementStartPoint.x, currentSegementEndPoint.x) - LineSettings.CornerRadius - LineSettings.CrossRadius > otherSegementStartPoint.x
                                    && currentSegementStartPoint.y > Math.min(otherSegementStartPoint.y, otherSegementEndPoint.y) + LineSettings.CornerRadius + LineSettings.CrossRadius
                                    && currentSegementStartPoint.y < Math.max(otherSegementStartPoint.y, otherSegementEndPoint.y) - LineSettings.CornerRadius - LineSettings.CrossRadius) {
                                    thisLine.addCrossPoint(otherSegementStartPoint.x, currentSegementStartPoint.y, otherLine.ID);
                                }
                                    //其他线是水平线
                                else if (otherSegementStartPoint.y == otherSegementEndPoint.y
                                    //当前线是竖直线
                                    && currentSegementStartPoint.x == currentSegementEndPoint.x
                                    && Math.min(otherSegementStartPoint.x, otherSegementEndPoint.x) + LineSettings.CornerRadius + LineSettings.CrossRadius < currentSegementStartPoint.x
                                    && Math.max(otherSegementStartPoint.x, otherSegementEndPoint.x) - LineSettings.CornerRadius - LineSettings.CrossRadius > currentSegementStartPoint.x
                                    && otherSegementStartPoint.y > Math.min(currentSegementStartPoint.y, currentSegementEndPoint.y) + LineSettings.CornerRadius + LineSettings.CrossRadius
                                    && otherSegementStartPoint.y < Math.max(currentSegementStartPoint.y, currentSegementEndPoint.y) - LineSettings.CornerRadius - LineSettings.CrossRadius) {
                                    otherLine.addCrossPoint(currentSegementStartPoint.x, otherSegementStartPoint.y, thisLine.ID);
                                }
                            }
                        });
                    }
                });
            }
        });
    },

    //显示控制点
    showHandler: function () {
        LineResizeStack.CurrentLine = this;
        //将折线分段
        var points = this.Points.slice();
        if (points && points.length > 0) {
            var handler = $("<div class='" + LineStyleClassName.LineHandler + "' ></div>")

            //显示起点控制点
            handler.clone()
                .css("left", points[0].x + svg._position().left)
                .css("top", points[0].y + svg._position().top)
                .addClass(LineStyleClassName.StartPointHandler)
                .appendTo(svg.parent())
                .bind("mousedown" + LineSettings.LineHandleEventNamespace, this.selectHandler);

            //显示终点控制点
            handler.clone()
                .css("left", points[points.length - 1].x + svg._position().left)
                .css("top", points[points.length - 1].y + svg._position().top)
                .addClass(LineStyleClassName.EndPointHandler)
                .appendTo(svg.parent())
                .bind("mousedown" + LineSettings.LineHandleEventNamespace, this.selectHandler);

            this.refreshSegementHandler();
        }
    },

    //更新线段控制点
    refreshSegementHandler: function () {
        $("." + LineStyleClassName.HorizontalSegementHandler).remove();
        $("." + LineStyleClassName.VerticalSegementHandler).remove();

        var handler = $("<div class='" + LineStyleClassName.LineHandler + "' ></div>")
        var points = this.Points;
        var thisLine = this;
        //线段中间加控制点
        $(points).each(function (index) {
            if (index > 0 && index < points.length - 2) {
                var pre_x = this.x;
                var pre_y = this.y;
                var next_x = points[index + 1].x;
                var next_y = points[index + 1].y;

                //竖线
                if (pre_x == next_x) {
                    //放到结束控制点前
                    handler.clone()
                        .data("index", index)
                        .css("left", $(svg)._position().left + pre_x)
                        .css("top", $(svg)._position().top + pre_y / 2 + next_y / 2)
                        //添加可水平移动的鼠标样式
                        .addClass(LineStyleClassName.HorizontalSegementHandler)
                        .bind("mousedown" + LineSettings.LineHandleEventNamespace, thisLine.selectHandler)
                        .insertBefore("." + LineStyleClassName.EndPointHandler);
                }
                    //水平线
                else {
                    //放到结束控制点前
                    handler.clone()
                        .data("index", index)
                        .css("left", $(svg)._position().left + pre_x / 2 + next_x / 2)
                        .css("top", $(svg)._position().top + pre_y)
                        //添加可竖直移动的鼠标样式
                        .addClass(LineStyleClassName.VerticalSegementHandler)
                        .bind("mousedown" + LineSettings.LineHandleEventNamespace, thisLine.selectHandler)
                        .insertBefore("." + LineStyleClassName.EndPointHandler);
                }
            }
        });
    },

    //取消选中
    Unselect: function () {
        this.isSelected = false;

        if (LineResizeStack.CurrentLine && LineResizeStack.CurrentLine.ID == this.ID) {
            LineResizeStack.CurrentLine = undefined;
            LineResizeStack.CurrentHandler = undefined;

            $("." + LineStyleClassName.LineHandler).remove();
        }
        if ((workflowMode == WorkflowMode.Designer || workflowMode == WorkflowMode.ViewWithProperty) && wp.CurrentObject == this) {
            wp.DisplayProperties(workflow);
        }
    },

    //线条的鼠标事件
    doDown: function (e) {
        if (workflowMode == WorkflowMode.ViewOnly)
            return;

        wp.DisplayProperties(this);

        this.Select();
    },
    doUp: function (e) {
    },
    beginDrawing: function () {
        //线条ID
        LineDrawStack.CurrentLine = this;
        //自动画线
        LineDrawStack.CurrentLine.autoDraw();
        $(document).unbind(LineSettings.LineHandleEventNamespace).bind("mousemove" + LineSettings.LineHandleEventNamespace, function (e) {
            LineDrawStack.CurrentLine.endPoint = {
                x: e.pageX - svg._offset().left,
                y: e.pageY - svg._offset().top
            };
            //必须离开过活动才开始绘制
            if (!LineDrawStack.IsDrawing) {
                workflow.setMultiActionFlag(WorkflowMultiActionType.LineDraw);

                if (LineDrawStack.CurrentLine.endPoint.x < LineDrawStack.CurrentLine.startActivity.left
                    || LineDrawStack.CurrentLine.endPoint.x > LineDrawStack.CurrentLine.startActivity.left + LineDrawStack.CurrentLine.startActivity.width
                    || LineDrawStack.CurrentLine.endPoint.y < LineDrawStack.CurrentLine.startActivity.top
                    || LineDrawStack.CurrentLine.endPoint.y > LineDrawStack.CurrentLine.startActivity.top + LineDrawStack.CurrentLine.startActivity.height)
                    LineDrawStack.IsDrawing = true;
            }

            if (LineDrawStack.IsDrawing) {
                LineDrawStack.CurrentLine.endPoint = {
                    x: e.pageX - svg._offset().left,
                    y: e.pageY - svg._offset().top
                };
                //计算修正停靠点
                var _dockPosition = workflow.calculateDockActivity(e);
                if (_dockPosition) {
                    LineDrawStack.CurrentLine.endActivity = _dockPosition.Activity;
                    LineDrawStack.CurrentLine.endDirection = _dockPosition.DockDirection;
                    LineDrawStack.CurrentLine.endPoint = {
                        x: _dockPosition.x,
                        y: _dockPosition.y
                    }
                }
                else {
                    LineDrawStack.CurrentLine.endActivity = undefined;
                    LineDrawStack.CurrentLine.endDirection = LineArrowDirection.Unspecified;
                    LineDrawStack.CurrentLine.endPoint = {
                        x: e.pageX - svg._offset().left,
                        y: e.pageY - svg._offset().top
                    }
                }
                //计算
                LineDrawStack.CurrentLine.setPoints();
                //绘制
                LineDrawStack.CurrentLine.draw();
            }
        });
        $(document).one("mouseup" + LineSettings.LineHandleEventNamespace, function (e) {
            workflow.setMultiActionFlag(WorkflowMultiActionType.None);

            if (!LineDrawStack.CurrentLine.endActivity)
                workflow.removeLine(LineDrawStack.CurrentLine.ID);
            else {
                if (LineDrawStack.CurrentLine.Points && LineDrawStack.CurrentLine.Points.length > 0) {
                    LineDrawStack.CurrentLine.endPoint = LineDrawStack.CurrentLine.Points[LineDrawStack.CurrentLine.Points.length - 1];
                }
                LineDrawStack.CurrentLine.calculateCrossPoints();
                $(workflow.lines).each(function () {
                    if (this.needRedraw)
                        this.draw(true);
                });

                TraceManager.AddTrace(TraceManager.TraceType.Line.Add, LineDrawStack.CurrentLine);
            }

            LineDrawStack.IsDrawing = false;

            $(document).unbind(LineSettings.LineHandleEventNamespace);
        });
    },
    //自动绘制到下一个活动
    autoDraw: function () {
        var thisLine = LineDrawStack.CurrentLine;
        //距离总值
        var distance = Number.POSITIVE_INFINITY;

        //点在线上的位移与边长的百分比
        var pointPerceageToEdgeLine = 0.5;
        switch (this.startDirection) {
            case LineArrowDirection.Up:
                pointPerceageToEdgeLine = (this.startPoint.x - thisLine.startActivity.left) / thisLine.startActivity.width;
                $(workflow.activities).each(function () {
                    //寻找在出发方向上的最近的活动
                    if (this.top + this.height < LineDrawStack.CurrentLine.startActivity.top) {
                        var _currentDistance = Math.abs(this.left + this.width * pointPerceageToEdgeLine - LineDrawStack.CurrentLine.startPoint.x) * LineSettings.VerticalPerceage + (thisLine.startActivity.top - (this.top + this.height));
                        if (_currentDistance < distance) {
                            distance = _currentDistance;
                            LineDrawStack.CurrentLine.endActivity = this;
                        }
                    }
                });
                //画线，选取起始活动、结束活动的等比例位置
                if (LineDrawStack.CurrentLine.endActivity)
                    LineDrawStack.CurrentLine.endPoint = {
                        x: LineDrawStack.CurrentLine.endActivity.left + LineDrawStack.CurrentLine.endActivity.width * pointPerceageToEdgeLine,
                        y: LineDrawStack.CurrentLine.endActivity.top + LineDrawStack.CurrentLine.endActivity.height
                    }
                break;
            case LineArrowDirection.Down:
                pointPerceageToEdgeLine = (LineDrawStack.CurrentLine.startPoint.x - LineDrawStack.CurrentLine.startActivity.left) / LineDrawStack.CurrentLine.startActivity.width;
                $(workflow.activities).each(function () {
                    if (this.top > thisLine.startActivity.top + LineDrawStack.CurrentLine.startActivity.height) {
                        var _currentDistance = Math.abs(this.left + this.width * pointPerceageToEdgeLine - LineDrawStack.CurrentLine.startPoint.x) * LineSettings.VerticalPerceage + (this.top - LineDrawStack.CurrentLine.startActivity.top - LineDrawStack.CurrentLine.startActivity.height);
                        if (_currentDistance < distance) {
                            distance = _currentDistance;
                            LineDrawStack.CurrentLine.endActivity = this;
                        }
                    }
                });
                if (LineDrawStack.CurrentLine.endActivity)
                    LineDrawStack.CurrentLine.endPoint = {
                        x: LineDrawStack.CurrentLine.endActivity.left + LineDrawStack.CurrentLine.endActivity.width * pointPerceageToEdgeLine,
                        y: LineDrawStack.CurrentLine.endActivity.top
                    }
                break;
            case LineArrowDirection.Left:
                pointPerceageToEdgeLine = (LineDrawStack.CurrentLine.startPoint.y - thisLine.startActivity.top) / LineDrawStack.CurrentLine.startActivity.height;
                $(workflow.activities).each(function () {
                    if (this.left + this.width < LineDrawStack.CurrentLine.startActivity.left) {
                        var _currentDistance = Math.abs(this.top + this.height * pointPerceageToEdgeLine - LineDrawStack.CurrentLine.startPoint.y) * LineSettings.VerticalPerceage + (LineDrawStack.CurrentLine.startActivity.left - this.left - this.width);
                        if (_currentDistance < distance) {
                            distance = _currentDistance;
                            LineDrawStack.CurrentLine.endActivity = this;
                        }
                    }
                });
                if (LineDrawStack.CurrentLine.endActivity)
                    LineDrawStack.CurrentLine.endPoint = {
                        x: LineDrawStack.CurrentLine.endActivity.left + LineDrawStack.CurrentLine.endActivity.width,
                        y: LineDrawStack.CurrentLine.endActivity.top + LineDrawStack.CurrentLine.endActivity.height * pointPerceageToEdgeLine
                    }
                break;
            case LineArrowDirection.Right:
                pointPerceageToEdgeLine = (LineDrawStack.CurrentLine.startPoint.y - thisLine.startActivity.top) / LineDrawStack.CurrentLine.startActivity.height;
                $(workflow.activities).each(function () {
                    if (this.left > LineDrawStack.CurrentLine.startActivity.left + LineDrawStack.CurrentLine.startActivity.width) {
                        var _currentDistance = Math.abs(this.top + this.height * pointPerceageToEdgeLine - LineDrawStack.CurrentLine.startPoint.y) * LineSettings.VerticalPerceage + (this.left - LineDrawStack.CurrentLine.startActivity.left - LineDrawStack.CurrentLine.startActivity.width);
                        if (_currentDistance < distance) {
                            distance = _currentDistance;
                            LineDrawStack.CurrentLine.endActivity = this;
                        }
                    }
                });
                if (LineDrawStack.CurrentLine.endActivity)
                    LineDrawStack.CurrentLine.endPoint = {
                        x: LineDrawStack.CurrentLine.endActivity.left,
                        y: LineDrawStack.CurrentLine.endActivity.top + LineDrawStack.CurrentLine.endActivity.height * pointPerceageToEdgeLine
                    }
                break;
        }

        var _Drawable = true;
        //自动选择与开始方向相反的方向
        if (LineDrawStack.CurrentLine.endActivity) {
            if (LineDrawStack.CurrentLine.endActivity.ToolTipText == "Start") {
                _Drawable = false;
            }
            else {
                var thisLineId = this.ID;
                //如果已经存在从开始到结束活动的连接线，则返回
                for (var index = 0; index < workflow.lines.length; index++) {
                    if (workflow.lines[index].ID != thisLineId
                        && ((workflow.lines[index].startActivity == LineDrawStack.CurrentLine.startActivity && workflow.lines[index].endActivity == LineDrawStack.CurrentLine.endActivity)
                            || (workflow.lines[index].endActivity == LineDrawStack.CurrentLine.startActivity && workflow.lines[index].startActivity == LineDrawStack.CurrentLine.endActivity)))
                        _Drawable = false;
                }
            }

            if (!_Drawable) {
                LineDrawStack.CurrentLine.endDirection = LineArrowDirection.Unspecified;
                LineDrawStack.CurrentLine.endPoint = undefined;
                LineDrawStack.CurrentLine.endActivity = undefined;
            }
            else {
                //结束方向与起始方向相反
                LineDrawStack.CurrentLine.endDirection = LineArrowDirection.Opposite(LineDrawStack.CurrentLine.startDirection);

                LineDrawStack.CurrentLine.setPoints();
                LineDrawStack.CurrentLine.draw();
            }
        }
    }
}