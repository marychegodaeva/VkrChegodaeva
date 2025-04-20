using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VkrChegodaeva;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<VkrDbContext>(
            options =>
            {
                options.UseLazyLoadingProxies().UseNpgsql(configuration.GetConnectionString(nameof(VkrDbContext)));
            }
        );

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IDeviceRepository, DeviceRepository>();

        return services;
    }
}
