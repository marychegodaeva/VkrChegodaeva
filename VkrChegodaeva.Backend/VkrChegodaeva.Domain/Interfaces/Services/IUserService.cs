namespace VkrChegodaeva;

public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
}
