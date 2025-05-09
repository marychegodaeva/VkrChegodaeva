namespace VkrChegodaeva;

public class FavoriteDeviceService(IFavoriteDeviceRepository favoriteDeviceRepository) : IFavoriteDeviceService
{
    public async Task AddAsync(int userId, int deviceId)
    {
        var entity = new FavoriteDeviceEntity
        {
            UserId = userId,
            DeviceId = deviceId
        };

        if (await _favoriteDeviceRepository.HasUserHaveThisDeviceInFavoriteAsync(userId, deviceId))
        {
            throw new Exception("User already have this device in favorite");
        }

        if (!await _favoriteDeviceRepository.CanUserHaveMoreFavoriteDevicesAsync(userId))
        {
            throw new Exception("User can't have more favorite devices");
        }

        await _favoriteDeviceRepository.AddAsync(entity);
    }

    public async Task DeleteAsync(int userId, int deviceId) => await _favoriteDeviceRepository.DeleteAsync(userId, deviceId);

    private readonly IFavoriteDeviceRepository _favoriteDeviceRepository = favoriteDeviceRepository;
}
