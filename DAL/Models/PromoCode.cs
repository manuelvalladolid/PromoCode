using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class PromoCode
    {
        [Key]
        public Guid IdPromoCode { get; set; }

        public string Nombre { get; set; }
        public string Email { get; set; }

        /// <summary>
        /// 0 => Generado
        /// 1 => Canjeado
        /// </summary>
        public byte Estado { get; set; }
    }
}
