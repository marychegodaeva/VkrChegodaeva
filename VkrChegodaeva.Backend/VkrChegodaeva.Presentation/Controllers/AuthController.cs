using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserService userService, ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] UserRequest request)
    {
        _logger.LogInformation($"Получен запрос на регистрацию с Email = {request.Email}");

        if (!await _userService.IsFreeEmailAsync(request.Email))
        {
            _logger.LogWarning($"Пользователь с Email = {request.Email} уже существует");
            return BadRequest("Email not free");
        }

        await _userService.RegisterAsync(request);

        _logger.LogInformation($"Пользователь с Email = {request.Email} зарегистрирован успешно");

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] UserRequest request)
    {
        _logger.LogInformation($"Получен запрос на авторизацию с Login = {request.Login}");

        try
        {
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddHours(12)
            };

            var token = await _userService.LoginAsync(request);

            Response.Cookies.Delete("some-cookies");
            Response.Cookies.Append("some-cookies", token, cookieOptions);
        }
        catch (Exception ex)
        {
            _logger.LogWarning($"Авторизация для Login = {request.Login} не пройдена. Введены неверные данные");
            return BadRequest(ex.Message);
        }

        _logger.LogInformation("Авторизация прошла успешно");

        return Ok();
    }

    private readonly IUserService _userService = userService;
    private readonly ILogger<AuthController> _logger = logger;
}
