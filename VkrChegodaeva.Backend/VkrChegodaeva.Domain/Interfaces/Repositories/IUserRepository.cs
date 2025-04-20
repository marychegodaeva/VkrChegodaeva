namespace VkrChegodaeva;

public interface IUserRepository
{
    Task<UserEntity?> GetUserByIdAsync(int id);
}
