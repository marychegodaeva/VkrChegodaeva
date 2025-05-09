namespace VkrChegodaeva;

public interface IFavoriteDeviceService
{
    Task AddAsync(int userId, int deviceId);
    Task DeleteAsync(int userId, int deviceId);
}
