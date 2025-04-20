using Microsoft.EntityFrameworkCore;

namespace VkrChegodaeva;

public class CategoryRepository(VkrDbContext dbContext) : ICategoryRepository
{
    public async Task<List<CategoryEntity>> GetListAsync() => await _dbContext.Categories.AsNoTracking().ToListAsync();

    public async Task<CategoryEntity?> GetDevicesByCategoryIdAsync(int id)
    {
        var categoryEntity = await _dbContext.Categories.AsNoTracking()
            .Include(c => c.Devices)
                .ThenInclude(x => x.DeviceParameters)
                    .ThenInclude(x => x.Parameter)
            .Include(x => x.Devices)
                .ThenInclude(x => x.FavoriteDevices)
            .FirstOrDefaultAsync(x => x.Id == id);

        return categoryEntity;
    }

    private readonly VkrDbContext _dbContext = dbContext;
}
