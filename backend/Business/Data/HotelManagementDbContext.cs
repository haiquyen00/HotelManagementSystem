using Microsoft.EntityFrameworkCore;
using Business.Model;

namespace Business.Data
{
    public class HotelManagementDbContext : DbContext
    {
        public HotelManagementDbContext(DbContextOptions<HotelManagementDbContext> options)
            : base(options)
        {

        }

        // User Management
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        // Hotel & Infrastructure
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Amenity> Amenities { get; set; }

        // Room Management
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomTypeAmenity> RoomTypeAmenities { get; set; }
        public DbSet<RoomTypeImage> RoomTypeImages { get; set; }

        // Pricing & Coupons
        public DbSet<PricingRule> PricingRules { get; set; }
        public DbSet<DailyPrice> DailyPrices { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<CouponUsage> CouponUsages { get; set; }

        // Booking Management
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingRoom> BookingRooms { get; set; }
        public DbSet<BookingHistory> BookingHistories { get; set; }

        // Payment
        public DbSet<Payment> Payments { get; set; }

        // Chat System
        public DbSet<ChatConversation> ChatConversations { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }

        // System Configuration
        public DbSet<FeatureFlag> FeatureFlags { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<AnalyticsEvent> AnalyticsEvents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite keys
            modelBuilder.Entity<RoomTypeAmenity>()
                .HasKey(ra => new { ra.RoomTypeId, ra.AmenityId });

            // Configure unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Name)
                .IsUnique();

            modelBuilder.Entity<Coupon>()
                .HasIndex(c => c.Code)
                .IsUnique();

            modelBuilder.Entity<Booking>()
                .HasIndex(b => b.BookingCode)
                .IsUnique();

            modelBuilder.Entity<Room>()
                .HasIndex(r => r.RoomNumber)
                .IsUnique();

            modelBuilder.Entity<SystemSetting>()
                .HasIndex(s => new { s.Category, s.Key })
                .IsUnique();

            modelBuilder.Entity<DailyPrice>()
                .HasIndex(dp => new { dp.RoomTypeId, dp.Date })
                .IsUnique();

            // Configure decimal precision
            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BasePrice)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.DiscountAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.FinalAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Booking>()
                .Property(b => b.TaxAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Customer>()
                .Property(c => c.TotalSpent)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<BookingRoom>()
                .Property(br => br.RatePerNight)
                .HasPrecision(12, 2);

            modelBuilder.Entity<BookingRoom>()
                .Property(br => br.TotalAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Coupon>()
                .Property(c => c.DiscountValue)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Coupon>()
                .Property(c => c.MaxDiscountAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<Coupon>()
                .Property(c => c.MinimumOrderAmount)
                .HasPrecision(12, 2);

            modelBuilder.Entity<PricingRule>()
                .Property(pr => pr.PriceModifierValue)
                .HasPrecision(12, 2);

            modelBuilder.Entity<DailyPrice>()
                .Property(dp => dp.BasePrice)
                .HasPrecision(12, 2);

            modelBuilder.Entity<DailyPrice>()
                .Property(dp => dp.FinalPrice)
                .HasPrecision(12, 2);

            // Configure relationships with proper cascade behavior
            modelBuilder.Entity<RoomTypeAmenity>()
                .HasOne(ra => ra.RoomType)
                .WithMany(rt => rt.RoomTypeAmenities)
                .HasForeignKey(ra => ra.RoomTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoomTypeAmenity>()
                .HasOne(ra => ra.Amenity)
                .WithMany(a => a.RoomTypeAmenities)
                .HasForeignKey(ra => ra.AmenityId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships to avoid cascade conflicts
            modelBuilder.Entity<CouponUsage>()
                .HasOne(cu => cu.User)
                .WithMany(u => u.CouponUsages)
                .HasForeignKey(cu => cu.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CouponUsage>()
                .HasOne(cu => cu.Coupon)
                .WithMany(c => c.CouponUsages)
                .HasForeignKey(cu => cu.CouponId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CouponUsage>()
                .HasOne(cu => cu.Booking)
                .WithMany(b => b.CouponUsages)
                .HasForeignKey(cu => cu.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookingHistory>()
                .HasOne(bh => bh.ChangedByUser)
                .WithMany()
                .HasForeignKey(bh => bh.ChangedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FeatureFlag>()
                .HasOne(ff => ff.Creator)
                .WithMany()
                .HasForeignKey(ff => ff.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Coupon>()
                .HasOne(c => c.Creator)
                .WithMany(u => u.CreatedCoupons)
                .HasForeignKey(c => c.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatConversation>()
                .HasOne(cc => cc.AssignedStaff)
                .WithMany(u => u.AssignedConversations)
                .HasForeignKey(cc => cc.StaffId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ChatConversation>()
                .HasOne(cc => cc.Customer)
                .WithMany(c => c.ChatConversations)
                .HasForeignKey(cc => cc.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AnalyticsEvent>()
                .HasOne(ae => ae.User)
                .WithMany()
                .HasForeignKey(ae => ae.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Customer>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Coupon)
                .WithMany(c => c.Bookings)
                .HasForeignKey(b => b.CouponId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BookingRoom>()
                .HasOne(br => br.Booking)
                .WithMany(b => b.BookingRooms)
                .HasForeignKey(br => br.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookingRoom>()
                .HasOne(br => br.RoomType)
                .WithMany(rt => rt.BookingRooms)
                .HasForeignKey(br => br.RoomTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure enum conversions
            modelBuilder.Entity<Room>()
                .Property(r => r.Status)
                .HasConversion<string>();

            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.Status)
                .HasConversion<string>();

            modelBuilder.Entity<RoomType>()
                .Property(rt => rt.BedType)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .Property(b => b.BookingStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .Property(b => b.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .Property(b => b.BookingSource)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Coupon>()
                .Property(c => c.DiscountType)
                .HasConversion<string>();

            modelBuilder.Entity<Coupon>()
                .Property(c => c.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Coupon>()
                .Property(c => c.CustomerType)
                .HasConversion<string>();

            modelBuilder.Entity<ChatConversation>()
                .Property(cc => cc.Status)
                .HasConversion<string>();

            modelBuilder.Entity<ChatMessage>()
                .Property(cm => cm.SenderType)
                .HasConversion<string>();

            modelBuilder.Entity<ChatMessage>()
                .Property(cm => cm.MessageType)
                .HasConversion<string>();

            modelBuilder.Entity<Customer>()
                .Property(c => c.LoyaltyTier)
                .HasConversion<string>();

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Roles
            var adminRoleId = Guid.NewGuid();
            var managerRoleId = Guid.NewGuid();
            var staffRoleId = Guid.NewGuid();
            var customerRoleId = Guid.NewGuid();

            modelBuilder.Entity<Role>().HasData(
                new Role
                {
                    Id = adminRoleId,
                    Name = "admin",
                    DisplayName = "Quản trị viên",
                    Permissions = "{\"all\": [\"read\", \"write\", \"delete\"]}",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = managerRoleId,
                    Name = "manager",
                    DisplayName = "Quản lý",
                    Permissions = "{\"bookings\": [\"read\", \"write\"], \"rooms\": [\"read\", \"write\"], \"customers\": [\"read\"]}",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = staffRoleId,
                    Name = "staff",
                    DisplayName = "Nhân viên",
                    Permissions = "{\"bookings\": [\"read\", \"write\"], \"rooms\": [\"read\"]}",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Role
                {
                    Id = customerRoleId,
                    Name = "customer",
                    DisplayName = "Khách hàng",
                    Permissions = "{\"bookings\": [\"read\"]}",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Hotel
            var hotelId = Guid.NewGuid();
            modelBuilder.Entity<Hotel>().HasData(
                new Hotel
                {
                    Id = hotelId,
                    Name = "Grand Ocean Hotel",
                    Description = "Khách sạn 5 sao view biển tuyệt đẹp tại trung tâm thành phố",
                    Address = "123 Trần Phú, Nha Trang",
                    City = "Nha Trang",
                    Country = "Vietnam",
                    Phone = "+84 258 123 4567",
                    Email = "info@grandoceanhotel.com",
                    Website = "https://grandoceanhotel.com",
                    StarRating = 5,
                    CheckInTime = new TimeSpan(14, 0, 0),
                    CheckOutTime = new TimeSpan(12, 0, 0),
                    Timezone = "Asia/Ho_Chi_Minh",
                    Currency = "VND",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Amenities
            var amenityIds = new List<Guid>();
            var amenities = new[]
            {
                new { Name = "WiFi miễn phí", NameEn = "Free WiFi", Category = "technology", Icon = "wifi" },
                new { Name = "Điều hòa", NameEn = "Air Conditioning", Category = "comfort", Icon = "snowflake" },
                new { Name = "TV màn hình phẳng", NameEn = "Flat-screen TV", Category = "entertainment", Icon = "tv" },
                new { Name = "Phòng tắm riêng", NameEn = "Private Bathroom", Category = "bathroom", Icon = "bath" },
                new { Name = "Tủ lạnh mini", NameEn = "Mini Fridge", Category = "comfort", Icon = "fridge" },
                new { Name = "Ban công", NameEn = "Balcony", Category = "comfort", Icon = "balcony" },
                new { Name = "View biển", NameEn = "Sea View", Category = "comfort", Icon = "eye" },
                new { Name = "Két an toàn", NameEn = "Safe Box", Category = "security", Icon = "lock" }
            };

            foreach (var amenity in amenities)
            {
                var id = Guid.NewGuid();
                amenityIds.Add(id);
                modelBuilder.Entity<Amenity>().HasData(
                    new Amenity
                    {
                        Id = id,
                        Name = amenity.Name,
                        NameEn = amenity.NameEn,
                        Category = amenity.Category,
                        Icon = amenity.Icon,
                        IsActive = true,
                        SortOrder = amenityIds.Count,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                );
            }
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;
                entity.UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
