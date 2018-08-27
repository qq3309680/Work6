using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTool.Workflow
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/12/11 15:37:15
 
    /// Description : 流程模板配置
    /// </summary>
    public class WorkflowTemplate
    {
        public string WorkflowCode { get; set; }
        public string InstanceName { get; set; }
        public string Creator { get; set; }
        public string ModifiedBy { get; set; }
        public string CreatedTime { get; set; }
        public string ModifiedTime { get; set; }
        public string Description { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public string BizObjectSchemaCode { get; set; }
        public List<ActivityModel> Activities { get; set; }
        public List<LineRuleModel> Rules { get; set; }

    }

    /// <summary>
    /// 节点连线模型
    /// </summary>
    public class LineRuleModel
    {
        public string DisplayName { get; set; }
        public bool IsRule { get; set; }
        public string PreActivityCode { get; set; }
        public string PostActivityCode { get; set; }
        public bool UtilizeElse { get; set; }
        public bool FixedPoint { get; set; }
        public string Formula { get; set; }
        public string TextX { get; set; }
        public string TextY { get; set; }
        /// <summary>
        /// 例子： "Points": [ "272,333","272,370"]
        /// </summary>
        public List<string> Points { get; set; }
        public int FontSize { get; set; }
        public string FontColor { get; set; }
        public string ID { get; set; }

    }

    public enum ActivityType
    {
        Start = 0,//开始节点
        End = 1,//结束节点
        FillSheet = 3,//手工节点
        Approve = 4,//审批节点
        Circulate = 25,//传阅节点
        Connection = 2,//连接点节点
        BizAction = 28//业务动作节点
    }

    /// <summary>
    /// 流程图节点配置
    /// </summary>
    public class ActivityModel
    {

        /// <summary>
        /// 节点类型
        /// </summary>
        public int ActivityType { get; set; }

        public string ClassName { get; set; }
        /// <summary>
        /// 节点名称
        /// </summary>
        public string DisplayName { get; set; }
        /// <summary>
        /// 汽包名称
        /// </summary>
        public string ToolTipText { get; set; }
        /// <summary>
        /// 节点编码
        /// </summary>
        public string ActivityCode { get; set; }
        public int SortKey { get; set; }
        public string Description { get; set; }
        /// <summary>
        /// 节点高度
        /// </summary>
        public int Height { get; set; }
        /// <summary>
        /// 节点宽度
        /// </summary>
        public int Width { get; set; }
        /// <summary>
        /// 横轴位置
        /// </summary>
        public int X { get; set; }
        /// <summary>
        /// 竖轴位置
        /// </summary>
        public int Y { get; set; }
        /// <summary>
        /// 是否节点
        /// </summary>
        public bool IsActivity { get; set; }
        /// <summary>
        /// 是否结束节点
        /// </summary>
        public bool IsEnd { get; set; }
        /// <summary>
        /// 是否审批节点
        /// </summary>
        public bool IsApproveActivity { get; set; }
        public string FullName { get; set; }
        public int FontSize { get; set; }
        /// <summary>
        /// 到达规则
        /// </summary>
        public string EntryCondition { get; set; }
        public string FontColor { get; set; }
        public string ID { get; set; }
        /// <summary>
        /// 参与人
        /// </summary>
        public string Participants { get; set; }
    }
}
