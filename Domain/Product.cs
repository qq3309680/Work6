using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Domain
{
    public class Product
    {
        public int ProductID { get; set; }

        public string ProductName { get; set; }

        public string ProductDesc { get; set; }

        public TransportUsers UserOwner { get; set; }

        public string CreateTime { get; set; }
    }
}