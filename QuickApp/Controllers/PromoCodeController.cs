
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuickApp.ViewModels;
using DAL.Repositories.Interfaces;
using Viewmodel = DAL.Models;


namespace QuickApp.Controllers
{
    [Route("api/[controller]")]
    public class PromoCodeController : ControllerBase
    {
        private readonly IPromoCodeRepository _IPromoCodeRepository;

        public PromoCodeController(IPromoCodeRepository iPromoCodeRepository)
        {
            _IPromoCodeRepository = iPromoCodeRepository;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] PromoGenerate promo)
        {
            var promoObject = new Viewmodel.PromoGenerate();
            promoObject.Email = promo.Email;
            promoObject.Nombre = promo.Nombre;
            bool result = await _IPromoCodeRepository.AddPromoCode(promoObject);
            return Ok(new { result = "Ok" , data = result});
        }

        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            var result = await _IPromoCodeRepository.GetPromoCodes();
            return Ok(new { result = "Ok", data = result });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id)
        {
            var result = await _IPromoCodeRepository.CanjePromoCode(id);
            return Ok(new { result = "Ok", data = result });
        }

    }
}
