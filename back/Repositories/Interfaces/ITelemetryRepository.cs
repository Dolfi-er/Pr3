using back.Models.Entities;

namespace back.Repository;

public interface ITelemetryRepository
{
    Task<int> AddAsync(TelemetryEntity entity);
    Task<List<TelemetryEntity>> GetAllAsync();
}