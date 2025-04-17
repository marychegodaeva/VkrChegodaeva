using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VkrChegodaeva;

public class FavoriteDeviceConfiguration : IEntityTypeConfiguration<FavoriteDeviceEntity>
{
    public void Configure(EntityTypeBuilder<FavoriteDeviceEntity> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.User).WithMany(x => x.FavoriteDevices).HasForeignKey(x => x.UserId);
        builder.HasOne(x => x.Device).WithMany(x => x.FavoriteDevices).HasForeignKey(x => x.DeviceId);

        builder.Property(x => x.UserId).IsRequired();
        builder.Property(x => x.DeviceId).IsRequired();
    }
}
