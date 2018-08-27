using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/10/11 14:59:02

    /// Description : 
    /// </summary>
    public class ZD_SyncTaskConfig
    {
        public ZD_SyncTaskConfig()
        {
            //
            // TODO: 在此处添加构造函数逻辑
            //
        }
        public string ObjectId { get; set; }
        public string MissionCode { get; set; }
        public string MissionName { get; set; }
        public DateTime SyncTime { get; set; }
        /// <summary>
        /// 成功执行完成时间
        /// </summary>
        public DateTime SyncSuccessTime { get; set; }
        /// <summary>
        /// 成功执行开始时间
        /// </summary>
        public DateTime SyncSuccessBeginTime { get; set; }
        public int IsAyncSuccess { get; set; }
        public string JobClassName { get; set; }
        public int State { get; set; }
        public string CronExplain { get; set; }
        public string HostName { get; set; }
    }
}
