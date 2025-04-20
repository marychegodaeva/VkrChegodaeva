namespace VkrChegodaeva;

public class DeviceParameter
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }

    public static DeviceParameter ConvertToDto(DeviceParameterEntity entity)
        => new()
        {
            Id = entity.Id,
            Name = entity.Parameter.Name,
            Value = entity.Value,
        };
}
