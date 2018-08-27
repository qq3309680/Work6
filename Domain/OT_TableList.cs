using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain
{
    /// <summary>
    /// 数据表清单
    /// </summary>
    public class OT_TableList
    {
        public OT_TableList()
        { }
        #region Model
        private string _objectid;
        private string _gridname;
        private string _gridcode;
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
        public string GridName
        {
            set { _gridname = value; }
            get { return _gridname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string GridCode
        {
            set { _gridcode = value; }
            get { return _gridcode; }
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