namespace Shared.Models.Options
{
    public class EmailOptions
    {
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public string Security { get; set; } = null!;
        public string FromAddress { get; set; } = null!;
        public string FromName { get; set; } = null!;
        public string ApplicationUrl { get; set; } = null!;
    }
}