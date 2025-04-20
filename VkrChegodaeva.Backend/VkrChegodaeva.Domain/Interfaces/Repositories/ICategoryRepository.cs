namespace VkrChegodaeva;

public interface ICategoryRepository
{
    Task<List<CategoryEntity>> GetListAsync();
    Task<CategoryEntity?> GetDevicesByCategoryIdAsync(int id);
}
