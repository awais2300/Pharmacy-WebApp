using System;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Dtos
{
    public class MedicineDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int SupplierId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be 0 or more.")]
        public int Quantity { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(255)]
        public string? Description { get; set; }
    }
}
