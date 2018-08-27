
using CommonTool.DBHelper;
using Domain;
using IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BaseEnvironment;
namespace Service
{
    public class UsersService : IUsersService
    {

        public List<TransportUsers> SimpleQuery(string sql, object whereObj)
        {
            return DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).SimpleQuery<TransportUsers>(sql, whereObj);
        }
    }
}