using Moq;
using VkrChegodaeva;

public class CategoryServiceTests
{
    private readonly Mock<ICategoryRepository> _mockCategoryRepository;
    private readonly CategoryService _categoryService;

    public CategoryServiceTests()
    {
        _mockCategoryRepository = new Mock<ICategoryRepository>();
        _categoryService = new CategoryService(_mockCategoryRepository.Object);
    }

    [Fact]
    public async Task GetListAsync_ReturnsOrderedListOfCategories()
    {
        // Arrange
        var categories = new List<CategoryEntity>
        {
            new CategoryEntity { Id = 2, Name = "Category 2" },
            new CategoryEntity { Id = 1, Name = "Category 1" }
        };

        _mockCategoryRepository.Setup(repo => repo.GetListAsync()).ReturnsAsync(categories);

        // Act
        var result = await _categoryService.GetListAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal(1, result[0].Id);
        Assert.Equal("Category 1", result[0].Name);
        Assert.Equal(2, result[1].Id);
        Assert.Equal("Category 2", result[1].Name);
    }

    [Fact]
    public async Task GetDevicesByCategoryIdAsync_ReturnsNullWhenCategoryNotFound()
    {
        // Arrange
        int categoryId = 1;
        int userId = 1;

        _mockCategoryRepository.Setup(repo => repo.GetDevicesByCategoryIdAsync(categoryId)).ReturnsAsync((CategoryEntity)null);

        // Act
        var result = await _categoryService.GetDevicesByCategoryIdAsync(categoryId, userId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetDevicesByCategoryIdAsync_ReturnsCategoryWithDevicesMarkedAsFavorite()
    {
        // Arrange
        int categoryId = 1;
        int userId = 1;

        var devices = new List<DeviceEntity>
        {
            new DeviceEntity { Id = 1, Name = "Device 1", FavoriteDevices = new List<FavoriteDeviceEntity> { new FavoriteDeviceEntity { UserId = userId, DeviceId = 1 } } },
            new DeviceEntity { Id = 2, Name = "Device 2", FavoriteDevices = new List<FavoriteDeviceEntity>() }
        };

        var categoryEntity = new CategoryEntity
        {
            Id = categoryId,
            Name = "Test Category",
            Devices = devices
        };

        _mockCategoryRepository.Setup(repo => repo.GetDevicesByCategoryIdAsync(categoryId)).ReturnsAsync(categoryEntity);

        // Act
        var result = await _categoryService.GetDevicesByCategoryIdAsync(categoryId, userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(categoryId, result.Id);
        Assert.Contains(result.Devices, d => d.Id == 1 && d.IsFavorite);
        Assert.DoesNotContain(result.Devices, d => d.Id == 2 && d.IsFavorite);
    }
}