using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserService userService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] UserRequest request)
    {
        if (!await _userService.IsFreeEmailAsync(request.Email))
        {
            return BadRequest("Email not free");
        }

        await _userService.RegisterAsync(request);

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] UserRequest request)
    {
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
            return BadRequest(ex.Message);
        }

        return Ok();
    }

    private readonly IUserService _userService = userService;
}
