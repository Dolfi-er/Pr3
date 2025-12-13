using back.Models;
using back.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace back.Repository;

public class TelemetryRepository : ITelemetryRepository
{
    private readonly Context context;
    public TelemetryRepository(Context context)
    {
        this.context = context;
    }
    public async Task<int> AddAsync(TelemetryEntity entity)
    {
        context.Telemetry.Add(entity);
        return await context.SaveChangesAsync();
    }
    public async Task<List<TelemetryEntity>> GetAllAsync()
    {
        return await context.Telemetry.OrderByDescending(t => t.Timestamp).ToListAsync();
    }
}
