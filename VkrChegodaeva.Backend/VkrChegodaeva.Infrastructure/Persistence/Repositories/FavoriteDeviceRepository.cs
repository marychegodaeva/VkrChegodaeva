using Microsoft.EntityFrameworkCore;

namespace VkrChegodaeva;

public class FavoriteDeviceRepository(VkrDbContext dbContext) : IFavoriteDeviceRepository
{
    public async Task AddAsync(FavoriteDeviceEntity entity)
    {
        await _dbContext.FavoriteDevices.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int userId, int deviceId)
    {
        await _dbContext.FavoriteDevices.Where(x => x.UserId == userId && x.DeviceId == deviceId).ExecuteDeleteAsync();
    }

    public async Task<bool> HasUserHaveThisDeviceInFavoriteAsync(int userId, int deviceId)
    {
        return await _dbContext.FavoriteDevices.AsNoTracking().AnyAsync(x => x.UserId == userId && x.DeviceId == deviceId);
    }

    public async Task<bool> CanUserHaveMoreFavoriteDevicesAsync(int userId)
    {
        return await _dbContext.FavoriteDevices.AsNoTracking().Where(x => x.UserId == userId).CountAsync() < 4;
    }

    private readonly VkrDbContext _dbContext = dbContext;
}
