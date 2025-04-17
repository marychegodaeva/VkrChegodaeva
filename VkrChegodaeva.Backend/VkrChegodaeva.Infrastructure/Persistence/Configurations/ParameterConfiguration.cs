using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace VkrChegodaeva;

public class ParameterConfiguration : IEntityTypeConfiguration<ParameterEntity>
{
    public void Configure(EntityTypeBuilder<ParameterEntity> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasMany(x => x.DeviceParameters).WithOne(x => x.Parameter).HasForeignKey(x => x.ParameterId);
    }
}
