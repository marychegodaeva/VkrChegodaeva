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

        return services;
    }
}
