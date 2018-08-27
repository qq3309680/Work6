using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace BaseEnvironment
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/15 15:04:35
    
    /// Description : 
    /// </summary>
    public class BaseController : Controller
    {

        /// <summary>
        ///  重写，允许Get请求访问
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        protected internal new JsonResult Json(object data)
        {
            return Json(data, null /* contentEncoding */, JsonRequestBehavior.AllowGet);
        }



        /// <summary>
        /// 返回Json格式数据
        /// </summary>
        /// <param name="returnData"></param>
        /// <returns></returns>
        public ActionResult AjaxJson(AjaxReturnData returnData)
        {
            return this.Json(returnData);
        }

        /// <summary>
        ///  返回Json格式数据(重载)
        /// </summary>
        /// <param name="states"></param>
        /// <param name="resultObject"></param>
        /// <param name="message"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public ActionResult AjaxJson(bool states, Object resultObject, string message, string errorMessage)
        {
            AjaxReturnData returnData = new AjaxReturnData();
            returnData.States = states;
            returnData.Data = resultObject;
            returnData.Message = message;
            returnData.ErrorMessage = errorMessage;
            return AjaxJson(returnData);
        }
    }
}
