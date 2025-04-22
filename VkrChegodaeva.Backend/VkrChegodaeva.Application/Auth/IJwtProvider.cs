namespace VkrChegodaeva;

public interface IJwtProvider
{
    string Generate(UserEntity userEntity);
    bool CheckToken(string token);
    int GetUserIdFromToken(string token);
}
