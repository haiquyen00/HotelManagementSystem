using Business.Model;
using Service.Interfaces;
using Repositories.Interfaces;

namespace Service.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IPasswordService _passwordService;

        public UserService(
            IUserRepository userRepository, 
            IRoleRepository roleRepository,
            IPasswordService passwordService)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _passwordService = passwordService;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            return await _userRepository.GetByPhoneAsync(phone);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }

        public async Task<bool> PhoneExistsAsync(string phone)
        {
            return await _userRepository.PhoneExistsAsync(phone);
        }

        public async Task<User> CreateAsync(User user)
        {
            // Hash password
            user.PasswordHash = _passwordService.HashPassword(user.PasswordHash);

            // Set default role if not specified
            if (user.RoleId == Guid.Empty)
            {
                var defaultRole = await _roleRepository.GetDefaultRoleAsync();
                if (defaultRole != null)
                {
                    user.RoleId = defaultRole.Id;
                }
            }

            return await _userRepository.CreateAsync(user);
        }

        public async Task<User> UpdateAsync(User user)
        {
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _userRepository.DeleteAsync(id);
        }
    }
}
