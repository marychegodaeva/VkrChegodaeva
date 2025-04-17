using System.ComponentModel.DataAnnotations.Schema;

namespace VkrChegodaeva;

[Table("Parameter")]
public class ParameterEntity
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual List<DeviceParameterEntity> DeviceParameters { get; set; }
}
