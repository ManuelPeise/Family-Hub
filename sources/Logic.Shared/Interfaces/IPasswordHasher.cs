namespace Logic.Shared.Interfaces
{
    public interface IPasswordHasher
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
        bool NeedsRehash(string passwordHash);
        string GetRandomOneTimePassword(int length = 12);
    }
}
