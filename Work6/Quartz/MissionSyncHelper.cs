using CommonTool.DBHelper;
using Domain;
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Work6.Quartz
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/10/19 16:23:13
    
    /// Description : 
    /// </summary>
    public class MissionSyncHelper
    {
        private static readonly ILog _logger = LogManager.GetLogger(typeof(MissionSyncHelper));
        public MissionSyncHelper()
        {
            //
            // TODO: 在此处添加构造函数逻辑
            //

        }

        /// <summary>
        /// 应用程序启动时从新启动已开启的任务
        /// </summary>
        public static void StartPlan()
        {
            try
            {
                string sql = @"SELECT [ObjectId], [MissionCode]
      ,[MissionName]
      ,[SyncTime]
      ,[SyncSuccessTime]
      ,[IsAyncSuccess]
      ,[JobClassName]
      ,[State]
      ,[CronExplain],[SyncSuccessBeginTime],[HostName] FROM [ZD_SyncTaskConfig] where State=1 and HostName='" + Dns.GetHostName() + "'";

                var dataList = DapperHelper.CreateInstance().SimpleQuery<ZD_SyncTaskConfig>(sql);
                if (dataList.Count > 0)
                {
                    foreach (var item in dataList)
                    {
                        ZD_SyncTaskConfig result = new ZD_SyncTaskConfig();
                        result.ObjectId = item.ObjectId + string.Empty;
                        result.MissionCode = item.MissionCode + string.Empty;
                        result.MissionName = item.MissionName + string.Empty;
                        result.SyncSuccessTime = item.SyncSuccessTime;
                        result.SyncTime = item.SyncTime;
                        result.SyncSuccessBeginTime = item.SyncSuccessBeginTime;
                        result.IsAyncSuccess = item.IsAyncSuccess;
                        result.State = 1;
                        result.JobClassName = item.JobClassName + string.Empty;
                        result.CronExplain = item.CronExplain + string.Empty;
                        result.HostName = item.HostName + string.Empty;
                        JobScheduler.JobScheduler.Start(result);
                    }
                }



            }
            catch (Exception e)
            {
                _logger.InfoFormat(e.Message.ToString());
                throw;
            }



        }


        /// <summary>
        /// 通过任务编码获得任务信息
        /// </summary>
        /// <param name="missionCode"></param>
        /// <returns></returns>
        public static ZD_SyncTaskConfig GetTaskInfoByCode(string missionCode)
        {

            string sql = @"SELECT [ObjectId], [MissionCode]
      ,[MissionName]
      ,[SyncTime]
      ,[SyncSuccessTime]
      ,[IsAyncSuccess]
      ,[JobClassName]
      ,[State]
      ,[CronExplain],[SyncSuccessBeginTime],[HostName] FROM [ZD_SyncTaskConfig] where MissionCode='" + missionCode + "'";

            var dataTable = DapperHelper.CreateInstance().SimpleQuery<ZD_SyncTaskConfig>(sql);
            ZD_SyncTaskConfig result = new ZD_SyncTaskConfig();
            if (dataTable.Count > 0)
            {
                result.ObjectId = dataTable[0].ObjectId;
                result.MissionCode = missionCode;
                result.MissionName = dataTable[0].MissionName + string.Empty;
                result.SyncSuccessTime = dataTable[0].SyncSuccessTime;
                result.SyncTime = dataTable[0].SyncTime;
                result.SyncSuccessBeginTime = dataTable[0].SyncSuccessBeginTime;
                result.IsAyncSuccess = dataTable[0].IsAyncSuccess;
                result.State = dataTable[0].State;
                result.JobClassName = dataTable[0].JobClassName + string.Empty;
                result.CronExplain = dataTable[0].CronExplain + string.Empty;
                result.HostName = dataTable[0].HostName + string.Empty;
            }
            else
            {
                result = null;
            }
            return result;
        }


        public static bool UpdateMissionPlan(ZD_SyncTaskConfig model)
        {

            int result = DapperHelper.CreateInstance().UpdateTable<ZD_SyncTaskConfig>("ZD_SyncTaskConfig", model);
            if (result > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        #region 任务执行成功更新状态
        public static bool PlanSuccessUpdate(ZD_SyncTaskConfig model)
        {
            model.IsAyncSuccess = 1;//成功
            model.SyncTime = DateTime.Now;
            model.SyncSuccessTime = DateTime.Now;
            bool flag = UpdateMissionPlan(model);
            if (flag)
            {
                _logger.InfoFormat(model.MissionName + "=============成功执行时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "=============");
                return true;
            }
            else
            {
                _logger.InfoFormat(model.MissionName + "=============更新状态失败=============");
                return false;
            }
        }
        #endregion

        #region 任务执行失败更新状态
        public static bool PlanFailUpdate(ZD_SyncTaskConfig model)
        {
            model.IsAyncSuccess = 0;//失败
            model.SyncTime = DateTime.Now;
            bool flag = UpdateMissionPlan(model);
            if (flag)
            {
                _logger.InfoFormat(model.MissionName + "=============执行失败=============");
                return true;
            }
            else
            {
                _logger.InfoFormat(model.MissionName + "=============更新状态失败=============");
                return false;
            }
        }
        #endregion

    }
}
