namespace VkrChegodaeva;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<User?> GetUserByIdAsync(int id)
    {
        var userEntity = await _userRepository.GetUserByIdAsync(id);

        if (userEntity == null)
        {
            return null;
        }

        var user = User.ConvertToDto(userEntity);

        return user;
    }

    private readonly IUserRepository _userRepository = userRepository;
}
