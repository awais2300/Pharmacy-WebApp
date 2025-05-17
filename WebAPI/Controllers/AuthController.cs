using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Data;
using WebAPI.Dtos;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            try
            {
                var user = _context.Users.SingleOrDefault(u => u.Username == login.Username);

                _logger.LogInformation("Login attempt for user: {Username} at {Time}", user?.Username, DateTime.UtcNow);

                if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
                {
                    _logger.LogInformation("Invalid credentials");
                    return Unauthorized("Invalid credentials");
                }
                    
                var token = GenerateToken(user);
                _logger.LogInformation("Login Successfull");
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for {UserId}", login.Username);
                return StatusCode(500);
            }
            
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (_context.Users.Any(u => u.Username == registerDto.Username))
                {
                    return BadRequest("Username already exists.");
                }

                var user = new User
                {
                    Username = registerDto.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    Role = registerDto.Role
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                _logger.LogInformation("User registered successfully: {user} at {time}", registerDto.Username, DateTime.UtcNow);
                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while registeration {UserId}", registerDto.Username);
                return StatusCode(500);
            }
            
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role), // very important
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}