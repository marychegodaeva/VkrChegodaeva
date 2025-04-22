﻿
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace VkrChegodaeva;

public class JwtProvider(IOptions<JwtOptions> options) : IJwtProvider
{
    public string Generate(UserEntity userEntity)
    {
        Claim[] claims = [new("userId", userEntity.Id.ToString())];

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            signingCredentials: signingCredentials,
            expires: DateTime.UtcNow.AddHours(_options.ExpiresHours)
            );

        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenValue;
    }

    public bool CheckToken(string token)
    {
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_options.SecretKey)),
            ValidateLifetime = true,
            ValidateAudience = false,
            ValidateIssuer = false
        };

        try
        {
            new JwtSecurityTokenHandler().ValidateToken(token, validationParameters, out _);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public int GetUserIdFromToken(string token)
    {
        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var id = jwtToken.Claims.FirstOrDefault(x => x.Type.Equals("userId"));

        if (id is not null)
            return int.Parse(id.Value);

        return 0;
    }

    private readonly JwtOptions _options = options.Value;
}
