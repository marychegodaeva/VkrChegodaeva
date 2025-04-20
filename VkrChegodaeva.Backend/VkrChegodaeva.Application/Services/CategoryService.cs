namespace VkrChegodaeva;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<List<Category>> GetListAsync()
    {
        var entityList = await _categoryRepository.GetListAsync();

        return entityList.Select(Category.ConvertToDto).ToList();
    }

    public async Task<Category?> GetDevicesByCategoryIdAsync(int categoryId, int userId)
    {
        var categoryEntity = await _categoryRepository.GetDevicesByCategoryIdAsync(categoryId);

        if (categoryEntity == null)
        {
            return null;
        }

        var userFavoriteDevices = categoryEntity.Devices.SelectMany(x => x.FavoriteDevices).Where(x => x.UserId == userId);

        var category = Category.ConvertToDto(categoryEntity);

        category.Devices.ForEach(x => x.IsFavorite = userFavoriteDevices.Any(y => y.DeviceId == x.Id));

        return category;
    }

    private readonly ICategoryRepository _categoryRepository = categoryRepository;
}
