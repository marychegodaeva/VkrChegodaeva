namespace VkrChegodaeva;

public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
    Task<bool> IsFreeEmailAsync(string email);
    Task RegisterAsync(UserRequest user);
    Task<string> LoginAsync(UserRequest user);
    bool CheckToken(string token);
}
