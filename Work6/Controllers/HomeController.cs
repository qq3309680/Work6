using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dapper;
using System.Configuration;
using System.Reflection;
using System.Collections;
using Autofac;
using IService;
using Domain;
using CommonTool.DBHelper;
using log4net;
using BaseEnvironment;
using System.IO;
using Topshelf;

namespace Work6
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        private static readonly log4net.ILog log = LogManager.GetLogger(typeof(MvcApplication));
        private IUsersService _usersService;
        private IPrimaryKeyTestService _primaryKeyTestService;
        public HomeController(IUsersService usersService, IPrimaryKeyTestService primaryKeyTestService)
        {
            _usersService = usersService;
            _primaryKeyTestService = primaryKeyTestService;
        }

        public ActionResult LigerUITest()
        {
            return View();
        }


        public ActionResult DragView()
        {
            return View();
        }

        public ActionResult AddRowConfig()
        {
            return View();
        }

        public ActionResult Index()
        {
            IDbConnection connection = new SqlConnection("Data Source=.;Initial Catalog=DataMip;Integrated Security=True;MultipleActiveResultSets=True");
            //log.Info("HomeController启动...");

            //log4net.Config.XmlConfigurator.ConfigureAndWatch(new FileInfo(AppDomain.CurrentDomain.BaseDirectory + "log4Net.config"));

            //HostFactory.Run(x =>
            //{
            //    x.UseLog4Net();

            //    x.Service<ServiceRunner>();

            //    x.SetDescription("QuartzDemo服务描述");
            //    x.SetDisplayName("QuartzDemo服务显示名称");
            //    x.SetServiceName("QuartzDemo服务名称");

            //    x.EnablePauseAndContinue();
            //});

            //var result = connection.Execute("Insert into Users values (@UserName, @Email, @Address)",
            //                       new { UserName = "jack", Email = "380234234@qq.com", Address = "上海" });

            //var usersList = Enumerable.Range(0, 10).Select(i => new Users()
            //{
            //    Email = i + "qq.com",
            //    Address = "安徽",
            //    UserName = i + "jack"
            //});

            //var usersList = new List<Users>();
            //Users u1 = new Users();
            //u1.Address = "广州";
            //u1.Email = "tanzhen@qq.com";
            //u1.UserName = "tanzhen";
            //Users u2 = new Users();
            //u2.Address = "广州";
            //u2.Email = "cc@qq.com";
            //u2.UserName = "cc";
            //usersList.Add(u1);
            //usersList.Add(u2);

            //var result = connection.Execute("Insert into Users values (@UserName, @Email, @Address)", usersList);
            //ViewData["Result"] = result;
            log.Info("HomeController关闭...");

            return View();
        }

        public ActionResult Query()
        {
            //IDbConnection connection = new SqlConnection("Data Source=.;Initial Catalog=DataMip;Integrated Security=True;MultipleActiveResultSets=True");

            //var query = connection.Query<Users>("select * from Users where UserName=@UserName", new { UserName = "jack" });
            //var query = DapperHelper.SimpleQuery<Users>("select * from Users where UserName=@UserName", new { UserName = "jack" });
            List<TransportUsers> query;

            //// 创建你的builder
            //var builder = new ContainerBuilder();

            //// 通常你只关心这个接口的一个实现
            //builder.RegisterType<UsersService>().As<IUsersService>();
            //IContainer container = builder.Build();
            //using (var scope = container.BeginLifetimeScope())
            //{
            //    var userService = container.Resolve<IUsersService>();
            //    query = userService.SimpleQuery("select * from Users where UserName=@UserName", new { UserName = "jack" });
            //}
            //query = _usersService.SimpleQuery("select * from Users where UserName=@UserName", new { UserName = "jack" });
            Dictionary<string, object> o = new Dictionary<string, object>();
            o.Add("UserName", "jack");
            query = _usersService.SimpleQuery("select * from Users where UserName=@UserName", o);
            ViewData["Query"] = query;
            return View();
        }

        /// <summary>
        /// 多条sql一起执行
        /// </summary>
        /// <returns></returns>
        public ActionResult ManyQuery()
        {

            IDbConnection connection = new SqlConnection("Data Source=.;Initial Catalog=DataMip;Integrated Security=True;MultipleActiveResultSets=True");

            string sql = "select * from Product; select * from Users";
            var multiReader = connection.QueryMultiple(sql);

            var productList = multiReader.Read<Product>();

            var userList = multiReader.Read<TransportUsers>();

            ViewData["userList"] = userList;

            ViewData["productList"] = productList;

            return View();
        }

        /// <summary>
        /// 多表联合查询
        /// </summary>
        /// <returns></returns>
        public ActionResult JoinQuery()
        {
            IDbConnection connection = new SqlConnection("Data Source=.;Initial Catalog=DataMip;Integrated Security=True;MultipleActiveResultSets=True");
            PropertyInfo[] props = typeof(Product).GetProperties();
            string NameSpace;
            string Name;
            foreach (var item in props)
            {

                NameSpace = item.PropertyType.Namespace;
                #region 折叠代码
                if (NameSpace == "Work6.DataModel")
                {
                    Name = item.Name;
                }
                #endregion

                //Columns += item.Name + ",";
            }
            var sql = @"select  p.ProductName,p.CreateTime,u.UserName,u.address
                        from Product as p
                        join Users as u
                        on p.UserID = u.UserID
                        where p.CreateTime > '2015-12-12'; ";
            var result = connection.Query<Product, TransportUsers, Product>(sql, (product, users) =>
            {
                product.UserOwner = users; return product;
            }, splitOn: "UserName");
            //var result = DapperHelper.OneToOneQuery<Product, Users>(sql, "UserName");
            ViewData["Result"] = result;

            return View();
        }

        /// <summary>
        /// 一对多查询
        /// </summary>
        /// <returns></returns>
        public ActionResult OneToManyQuery()
        {

            IDbConnection connection = new SqlConnection("Data Source=.;Initial Catalog=DataMip;Integrated Security=True;MultipleActiveResultSets=True");

            var sql = @"select c.CustomerID, c.CustomerName,c.Mobile,c.Address,c.Email,p.ProductID,p.ProductName,p.ProductDesc from Customers c left join OrderGoods o on c.CustomerID=o.CustomerID left join Product p on  p.ProductID=o.ProductID";
            var lookUp = new Dictionary<int, Customers>();
            List<Customers> customerList = new List<Customers>();
            List<Product> productList = new List<Product>();
            List<Customers> resultList = new List<Customers>();
            customerList = connection.Query<Customers, Product, Customers>(sql, (customer, product) =>
            {
                Customers c;
                if (!lookUp.TryGetValue(customer.CustomerID, out c))
                {
                    lookUp.Add(customer.CustomerID, c = customer);
                }
                Product p;
                p = product;
                //productList.Add(p);
                c.Products.Add(p);
                return customer;
            }, splitOn: "ProductID").ToList();

            var result = connection.Query(sql);
            resultList.AddRange(lookUp.Values);


            //resultList = DapperHelper.OneToManyQuery<Customers, Product>(sql, "ProductID", "CustomerID");


            ViewData["Result"] = resultList;
            AjaxReturnData returnData = new AjaxReturnData();
            returnData.States = true;
            returnData.Data = resultList;
            return AjaxJson(returnData);
            //return View();
        }


        /// <summary>
        /// 事务
        /// </summary>
        /// <returns></returns>
        public ActionResult Tran()
        {
            string sql1 = "insert into Users(UserName,Email,Address) values('zhao',23,'上海')";
            string sql2 = "insert into Users(UserName,Email,Address) values('zhao',23,'上海')";
            List<string> listStr = new List<string>();
            listStr.Add(sql1);
            listStr.Add(sql2);
            using (IDbConnection dbConnection = new SqlConnection(ConfigurationManager.AppSettings["SqlConnectionKey"].ToString()))
            {
                dbConnection.Open();
                IDbTransaction transaction = dbConnection.BeginTransaction();
                try
                {
                    dbConnection.Execute(sql1, null, transaction);

                    dbConnection.Execute(sql2, null, transaction);
                    transaction.Commit();
                }
                catch (Exception exception)
                {

                    transaction.Rollback();
                    return Content("Fail");
                }


            }
            // int result = DapperHelper.TransAction(listStr);
            return Content("success");
        }


        /// <summary>
        /// 存储过程
        /// </summary>
        /// <returns></returns>
        public ActionResult UseProcedure()
        {
            var connection = new SqlConnection("Data Source=.;Initial Catalog=Datamip;Integrated Security=True;MultipleActiveResultSets=True");

            var info = connection.Query<TransportUsers>("sp_GetUsers", new { id = 5 },
                                   commandType: CommandType.StoredProcedure);
            ViewData["Result"] = info;

            return View();
        }



        public ActionResult Test()
        {
            #region 插入代码测试
            //string TableName = "Product";
            //string path = "Work6.DataModel." + TableName + ",Work6";
            //Type type = Type.GetType(path);
            //object modelObj = Activator.CreateInstance(type);
            //string Columns = "";
            //string Params = "";
            //PropertyInfo[] props = type.GetProperties();
            //foreach (var item in props)
            //{
            //    Columns += item.Name + ",";
            //    Params += "@" + item.Name + ",";
            //}
            //Columns = Columns.Substring(0, Columns.Length - 1);
            //Columns = "ProductName,ProductDesc,UserID,CreateTime";
            //Params = Params.Substring(0, Params.Length - 1);
            //string sql = string.Format("insert into " + TableName + "({0}) values ({1})", Columns, Params);
            //sql = "insert into Product(ProductName,ProductDesc,UserID,CreateTime) values (@ProductName,@ProductDesc,@UserID,@CreateTime)";
            //List<Users> userList = new List<Users>();
            //Users u1 = new Users();
            //u1.Address = "广州";
            //u1.Email = "tanzhen@qq.com";
            //u1.UserName = "tanzhen";
            //userList.Add(u1);
            ////Columns = "Address,Email,UserName";

            //List<Product> proList = new List<Product>();
            //Product p1 = new Product();
            //p1.ProductName = "电脑";
            //p1.ProductDesc = "日常办公电脑";
            //p1.CreateTime = DateTime.Now.ToShortDateString();
            //p1.UserOwner = u1;
            //Product p2 = new Product();
            //p2.ProductName = "手机";
            //p2.ProductDesc = "日常办公手机";
            //p2.CreateTime = DateTime.Now.ToShortDateString();
            //p2.UserOwner = u1;
            //proList.Add(p1);
            //proList.Add(p2);
            //int result;
            //using (IDbConnection dbConnection = new SqlConnection(ConfigurationManager.AppSettings["SqlConnectionKey"].ToString()))
            //{
            //    ArrayList a = new ArrayList();
            //    a.Add(new { ProductName = "电脑2", ProductDesc = "日常办公电脑", CreateTime = DateTime.Now.ToShortDateString(), UserID = 1 });
            //    a.Add(new { ProductName = "手机2", ProductDesc = "日常办公手机", CreateTime = DateTime.Now.ToShortDateString(), UserID = 2 });
            //    // result = dbConnection.Execute(sql, a);
            //    result = DapperHelper.InsertBatch(TableName, Columns, a);
            //    result += DapperHelper.InsertBatch("Users", userList);
            //}
            #endregion

            //string TableName = "Product";

            //Dictionary<string, object> Data = new Dictionary<string, object>();
            //Data.Add("ProductName", "'电脑3'");
            //Data.Add("ProductDesc", "'办公电脑3'");
            //Dictionary<string, object> Param = new Dictionary<string, object>();
            //Param.Add("ProductID", 10);
            //var result = DapperHelper.CreateInstance(BaseApplication.DefaultSqlConnectionKey).UpdateTable(Data, Param, TableName);
            string FieldName = "ObjectId,BizObjectId";
            List<PrimaryKeyTest> list = new List<PrimaryKeyTest>();
            PrimaryKeyTest pk = new PrimaryKeyTest();
            pk.ObjectId = Guid.NewGuid().ToString();
            pk.BizObjectId = Guid.NewGuid().ToString();
            list.Add(pk);
            var result = _primaryKeyTestService.InsertTable(FieldName, list);
            //AjaxReturnData returnData = new AjaxReturnData();
            //returnData.States = true;
            //returnData.Data = result;
            //return AjaxJson(returnData);
            return AjaxJson(true, result, "插入成功.", "");
        }


    }
}
