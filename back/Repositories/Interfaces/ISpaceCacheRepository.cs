using back.Models.Entities;

namespace back.Repository;

public interface ISpaceCacheRepository
{
    Task AddAsync(SpaceCache spaceCache);
    Task<SpaceCache?> GetBySource(string source);
}