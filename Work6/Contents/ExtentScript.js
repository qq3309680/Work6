//自定义扩展的js

; (function ($) {
    $.extend({
        //发送HTTP数据获得json
        AJAXGetData: function (Method, Url, Data, CallBack) {
            //$.LoadingMask.Show("加载中", true);
            if ($(".loading-div")) {
                $(".loading-div").css("display", "block");
                $(".loading-img-div").css("display", "block");
            }
            $.ajax({
                type: Method,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                url: Url,
                timeout: 10000, //超时时间设置，单位毫秒
                data: JSON.stringify(Data),
                success: function (data) {
                    CallBack(data);
                    //$.LoadingMask.Hide();

                },
                error: function (err, status) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        alert("超时");
                    } else if (status == 'error') {
                        alert("服务器出错。")
                    }
                    console.dir(err);
                    //$.LoadingMask.Hide();

                },
                complete: function (XMLHttpRequest, textStatus) {
                    if ($(".loading-div")) {
                        $(".loading-div").css("display", "none");
                        $(".loading-img-div").css("display", "none");
                    }
                }
            });
        },
        //发送HTTP数据获得json(同步)
        AJAXGetDataAsync: function (Method, Url, Data, CallBack) {
            // $.LoadingMask.Show("加载中", true);
            if ($(".loading-div")) {
                $(".loading-div").css("display", "block");
                $(".loading-img-div").css("display", "block");
            }
            $.ajax({
                type: Method,
                dataType: "json",
                async: false,
                contentType: "application/json;charset=utf-8",
                url: Url,
                timeout: 10000, //超时时间设置，单位毫秒
                data: JSON.stringify(Data),
                success: function (data) {
                    CallBack(data);
                    //$.LoadingMask.Hide();
                },
                error: function (err, status) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        alert("超时");
                    } else if (status == 'error') {
                        alert("服务器出错。")
                    }
                    console.dir(err);
                    //$.LoadingMask.Hide();

                },
                complete: function () {
                    if ($(".loading-div")) {
                        $(".loading-div").css("display", "none");
                        $(".loading-img-div").css("display", "none");
                    }
                }
            });
        },
        //弹出框（内嵌页面）
        DialogOpen: function (id, title, url, myData, width, height) {
            $.ligerDialog.open({
                id: id,//给dialog附加id 
                height: height,
                width: width,
                title: title,
                url: url,
                showMax: true,//是否显示最大化 
                showToggle: false,//是否显示收缩 
                showMin: false,
                isResize: true,
                slide: true,
                //自定义参数
                myData: myData
            });
        },
        //artDialog弹出页
        ArtDialogOpen: function (title, url, width, height, closeFunc) {
            art.artDialog.open(url, {
                title: title,
                fixed: true,
                lock: true,
                background: 'Black',
                opacity: 0.68,
                height: height,
                width: width,
                close: function () {
                    closeFunc();
                }
            });

        },

        //创建通用表格，不分页
        CreateT2NoPageGrid: function (id, columns, url, parms) {
            //配置表格
            var Grid = $("#" + id).ligerGrid({
                //title: '通用表单展示',
                columns: columns,
                url: url,
                parms: parms,
                // data: {},
                checkbox: true,
                usePager: false,
                rownumbers: true,
                herght: '100%',
                dateFormat: "yyyy-MM-dd hh:mm:ss",
                toolbar: {
                    items: [
                  {
                      text: '增加', click: function () {
                          //增加按钮点击事件
                          //console.dir(columns);
                          var fields = $.GetT2FormFieldsByGridColumns(columns);
                          $.DialogOpen("TableDateDialog", "表格数据", '/Admin/T2GridAddData?TableListObjectId=' + parms.TableListObjectId, fields, 700, $(window).height());
                      }, icon: 'add'
                  },
                  { line: true },
                  {
                      text: '修改', click: function () {
                          //增加按钮点击事件
                          var SelectRow = Grid.getSelectedRow();
                          //console.dir(SelectRow);
                          if (SelectRow == null) {
                              alert("请勾选一行数据.");
                          } else {
                              var fields = $.GetT2FormFieldsByGridColumns(columns);
                              $.DialogOpen("TableDateDialog", "表格数据", '/Admin/T2GridEditData?TableListObjectId=' + parms.TableListObjectId, { "fields": fields, "formData": SelectRow }, 700, $(window).height());
                          }

                      }, icon: 'modify'
                  },
                  { line: true },
                  {
                      text: '删除', click: function () {
                          //增加按钮点击事件
                          var SelectRow = Grid.getSelectedRows();
                          var ObjectIdStr = "";
                          $.each(SelectRow, function (key, val) {
                              ObjectIdStr += val.ObjectId + ",";
                          });
                          ObjectIdStr = ObjectIdStr.substring(0, ObjectIdStr.length - 1);
                          $.AJAXGetData("post", "/Admin/DeleteGridData", { ObjectIdStr: ObjectIdStr }, function (responseData) {
                              if (responseData.States) {
                                  alert(responseData.Message);
                                  $("#reloadBtn", window.document).click();
                              } else {
                                  alert(responseData.ErrorMessage);
                              }
                          });
                      }, icon: 'delete'
                  }
                    ]
                }

            });
            return Grid;
        },
        //创建通用表格，分页
        CreateT2PageGrid: function (id, columns, url, parms) {
            //配置表格
            var Grid = $("#" + id).ligerGrid({
                //title: '通用表单展示',
                columns: columns,
                url: url,
                parms: parms,
                // data: {},
                checkbox: true,
                usePager: true,
                pageSizeOptions: [5, 10, 20, 30, 40, 50],
                page: 1,
                pageSize: 10,
                rownumbers: true,
                herght: '100%',
                heightDiff: 200,//高度补齐
                dateFormat: "yyyy-MM-dd hh:mm:ss",
                toolbar: {
                    items: [
                  {
                      text: '增加', click: function () {
                          //增加按钮点击事件
                          //console.dir(columns);
                          var fields = $.GetT2FormFieldsByGridColumns(columns);
                          $.DialogOpen("TableDateDialog", "表格数据", '/Admin/T2GridAddData?TableListObjectId=' + parms.TableListObjectId, fields, 700, $(window).height());
                      }, icon: 'add'
                  },
                  { line: true },
                  {
                      text: '修改', click: function () {
                          //增加按钮点击事件
                          var SelectRow = Grid.getSelectedRow();
                          //console.dir(SelectRow);
                          if (SelectRow == null) {
                              alert("请勾选一行数据.");
                          } else {
                              var fields = $.GetT2FormFieldsByGridColumns(columns);
                              $.DialogOpen("TableDateDialog", "表格数据", '/Admin/T2GridEditData?TableListObjectId=' + parms.TableListObjectId, { "fields": fields, "formData": SelectRow }, 700, $(window).height());
                          }

                      }, icon: 'modify'
                  },
                  { line: true },
                  {
                      text: '删除', click: function () {
                          //增加按钮点击事件
                          var SelectRow = Grid.getSelectedRows();
                          var ObjectIdStr = "";
                          $.each(SelectRow, function (key, val) {
                              ObjectIdStr += val.ObjectId + ",";
                          });
                          ObjectIdStr = ObjectIdStr.substring(0, ObjectIdStr.length - 1);
                          $.AJAXGetData("post", "/Admin/DeleteGridData", { ObjectIdStr: ObjectIdStr }, function (responseData) {
                              if (responseData.States) {
                                  alert(responseData.Message);
                                  $("#reloadBtn", window.document).click();
                              } else {
                                  alert(responseData.ErrorMessage);
                              }
                          });
                      }, icon: 'delete'
                  }
                    ]
                }

            });
            return Grid;
        }
        ,
        //获取通用表格通用列配置
        GetT2GridColumns: function (TableListObjectId) {
            var columns = [];
            $.ajax({
                type: "post",
                dataType: "text",
                async: false,
                contentType: "application/json;charset=utf-8",
                url: "/Admin/GetGridColumn",
                timeout: 10000, //超时时间设置，单位毫秒
                data: JSON.stringify({ TableListObjectId: TableListObjectId }),
                success: function (responseData) {
                    console.dir(responseData);
                    var arr = responseData.split("|||");
                    $.each(arr, function (key, val) {
                        //console.dir(val);
                        columns.push(JSON.parse(val));
                    });
                },
                error: function (err, status) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        alert("超时");
                    } else if (status == 'error') {
                        alert("服务器出错。")
                    }
                    console.dir(err);
                    //$.LoadingMask.Hide();

                }
            });
            return columns;
        },
        //生成GUID
        GetGUID: function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            function guid() {
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            }
            return guid();
        },
        //构建通用表单fields
        GetT2FormFieldsByGridColumns: function (columns) {
            var fields = [];
            var newline = true;
            $.each(columns, function (key, val) {

                if (val.hide == "True") {
                    var Obj = new Object();
                    Obj.name = val.columnname;
                    Obj.type = "hidden";
                    fields.push(Obj);
                } else {
                    var Obj = new Object();
                    Obj.display = val.display;
                    Obj.name = val.columnname;
                    Obj.type = val.type;
                    Obj.newline = newline;
                    //备注
                    if (val.columnname == "Remark") {
                        Obj.type = "textarea";
                        Obj.width = 470;
                        Obj.newline = true;
                    }
                    if (newline) {
                        newline = false;
                    } else {
                        newline = true;
                    }
                    //如果是日期类型，则设置它的格式
                    if (val.type == "date") {
                        Obj.format = "yyyy/MM/dd";
                    }
                    fields.push(Obj);
                }
            });
            return fields;
        },
        //日期格式化
        dateFormat: function (datavalue, fmt) {
            datavalue = new Date(datavalue);
            console.dir(datavalue);
            var o = {
                "M+": datavalue.getMonth() + 1, //月份         
                "d+": datavalue.getDate(), //日         
                "h+": datavalue.getHours() % 12 == 0 ? 12 : datavalue.getHours() % 12, //小时         
                "H+": datavalue.getHours(), //小时         
                "m+": datavalue.getMinutes(), //分         
                "s+": datavalue.getSeconds(), //秒         
                "q+": Math.floor((datavalue.getMonth() + 3) / 3), //季度         
                "S": datavalue.getMilliseconds() //毫秒         
            };
            var week = {
                "0": "/u65e5",
                "1": "/u4e00",
                "2": "/u4e8c",
                "3": "/u4e09",
                "4": "/u56db",
                "5": "/u4e94",
                "6": "/u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (datavalue.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[datavalue.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;

        },
        //获取当前地址链接参数
        GetLocationParams: function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

    });


})(jQuery);
