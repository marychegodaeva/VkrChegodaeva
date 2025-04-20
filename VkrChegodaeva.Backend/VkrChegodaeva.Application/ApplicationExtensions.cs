using Microsoft.Extensions.DependencyInjection;

namespace VkrChegodaeva;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IDeviceService, DeviceService>();

        return services;
    }
}
