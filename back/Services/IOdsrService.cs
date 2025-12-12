namespace back.Services;

public interface IOdsrService
{
    Task<int> FetchAndStoreAsync(CancellationToken ct = default);
}