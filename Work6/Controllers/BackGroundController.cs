using BaseEnvironment;
using CommonTool;
using CommonTool.DBHelper;
using CommonTool.Workflow;
using Work6.Models.Admin;
using Work6.Quartz;
using Work6.Quartz.JobScheduler;
using Domain;
using IService;
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;

namespace Work6.Controllers
{
    public class BackGroundController : BaseController
    {
        private static readonly ILog _logger = LogManager.GetLogger(typeof(BackGroundController));


        private IAdminMenuService _adminMenuService;
        private IZD_SyncTaskConfigService _zD_SyncTaskConfigService;
        private IOT_WorkflowTemplateDraftService _workflowTemplateDraftService;


        public BackGroundController(IAdminMenuService adminMenuService, IZD_SyncTaskConfigService zD_SyncTaskConfigService, IOT_WorkflowTemplateDraftService workflowTemplateDraftService)
        {
            this._adminMenuService = adminMenuService;
            this._zD_SyncTaskConfigService = zD_SyncTaskConfigService;
            this._workflowTemplateDraftService = workflowTemplateDraftService;
        }


        //
        // GET: /BackGround/
        /// <summary>
        /// 管理系统后台主页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //这里只做了三层菜单:不做太深，不要太复杂,使用方便.
            List<ManagerPageMenuModel> list = new List<ManagerPageMenuModel>();

            List<AdminMenu> listMenu = _adminMenuService.GetRootMenu();
            foreach (var item in listMenu)
            {
                ManagerPageMenuModel pageMenuModel = new ManagerPageMenuModel();
                pageMenuModel.ObjectId = item.ObjectId;
                pageMenuModel.ParentObjectId = item.ParentObjectId;
                pageMenuModel.DisplayName = item.DisplayName;
                pageMenuModel.IsLeaf = item.IsLeaf;
                pageMenuModel.IsRoot = item.IsRoot;
                pageMenuModel.Href = item.Href;
                pageMenuModel.Sort = item.Sort;
                pageMenuModel.Level = item.Level;
                pageMenuModel.IconImg = item.IconImg;
                if (!item.IsLeaf)
                {
                    pageMenuModel.SonMenuModel = GetSonMenu(item);
                }
                else
                {
                    pageMenuModel.SonMenuModel = null;
                }
                list.Add(pageMenuModel);
            }

            return View(list);
        }
        /// <summary>
        /// 迭代获得所需的结构菜单
        /// </summary>
        /// <returns></returns>
        public List<ManagerPageMenuModel> GetSonMenu(AdminMenu menuModel)
        {

            List<ManagerPageMenuModel> sonList = new List<ManagerPageMenuModel>();
            List<AdminMenu> listTaget = _adminMenuService.GetMenuListByParentId(menuModel.ObjectId);

            foreach (var item in listTaget)
            {
                ManagerPageMenuModel sonModel = new ManagerPageMenuModel();
                sonModel.ObjectId = item.ObjectId;
                sonModel.ParentObjectId = item.ParentObjectId;
                sonModel.DisplayName = item.DisplayName;
                sonModel.IsLeaf = item.IsLeaf;
                sonModel.IsRoot = item.IsRoot;
                sonModel.Href = item.Href;
                sonModel.Sort = item.Sort;
                sonModel.Level = item.Level;
                sonModel.IconImg = item.IconImg;
                if (!menuModel.IsLeaf)
                {
                    sonModel.SonMenuModel = GetSonMenu(item);
                }
                else
                {
                    sonModel.SonMenuModel = null;
                }
                sonList.Add(sonModel);
            }
            return sonList;
        }


        /// <summary>
        /// 定时任务页面
        /// </summary>
        /// <returns></returns>
        public ActionResult TaskPlan()
        {
            return View();
        }

        /// <summary>
        /// 编辑单个定时任务页面
        /// </summary>
        /// <returns></returns>
        public ActionResult TaskPlanPage()
        {
            return View();
        }
        /// <summary>
        /// 定时任务数据变更
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult EditTaskPlan(ZD_SyncTaskConfig model, string type)
        {

            int scalCount = 0;
            switch (type)
            {
                case "change":
                    List<ZD_SyncTaskConfig> planList = _zD_SyncTaskConfigService.SelectData<ZD_SyncTaskConfig>("select * from ZD_SyncTaskConfig where ObjectId='" + model.ObjectId + "'");
                    planList[0].MissionName = model.MissionName;
                    planList[0].MissionCode = model.MissionCode;
                    planList[0].JobClassName = model.JobClassName;
                    planList[0].State = model.State;
                    planList[0].CronExplain = model.CronExplain;
                    scalCount = _zD_SyncTaskConfigService.UpdateTable<ZD_SyncTaskConfig>(planList[0]);
                    break;
                case "add":
                    model.ObjectId = Guid.NewGuid().ToString();
                    model.SyncTime = DateTime.Now;
                    model.SyncSuccessTime = DateTime.Now;
                    model.SyncSuccessBeginTime = DateTime.Now;
                    scalCount = _zD_SyncTaskConfigService.Insert<ZD_SyncTaskConfig>(model);
                    break;
                default:
                    break;
            }

            if (scalCount > 0)
            {
                return AjaxJson(true, 1, "成功.", "");
            }
            else
            {

                return AjaxJson(false, 0, "", "失败.");
            }
        }

