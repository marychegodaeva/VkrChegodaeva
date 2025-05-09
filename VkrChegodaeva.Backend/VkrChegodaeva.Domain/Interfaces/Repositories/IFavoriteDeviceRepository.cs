namespace VkrChegodaeva;

public interface IFavoriteDeviceRepository
{
    Task AddAsync(FavoriteDeviceEntity entity);
    Task DeleteAsync(int userId, int deviceId);
    Task<bool> HasUserHaveThisDeviceInFavoriteAsync(int userId, int deviceId);
    Task<bool> CanUserHaveMoreFavoriteDevicesAsync(int userId);
}
