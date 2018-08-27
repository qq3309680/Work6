using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace CommonTool
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/27 10:42:09

    /// Description : .Net原生支持的内存缓存
    /// </summary>
    public class CacheHelper
    {
        static Cache RuntimeCache = null;
       
        static CacheHelper()
        {
            RuntimeCache = HttpRuntime.Cache;
        }


        /// <summary>  
        /// 设置数据缓存  
        /// </summary>  
        public static void SetCache(string cacheKey, object objObject)
        {
            var objCache = HttpRuntime.Cache;
            objCache.Insert(cacheKey, objObject);
        }

        /// <summary>
        /// 根据key缓存数据
        /// </summary>
        /// <param name="key"></param>
        /// <param name="o"></param>
        public void SetCache(string cacheKey, object objObject, int timeout = 3600000)
        {
            try
            {
                if (objObject == null) return;
                var objCache = HttpRuntime.Cache;
                //相对过期  
                //objCache.Insert(cacheKey, objObject, null, DateTime.MaxValue, timeout, CacheItemPriority.NotRemovable, null);  
                //绝对过期时间  
                objCache.Insert(cacheKey, objObject, null, DateTime.Now.AddSeconds(timeout), TimeSpan.Zero);
            }
            catch (Exception)
            {
                //throw;  
            }
        }

        /// <summary>
        /// 根据key获取缓存数据
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public T Get<T>(string cacheKey)
        {
            T objCache = (T)HttpRuntime.Cache.Get(cacheKey);
            return objCache;
        }
        /// <summary>
        /// 移除Cache
        /// </summary>
        /// <param name="key"></param>
        public void Remove(string key)
        {
            RuntimeCache.Remove(key);
        }
        /// <summary>
        /// 判断是否存在某项缓存
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public bool IsContains(string key)
        {
            return RuntimeCache[key] == null ? false : true;
        }


    }
}
