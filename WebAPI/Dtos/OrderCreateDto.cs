using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class OrderCreateDto
{
    [Required]
    public int CustomerId { get; set; } // or use string for InvoiceNo/CustomerName if needed

    public DateTime OrderDate { get; set; } = DateTime.Now;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    [Required]
    public List<OrderItemDto> Items { get; set; }
}
