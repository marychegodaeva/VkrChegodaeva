namespace VkrChegodaeva;

public class FavoriteDeviceEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int DeviceId { get; set; }

    public virtual UserEntity User { get; set; }
    public virtual DeviceEntity Device { get; set; }
}
