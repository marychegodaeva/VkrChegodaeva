namespace VkrChegodaeva;

public class DeviceEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageName { get; set; }
    public int CategoryId { get; set; }

    public virtual CategoryEntity Category { get; set; }
}
