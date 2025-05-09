using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IUserService userService, IDeviceService deviceService,
    IJwtProvider jwtProvider, ILogger<ProfileController> logger) : ControllerBase
{
    [HttpGet("getUserInfo")]
    public async Task<IActionResult> GetUserInfoAsync()
    {
        _logger.LogInformation("Получен запрос на получение информации о пользователе");

        var token = Request.Cookies["some-cookies"];

        var userId = !string.IsNullOrEmpty(token) ? _jwtProvider.GetUserIdFromToken(token) : 0;

        if (userId == 0)
        {
            _logger.LogWarning("Пользователь не авторизован");
            return Unauthorized();
        }

        var user = await _userService.GetUserByIdAsync(userId);

        if (user == null)
        {
            _logger.LogWarning($"Пользователь с Id = {userId} не найден");
            return NotFound();
        }

        _logger.LogInformation($"Запрос на получение информации о пользователе с Id = {userId} выполнен успешно");

        return Ok(user);
    }

    [HttpGet("getComparisonDevices/{ids}")]
    public async Task<IActionResult> GetDevicesByIdsAsync([FromRoute] string ids)
    {
        _logger.LogInformation("Получен запрос на получение товаров для сравнения");

        var token = Request.Cookies["some-cookies"];

        var userId = !string.IsNullOrEmpty(token) ? _jwtProvider.GetUserIdFromToken(token) : 0;

        if (userId == 0)
        {
            _logger.LogWarning("Пользователь не авторизован");
            return Unauthorized();
        }

        if (ids.Equals("0"))
        {
            return BadRequest();
        }

        var idList = ids.Split(',').Select(int.Parse).ToList();

        var devices = await _deviceService.GetDevicesByIdsAsync(userId, idList);

        _logger.LogInformation($"Запрос на получение товаров с Id = {ids} выполнен успешно");

        return Ok(devices);
    }

    private readonly IUserService _userService = userService;
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly ILogger<ProfileController> _logger = logger;
}
