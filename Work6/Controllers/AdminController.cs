using BaseEnvironment;
using CommonTool;
using CommonTool.DBHelper;
using Work6.Models.Admin;
using Work6.Models.LigerUIModel;
using Domain;
using IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Work6.Controllers
{
    public class AdminController : BaseController
    {
        //
        // GET: /Admin/
        private IAdminMenuService _adminMenuService;
        public AdminController(IAdminMenuService adminMenuService)
        {
            this._adminMenuService = adminMenuService;
        }

        public ActionResult Index()
        {
            //int s = Convert.ToInt32(float.Parse("50"));
            //AdminMenu adminMenu = new AdminMenu();
            //adminMenu.ObjectId = Guid.NewGuid().ToString();
            //adminMenu.ParentObjectId = Guid.NewGuid().ToString();
            //adminMenu.DisplayName = "表格清单";
            //adminMenu.IsLeaf = true;
            //adminMenu.Href = "";
            //adminMenu.Sort = 0;
            //List<AdminMenu> list = new List<AdminMenu>();
            //list.Add(adminMenu);
            //int i = _adminMenuService.InsertBatch<AdminMenu>(list);
            //return AjaxJson(true, i, "", "");
            return View();
        }

        /// <summary>
        /// .后台首页
        /// </summary>
        /// <returns></returns>
        public ActionResult ControlPage()
        {

            ControlPageModel model = new ControlPageModel();
            List<TreeDataModel> cacheTreeData = new CacheHelper().Get<List<TreeDataModel>>("ControlPageMenu");
            if (cacheTreeData == null)
            {
                List<AdminMenu> listMenu = null;
                listMenu = _adminMenuService.GetAllMenu();
                foreach (var item in listMenu)
                {
                    TreeDataModel treeData = new TreeDataModel();
                    treeData.Id = item.ObjectId;
                    treeData.PId = item.ParentObjectId;
                    treeData.TabId = item.ObjectId;
                    treeData.Text = item.DisplayName;
                    treeData.IsLeaf = item.IsLeaf;
                    treeData.IsRoot = item.IsRoot;
                    treeData.Url = item.Href;
                    treeData.Sort = item.Sort;
                    model.MenuData.Add(treeData);
                }
            }
            else
            {
                model.MenuData = cacheTreeData;
            }

            ViewData["ControlPageModel"] = new JavaScriptSerializer().Serialize(model).ToLower();
            return View();
        }

        /// <summary>
        /// 获得后台菜单json数据
        /// </summary>
        /// <returns></returns>
        public string GetAdminMenuList()
        {
            List<AdminMenu> listMenu = _adminMenuService.GetRootMenu();
            List<Object> list = new List<object>();
            foreach (var item in listMenu)
            {
                var obj = new object();
                if (item.IsLeaf)
                {
                    obj = new { id = item.ObjectId, text = item.DisplayName };
                }
                else
                {
                    obj = new { id = item.ObjectId, text = item.DisplayName, children = ReturnChildMenu(item) };
                }
                list.Add(obj);
            }

            return new JavaScriptSerializer().Serialize(list);
        }
        /// <summary>
        /// 迭代获得子菜单
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public List<object> ReturnChildMenu(AdminMenu model)
        {
            List<object> result = new List<object>();
            List<AdminMenu> list = _adminMenuService.GetMenuListByParentId(model.ObjectId);
            if (list.Count > 0)
            {
                foreach (var item in list)
                {
                    var obj = new object();
                    if (item.IsLeaf)
                    {
                        obj = new { id = item.ObjectId, text = item.DisplayName };
                    }
                    else
                    {
                        obj = new { id = item.ObjectId, text = item.DisplayName, children = ReturnChildMenu(item) };
                    }

                    result.Add(obj);
                }
            }
            return result;
        }


       


        /// <summary>
        /// 添加菜单
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult AddAdminMenu(AdminMenu model)
        {

            model.ObjectId = Guid.NewGuid().ToString();

            if (!string.IsNullOrEmpty(model.ParentObjectId))
            {
                var parentModel = _adminMenuService.GetMenuByObjectId(model.ParentObjectId);
                model.Level = parentModel.Level + 1;
                model.IsRoot = false;
                if (parentModel.IsLeaf)
                {
                    parentModel.IsLeaf = false;
                    var dic = new Dictionary<string, object>();
                    if (_adminMenuService.UpdateTable<AdminMenu>(parentModel) <= 0)
                    {
                        return AjaxJson(false, 0, "", "添加菜单失败.");
                    }
                }
            }
            else
            {
                model.Level = 1;
                model.IsRoot = true;
            }
            model.IsLeaf = true;
            if (_adminMenuService.Insert<AdminMenu>(model) > 0)
            {
                return AjaxJson(true, 1, "添加菜单成功.", "");
            }
            else
            {
                return AjaxJson(false, 0, "", "添加菜单失败.");
            }

        }

        /// <summary>
        /// 添加菜单页面
        /// </summary>
        /// <returns></returns>
        public ActionResult AddAdminMenuPage()
        {
            return View();
        }


        /// <summary>
        /// 更新后台菜单数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult EditAdminMenu(AdminMenu model)
        {
            try
            {
                Dictionary<string, object> param = new Dictionary<string, object>();
                param.Add("ObjectId", model.ObjectId);
                int i = _adminMenuService.UpdateTable<AdminMenu>(model, param);
                if (i > 0)
                {
                    return AjaxJson(true, i, "编辑数据成功.", "");
                }
                else
                {
                    return AjaxJson(false, 0, "", "编辑数据失败.");
                }
            }
            catch (Exception)
            {
                return AjaxJson(false, 0, "", "查询出错.");
                throw;
            }


        }

        /// <summary>
        /// 删除后台菜单数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public ActionResult DeleteAdminMenu(AdminMenu model)
        {
            try
            {
                Dictionary<string, object> param = new Dictionary<string, object>();
                param.Add("ObjectId", model.ObjectId);
                var parentMenu = _adminMenuService.GetMenuByObjectId(model.ParentObjectId);
                if (_adminMenuService.GetMenuListByParentId(model.ParentObjectId).Count == 1)
                {
                    parentMenu.IsLeaf = true;
                    var updateParentMenu = _adminMenuService.UpdateTable<AdminMenu>(parentMenu);
                    if (updateParentMenu <= 0)
                    {
                        return AjaxJson(false, 0, "", "删除出错.");
                    }
                }
                int i = _adminMenuService.DeleteSigerData<AdminMenu>(param);
                if (i > 0)
                {
                    return AjaxJson(true, i, "删除数据成功.", "");
                }
                else
                {
                    return AjaxJson(false, 0, "", "删除数据失败.");
                }
            }
            catch (Exception)
            {
                return AjaxJson(false, 0, "", "删除出错.");
                throw;
            }


        }


        /// <summary>
        /// 菜单管理数据页面
        /// </summary>
        /// <returns></returns>
        public ActionResult ManagerMenu()
        {
            List<AdminMenu> listAllMenu = new List<AdminMenu>();
            listAllMenu = _adminMenuService.GetAllMenu();
            ViewData["listAllMenu"] = new JavaScriptSerializer().Serialize(listAllMenu);
            return View();
        }

        /// <summary>
        /// 拖拽设计页面
        /// </summary>
        /// <returns></returns>
        public ActionResult DesignerPage()
        {

            return View();
        }

        /// <summary>
        /// 通用GridDataPage
        /// </summary>
        /// <returns></returns>
        public ActionResult CommonGridDataPage()
        {

            return View();
        }

        public ActionResult GoodsBill()
        {
            return View();
        }

        /// <summary>
        /// 表格清单
        /// </summary>
        /// <returns></returns>
        public ActionResult GridTableList()
        {
            return View();
        }
        /// <summary>
        /// 弹出页面
        /// </summary>
        /// <returns></returns>
        public ActionResult DialogPage()
        {

            return View();
        }

        /// <summary>
        /// 配置表格页面
        /// </summary>
        /// <returns></returns>
        public ActionResult ConfigGridPage()
        {
            return View();
        }
        /// <summary>
        /// 添加表格配置页面
        /// </summary>
        /// <returns></returns>
        public ActionResult AddGridTableConfig()
        {
            return View();

        }
        /// <summary>
        /// 表格数据页面
        /// </summary>
        /// <returns></returns>
        public ActionResult TableDataPage()
        {
            return View();
        }


        /// <summary>
        /// 添加数据表清单
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public ActionResult AddGridTable(OT_TableList param)
        {
            param.ObjectId = Guid.NewGuid().ToString();
            param.CreaterObjectId = Guid.NewGuid().ToString();
            List<OT_TableList> list = new List<OT_TableList>();
            list.Add(param);
            int i = DapperHelper.CreateInstance().InsertBatch<OT_TableList>("OT_TableList", list);
            return AjaxJson(true, i, "添加表单成功.", "");
        }

        /// <summary>
        /// 删除数据表清单数据
        /// </summary>
        /// <param name="paramList"></param>
        /// <returns></returns>
        public ActionResult DeleteGridTable(List<OT_TableList> paramList)
        {
            string ObjectIdValues = "";
            foreach (var item in paramList)
            {
                ObjectIdValues += item.ObjectId + ",";
            }
            ObjectIdValues = ObjectIdValues.Substring(0, ObjectIdValues.Length - 1);
            int i = DapperHelper.CreateInstance().DeleteManyData("OT_TableList", ObjectIdValues);
            return AjaxJson(true, i, "删除数据成功.", "");
        }

        /// <summary>
        /// 添加表单数据
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public ActionResult AddGridData(OT_GridData param)
        {
            param.CreaterObjectId = Guid.NewGuid().ToString();
            List<OT_GridData> list = new List<OT_GridData>();
            list.Add(param);
            int i = DapperHelper.CreateInstance().InsertBatch<OT_GridData>("OT_GridData", list);
            return AjaxJson(true, i, "添加表单成功.", "");
        }

        /// <summary>
        /// 修改表单数据
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public ActionResult EditGridData(OT_GridData data)
        {
            Dictionary<string, object> param = new Dictionary<string, object>();
            param.Add("ObjectId", data.ObjectId);
            //Dictionary<string, object> editData = new Dictionary<string, object>();
            //editData.Add("RowValue", data.RowValue);
            //editData.Add("RowNumber", data.RowNumber);
            int i = DapperHelper.CreateInstance().UpdateTable<OT_GridData>("OT_GridData", data, param);
            return AjaxJson(true, i, "更新表单成功.", "");
        }


        /// <summary>
        /// 删除表单数据
        /// </summary>
        /// <param name="paramList"></param>
        /// <returns></returns>
        public ActionResult DeleteGridData(string ObjectIdStr)
        {
            int i = DapperHelper.CreateInstance().DeleteManyData("OT_GridData", ObjectIdStr);
            return AjaxJson(true, i, "删除数据成功.", "");
        }

        /// <summary>
        /// 添加通用表单数据
        /// </summary>
        /// <returns></returns>
        public ActionResult T2GridAddData()
        {
            return View();
        }

        /// <summary>
        /// 添加数据表清单
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public ActionResult AddGridTableConfigData(OT_TableConfig param)
        {
            param.ObjectId = Guid.NewGuid().ToString();
            List<OT_TableConfig> list = new List<OT_TableConfig>();
            list.Add(param);
            int i = _adminMenuService.InsertBatch<OT_TableConfig>(list);
            return AjaxJson(true, i, "添加表单配置成功.", "");
        }
        /// <summary>
        /// 修改通用表单数据
        /// </summary>
        /// <returns></returns>
        public ActionResult T2GridEditData()
        {
            return View();
        }
        /// <summary>
        /// 获得通用表单数据
        /// </summary>
        /// <returns></returns>
        public string GetT2GridData()
        {
            string TableListObjectId = Request.Params["TableListObjectId"].ToString();

            string sql = @"SELECT [ObjectId]
      ,[TableListObjectId]
      ,[RowValue]
      ,[RowNumber]
      ,[CreaterObjectId]
  FROM [DataMip].[dbo].[OT_GridData] where [TableListObjectId]='" + TableListObjectId + "'";
            List<OT_GridData> list = DapperHelper.CreateInstance().SimpleQuery<OT_GridData>(sql);

            StringBuilder result = new StringBuilder();
            result.Append("{");
            if (list.Count > 0)
            {
                result.Append("\"Rows\":[");
                foreach (OT_GridData item in list)
                {

                    result.Append(item.RowValue + ",");

                }
                result.Remove(result.Length - 1, 1);
                result.Append("],");
            }
            result.Append("\"Total\":" + list.Count);
            result.Append("}");
            return result.ToString(); ;

        }

        /// <summary>
        /// 获得通用表单数据--分页
        /// </summary>
        /// <returns></returns>
        public string GetT2GridPageData()
        {
            string TableListObjectId = Request.Params["TableListObjectId"].ToString();
            int page = Convert.ToInt32(Request.Params["page"].ToString());
            int pageSize = Convert.ToInt32(Request.Params["pageSize"].ToString());

            string sql = @"select * from (SELECT row_number()over(order by [RowNumber])as rownum,[ObjectId]
      ,[TableListObjectId]
      ,[RowValue]
      ,[RowNumber]
      ,[CreaterObjectId]
  FROM [DataMip].[dbo].[OT_GridData] where [TableListObjectId]='" + TableListObjectId + "')a where a.rownum>" + (page - 1) * pageSize + " and a.rownum<=" + page * pageSize;
            List<OT_GridData> list = DapperHelper.CreateInstance().SimpleQuery<OT_GridData>(sql);

            StringBuilder result = new StringBuilder();
            result.Append("{");
            if (list.Count > 0)
            {
                result.Append("\"Rows\":[");
                foreach (OT_GridData item in list)
                {

                    result.Append(item.RowValue + ",");

                }
                result.Remove(result.Length - 1, 1);
                result.Append("],");
            }
            result.Append("\"Total\":" + list.Count);
            result.Append("}");
            return result.ToString(); ;

        }


        /// <summary>
        /// 通用GridData返回数据
        /// </summary>
        /// <param name="TableName"></param>
        /// <returns></returns>
        public ActionResult GetGridData()
        {
            string TableName = Request.Params["TableName"].ToString();

            string path = "Domain." + TableName + ",Domain";
            Type type = Type.GetType(path);

            string Columns = "";
            PropertyInfo[] props = type.GetProperties();
            Dictionary<string, object> Param = new Dictionary<string, object>();
            foreach (var item in props)
            {
                Columns += item.Name + ",";
            }
            Columns = Columns.Substring(0, Columns.Length - 1);
            string sql = "select " + Columns + " from " + TableName + " ";
            string Params = "";
            Dictionary<string, Object> ParamDic = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(Request.Params["Params"]))
            {
                Params = Request.Params["Params"].ToString();
                string[] ParamsArr = Params.Split('&');
                if (ParamsArr.Count() > 0)
                {
                    sql += " where ";
                    foreach (var item in ParamsArr)
                    {
                        if (!string.IsNullOrEmpty(item.Split('=')[0]))
                        {
                            string Name = item.Split('=')[0];
                            string Value = item.Split('=')[1];
                            sql += Name + "=@" + Name + " and";
                            ParamDic.Add(Name, Value);
                        }
                    }
                    sql = sql.Substring(0, sql.Length - 3);
                }
            }


            GridDataModel model = new GridDataModel();
            List<dynamic> dynamicList = DapperHelper.CreateInstance().SimpleQuery(sql, ParamDic);
            List<Object> target = new List<Object>();
            foreach (dynamic dynamicItem in dynamicList)
            {
                object modelObj = Activator.CreateInstance(type);

                foreach (var item in dynamicItem)
                {
                    foreach (var classItem in props)
                    {

                        if (classItem.Name.Equals(item.Key))
                        {
                            classItem.SetValue(modelObj, item.Value, null);
                        }
                    }

                }
                target.Add(modelObj);
            }
            model.Rows = target;
            model.Total = model.Rows.Count();
            string s = new JavaScriptSerializer().Serialize(model);
            return Json(model);
        }
        /// <summary>
        /// 通用GridData返回的Column
        /// </summary>
        /// <param name="TableName"></param>
        /// <returns></returns>
        public string GetGridColumn(string TableListObjectId)
        {
            List<OT_TableConfig> configList = new List<OT_TableConfig>();
            string sql = @"SELECT [ObjectId]
      ,[TableListObjectId]
      ,[ColumnName]
      ,[ColumnCode]
      ,[Sort]
      ,[CreaterObjectId]
      ,[IsNull]
      ,[IsHide]
      ,[MinWidth]
      ,[ColumnType]
  FROM [DataMip].[dbo].[OT_TableConfig]
where TableListObjectId=@TableListObjectId";
            configList = DapperHelper.CreateInstance().SimpleQuery<OT_TableConfig>(sql, new { TableListObjectId = TableListObjectId });
            StringBuilder ColumnsStr = new StringBuilder();
            if (configList.Count > 0)
            {

                foreach (OT_TableConfig item in configList)
                {
                    ColumnsStr.Append("{");
                    ColumnsStr.Append(string.Format("\"display\":\"{0}\",", item.ColumnName.Trim()));
                    ColumnsStr.Append(string.Format("\"name\":\"{0}\",", item.ColumnCode.Trim()));
                    ColumnsStr.Append(string.Format("\"minWidth\":{0},", item.MinWidth));
                    if (item.IsHide)
                    {
                        ColumnsStr.Append(string.Format("\"hide\":\"{0}\",", item.IsHide));
                    }
                    else
                    {
                        ColumnsStr.Append(string.Format("\"type\":\"{0}\",", item.ColumnType.Trim()));
                    }

                    //ColumnsStr.Append(string.Format("isSort:'{0}',", item.isSort));
                    ColumnsStr.Remove(ColumnsStr.Length - 1, 1);
                    ColumnsStr.Append("}|||");
                }
                ColumnsStr.Remove(ColumnsStr.Length - 3, 3);
            }

            return ColumnsStr.ToString(); ;
        }
    }
}
