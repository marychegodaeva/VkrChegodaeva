namespace VkrChegodaeva;

public class User
{
    public int Id { get; set; }
    public string Login { get; set; }
    public List<Device> FavoriteDevices { get; set; }

    public static User ConvertToDto(UserEntity entity)
        => new()
        {
            Id = entity.Id,
            Login = entity.Login,
            FavoriteDevices = entity.FavoriteDevices.Select(x => Device.ConvertToDto(x.Device)).ToList()
        };
}
