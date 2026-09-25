using BCrypt.Net;
using Logic.Shared.Interfaces;

namespace Logic.Shared
{
    public class BCryptPasswordHasher : IPasswordHasher
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
    }
}
