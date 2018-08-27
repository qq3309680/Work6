using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain
{
    /// <summary>
    /// 数据表格配置表
    /// </summary>
    public class OT_TableConfig
    {
        public OT_TableConfig()
        { }
        #region Model
        private string _objectid;
        private string _tablelistobjectid;
        private string _columnname;
        private string _columncode;
        private int? _sort;
        private string _createrobjectid;
        private bool _isnull;
        private bool _ishide;
        private int? _minwidth;
        private string _columntype;
        /// <summary>
        /// 
        /// </summary>
        public string ObjectId
        {
            set { _objectid = value; }
            get { return _objectid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string TableListObjectId
        {
            set { _tablelistobjectid = value; }
            get { return _tablelistobjectid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ColumnName
        {
            set { _columnname = value; }
            get { return _columnname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ColumnCode
        {
            set { _columncode = value; }
            get { return _columncode; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? Sort
        {
            set { _sort = value; }
            get { return _sort; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string CreaterObjectId
        {
            set { _createrobjectid = value; }
            get { return _createrobjectid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool IsNull
        {
            set { _isnull = value; }
            get { return _isnull; }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool IsHide
        {
            set { _ishide = value; }
            get { return _ishide; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? MinWidth
        {
            set { _minwidth = value; }
            get { return _minwidth; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ColumnType
        {
            set { _columntype = value; }
            get { return _columntype; }
        }
        #endregion Model

    }
}