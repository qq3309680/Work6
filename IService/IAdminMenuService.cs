using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IService
{
    public interface IAdminMenuService : IBaseService
    {
        /// <summary>
        /// 获得所有菜单
        /// </summary>
        /// <returns></returns>
        List<AdminMenu> GetAllMenu();
        /// <summary>
        /// 获得根节点菜单（一级菜单）
        /// </summary>
        /// <returns></returns>
        List<AdminMenu> GetRootMenu();
        /// <summary>
        /// 根据父节点Id获得菜单集合
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        List<AdminMenu> GetMenuListByParentId(string parentId);

        /// <summary>
        /// 根据Object获得菜单数据
        /// </summary>
        /// <param name="objectId"></param>
        /// <returns></returns>
        AdminMenu GetMenuByObjectId(string objectId);
    }
}
