using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain
{
    /// <summary>
    /// OT_GridData:实体类(表格数据表)--大数据量
    /// </summary>
    [Serializable]
    public class OT_GridData
    {
        public OT_GridData()
        { }
        #region Model
        private string _objectid;
        private string _tablelistobjectid;
        private string _rowvalue;
        private int? _rownumber;
        private string _createrobjectid;
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
        public string RowValue
        {
            set { _rowvalue = value; }
            get { return _rowvalue; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? RowNumber
        {
            set { _rownumber = value; }
            get { return _rownumber; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string CreaterObjectId
        {
            set { _createrobjectid = value; }
            get { return _createrobjectid; }
        }
        #endregion Model
    }
}