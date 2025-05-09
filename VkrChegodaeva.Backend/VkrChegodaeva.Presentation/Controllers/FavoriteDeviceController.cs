using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class FavoriteDeviceController(IFavoriteDeviceService favoriteDeviceService,
    IJwtProvider jwtProvider, ILogger<FavoriteDeviceController> logger) : ControllerBase
{
    [HttpPost("{id}")]
    public async Task<IActionResult> AddFavoriteDeviceAsync([FromRoute] int id)
    {
        _logger.LogInformation($"Получен запрос на добавление оборудования с Id = {id} в избранное");

        var token = Request.Cookies["some-cookies"];

        var userId = !string.IsNullOrEmpty(token) ? _jwtProvider.GetUserIdFromToken(token) : 0;

        if (userId == 0)
        {
            _logger.LogWarning("Пользователь не авторизован");
            return Unauthorized();
        }

        try
        {
            await _favoriteDeviceService.AddAsync(userId, id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return BadRequest(ex.Message);
        }

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFavoriteDeviceAsync([FromRoute] int id)
    {
        _logger.LogInformation($"Получен запрос на удаление оборудования с Id = {id} из избранного");

        var token = Request.Cookies["some-cookies"];

        var userId = !string.IsNullOrEmpty(token) ? _jwtProvider.GetUserIdFromToken(token) : 0;

        if (userId == 0)
        {
            _logger.LogWarning("Пользователь не авторизован");
            return Unauthorized();
        }

        try
        {
            await _favoriteDeviceService.DeleteAsync(userId, id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return BadRequest(ex.Message);
        }

        return Ok();
    }

    private readonly IFavoriteDeviceService _favoriteDeviceService = favoriteDeviceService;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly ILogger<FavoriteDeviceController> _logger = logger;
}
