using BCrypt.Net;
using Logic.Shared.Interfaces;

namespace Logic.Shared
{
    public class PasswordHasher : IPasswordHasher
    {
        private const int WorkFactor = 12;

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.EnhancedHashPassword(password, WorkFactor);
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            try
            {
                return BCrypt.Net.BCrypt.EnhancedVerify(password, passwordHash);
            }
            catch (SaltParseException)
            {
                return false;
            }
        }

        public bool NeedsRehash(string passwordHash)
        {
            return BCrypt.Net.BCrypt.PasswordNeedsRehash(passwordHash, WorkFactor);
        }

        public string GetRandomOneTimePassword(int length = 12)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";
            var random = new Random();
            
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
