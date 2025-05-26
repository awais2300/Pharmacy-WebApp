using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Medicines
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [ForeignKey("Categories")]
        public int CategoryId { get; set; }

        [ForeignKey("Suppliers")]
        public int SupplierId { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal PurchasePrice { get; set; }

        public int Quantity { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ExpiryDate { get; set; }

        [MaxLength(255)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? RackNumber { get; set; }

        // Navigation properties
        public Categories Category { get; set; }
        public Suppliers Supplier { get; set; }
    }
}
