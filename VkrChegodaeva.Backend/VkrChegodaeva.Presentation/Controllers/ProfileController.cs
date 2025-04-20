using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class ProfileController(IUserService userService, IDeviceService deviceService) : ControllerBase
{
    [HttpGet("getUserInfo")]
    public async Task<IActionResult> GetUserInfoAsync()
    {
        var userId = 1; //TODO

        var user = await _userService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet("getComparisonDevices/{ids}")]
    public async Task<IActionResult> GetDevicesByIdsAsync([FromRoute] string ids)
    {
        var userId = 1; //TODO

        var idList = ids.Split(',').Select(int.Parse).ToList();

        var devices = await _deviceService.GetDevicesByIdsAsync(userId, idList);

        return Ok(devices);
    }

    private readonly IUserService _userService = userService;
    private readonly IDeviceService _deviceService = deviceService;
}
