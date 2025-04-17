using System.ComponentModel.DataAnnotations.Schema;

namespace VkrChegodaeva;

[Table("Category")]
public class CategoryEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageName { get; set; }

    public virtual List<DeviceEntity> Devices { get; set; }
}
