using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseEnvironment
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/15 14:07:56
   
    /// Description : 对Ajax请求封装的标准返回值格式
    /// </summary>
    public class AjaxReturnData
    {
        public bool States { get; set; }
        public object Data { get; set; }
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
    }
}