        /// <summary>
        /// 删除任务数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult DeleteTaskPlan(string MissionCodes)
        {
            int successCount = DapperHelper.CreateInstance().DeleteManyData("ZD_SyncTaskConfig", MissionCodes);
            if (successCount > 0)
            {
                return AjaxJson(true, 1, "成功.", "");
            }
            else
            {
                return AjaxJson(false, 0, "", "失败.");

            }

        }


        #region 启用定时任务
        public ActionResult StartPlan(string MissionCodes)
        {

            ZD_SyncTaskConfig plan = new ZD_SyncTaskConfig();
            plan = MissionSyncHelper.GetTaskInfoByCode(MissionCodes);
            plan.State = 1;
            string HostName = Dns.GetHostName();
            plan.HostName = HostName;
            MissionSyncHelper.UpdateMissionPlan(plan);
            //启动定时任务
            JobScheduler.Start(plan);
            _logger.InfoFormat(plan.MissionName + "=============启动时间时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            return AjaxJson(true, "", "", "");
        }
        #endregion

        #region 停止定时任务
        public ActionResult StopPlan(string MissionCodes)
        {
            ZD_SyncTaskConfig plan = new ZD_SyncTaskConfig();
            plan = MissionSyncHelper.GetTaskInfoByCode(MissionCodes);
            plan.State = 0;
            MissionSyncHelper.UpdateMissionPlan(plan);
            //启动定时任务
            JobScheduler.Stop(plan);
            _logger.InfoFormat(plan.MissionName + "=============禁止时间时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            return AjaxJson(true, "", "", "");
        }
        #endregion
        /// <summary>
        /// 任务配置数据
        /// </summary>
        /// <returns></returns>
        public string TaskConfigData()
        {
            string sql = @"SELECT [ObjectId], [MissionCode]
      ,[MissionName]
      ,[SyncTime]
      ,[SyncSuccessTime]
      ,[IsAyncSuccess]
      ,[JobClassName]
      ,[State]
      ,[CronExplain],[SyncSuccessBeginTime],[HostName] 
  FROM [ZD_SyncTaskConfig]";

            List<ZD_SyncTaskConfig> list = DapperHelper.CreateInstance().SimpleQuery<ZD_SyncTaskConfig>(sql);

            //处理时间格式
            List<Dictionary<string, object>> lists = new List<Dictionary<string, object>>();

            foreach (var item in list)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                foreach (var dc in item.GetType().GetProperties())
                {
                    if (dc.PropertyType == typeof(DateTime) & dc.GetValue(item) != DBNull.Value)
                        result.Add(dc.Name, ((DateTime)dc.GetValue(item)).ToString("yyyy-MM-dd HH:mm:ss"));
                    else
                        result.Add(dc.Name, dc.GetValue(item) == null ? "" : dc.GetValue(item).ToString());
                }
                lists.Add(result);
            }

            return CreateLigerUIGridData(lists.ToArray());
        }

        #region 创建LigerUI表格的数据，已序列化
        /// <summary>
        /// 创建LigerUI表格的数据，已序列化
        /// </summary>
        /// <param name="rowOjb"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public string CreateLigerUIGridData(object[] rowOjb)
        {
            int totalCount = rowOjb == null ? 0 : rowOjb.Length;
            int startIndex = 0;
            int endIndex = totalCount;

            List<Object> objList = new List<object>();

            for (int i = startIndex; i < endIndex; i++)
            {
                objList.Add((rowOjb as object[])[i]);
            }

            var jsonObj = new { Rows = objList, Total = totalCount };
            return new JavaScriptSerializer().Serialize(jsonObj);
        }

        #endregion

        #region 流程图设计器
        /// <summary>
        /// 画图页面
        /// </summary>
        /// <returns></returns>
        public ActionResult DesignerPage()
        {
            List<OT_WorkflowTemplateDraft> modelList = _workflowTemplateDraftService.SelectData<OT_WorkflowTemplateDraft>(@"SELECT [ObjectID]
      ,[Content]
      ,[Creator]
      ,[ModifiedBy]
      ,[CreatedTime]
      ,[ModifiedTime]
      ,[WorkflowCode]
      ,[BizObjectSchemaCode]
      ,[ParentObjectID]
      ,[ParentPropertyName]
      ,[ParentIndex]
  FROM [DataMip].[dbo].[OT_WorkflowTemplateDraft]");
            OT_WorkflowTemplateDraft model = modelList[0];
            var WorkflowPackage = XMLHelper.GetRootNode(model.Content);
            WorkflowTemplate workflowTemplate = new WorkflowTemplate();
            workflowTemplate.WorkflowCode = XMLHelper.GetNodeValue(WorkflowPackage, "WorkflowCode");
            workflowTemplate.InstanceName = XMLHelper.GetNodeValue(WorkflowPackage, "InstanceName");
            workflowTemplate.Creator = modelList[0].Creator;
            workflowTemplate.ModifiedBy = modelList[0].ModifiedBy;
            workflowTemplate.CreatedTime = Convert.ToString( modelList[0].CreatedTime);
            workflowTemplate.ModifiedTime = Convert.ToString(modelList[0].ModifiedTime);
            workflowTemplate.Description = XMLHelper.GetNodeValue(WorkflowPackage, "Description");
            workflowTemplate.Height = 0;
            workflowTemplate.Width = 0;
            workflowTemplate.BizObjectSchemaCode = XMLHelper.GetNodeValue(WorkflowPackage, "BizObjectSchemaCode");
            List<ActivityModel> activites = new List<ActivityModel>();


            #region 获取开始节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/StartActivity"));

         
            #endregion
            #region 获取结束节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/EndActivity"));
          
            #endregion
            #region 获取手工节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/FillSheetActivity"));
          
            #endregion
            #region 获取传阅节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/CirculateActivity"));
      
            #endregion
            #region 获取连接点节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/ConnectionActivity"));
          
            #endregion
            #region 获取业务动作节点
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/BizActionActivity"));
        
            #endregion
            #region 获取审批节点集合
            activites.AddRange(WorkflowHelper.GetActivities(WorkflowPackage, "Activities/ApproveActivity"));
     
            #endregion
          
            workflowTemplate.Activities = activites;




            List<LineRuleModel> rules = new List<LineRuleModel>();
            XmlNodeList ruleList = XMLHelper.GetNodeList(WorkflowPackage, "Rules/Rule");
            foreach (XmlNode rule in ruleList)
            {
                LineRuleModel ruleModel = new LineRuleModel();
                ruleModel.DisplayName = XMLHelper.GetNodeValue(rule, "Text");
                ruleModel.IsRule = true;
                ruleModel.PreActivityCode = XMLHelper.GetNodeValue(rule, "PreActivityCode");
                ruleModel.PostActivityCode = XMLHelper.GetNodeValue(rule, "PostActivityCode");
                ruleModel.UtilizeElse = Convert.ToBoolean(XMLHelper.GetNodeValue(rule, "UtilizeElse"));
                ruleModel.FixedPoint = Convert.ToBoolean(XMLHelper.GetNodeValue(rule, "FixedPoint"));
                ruleModel.Formula = XMLHelper.GetNodeValue(rule, "Formula");
                ruleModel.TextX = XMLHelper.GetNodeValue(rule, "TextX");
                ruleModel.TextY = XMLHelper.GetNodeValue(rule, "TextX");
                XmlNodeList pointList = XMLHelper.GetNodeList(rule, "Points/Point");
                List<string> points = new List<string>();
                foreach (XmlNode item in pointList)
                {
                    points.Add(item.InnerText);
                }
                ruleModel.Points = points;
                ruleModel.FontSize = Convert.ToInt32(XMLHelper.GetNodeValue(rule, "FontSize"));
                ruleModel.FontColor = XMLHelper.GetNodeValue(rule, "FontColor");
                ruleModel.ID = XMLHelper.GetNodeValue(rule, "ID");
                rules.Add(ruleModel);
            }
            workflowTemplate.Rules = rules;
            ViewData["WorkflowTemplate"] = new JavaScriptSerializer().Serialize(workflowTemplate);
            return View();
        }
        /// <summary>
        /// Iframe静态页
        /// </summary>
        /// <returns></returns>
        public ActionResult WorkflowThumbnail()
        {
            return View();
        }
        #endregion
    }
}
