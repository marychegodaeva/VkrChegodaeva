using System.ComponentModel.DataAnnotations.Schema;

namespace VkrChegodaeva;

[Table("User")]
public class UserEntity
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }

    public virtual List<FavoriteDeviceEntity> FavoriteDevices { get; set; }
}
