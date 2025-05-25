using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Data;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/admin/category
        [HttpPost("category")]
        public async Task<IActionResult> AddCategory([FromBody] CategoryDto categorydto)
        {
            if (string.IsNullOrWhiteSpace(categorydto.Name))
            {
                return BadRequest("Category name is required.");
            }

            var category = new WebAPI.Models.Categories
            {
                Name = categorydto.Name
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category added successfully." });
        }

        // POST: api/admin/supplier
        [HttpPost("supplier")]
        public async Task<IActionResult> AddSupplier([FromBody] SupplierDto supplierdto)
        {
            if (string.IsNullOrWhiteSpace(supplierdto.Name))
            {
                return BadRequest("Supplier name is required.");
            }

            var supplier = new WebAPI.Models.Suppliers
            {
                Name = supplierdto.Name,
                ContactInfo = supplierdto.ContactInfo,
                Address = supplierdto.Address
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Supplier added successfully." });
        }

        // POST: api/admin/medicine
        [HttpPost("medicines")]
        public async Task<IActionResult> AddMedicine([FromBody] MedicineDto medicineDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if CategoryId and SupplierId exist
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == medicineDto.CategoryId);
            var supplierExists = await _context.Suppliers.AnyAsync(s => s.Id == medicineDto.SupplierId);

            if (!categoryExists)
                return BadRequest("Invalid CategoryId");

            if (!supplierExists)
                return BadRequest("Invalid SupplierId");

            var medicine = new Medicines
            {
                Name = medicineDto.Name,
                CategoryId = medicineDto.CategoryId,
                SupplierId = medicineDto.SupplierId,
                Price = medicineDto.Price,
                Quantity = medicineDto.Quantity,
                ExpiryDate = medicineDto.ExpiryDate,
                Description = medicineDto.Description
            };

            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medicine added successfully." });
        }

        [HttpPost("sales")]
        public async Task<IActionResult> CreateSale([FromBody] OrderCreateDto dto)
        {
            if (!ModelState.IsValid || dto.Items == null || !dto.Items.Any())
                return BadRequest("Invalid sale data.");

            // Calculate total
            decimal total = dto.Items.Sum(i => i.Price * i.Quantity);

            // Create Order
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                OrderDate = dto.OrderDate,
                Status = dto.Status,
                TotalAmount = total
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // To get OrderId

            // Add order details
            foreach (var item in dto.Items)
            {
                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    MedicineId = item.MedicineId,
                    Quantity = item.Quantity,
                    Price = item.Price
                };

                _context.OrderDetails.Add(detail);

                // Optionally: Update stock
                var medicine = await _context.Medicines.FindAsync(item.MedicineId);
                if (medicine != null)
                {
                    medicine.Quantity -= item.Quantity;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Sale saved successfully", orderId = order.Id });
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverviewStats()
        {
            var totalMedicines = await _context.Medicines.CountAsync();
            var totalStock = await _context.Medicines.SumAsync(m => m.Quantity);
            var totalUsers = await _context.Users.CountAsync();

            return Ok(new
            {
                medicines = totalMedicines,
                stock = totalStock,
                users = totalUsers
            });
        }


        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new { c.Id, c.Name })  // Project to only needed fields
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSuppliers()
        {
            var suppliers = await _context.Suppliers
                .Select(c => new { c.Id, c.Name })  // Project to only needed fields
                .ToListAsync();

            return Ok(suppliers);
        }

        [HttpGet("medicines")]
        public async Task<IActionResult> GetAllMedicines()
        {
            var medicines = await _context.Medicines
                .Include(m => m.Category)
                .Include(m => m.Supplier)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    Category = m.Category.Name,
                    Supplier = m.Supplier.Name,
                    m.Price,
                    m.Quantity,
                    m.ExpiryDate,
                    m.Description
                }).ToListAsync();

            return Ok(medicines);
        }

        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory()
        {
            var medicines = await _context.Medicines
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Price,
                    m.Quantity
                })
                .ToListAsync();

            return Ok(medicines);
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .AsNoTracking()
                .Where(u => u.Role == "Customer")  // filter only customers
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.FullName
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await (
             from o in _context.Orders
             join od in _context.OrderDetails on o.Id equals od.OrderId
             join m in _context.Medicines on od.MedicineId equals m.Id
             group new { od, m, o } by new
             {
                 o.Id,
                 o.CustomerId,
                 o.OrderDate,
                 CustomerName = o.CustomerId  // Or get customer name however it's stored
             } into g
             select new
             {
                 Id = g.Key.Id,
                 Date = g.Key.OrderDate.ToString("o"),
                 CustomerName = g.Key.CustomerName,
                 Items = g.Select(x => new
                 {
                     MedicineName = x.m.Name,
                     Quantity = x.od.Quantity,
                     Price = x.od.Price,
                     Total = x.od.Quantity * x.od.Price
                 }).ToList(),
                 TotalAmount = g.Sum(x => x.od.Quantity * x.od.Price)
             }
             ).ToListAsync();

            return Ok(new { orders });
        }

        [Authorize]
        [HttpGet("ping")]
        public IActionResult Ping() => Ok("Authorized");
    }
}
