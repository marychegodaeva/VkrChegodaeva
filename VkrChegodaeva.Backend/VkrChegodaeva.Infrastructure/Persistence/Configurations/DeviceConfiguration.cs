using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VkrChegodaeva;

public class DeviceConfiguration : IEntityTypeConfiguration<DeviceEntity>
{
    public void Configure(EntityTypeBuilder<DeviceEntity> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Category).WithMany(x => x.Devices).HasForeignKey(x => x.CategoryId);
        builder.HasMany(x => x.FavoriteDevices).WithOne(x => x.Device).HasForeignKey(x => x.DeviceId);

        builder.Property(x => x.CategoryId).IsRequired();
    }
}
