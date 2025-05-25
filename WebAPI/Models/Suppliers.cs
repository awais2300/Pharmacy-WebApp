namespace WebAPI.Models
{
    public class Suppliers
    {
        public int Id { get; set; } // PK, identity
        public string Name { get; set; } = null!;
        public string? ContactInfo { get; set; }
        public string? Address { get; set; }
    }
}