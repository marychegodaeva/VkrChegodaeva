using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using VkrChegodaeva;

public class FavoriteDeviceServiceTests
{
    private readonly Mock<IFavoriteDeviceRepository> _mockFavoriteDeviceRepository;
    private readonly FavoriteDeviceService _favoriteDeviceService;

    public FavoriteDeviceServiceTests()
    {
        _mockFavoriteDeviceRepository = new Mock<IFavoriteDeviceRepository>();
        _favoriteDeviceService = new FavoriteDeviceService(_mockFavoriteDeviceRepository.Object);
    }

    [Fact]
    public async Task AddAsync_ThrowsExceptionWhenUserAlreadyHasDeviceInFavorite()
    {
        // Arrange
        int userId = 1;
        int deviceId = 1;

        _mockFavoriteDeviceRepository.Setup(repo => repo.HasUserHaveThisDeviceInFavoriteAsync(userId, deviceId)).ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _favoriteDeviceService.AddAsync(userId, deviceId));
    }

    [Fact]
    public async Task AddAsync_ThrowsExceptionWhenUserCannotHaveMoreFavoriteDevices()
    {
        // Arrange
        int userId = 1;
        int deviceId = 1;

        _mockFavoriteDeviceRepository.Setup(repo => repo.HasUserHaveThisDeviceInFavoriteAsync(userId, deviceId)).ReturnsAsync(false);
        _mockFavoriteDeviceRepository.Setup(repo => repo.CanUserHaveMoreFavoriteDevicesAsync(userId)).ReturnsAsync(false);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _favoriteDeviceService.AddAsync(userId, deviceId));
    }

    [Fact]
    public async Task AddAsync_AddsDeviceToFavoritesWhenConditionsAreMet()
    {
        // Arrange
        int userId = 1;
        int deviceId = 1;

        _mockFavoriteDeviceRepository.Setup(repo => repo.HasUserHaveThisDeviceInFavoriteAsync(userId, deviceId)).ReturnsAsync(false);
        _mockFavoriteDeviceRepository.Setup(repo => repo.CanUserHaveMoreFavoriteDevicesAsync(userId)).ReturnsAsync(true);

        // Act
        await _favoriteDeviceService.AddAsync(userId, deviceId);

        // Assert
        _mockFavoriteDeviceRepository.Verify(repo => repo.AddAsync(It.IsAny<FavoriteDeviceEntity>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeletesDeviceFromFavorites()
    {
        // Arrange
        int userId = 1;
        int deviceId = 1;

        // Act
        await _favoriteDeviceService.DeleteAsync(userId, deviceId);

        // Assert
        _mockFavoriteDeviceRepository.Verify(repo => repo.DeleteAsync(userId, deviceId), Times.Once);
    }
}

