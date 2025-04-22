namespace VkrChegodaeva;

public interface IUserRepository
{
    Task<UserEntity?> GetUserByIdAsync(int id);
    Task<UserEntity?> GetUserByLoginAsync(string login);
    Task<bool> IsFreeEmailAsync(string email);
    Task AddAsync(UserEntity user);
}
