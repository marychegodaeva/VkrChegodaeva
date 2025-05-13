using Xunit;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VkrChegodaeva;

public class DeviceServiceTests
{
    private readonly Mock<IDeviceRepository> _mockDeviceRepository;
    private readonly DeviceService _deviceService;

    public DeviceServiceTests()
    {
        _mockDeviceRepository = new Mock<IDeviceRepository>();
        _deviceService = new DeviceService(_mockDeviceRepository.Object);
    }

    [Fact]
    public async Task GetDevicesByIdsAsync_ReturnsDevicesWithFavoriteStatus()
    {
        // Arrange
        int userId = 1;
        var ids = new List<int> { 1, 2 };

        var devices = new List<DeviceEntity>
        {
            new DeviceEntity
            {
                Id = 1,
                Name = "Device 1",
                FavoriteDevices = new List<FavoriteDeviceEntity> { new FavoriteDeviceEntity { UserId = userId, DeviceId = 1 } }
            },
            new DeviceEntity
            {
                Id = 2,
                Name = "Device 2",
                FavoriteDevices = new List<FavoriteDeviceEntity>()
            }
        };

        _mockDeviceRepository.Setup(repo => repo.GetDevicesByIdsAsync(ids)).ReturnsAsync(devices);

        // Act
        var result = await _deviceService.GetDevicesByIdsAsync(userId, ids);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.True(result.Any(d => d.Id == 1 && d.IsFavorite));
        Assert.False(result.Any(d => d.Id == 2 && d.IsFavorite));
    }

    [Fact]
    public async Task GetDevicesByIdsAsync_ReturnsEmptyListWhenNoDevicesFound()
    {
        // Arrange
        int userId = 1;
        var ids = new List<int> { 3, 4 };

        _mockDeviceRepository.Setup(repo => repo.GetDevicesByIdsAsync(ids)).ReturnsAsync(new List<DeviceEntity>());

        // Act
        var result = await _deviceService.GetDevicesByIdsAsync(userId, ids);

        // Assert
        Assert.Empty(result);
    }
}
