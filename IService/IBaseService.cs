using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IService
{
    public interface IBaseService
    {
        /// <summary>
        /// 分页
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="PageSize"></param>
        /// <param name="PageIndex"></param>
        /// <param name="OrderBy"></param>
        /// <param name="sql"></param>
        /// <param name="whereObj"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        List<T> SimplePageQuery<T>(int PageSize, int PageIndex, String OrderBy, out int TotalCount, string sql, object whereObj = null, string DbConnectStr = "");
        /// <summary>
        /// 查询数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        List<T> SelectData<T>(string sql, string DbConnectStr = "");
        /// <summary>
        /// 插入数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        int Insert<T>(object data, string DbConnectStr = "");
        /// <summary>
        /// 批量插入数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dataList"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        int InsertBatch<T>(object dataList, string DbConnectStr = "");
        /// <summary>
        /// 更新数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Param"></param>
        /// <param name="dataList"></param>
        /// <param name="DbConnectStr"></param>
        /// <returns></returns>
        int UpdateTable<T>(object data, Dictionary<string, object> Param = null, string DbConnectStr = "");
        /// <summary>
        /// 删除单条数据
        /// </summary>
        /// <param name="TableName"></param>
        /// <param name="dicParam"></param>
        /// <returns></returns>
        int DeleteSigerData<T>(Dictionary<string, Object> dicParam, string DbConnectStr = "");
    }
}
