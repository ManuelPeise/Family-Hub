using Data.Accessor.Interfaces;
using Data.Database.Context.Entities.Family;
using Data.Database.Context.Entities.User;
using Logic.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Enums.Auth;
using Shared.Enums.Notifications;
using Shared.Models.Family;

namespace Logic.Administration.Family
{
    public class FamilyMemberAdministrationModule : IFamilyMemberAdministrationModule
    {
        private const string FamilyMemberRequestNotificationResourceKey = "familyMemberRequestNotification";
        private readonly ILogger<FamilyMemberAdministrationModule> _logger;
        private readonly IApplicationUnitOfWork _applicationUnitOfWork;

        public FamilyMemberAdministrationModule(ILogger<FamilyMemberAdministrationModule> logger, IApplicationUnitOfWork applicationUnitOfWork)
        {
            _logger = logger;
            _applicationUnitOfWork = applicationUnitOfWork;
        }

        public async Task InsertFamilyRequest(FamilyMemberRequest request)
        {
            try
            {
                ArgumentException.ThrowIfNullOrEmpty(request.FamilyName, nameof(request.FamilyName));
                ArgumentException.ThrowIfNullOrEmpty(request.ContactMailAddress, nameof(request.ContactMailAddress));
                ArgumentException.ThrowIfNullOrEmpty(request.MainMemberFirstName, nameof(request.MainMemberFirstName));
                ArgumentException.ThrowIfNullOrEmpty(request.MainMemberLastName, nameof(request.MainMemberLastName));
                ArgumentException.ThrowIfNullOrEmpty(request.MainMemberUserName, nameof(request.MainMemberUserName));

                var isExistingRequest = _applicationUnitOfWork.AdministrationUnitOfWork.FamilyAccessRequestRepository.Query()
                    .Any(x => x.FamilyName == request.FamilyName && x.ContactMailAddress == request.ContactMailAddress);

                var isExistingUserMail = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Any(x => x.Email == request.ContactMailAddress);

                if (isExistingRequest || isExistingUserMail)
                {
                    throw new InvalidOperationException("A family request with the same family name and contact mail address or a user with the same email already exists.");
                }

                var familyRequest = new FamilyAccessRequestEntity
                {
                    FamilyName = request.FamilyName,
                    ContactMailAddress = request.ContactMailAddress,
                    MainMemberFirstName = request.MainMemberFirstName,
                    MainMemberLastName = request.MainMemberLastName,
                    MainMemberUserName = request.MainMemberUserName,
                    MainMemberDateOfBirth = request.MainMemberDateOfBirth
                };

                await _applicationUnitOfWork.AdministrationUnitOfWork.FamilyAccessRequestRepository.AddAsync(familyRequest);

                var adminUserIds = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                    .Include(u => u.Roles)
                    .Where(u => u.Roles.Any(r => r.RoleType == UserRoleEnum.Admin))
                    .Select(u => u.Id);

                if (adminUserIds.Any())
                {
                    var adminUsers = _applicationUnitOfWork.IdentityUnitOfWork.UserRepository.Query()
                        .Where(u => adminUserIds.Contains(u.Id))
                        .ToList();

                    var notificationEntities = adminUsers.Select(adminUser => new UserNotificationEntity
                    {
                        MessageResourceKey = FamilyMemberRequestNotificationResourceKey,
                        NotificationType = NotificationTypeEnum.FamilyMemberRequest,
                        UserId = adminUser.Id,
                        IsActive = true,
                    });

                    await _applicationUnitOfWork.IdentityUnitOfWork.NotificationRepository.AddRangeAsync(notificationEntities);
                }

                await _applicationUnitOfWork.SaveChanges();
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error inserting family request");
                throw;
            }
        }
    }
}
