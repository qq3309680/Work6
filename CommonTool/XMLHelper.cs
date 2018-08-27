using log4net;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace CommonTool
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/12/8 10:52:32
   
    /// Description : 
    /// </summary>
   public class XMLHelper
    {
       private static readonly ILog _logger = LogManager.GetLogger(typeof(XMLHelper));

        public XMLHelper()
        {
            //
            // TODO: 在此处添加构造函数逻辑
            //
        }

        #region Fields and Properties

        public enum XmlType
        {
            File,
            String
        }

        #endregion


       /// <summary>
       /// 获取xml的根节点
       /// </summary>
       /// <param name="source"></param>
       /// <returns></returns>
        public static XmlNode GetRootNode(string source) {
            var xmlDocument = new XmlDocument();
            xmlDocument.LoadXml(source);
            XmlNode root = xmlDocument.DocumentElement;
            return root;
        }

        /// <summary>
        /// 获取xml节点的集合
        /// </summary>
        /// <param name="root"></param>
        /// <param name="xPath"></param>
        /// <returns></returns>
        public static XmlNode GetNode(XmlNode root, string nodeName)
        {
            XmlNode node = root.SelectSingleNode(nodeName);
            return node;
        }


       /// <summary>
       /// 获取xml节点的集合
       /// </summary>
       /// <param name="root"></param>
       /// <param name="xPath"></param>
       /// <returns></returns>
        public static XmlNodeList GetNodeList(XmlNode root, string xPath)
        {
            XmlNodeList list = root.SelectNodes(xPath);
            return list;
        }

        /// <summary>
        ///     读取XML资源中的指定节点内容
        /// </summary>
        /// <param name="source">XML资源</param>
        /// <param name="xmlType">XML资源类型：文件，字符串</param>
        /// <param name="nodeName">节点名称</param>
        /// <returns>节点内容</returns>
        public static string GetNodeValue(string source, XmlType xmlType, string nodeName)
        {
            var xmlDocument = new XmlDocument();
            if (xmlType == XmlType.File)
                xmlDocument.Load(source);
            else
                xmlDocument.LoadXml(source);
            var documentElement = xmlDocument.DocumentElement;
            var selectSingleNode = documentElement.SelectSingleNode(nodeName);
            return selectSingleNode.InnerText;
        }

        /// <summary>
        ///     读取XML资源中的指定节点内容
        /// </summary>
        /// <param name="root">xml根节点</param>
        /// <param name="nodeName">节点名称</param>
        /// <returns>节点内容</returns>
        public static string GetNodeValue(XmlNode root, string nodeName)
        {
            var documentElement = root;
            var selectSingleNode = documentElement.SelectSingleNode(nodeName);
            if (selectSingleNode==null)
            {
                return "";
            }
            return selectSingleNode.InnerText;
        }

        /// <summary>
        /// 获取唯一XML路径的值
        /// </summary>
        /// <param name="xdoc"></param>
        /// <param name="xpath"></param>
        /// <returns></returns>
        public static string GetXmlNodeText(System.Xml.XmlDocument xdoc, string xpath)
        {
            if (string.IsNullOrEmpty(xpath))
                return "";
            try
            {
                System.Xml.XmlNode xnode = xdoc.SelectSingleNode(xpath);
                if (xnode == null || xnode == default(System.Xml.XmlNode))
                    return "";
                return xnode.InnerText;
            }
            catch
            {
                return "";
            }
        }
        /// <summary>
        /// 获取XmlNode的值
        /// </summary>
        /// <param name="xnode"></param>
        /// <returns></returns>
        public static string GetXmlNodeText(System.Xml.XmlNode xnode)
        {
            if (xnode == null || xnode == default(System.Xml.XmlNode))
                return "";
            return xnode.InnerText;
        }

        /// <summary>
        /// 获取XmlNode的属性值
        /// </summary>
        /// <param name="xnode"></param>
        /// <param name="attrname"></param>
        /// <returns></returns>
        public static string GetXmlNodeAttributeValue(System.Xml.XmlNode xnode, string attrname)
        {
            if (string.IsNullOrEmpty(attrname))
                return "";
            if (xnode == null || xnode == default(System.Xml.XmlNode))
                return "";
            if (xnode.Attributes.Count == 0)
                return "";
            System.Xml.XmlAttribute attr = xnode.Attributes[attrname];
            if (attr == null || attr == default(System.Xml.XmlAttribute))
                return "";
            return attr.Value;
        }

    
    }
}
