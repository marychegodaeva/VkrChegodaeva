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

    public async Task<UserEntity?> GetUserByLoginAsync(string login)
        => await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Login == login);

    public async Task<bool> IsFreeEmailAsync(string email) => !await _dbContext.Users.AnyAsync(x => x.Email == email);

    public async Task AddAsync(UserEntity user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    private readonly VkrDbContext _dbContext = dbContext;
}
