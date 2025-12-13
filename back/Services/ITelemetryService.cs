namespace back.Services;

public interface ITelemetryService
{
    Task GenerateAndStoreAsync(CancellationToken ct = default);
}