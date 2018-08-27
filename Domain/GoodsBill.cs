using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    /// <summary>
    /// Author : 谭振
    /// DateTime : 2017/7/7 10:30:12
  
 
    /// </summary>
    public class GoodsBill
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public string ObjectId { get; set; }
        /// <summary>
        /// 账单名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 购买人
        /// </summary>
        public string PurchaseMan { get; set; }
        /// <summary>
        /// 账单总金额
        /// </summary>
        public decimal BillAmount { get; set; }
        /// <summary>
        /// 已付款金额
        /// </summary>
        public decimal PaidAmount { get; set; }
        /// <summary>
        /// 我的进价
        /// </summary>
        public decimal MyBid { get; set; }
        /// <summary>
        /// 商品名称
        /// </summary>
        public string GoodsName { get; set; }

        /// <summary>
        /// 订货日期
        /// </summary>
        public DateTime OrderDate { get; set; }
        /// <summary>
        /// 发货日期
        /// </summary>
        public DateTime DeliveryDate { get; set; }

        /// <summary>
        /// 付款情况（未付款，已付定金，已付全款）
        /// </summary>
        public string PaymentSituation { get; set; }
        /// <summary>
        /// 订单状态
        /// </summary>
        public string OrderState { get; set; }
        /// <summary>
        /// 利润
        /// </summary>
        public decimal Profit { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
