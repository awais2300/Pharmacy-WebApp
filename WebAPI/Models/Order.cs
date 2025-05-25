using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Order
{
    [Key]
    public int Id { get; set; }

    // Treat as plain integer, no foreign key
    public int CustomerId { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }

    // Navigation property (optional, not enforced)
    public virtual ICollection<OrderDetail> OrderDetails { get; set; }
}
