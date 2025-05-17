using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProtectedController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("You are authorized!");

    // Accessible only to users with Admin role
    [Authorize(Roles = "Admin")]
    [HttpGet("admin-data")]
    public IActionResult AdminData() => Ok("This is admin-only data.");

    // Accessible to Admin and Manager roles
    [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manager-data")]
    public IActionResult ManagerData() => Ok("Accessible to Manager and Admin.");
}
