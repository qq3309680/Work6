using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace CommonTool
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/27 10:37:37

    /// Description : 
    /// </summary>
    public class CookieHelper
    {
        public static void SetCookie(string name, string key, string value, DateTime expired, string domain, string path)
        {
            if (!String.IsNullOrEmpty(name))
            {
                HttpCookie cookie = null;
                if (HttpContext.Current.Request.Cookies[name] != null)
                    cookie = HttpContext.Current.Request.Cookies[name];
                else
                    cookie = new HttpCookie(name);
                if (!String.IsNullOrEmpty(domain))
                    cookie.Domain = domain;
                cookie.Path = path;
                cookie.Expires = expired;
                if (String.IsNullOrEmpty(key))
                    cookie.Value = HttpUtility.UrlEncode(value);
                else
                    cookie[key] = HttpUtility.UrlEncode(value);
                HttpContext.Current.Response.AppendCookie(cookie);
            }
        }
        public static void SetCookie(string name, string value, DateTime expired)
        {
            SetCookie(name, string.Empty, value, expired, string.Empty, "/");
        }
        public static void SetCookie(string name, string key, string value, DateTime expired)
        {
            SetCookie(name, key, value, expired, string.Empty, "/");
        }
        public static void SetCookie(string name, string key, string value, DateTime expired, string domain)
        {
            SetCookie(name, key, value, expired, domain, "/");
        }
        public static void SetCookie(string name, string value, DateTime expired, string domain)
        {
            SetCookie(name, string.Empty, value, expired, domain, "/");
        }
        public static string GetCookie(string name, string key)
        {
            string value = string.Empty;
            HttpCookie cookie = null;
            if (HttpContext.Current.Request.Cookies[name] != null)
            {
                cookie = HttpContext.Current.Request.Cookies[name];
                if (String.IsNullOrEmpty(key))
                    value = HttpContext.Current.Server.UrlDecode(cookie.Value);
                else if (cookie[key] != null)
                    value = HttpContext.Current.Server.UrlDecode(cookie[key]);
                else
                    value = string.Empty;

            }
            return value;
        }

        public static void RemoveCookie(string name, string key)
        {
            HttpCookie cookie = null;
            if (HttpContext.Current.Request.Cookies[name] != null)
            {
                cookie = HttpContext.Current.Request.Cookies[name];
                cookie.Values.Remove(key);
                HttpContext.Current.Response.AppendCookie(cookie);
            }
        }
        public static void RemoveCookie(string name)
        {
            HttpCookie cookie = null;
            if (HttpContext.Current.Request.Cookies[name] != null)
            {
                cookie = HttpContext.Current.Request.Cookies[name];
                TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                cookie.Expires = DateTime.Now.Add(ts);
                HttpContext.Current.Response.AppendCookie(cookie);
            }
        }
    }
}
