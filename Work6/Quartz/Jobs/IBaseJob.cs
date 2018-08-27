using Domain;
using log4net;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace Work6.Quartz.Jobs
{
    /// <summary>
    /// IBaseJob 的摘要说明
    /// </summary>
    public class IBaseJob : IJob
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(IBaseJob));
        private delegate void TimeToGo(ZD_SyncTaskConfig plan);

        private void ThreadMethod(Object obj)
        {
            ZD_SyncTaskConfig plan = (ZD_SyncTaskConfig)obj;
            TimeToGo planJob = new TimeToGo(JobMethod);
            planJob(plan);
        }

        public void Execute(IJobExecutionContext context)
        {
            IJobDetail jobDetail = context.JobDetail;
            ZD_SyncTaskConfig plan = (ZD_SyncTaskConfig)jobDetail.JobDataMap.Get("Plan");
            try
            {
                DateTime SyncSuccessBeginTime = DateTime.Now;

                //开辟新线程处理
                Thread thread = new Thread(ThreadMethod);
                thread.Start(plan);
                //TimeToGo planJob = new TimeToGo(JobMethod);
                //planJob(plan);
                //JobMethod(plan);
                plan.SyncSuccessBeginTime = SyncSuccessBeginTime;
                MissionSyncHelper.PlanSuccessUpdate(plan);
            }
            catch (Exception e)
            {
                MissionSyncHelper.PlanFailUpdate(plan);
                _logger.InfoFormat(e.Message.ToString());
                throw;
            }
        }
        /// <summary>
        /// 只需重写该虚拟方法便可
        /// </summary>
        /// <param name="plan"></param>
        public virtual void JobMethod(ZD_SyncTaskConfig plan) { }
    }
}