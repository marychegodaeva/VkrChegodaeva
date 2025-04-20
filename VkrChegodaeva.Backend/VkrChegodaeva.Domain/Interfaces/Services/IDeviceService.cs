namespace VkrChegodaeva;

public interface IDeviceService
{
    Task<List<Device>> GetDevicesByIdsAsync(int userId, List<int> ids);
}
