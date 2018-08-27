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
    /// DateTime : 2017/3/24 16:51:07

    /// Description : 
    /// </summary>
    public class BaseService : IBaseService
    {
        /// <summary>
        /// 分页查询
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="PageSize"></param>
        /// <param name="PageIndex"></param>
        /// <param name="OrderBy"></param>
        /// <param name="TotalCount"></param>
        /// <param name="sql"></param>
        /// <param name="whereObj"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        public List<T> SimplePageQuery<T>(int PageSize, int PageIndex, String OrderBy, out int TotalCount, string sql, object whereObj = null, string DbConnectStr = "")
        {
            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).SimplePageQuery<T>(PageSize, PageIndex, OrderBy, out TotalCount, sql, whereObj);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).SimplePageQuery<T>(PageSize, PageIndex, OrderBy, out TotalCount, sql, whereObj);
            }
        }

        public List<T> SelectData<T>(string sql, string DbConnectStr = "")
        {
            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).SimpleQuery<T>(sql);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).SimpleQuery<T>(sql);
            }

        }

        public int DeleteSigerData<T>(Dictionary<string, Object> dicParam, string DbConnectStr = "")
        {

            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).DeleteSigerData<T>(dicParam);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).DeleteSigerData<T>(dicParam);
            }

        }


        /// <summary>
        /// 插入数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataList"></param>
        /// <returns></returns>
        public int Insert<T>(object data, string DbConnectStr = "")
        {
            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).Insert<T>(typeof(T).Name, (T)data);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).Insert<T>(typeof(T).Name, (T)data);
            }

        }

        /// <summary>
        /// 批量插入数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataList"></param>
        /// <returns></returns>
        public int InsertBatch<T>(object dataList, string DbConnectStr = "")
        {
            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).InsertBatch<T>(typeof(T).Name, (List<T>)dataList);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).InsertBatch<T>(typeof(T).Name, (List<T>)dataList);
            }

        }


        /// <summary>
        /// 跟新数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Param"></param>
        /// <param name="dataList"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        public int UpdateTable<T>(object data, Dictionary<string, object> Param = null, string DbConnectStr = "")
        {
            if (DbConnectStr == "")
            {
                return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).UpdateTable<T>(typeof(T).Name, (T)data, Param);
            }
            else
            {
                return DapperHelper.CreateInstance(DbConnectStr).UpdateTable<T>(typeof(T).Name, (T)data, Param);
            }
        }
    }
}
