using Microsoft.EntityFrameworkCore;

namespace VkrChegodaeva;

public class DeviceRepository(VkrDbContext dbContext) : IDeviceRepository
{
    public async Task<List<DeviceEntity>> GetDevicesByIdsAsync(List<int> ids)
    {
        var deviceEntities = await _dbContext.Devices.AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .Include(x => x.DeviceParameters)
                .ThenInclude(x => x.Parameter)
            .Include(x => x.FavoriteDevices)
            .ToListAsync();

        return deviceEntities;
    }

    private readonly VkrDbContext _dbContext = dbContext;
}
