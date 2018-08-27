using BaseEnvironment;
using CommonTool.DBHelper;
using IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/20 10:48:35
 
    /// Description : 
    /// </summary>
    public class PrimaryKeyTestService : IPrimaryKeyTestService
    {

        public int InsertTable(string FiledsName, object arrayList)
        {
            return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).InsertBatch("PrimaryKeyTest", FiledsName, arrayList);
        }
    }
}
