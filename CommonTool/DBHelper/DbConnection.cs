using BaseEnvironment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonTool.DBHelper
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/28 16:53:34

    /// Description : 数据库连接帮助类(暂时只支持sql servcr)
    /// </summary>
    public class DbConnection
    {
        public static DapperHelper CreateInstance(string connectionKey = null)
        {
            if (connectionKey==null)
            {
                return new DapperHelper(BaseApplication.DefaultSqlConnectionKey);
            }
            else
            {
                return new DapperHelper(connectionKey);
            }
        }
    }
}
