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
    /// DateTime : 2017/12/23 18:49:21
 
    /// </summary>
    public class TransportOrdersService : BaseService, ITransportOrdersService
    {
        /// <summary>
        /// 是否存在该单号
        /// </summary>
        /// <param name="OrderNum"></param>
        /// <returns></returns>
        public bool HasOrderNum(string OrderNum)
        {

            string sql = "select count(*) from TransportOrders where OrderNum='" + OrderNum + "'";
            int result = DbConnection.CreateInstance().ExecuteScalar(sql);
            if (result > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
