using System.ComponentModel.DataAnnotations.Schema;

namespace VkrChegodaeva;

[Table("DeviceParameter")]
public class DeviceParameterEntity
{
    public int Id { get; set; }
    public string Value { get; set; }
    public int DeviceId { get; set; }
    public int ParameterId { get; set; }

    public virtual DeviceEntity Device { get; set; }
    public virtual ParameterEntity Parameter { get; set; }
}
