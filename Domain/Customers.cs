using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain
{
    public class Customers
    {
        public Customers()
        {
            Products = new List<Product>();
        }
        public int CustomerID { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string CustomerName { get; set; }
        public string Mobile { get; set; }
        public List<Product> Products { get; set; }
    }
}