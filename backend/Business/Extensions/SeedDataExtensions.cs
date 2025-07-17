using Business.Data;
using Business.Model;

namespace Business.Extensions
{
    public static class SeedDataExtensions
    {
        public static async Task SeedAmenitiesAsync(this HotelManagementDbContext context)
        {
            if (!context.Amenities.Any())
            {
                var amenities = new List<Amenity>
                {
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "WiFi miễn phí",
                        NameEn = "Free WiFi",
                        Description = "Kết nối internet tốc độ cao miễn phí trong toàn bộ khách sạn",
                        Icon = "wifi",
                        Category = "Technology",
                        IsActive = true,
                        SortOrder = 1,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Hồ bơi",
                        NameEn = "Swimming Pool",
                        Description = "Hồ bơi ngoài trời với view tuyệt đẹp, mở cửa 24/7",
                        Icon = "pool",
                        Category = "Recreation",
                        IsActive = true,
                        SortOrder = 2,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Phòng gym",
                        NameEn = "Fitness Center",
                        Description = "Phòng tập thể dục hiện đại với đầy đủ trang thiết bị",
                        Icon = "dumbbell",
                        Category = "Recreation",
                        IsActive = true,
                        SortOrder = 3,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Spa",
                        NameEn = "Spa Services",
                        Description = "Dịch vụ spa cao cấp với các liệu pháp thư giãn chuyên nghiệp",
                        Icon = "spa",
                        Category = "Wellness",
                        IsActive = true,
                        SortOrder = 4,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Nhà hàng",
                        NameEn = "Restaurant",
                        Description = "Nhà hàng phục vụ các món ăn địa phương và quốc tế",
                        Icon = "restaurant",
                        Category = "Dining",
                        IsActive = true,
                        SortOrder = 5,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Điều hòa",
                        NameEn = "Air Conditioning",
                        Description = "Hệ thống điều hòa không khí hiện đại trong tất cả các phòng",
                        Icon = "snowflake",
                        Category = "Comfort",
                        IsActive = true,
                        SortOrder = 6,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Amenity
                    {
                        Id = Guid.NewGuid(),
                        Name = "Bãi đỗ xe",
                        NameEn = "Parking",
                        Description = "Bãi đỗ xe miễn phí cho khách lưu trú",
                        Icon = "car",
                        Category = "Service",
                        IsActive = true,
                        SortOrder = 7,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                context.Amenities.AddRange(amenities);
                await context.SaveChangesAsync();
            }
            else
            {
                // Cập nhật description cho các amenities đã có nhưng thiếu description
                var amenitiesWithoutDescription = context.Amenities
                    .Where(a => string.IsNullOrEmpty(a.Description))
                    .ToList();

                foreach (var amenity in amenitiesWithoutDescription)
                {
                    amenity.Description = $"Mô tả cho tiện ích {amenity.Name}";
                    amenity.UpdatedAt = DateTime.UtcNow;
                }

                if (amenitiesWithoutDescription.Any())
                {
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
