namespace VkrChegodaeva;

public interface IDeviceRepository
{
    Task<List<DeviceEntity>> GetDevicesByIdsAsync(List<int> ids);
}
