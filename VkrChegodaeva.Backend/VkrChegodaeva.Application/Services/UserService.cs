namespace VkrChegodaeva;

public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider) : IUserService
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

    public async Task<bool> IsFreeEmailAsync(string email) => await _userRepository.IsFreeEmailAsync(email);

    public async Task RegisterAsync(UserRequest user)
    {
        var hashedPassword = _passwordHasher.Generate(user.Password);

        var userEntity = new UserEntity { Login = user.Login, Email = user.Email, PasswordHash = hashedPassword };

        await _userRepository.AddAsync(userEntity);
    }

    public async Task<string> LoginAsync(UserRequest user)
    {
        var userEntity = await _userRepository.GetUserByLoginAsync(user.Login);

        if (userEntity == null)
            throw new Exception("User not found");

        var result = _passwordHasher.Verify(user.Password, userEntity.PasswordHash);

        if (result == false)
            throw new Exception("Failed to login");

        var token = _jwtProvider.Generate(userEntity);

        return token;
    }

    public bool CheckToken(string token) => _jwtProvider.CheckToken(token);

    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
}
