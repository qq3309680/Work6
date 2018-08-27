using Autofac;
using Autofac.Integration.Mvc;
using Work6.Quartz;
using log4net;
using Quartz;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Caching;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Topshelf;

namespace Work6
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        private static readonly log4net.ILog log = LogManager.GetLogger(typeof(MvcApplication));
        private const string DummyPageUrl = "http://localhost:8010/Portal/KeepAlive/KeepAlivePage.aspx";
        private const string DummyCacheItemKey = "DummyCacheItemKey";

        protected void Application_Start()
        {
            log.Info("网站启动...");

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            MissionSyncHelper.StartPlan();
            AutofacRegiester();
          

            ////启动定时任务
            // ReportJobScheduler.Start();
            //JobScheduler.Start<TestJob>("0/3 * * * * ?", "testJobTrigger", "testJobGroup");
            //JobScheduler.Start<BankCardJob>("0/5 * * * * ?", "BankCardJobTrigger", "BankCardJobGroup");


        }

        // 注册一缓存条目在5分钟内到期，到期后触发的调事件  
        private void RegisterCacheEntry()
        {
            if (null != HttpContext.Current.Cache[DummyCacheItemKey]) return;
            HttpContext.Current.Cache.Add(DummyCacheItemKey, "Cache", null, DateTime.MaxValue,
                TimeSpan.FromMinutes(5), CacheItemPriority.NotRemovable,
                new CacheItemRemovedCallback(CacheItemRemovedCallback));
        }

        // 缓存项过期时程序模拟点击页面，阻止应用程序结束  
        public void CacheItemRemovedCallback(string key, object value, CacheItemRemovedReason reason)
        {
            HitPage();
        }

        // 模拟点击网站网页  
        private void HitPage()
        {
            Type type = System.Reflection.MethodBase.GetCurrentMethod().DeclaringType;
            log4net.ILog _logger = log4net.LogManager.GetLogger(type);
            _logger.InfoFormat("缓存过期执行回调函数...");
            System.Net.WebClient client = new System.Net.WebClient();
            client.DownloadData(DummyPageUrl);


        }

        //protected void Application_BeginRequest(Object sender, EventArgs e)
        //{
        //    if (HttpContext.Current.Request.Url.ToString() == DummyPageUrl)
        //    {
        //        RegisterCacheEntry();
        //    }
        //}
        /// <summary>
        /// Autofac Ioc注册
        /// </summary>
        private void AutofacRegiester()
        {
            // 创建你的builder
            var builder = new ContainerBuilder();
            // 通常你只关心这个接口的一个实现
            builder.RegisterAssemblyTypes(Assembly.Load("Service")).AsImplementedInterfaces();
            //注册所有的Controller
            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            IContainer container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}