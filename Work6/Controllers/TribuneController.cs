using BaseEnvironment;
using CommonTool;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Work6.Controllers
{
    public class TribuneController : BaseController
    {
        //
        // GET: /Tribune/

        public ActionResult Index()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            //dic.Add("secretKey", "8a90899456fd0bdd0156fd4a1db6001b");
            //dic.Add("userNo", "000091");
            dic.Add("param", "000091");
            HttpWebResponse res = HttpRequestHelper.CreatePostHttpResponse("http://localhost:8010/Portal/KeepAlive/KeepAlivePage.aspx/KeepAliveData", dic, null, "", Encoding.UTF8, null);
            //HttpWebResponse res = HttpRequestHelper.CreatePostHttpResponse("http://localhost:56403/Tribune/HttpTest", dic, null, "", Encoding.UTF8, null);
              Stream stream = res.GetResponseStream();
            //StreamReader类的Read方法依次读取网页源程序代码每一行的内容，直至行尾（读取的编码格式：UTF8）   
            StreamReader respStreamReader = new StreamReader(stream, Encoding.UTF8);
            string s = respStreamReader.ReadToEnd();
            return View();

        }

        public ActionResult Answer()
        {

            return View();
        }

        public ActionResult HttpTest(string secretKey, string userNo)
        {
            return Json(new { secretKey = secretKey, userNo = userNo });
        }
    }
}
