using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Work6.Models.LigerUIModel
{
    /// <summary>
    /// LigerUI树结构数据Model
    /// </summary>
    public class TreeDataModel
    {
        public string Id { get; set; }
        public string PId { get; set; }
        public string Text { get; set; }
        public string TabId { get; set; }
        public bool IsLeaf { get; set; }
        public bool IsRoot { get; set; }
        public string Url { get; set; }
        public int Sort { get; set; }
        public string[] Attribute { get; set; }
        public string CustomStr { get; set; }

    }
}