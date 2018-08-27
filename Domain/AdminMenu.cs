using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/3/24 16:26:58
  
    /// Description : 后台菜单
    /// </summary>
    public class AdminMenu
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public string ObjectId { get; set; }
        /// <summary>
        /// 父菜单Id
        /// </summary>
        public string ParentObjectId { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string DisplayName { get; set; }
        /// <summary>
        /// 是否叶子节点
        /// </summary>
        public bool IsLeaf { get; set; }
        /// <summary>
        /// 是否根节点
        /// </summary>
        public bool IsRoot { get; set; }
        /// <summary>
        /// 链接
        /// </summary>
        public string Href { get; set; }
        /// <summary>
        /// 排列顺序
        /// </summary>
        public int Sort { get; set; }
        /// <summary>
        /// 等级
        /// </summary>
        public int Level { get; set; }
        /// <summary>
        /// Icon图片链接
        /// </summary>
        public string IconImg { get; set; }

    }
}
