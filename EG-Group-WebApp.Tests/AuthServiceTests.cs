using Xunit;
using WebAPI.Services; 

public class AuthServiceTests
{
    [Fact]
    public void Register_ShouldCreateUser_WhenValidInput()
    {
        var authService = new AuthService(); 
        var result = authService.Register("testuser", "password", "User");
        Assert.True(result); 
    }

    [Fact]
    public void Login_ShouldReturnToken_WhenCredentialsAreValid()
    {
        var authService = new AuthService();
        var token = authService.Login("testuser", "testpass");
        Assert.NotNull(token);
        Assert.IsType<string>(token);
    }
}
