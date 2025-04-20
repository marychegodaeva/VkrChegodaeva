namespace VkrChegodaeva;

public interface ICategoryService
{
    Task<List<Category>> GetListAsync();
    Task<Category?> GetDevicesByCategoryIdAsync(int categoryId, int userId);
}
