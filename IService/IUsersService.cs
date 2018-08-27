
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IService
{
    public interface IUsersService
    {
        List<TransportUsers> SimpleQuery(string sql, object whereObj);
    }
}
