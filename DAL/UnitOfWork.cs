// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Repositories;
using DAL.Repositories.Interfaces;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;

        IPromoCodeRepository _promo;



        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IPromoCodeRepository Promo
        {
            get
            {
                if (_promo == null)
                    _promo = new PromoCodeRepository(_context);

                return _promo;
            }
        }


        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
