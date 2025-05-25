public class RegisterDto
{
    public string FullName { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Role { get; set; } = null!;
}