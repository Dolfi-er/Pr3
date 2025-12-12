using back.Models.Entities;
namespace back.Repository;
public interface IIssRepository
{
    Task<IssFetchLog> AddAsync(IssFetchLog log);
    Task<IssFetchLog?> GetLastAsync();
    Task<List<IssFetchLog>> GetLastNAsync(int n);
}