using Microsoft.EntityFrameworkCore;

namespace VkrChegodaeva;

public class VkrDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<DeviceEntity> Devices { get; set; }
    public DbSet<FavoriteDeviceEntity> FavoriteDevices { get; set; }
    public DbSet<ParameterEntity> Parameters { get; set; }
    public DbSet<DeviceParameterEntity> DeviceParameters { get; set; }

    public VkrDbContext(DbContextOptions<VkrDbContext> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ParameterConfiguration());
        modelBuilder.ApplyConfiguration(new DeviceConfiguration());
        modelBuilder.ApplyConfiguration(new FavoriteDeviceConfiguration());
        modelBuilder.ApplyConfiguration(new DeviceParameterConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}
