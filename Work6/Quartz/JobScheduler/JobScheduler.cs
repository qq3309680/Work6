using Domain;
using log4net;
using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Work6.Quartz.JobScheduler
{
    /// <summary>
    /// 定时任务调度器
    /// </summary>
    public class JobScheduler
    {
        private static readonly ILog _logger = LogManager.GetLogger(typeof(JobScheduler));
        //静态单例模式
        private static readonly IScheduler _scheduler = StdSchedulerFactory.GetDefaultScheduler();
        //static JobScheduler() { }
        //private JobScheduler() { }
        public static IScheduler Instance { get { return _scheduler; } }


        public static void Start(ZD_SyncTaskConfig plan)
        {
            try
            {
                IScheduler scheduler = _scheduler;
                if (scheduler.IsStarted)
                {

                }
                else
                {

                }
                scheduler.Start();
                IDictionary<string, Object> jobData = new Dictionary<string, Object>();
                jobData.Add("Plan", plan);
                //Type objType = typeof(T);
                Type objType = Type.GetType("Work6.Quartz.Jobs." + plan.JobClassName.Trim());
                IJobDetail job = JobBuilder.Create(objType)
                    .WithIdentity(plan.JobClassName.Trim(), plan.JobClassName.Trim() + "GroupName")
                    .SetJobData(new JobDataMap(jobData))
                    .Build();
                ITrigger trigger;
                trigger = TriggerBuilder.Create()
          .WithIdentity(plan.JobClassName.Trim() + "TriggerName", plan.JobClassName.Trim() + "GroupName")
          .WithCronSchedule(plan.CronExplain.Trim())
          .ForJob(job)
          .Build();
                scheduler.ScheduleJob(job, trigger);
                _logger.InfoFormat(plan.MissionName + "=============启动时间时间：" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

            }
            catch (Exception e)
            {
                _logger.InfoFormat("=============");
                _logger.InfoFormat(e.Message.ToString());
                throw;
            }



        }

        public static void Stop(ZD_SyncTaskConfig plan)
        {
            IScheduler scheduler = _scheduler;
            TriggerKey triggerKey = new TriggerKey(plan.JobClassName.Trim() + "TriggerName");
            scheduler.DeleteJob(new JobKey(plan.JobClassName.Trim(), plan.JobClassName.Trim() + "GroupName"));

        }
    }

}