using BaseEnvironment;
using CommonTool.DBHelper;
using Domain;
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
    /// DateTime : 2017/3/24 17:47:50

    /// Description : 
    /// </summary>
    public class AdminMenuService : BaseService, IAdminMenuService
    {
        /// <summary>
        /// 获得所有菜单
        /// </summary>
        /// <returns></returns>
        public List<AdminMenu> GetAllMenu()
        {
            string sql = " select * from AdminMenu";
            return DbConnection.CreateInstance().SimpleQuery<AdminMenu>(sql);
        }

        /// <summary>
        /// 获得根节点菜单（一级菜单）
        /// </summary>
        /// <returns></returns>
        public List<AdminMenu> GetRootMenu()
        {
            string sql = "select * from AdminMenu where Level=1";
            return DbConnection.CreateInstance().SimpleQuery<AdminMenu>(sql);
        }

        /// <summary>
        /// 根据父节点Id获得菜单集合
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public List<AdminMenu> GetMenuListByParentId(string parentId)
        {
            string sql = "select * from AdminMenu where ParentObjectId='" + parentId + "'";
            return DbConnection.CreateInstance().SimpleQuery<AdminMenu>(sql);
        }


        /// <summary>
        /// 根据Object获得菜单数据
        /// </summary>
        /// <param name="objectId"></param>
        /// <returns></returns>
        public AdminMenu GetMenuByObjectId(string objectId)
        {
            string sql = "select * from AdminMenu where ObjectId='" + objectId + "'";
            var list = DbConnection.CreateInstance().SimpleQuery<AdminMenu>(sql);
            if (list.Count > 0)
            {
                return list[0];
            }
            else
            {
                return null;
            }
        }
    }
}
