using Moq;
using VkrChegodaeva;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPasswordHasher> _mockPasswordHasher;
    private readonly Mock<IJwtProvider> _mockJwtProvider;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher>();
        _mockJwtProvider = new Mock<IJwtProvider>();
        _userService = new UserService(_mockUserRepository.Object, _mockPasswordHasher.Object, _mockJwtProvider.Object);
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsNullWhenUserNotFound()
    {
        // Arrange
        int userId = 1;
        _mockUserRepository.Setup(repo => repo.GetUserByIdAsync(userId)).ReturnsAsync((UserEntity)null);

        // Act
        var result = await _userService.GetUserByIdAsync(userId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsUserWhenUserFound()
    {
        // Arrange
        int userId = 1;
        var userEntity = new UserEntity { Id = userId, Login = "testuser", Email = "test@example.com" };
        _mockUserRepository.Setup(repo => repo.GetUserByIdAsync(userId)).ReturnsAsync(userEntity);

        // Act
        var result = await _userService.GetUserByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal("testuser", result.Login);
    }

    [Fact]
    public async Task IsFreeEmailAsync_ReturnsTrueWhenEmailIsFree()
    {
        // Arrange
        string email = "free@example.com";
        _mockUserRepository.Setup(repo => repo.IsFreeEmailAsync(email)).ReturnsAsync(true);

        // Act
        var result = await _userService.IsFreeEmailAsync(email);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task RegisterAsync_AddsUserWithHashedPassword()
    {
        // Arrange
        var userRequest = new UserRequest { Login = "newuser", Email = "new@example.com", Password = "password" };
        var hashedPassword = "hashedpassword";
        _mockPasswordHasher.Setup(hasher => hasher.Generate(userRequest.Password)).Returns(hashedPassword);

        // Act
        await _userService.RegisterAsync(userRequest);

        // Assert
        _mockUserRepository.Verify(repo => repo.AddAsync(It.Is<UserEntity>(u => u.Login == userRequest.Login && u.Email == userRequest.Email && u.PasswordHash == hashedPassword)), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_ThrowsExceptionWhenUserNotFound()
    {
        // Arrange
        var userRequest = new UserRequest { Login = "nonexistent", Password = "password" };
        _mockUserRepository.Setup(repo => repo.GetUserByLoginAsync(userRequest.Login)).ReturnsAsync((UserEntity)null);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _userService.LoginAsync(userRequest));
    }

    [Fact]
    public async Task LoginAsync_ThrowsExceptionWhenPasswordIsIncorrect()
    {
        // Arrange
        var userRequest = new UserRequest { Login = "testuser", Password = "wrongpassword" };
        var userEntity = new UserEntity { Login = userRequest.Login, PasswordHash = "hashedpassword" };
        _mockUserRepository.Setup(repo => repo.GetUserByLoginAsync(userRequest.Login)).ReturnsAsync(userEntity);
        _mockPasswordHasher.Setup(hasher => hasher.Verify(userRequest.Password, userEntity.PasswordHash)).Returns(false);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _userService.LoginAsync(userRequest));
    }

    [Fact]
    public async Task LoginAsync_ReturnsTokenWhenLoginIsSuccessful()
    {
        // Arrange
        var userRequest = new UserRequest { Login = "testuser", Password = "correctpassword" };
        var userEntity = new UserEntity { Login = userRequest.Login, PasswordHash = "hashedpassword" };
        var token = "testtoken";
        _mockUserRepository.Setup(repo => repo.GetUserByLoginAsync(userRequest.Login)).ReturnsAsync(userEntity);
        _mockPasswordHasher.Setup(hasher => hasher.Verify(userRequest.Password, userEntity.PasswordHash)).Returns(true);
        _mockJwtProvider.Setup(provider => provider.Generate(userEntity)).Returns(token);

        // Act
        var result = await _userService.LoginAsync(userRequest);

        // Assert
        Assert.Equal(token, result);
    }

    [Fact]
    public void CheckToken_ReturnsTrueWhenTokenIsValid()
    {
        // Arrange
        var token = "validtoken";
        _mockJwtProvider.Setup(provider => provider.CheckToken(token)).Returns(true);

        // Act
        var result = _userService.CheckToken(token);

        // Assert
        Assert.True(result);
    }
}
