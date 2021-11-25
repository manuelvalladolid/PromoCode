// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DAL.Repositories
{
    public class PromoCodeRepository : Repository<PromoCode>, IPromoCodeRepository
    {
        public PromoCodeRepository(ApplicationDbContext context) : base(context)
        { }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<bool> AddPromoCode(PromoGenerate promo)
        {
            var exist = await ValidateEmailExist(promo.Email);
            if (exist)
                return false;
          
            var promoCode = new PromoCode();
            promoCode.Email = promo.Email;
            promoCode.Nombre = promo.Nombre;

            await _appContext.PromoCode.AddAsync(promoCode);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>  ValidateEmailExist(string email)
        {
            var exist = await _appContext.PromoCode.Where(w => w.Email == email.Trim()).FirstOrDefaultAsync();
            if (exist != null)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CanjePromoCode(Guid id)
        {
            var promoCode = await _appContext.PromoCode.Where(w => w.IdPromoCode == id).FirstOrDefaultAsync();
            promoCode.Estado = 1;

            _appContext.PromoCode.Update(promoCode);
            await _context.SaveChangesAsync();

            return true;
        }



        public async Task<List<PromoCode>> GetPromoCodes()
        {
            return await _appContext.PromoCode.ToListAsync();
        }


        
    }
}
