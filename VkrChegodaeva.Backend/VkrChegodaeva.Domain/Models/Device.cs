namespace VkrChegodaeva;

public class Device
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageName { get; set; }
    public string Price { get; set; }
    public bool IsFavorite { get; set; }
    public List<DeviceParameter> DeviceParameters { get; set; }

    public static Device ConvertToDto(DeviceEntity entity)
        => new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ImageName = entity.ImageName,
            Price = entity.Price,
            DeviceParameters = entity.DeviceParameters.Select(DeviceParameter.ConvertToDto).ToList(),
        };
}
