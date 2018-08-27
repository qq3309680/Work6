using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace CommonTool.Workflow
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/12/11 15:39:20

    /// Description : 流程模板工具类
    /// </summary>
    public class WorkflowHelper
    {
        /// <summary>
        /// 获取节点集合
        /// </summary>
        /// <param name="source">xml数据源</param>
        /// <param name="xPath">节点路劲</param>
        /// <returns></returns>
        public static List<ActivityModel> GetActivities(XmlNode source, string xPath)
        {
            List<ActivityModel> activites = new List<ActivityModel>();
            XmlNodeList ApproveActivityList = XMLHelper.GetNodeList(source, xPath);
            try
            {
                foreach (XmlNode activity in ApproveActivityList)
                {
                    ActivityModel activityModel = new ActivityModel();
                    activityModel.ActivityType = (int)(ActivityType)Enum.Parse(typeof(ActivityType), XMLHelper.GetNodeValue(activity, "ActivityType"), false);
                    activityModel.ClassName = XMLHelper.GetNodeValue(activity, "ClassName");
                    activityModel.DisplayName = XMLHelper.GetNodeValue(activity, "Text");
                    activityModel.ToolTipText = XMLHelper.GetNodeValue(activity, "ActivityType");
                    activityModel.ActivityCode = XMLHelper.GetNodeValue(activity, "ActivityCode");
                    activityModel.SortKey = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "SortKey"));
                    activityModel.Description = XMLHelper.GetNodeValue(activity, "Description");
                    activityModel.Height = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "Height"));
                    activityModel.Width = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "Width"));
                    activityModel.X = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "X"));
                    activityModel.Y = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "Y"));
                    activityModel.IsActivity = true;
                    activityModel.IsEnd = false;
                    activityModel.IsApproveActivity = true;
                    activityModel.FullName = XMLHelper.GetNodeValue(activity, "ActivityCode") + " " + XMLHelper.GetNodeValue(activity, "Text");
                    activityModel.FontSize = Convert.ToInt32(XMLHelper.GetNodeValue(activity, "FontSize"));
                    activityModel.EntryCondition = XMLHelper.GetNodeValue(activity, "EntryCondition");
                    activityModel.FontColor = XMLHelper.GetNodeValue(activity, "Brush");
                    activityModel.ID = XMLHelper.GetNodeValue(activity, "ID");
                    activityModel.Participants = XMLHelper.GetNodeValue(activity, "Participants");
                    activites.Add(activityModel);
                }
            }
            catch (Exception e)
            {
                
                throw;
            }
        
            return activites;
        }

    }
}
