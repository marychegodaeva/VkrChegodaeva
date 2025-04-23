using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService, IJwtProvider jwtProvider,
    ILogger<CategoryController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCategoriesAsync()
    {
        _logger.LogInformation("Получен запрос на получение списка категорий");

        var categories = await _categoryService.GetListAsync();

        _logger.LogInformation("Запрос на получение списка категорий выполнен успешно");

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDevicesByCategoryIdAsync([FromRoute] int id)
    {
        _logger.LogInformation($"Получен запрос на получение информации о категории с Id = {id}");

        var token = Request.Cookies["some-cookies"];

        var userId = !string.IsNullOrEmpty(token) ? _jwtProvider.GetUserIdFromToken(token) : 0;

        _logger.LogInformation(userId > 0
            ? $"Запрос получен от пользователя с Id = {userId}"
            : "Запрос получен от неавторизованного пользователя"
        );

        var category = await _categoryService.GetDevicesByCategoryIdAsync(id, userId);

        if (category == null)
        {
            _logger.LogWarning($"Категория с Id = {id} не найдена");
            return NotFound();
        }

        _logger.LogInformation($"Запрос на получение информации о категории с Id = {id} выполнен успешно");

        return Ok(category);
    }

    private readonly ICategoryService _categoryService = categoryService;
    private readonly IJwtProvider _jwtProvider = jwtProvider;
    private readonly ILogger<CategoryController> _logger = logger;
}
