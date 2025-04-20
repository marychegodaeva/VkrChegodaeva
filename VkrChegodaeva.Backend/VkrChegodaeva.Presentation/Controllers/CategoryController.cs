using Microsoft.AspNetCore.Mvc;

namespace VkrChegodaeva;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCategoriesAsync()
    {
        var categories = await _categoryService.GetListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDevicesByCategoryIdAsync([FromRoute] int id)
    {
        var userId = 1; //TODO

        var category = await _categoryService.GetDevicesByCategoryIdAsync(id, userId);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    private readonly ICategoryService _categoryService = categoryService;
}
