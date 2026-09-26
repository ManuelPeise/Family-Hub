namespace Shared.Enums.Security
{
    /// <summary>
    /// What a user may do within a scope. Flags, so an endpoint can require several permissions at once.
    /// </summary>
    [Flags]
    public enum ScopePermissionEnum
    {
        None = 0,
        View = 1,
        Create = 2,
        Edit = 4,
        Delete = 8,
    }
}
