using back.Models.Entities;

namespace back.Services;

public interface IIssApiService
{
    Task<string?> FetchCurrentAsync();
    Task<IssFetchLog?> GetLastAsync();
    Task<object> GetTrendAsync();
}