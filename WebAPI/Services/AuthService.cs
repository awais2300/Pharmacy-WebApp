namespace WebAPI.Services
{
    public class AuthService
    {
        public bool Register(string username, string password, string role)
        {
            return true;
        }

        public string? Login(string username, string password)
        {
            if(username == "testuser" && password == "testpass")
            {
                return "fake-jwt-token";
            }
            return null; 
        }
    }
}
