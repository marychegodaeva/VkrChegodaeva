namespace VkrChegodaeva;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<Device> Devices { get; set; }

    public static Category ConvertToDto(CategoryEntity entity)
        => new Category
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Devices = entity.Devices.Select(Device.ConvertToDto).ToList()
        };
}
