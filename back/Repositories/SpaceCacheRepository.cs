using back.Models;
using back.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace back.Repository;

public class SpaceCacheRepository : ISpaceCacheRepository
{
    private readonly Context context;
    public SpaceCacheRepository(Context context)
    {
        this.context = context;
    }
    public async Task AddAsync(SpaceCache spaceCache)
    {
        await context.SpaceCache.AddAsync(spaceCache);
        await context.SaveChangesAsync();
    }

    public async Task<SpaceCache?> GetBySource(string source)
    {
        return await context.SpaceCache.Where(sc => sc.Source == source).OrderByDescending(sc => sc.FetchedAt).FirstOrDefaultAsync();
    }
}