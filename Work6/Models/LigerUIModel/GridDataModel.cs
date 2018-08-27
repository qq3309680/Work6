using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Work6.Models.LigerUIModel
{
    /// <summary>
    ///  LigerUI表格结构数据Model
    /// </summary>
    public class GridDataModel
    {
        public List<Object> Rows { get; set; }
        public int Total { get; set; }
    }
}