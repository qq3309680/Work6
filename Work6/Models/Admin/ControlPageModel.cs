using Work6.Models.LigerUIModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Work6.Models.Admin
{

    /// <summary>
    /// 页面Model
    /// </summary>
    public class ControlPageModel
    {
        public ControlPageModel() {
            this.MenuData = new List<TreeDataModel>();
        }
        public List<TreeDataModel> MenuData { get; set; }
    }
}