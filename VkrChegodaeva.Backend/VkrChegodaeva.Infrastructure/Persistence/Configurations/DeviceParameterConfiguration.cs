using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VkrChegodaeva;

public class DeviceParameterConfiguration : IEntityTypeConfiguration<DeviceParameterEntity>
{
    public void Configure(EntityTypeBuilder<DeviceParameterEntity> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.Parameter).WithMany(x => x.DeviceParameters).HasForeignKey(x => x.ParameterId);
        builder.HasOne(x => x.Device).WithMany(x => x.DeviceParameters).HasForeignKey(x => x.DeviceId);

        builder.Property(x => x.ParameterId).IsRequired();
        builder.Property(x => x.DeviceId).IsRequired();
    }
}
