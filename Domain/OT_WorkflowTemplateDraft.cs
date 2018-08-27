using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/12/8 10:18:41

    /// Description : 流程模板配置表
    /// </summary>
    public class OT_WorkflowTemplateDraft
    {
        public OT_WorkflowTemplateDraft()
        { }
        #region Model
        private string _objectid;
        private string _content;
        private string _creator;
        private string _modifiedby;
        private DateTime? _createdtime;
        private DateTime? _modifiedtime;
        private string _workflowcode;
        private string _bizobjectschemacode;
        private string _parentobjectid;
        private string _parentpropertyname;
        private int? _parentindex;
        /// <summary>
        /// 
        /// </summary>
        public string ObjectID
        {
            set { _objectid = value; }
            get { return _objectid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Content
        {
            set { _content = value; }
            get { return _content; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string Creator
        {
            set { _creator = value; }
            get { return _creator; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ModifiedBy
        {
            set { _modifiedby = value; }
            get { return _modifiedby; }
        }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? CreatedTime
        {
            set { _createdtime = value; }
            get { return _createdtime; }
        }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? ModifiedTime
        {
            set { _modifiedtime = value; }
            get { return _modifiedtime; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string WorkflowCode
        {
            set { _workflowcode = value; }
            get { return _workflowcode; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string BizObjectSchemaCode
        {
            set { _bizobjectschemacode = value; }
            get { return _bizobjectschemacode; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ParentObjectID
        {
            set { _parentobjectid = value; }
            get { return _parentobjectid; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string ParentPropertyName
        {
            set { _parentpropertyname = value; }
            get { return _parentpropertyname; }
        }
        /// <summary>
        /// 
        /// </summary>
        public int? ParentIndex
        {
            set { _parentindex = value; }
            get { return _parentindex; }
        }
        #endregion Model

    }
}
