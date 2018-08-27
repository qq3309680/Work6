using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
namespace BaseEnvironment
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/15 10:19:46
   
    /// Description : 网站基础数据
    /// </summary>
    public class BaseApplication
    {

        public static string DefaultSqlConnectionKey = ConfigurationManager.AppSettings["SqlConnectionKey"];

    }
}
