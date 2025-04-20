using Microsoft.EntityFrameworkCore;

namespace VkrChegodaeva;

public class UserRepository(VkrDbContext dbContext) : IUserRepository
{
    public async Task<UserEntity?> GetUserByIdAsync(int id)
    {
        var userEntity = await _dbContext.Users.AsNoTracking()
            .Include(x => x.FavoriteDevices)
                .ThenInclude(x => x.Device)
            .FirstOrDefaultAsync(x => x.Id == id);

        return userEntity;
    }

    private readonly VkrDbContext _dbContext = dbContext;
}
