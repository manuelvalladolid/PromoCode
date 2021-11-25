

using DAL.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces
{
    public interface IPromoCodeRepository : IRepository<PromoCode>
    {
        Task<bool> AddPromoCode(PromoGenerate promo);
        Task<bool> ValidateEmailExist(string email);
        Task<bool> CanjePromoCode(Guid id);
        Task<List<PromoCode>> GetPromoCodes();
    }
}
