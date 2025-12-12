using Microsoft.AspNetCore.Mvc;

namespace back.Controllers;

[ApiController]
[Route("/health")]
public class HealthController : ControllerBase
{
    [HttpGet()]
    public IActionResult Get()
    {
        return Ok(new{
            Status ="Ok",
            Date = DateTime.UtcNow,
        });
    }
}