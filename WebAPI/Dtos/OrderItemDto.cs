using System.ComponentModel.DataAnnotations;

public class OrderItemDto
{
    [Required]
    public int MedicineId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal Price { get; set; }
}
