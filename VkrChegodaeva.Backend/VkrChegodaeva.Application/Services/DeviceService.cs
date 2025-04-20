namespace VkrChegodaeva;

public class DeviceService(IDeviceRepository deviceRepository) : IDeviceService
{
    public async Task<List<Device>> GetDevicesByIdsAsync(int userId, List<int> ids)
    {
        var deviceEntities = await _deviceRepository.GetDevicesByIdsAsync(ids);

        var userFavoriteDevices = deviceEntities.SelectMany(x => x.FavoriteDevices).Where(x => x.UserId == userId);

        var devices = deviceEntities.Select(Device.ConvertToDto).ToList();

        devices.ForEach(x => x.IsFavorite = userFavoriteDevices.Any(y => y.DeviceId == x.Id));

        return devices;
    }

    private readonly IDeviceRepository _deviceRepository = deviceRepository;
}
