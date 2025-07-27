using Business.Data;
using Business.Model;
using Business.Model.Enums;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class RoomTypeRepository : BaseRepository<RoomType>, IRoomTypeRepository
    {
        public RoomTypeRepository(HotelManagementDbContext context) : base(context)
        {
        }

        #region Basic Queries với Relationships

        public async Task<RoomType?> GetWithAmenitiesAsync(Guid id)
        {
            return await _context.RoomTypes
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .FirstOrDefaultAsync(rt => rt.Id == id);
        }

        public async Task<RoomType?> GetWithImagesAsync(Guid id)
        {
            return await _context.RoomTypes
                .Include(rt => rt.RoomTypeImages.OrderBy(img => img.SortOrder))
                .FirstOrDefaultAsync(rt => rt.Id == id);
        }

        public async Task<RoomType?> GetWithFullDetailsAsync(Guid id)
        {
            return await _context.RoomTypes
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .Include(rt => rt.RoomTypeImages.OrderBy(img => img.SortOrder))
                .Include(rt => rt.Rooms)
                .FirstOrDefaultAsync(rt => rt.Id == id);
        }

        public async Task<IEnumerable<RoomType>> GetAllWithFullDetailsAsync()
        {
            return await _context.RoomTypes
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .Include(rt => rt.RoomTypeImages.OrderBy(img => img.SortOrder))
                .Include(rt => rt.Rooms)
                .OrderBy(rt => rt.SortOrder)
                .ThenBy(rt => rt.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomType>> GetByHotelIdAsync(Guid hotelId)
        {
            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId)
                .OrderBy(rt => rt.SortOrder)
                .ThenBy(rt => rt.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomType>> GetActiveByHotelIdAsync(Guid hotelId)
        {
            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId && rt.Status == RoomTypeStatus.Active)
                .OrderBy(rt => rt.SortOrder)
                .ThenBy(rt => rt.Name)
                .ToListAsync();
        }

        #endregion

        #region Validation Methods

        public async Task<bool> NameExistsAsync(string name, Guid hotelId, Guid? excludeId = null)
        {
            var query = _context.RoomTypes.Where(rt => 
                rt.HotelId == hotelId && 
                rt.Name.ToLower() == name.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(rt => rt.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }

        public async Task<bool> NameEnExistsAsync(string nameEn, Guid hotelId, Guid? excludeId = null)
        {
            if (string.IsNullOrWhiteSpace(nameEn))
                return false;

            var query = _context.RoomTypes.Where(rt => 
                rt.HotelId == hotelId && 
                rt.NameEn != null && 
                rt.NameEn.ToLower() == nameEn.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(rt => rt.Id != excludeId.Value);
            }
            
            return await query.AnyAsync();
        }

        #endregion

        #region Search và Filtering

        public async Task<IEnumerable<RoomType>> SearchAsync(string searchTerm, Guid? hotelId = null)
        {
            var query = _context.RoomTypes.AsQueryable();

            if (hotelId.HasValue)
            {
                query = query.Where(rt => rt.HotelId == hotelId.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(rt => 
                    rt.Name.ToLower().Contains(lowerSearchTerm) ||
                    (rt.NameEn != null && rt.NameEn.ToLower().Contains(lowerSearchTerm)) ||
                    rt.Description.ToLower().Contains(lowerSearchTerm));
            }

            return await query
                .OrderBy(rt => rt.SortOrder)
                .ThenBy(rt => rt.Name)
                .ToListAsync();
        }

        public async Task<(IEnumerable<RoomType> items, int totalCount)> GetPagedAsync(
            int page,
            int pageSize,
            Guid? hotelId = null,
            string? searchTerm = null,
            string? status = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            int? minOccupancy = null,
            int? maxOccupancy = null,
            string? bedType = null,
            bool? hasBalcony = null,
            bool? hasSeaView = null,
            List<Guid>? amenityIds = null,
            string orderBy = "name",
            bool descending = false)
        {
            var query = _context.RoomTypes
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .Include(rt => rt.RoomTypeImages.Where(img => img.IsPrimary))
                .AsQueryable();

            // Apply filters
            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerSearchTerm = searchTerm.ToLower();
                query = query.Where(rt => 
                    rt.Name.ToLower().Contains(lowerSearchTerm) ||
                    (rt.NameEn != null && rt.NameEn.ToLower().Contains(lowerSearchTerm)) ||
                    rt.Description.ToLower().Contains(lowerSearchTerm));
            }

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(rt => rt.Status.ToString().ToLower() == status.ToLower());

            if (minPrice.HasValue)
                query = query.Where(rt => rt.BasePrice >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(rt => rt.BasePrice <= maxPrice.Value);

            if (minOccupancy.HasValue)
                query = query.Where(rt => rt.MaxOccupancy >= minOccupancy.Value);

            if (maxOccupancy.HasValue)
                query = query.Where(rt => rt.MaxOccupancy <= maxOccupancy.Value);

            if (!string.IsNullOrWhiteSpace(bedType))
                query = query.Where(rt => rt.BedType.ToString().ToLower() == bedType.ToLower());

            if (hasBalcony.HasValue)
                query = query.Where(rt => rt.HasBalcony == hasBalcony.Value);

            if (hasSeaView.HasValue)
                query = query.Where(rt => rt.HasSeaView == hasSeaView.Value);

            // Filter by amenities
            if (amenityIds != null && amenityIds.Any())
            {
                query = query.Where(rt => rt.RoomTypeAmenities
                    .Any(rta => amenityIds.Contains(rta.AmenityId)));
            }

            var totalCount = await query.CountAsync();

            // Apply ordering
            query = orderBy.ToLower() switch
            {
                "name" => descending ? query.OrderByDescending(rt => rt.Name) : query.OrderBy(rt => rt.Name),
                "price" => descending ? query.OrderByDescending(rt => rt.BasePrice) : query.OrderBy(rt => rt.BasePrice),
                "occupancy" => descending ? query.OrderByDescending(rt => rt.MaxOccupancy) : query.OrderBy(rt => rt.MaxOccupancy),
                "area" => descending ? query.OrderByDescending(rt => rt.AreaSqm) : query.OrderBy(rt => rt.AreaSqm),
                "created" => descending ? query.OrderByDescending(rt => rt.CreatedAt) : query.OrderBy(rt => rt.CreatedAt),
                "updated" => descending ? query.OrderByDescending(rt => rt.UpdatedAt) : query.OrderBy(rt => rt.UpdatedAt),
                _ => query.OrderBy(rt => rt.SortOrder).ThenBy(rt => rt.Name)
            };

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        #endregion

        #region Availability Methods

        public async Task<IEnumerable<RoomType>> GetAvailableForDatesAsync(DateTime checkIn, DateTime checkOut, Guid? hotelId = null)
        {
            var query = _context.RoomTypes
                .Include(rt => rt.Rooms)
                .Where(rt => rt.Status == RoomTypeStatus.Active);

            if (hotelId.HasValue)
            {
                query = query.Where(rt => rt.HotelId == hotelId.Value);
            }

            // TODO: Add booking availability check when Booking entities are ready
            // For now, return all active room types
            return await query
                .OrderBy(rt => rt.SortOrder)
                .ThenBy(rt => rt.Name)
                .ToListAsync();
        }

        public async Task<Dictionary<Guid, int>> GetAvailableRoomCountsAsync(List<Guid> roomTypeIds, DateTime checkIn, DateTime checkOut)
        {
            var result = new Dictionary<Guid, int>();

            foreach (var roomTypeId in roomTypeIds)
            {
                var totalRooms = await _context.Rooms
                    .Where(r => r.RoomTypeId == roomTypeId && r.Status == RoomStatus.Available)
                    .CountAsync();

                // TODO: Subtract booked rooms when Booking entities are ready
                result[roomTypeId] = totalRooms;
            }

            return result;
        }

        #endregion

        #region Statistics và Analytics

        public async Task<Dictionary<string, int>> GetStatusCountsAsync(Guid? hotelId = null)
        {
            var query = _context.RoomTypes.AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            return await query
                .GroupBy(rt => rt.Status)
                .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);
        }

        public async Task<Dictionary<string, int>> GetBedTypeCountsAsync(Guid? hotelId = null)
        {
            var query = _context.RoomTypes.AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            return await query
                .GroupBy(rt => rt.BedType)
                .Select(g => new { BedType = g.Key.ToString(), Count = g.Count() })
                .ToDictionaryAsync(x => x.BedType, x => x.Count);
        }

        public async Task<decimal> GetAveragePriceAsync(Guid? hotelId = null)
        {
            var query = _context.RoomTypes.AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            return await query.AverageAsync(rt => rt.BasePrice);
        }

        public async Task<(decimal min, decimal max)> GetPriceRangeAsync(Guid? hotelId = null)
        {
            var query = _context.RoomTypes.AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            var min = await query.MinAsync(rt => rt.BasePrice);
            var max = await query.MaxAsync(rt => rt.BasePrice);

            return (min, max);
        }

        public async Task<IEnumerable<RoomType>> GetPopularTypesAsync(Guid? hotelId = null, int count = 10)
        {
            var query = _context.RoomTypes
                .Include(rt => rt.RoomTypeImages.Where(img => img.IsPrimary))
                .AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(rt => rt.HotelId == hotelId.Value);

            // TODO: Order by booking frequency when Booking entities are ready
            // For now, order by created date (newest first)
            return await query
                .OrderByDescending(rt => rt.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        #endregion

        #region Amenity Relationship Methods

        public async Task<IEnumerable<Amenity>> GetAmenitiesByRoomTypeIdAsync(Guid roomTypeId)
        {
            return await _context.RoomTypeAmenities
                .Where(rta => rta.RoomTypeId == roomTypeId)
                .Include(rta => rta.Amenity)
                .Select(rta => rta.Amenity)
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task AddAmenityAsync(Guid roomTypeId, Guid amenityId)
        {
            var exists = await _context.RoomTypeAmenities
                .AnyAsync(rta => rta.RoomTypeId == roomTypeId && rta.AmenityId == amenityId);

            if (!exists)
            {
                var roomTypeAmenity = new RoomTypeAmenity
                {
                    RoomTypeId = roomTypeId,
                    AmenityId = amenityId
                };

                _context.RoomTypeAmenities.Add(roomTypeAmenity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> RemoveAmenityAsync(Guid roomTypeId, Guid amenityId)
        {
            var roomTypeAmenity = await _context.RoomTypeAmenities
                .FirstOrDefaultAsync(rta => rta.RoomTypeId == roomTypeId && rta.AmenityId == amenityId);

            if (roomTypeAmenity != null)
            {
                _context.RoomTypeAmenities.Remove(roomTypeAmenity);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task ClearAmenitiesAsync(Guid roomTypeId)
        {
            var existingAmenities = await _context.RoomTypeAmenities
                .Where(rta => rta.RoomTypeId == roomTypeId)
                .ToListAsync();

            if (existingAmenities.Any())
            {
                _context.RoomTypeAmenities.RemoveRange(existingAmenities);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateAmenitiesAsync(Guid roomTypeId, List<Guid> amenityIds)
        {
            // Remove existing amenities
            var existingAmenities = await _context.RoomTypeAmenities
                .Where(rta => rta.RoomTypeId == roomTypeId)
                .ToListAsync();

            _context.RoomTypeAmenities.RemoveRange(existingAmenities);

            // Add new amenities
            var newAmenities = amenityIds.Select(amenityId => new RoomTypeAmenity
            {
                RoomTypeId = roomTypeId,
                AmenityId = amenityId
            });

            _context.RoomTypeAmenities.AddRange(newAmenities);
            await _context.SaveChangesAsync();
        }

        #endregion

        #region Image Relationship Methods

        public async Task<IEnumerable<RoomTypeImage>> GetImagesByRoomTypeIdAsync(Guid roomTypeId)
        {
            return await _context.RoomTypeImages
                .Where(img => img.RoomTypeId == roomTypeId)
                .OrderBy(img => img.SortOrder)
                .ThenBy(img => img.CreatedAt)
                .ToListAsync();
        }

        public async Task<RoomTypeImage?> GetPrimaryImageAsync(Guid roomTypeId)
        {
            return await _context.RoomTypeImages
                .Where(img => img.RoomTypeId == roomTypeId && img.IsPrimary)
                .FirstOrDefaultAsync();
        }

        public async Task AddImageAsync(RoomTypeImage image)
        {
            // If this is set as primary, remove primary flag from other images
            if (image.IsPrimary)
            {
                var existingPrimary = await _context.RoomTypeImages
                    .Where(img => img.RoomTypeId == image.RoomTypeId && img.IsPrimary)
                    .ToListAsync();

                foreach (var img in existingPrimary)
                {
                    img.IsPrimary = false;
                }
            }

            _context.RoomTypeImages.Add(image);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveImageAsync(Guid imageId)
        {
            var image = await _context.RoomTypeImages.FindAsync(imageId);
            if (image != null)
            {
                _context.RoomTypeImages.Remove(image);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateImageOrderAsync(List<(Guid imageId, int sortOrder)> imageOrders)
        {
            foreach (var (imageId, sortOrder) in imageOrders)
            {
                var image = await _context.RoomTypeImages.FindAsync(imageId);
                if (image != null)
                {
                    image.SortOrder = sortOrder;
                }
            }

            await _context.SaveChangesAsync();
        }

        #endregion

        #region Bulk Operations

        public async Task<int> BulkUpdatePricingAsync(List<Guid> roomTypeIds, decimal adjustment, string adjustmentType)
        {
            var roomTypes = await _context.RoomTypes
                .Where(rt => roomTypeIds.Contains(rt.Id))
                .ToListAsync();

            foreach (var roomType in roomTypes)
            {
                if (adjustmentType.ToLower() == "percentage")
                {
                    roomType.BasePrice = roomType.BasePrice + (roomType.BasePrice * adjustment / 100);
                }
                else // fixed amount
                {
                    roomType.BasePrice = roomType.BasePrice + adjustment;
                }

                // Ensure price doesn't go below 0
                roomType.BasePrice = Math.Max(0, roomType.BasePrice);
                roomType.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<int> BulkUpdateStatusAsync(List<Guid> roomTypeIds, string status)
        {
            if (!Enum.TryParse<RoomTypeStatus>(status, out var roomTypeStatus))
                return 0;

            var roomTypes = await _context.RoomTypes
                .Where(rt => roomTypeIds.Contains(rt.Id))
                .ToListAsync();

            foreach (var roomType in roomTypes)
            {
                roomType.Status = roomTypeStatus;
                roomType.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<bool> CanDeleteAsync(Guid roomTypeId)
        {
            // Check if room type has any rooms
            var hasRooms = await _context.Rooms
                .AnyAsync(r => r.RoomTypeId == roomTypeId);

            if (hasRooms)
                return false;

            // TODO: Check if room type has any bookings when Booking entities are ready

            return true;
        }

        public async Task<int> BulkDeleteAsync(List<Guid> roomTypeIds, bool force = false)
        {
            var roomTypesToDelete = new List<RoomType>();

            foreach (var roomTypeId in roomTypeIds)
            {
                var canDelete = force || await CanDeleteAsync(roomTypeId);
                if (canDelete)
                {
                    var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
                    if (roomType != null)
                    {
                        roomTypesToDelete.Add(roomType);
                    }
                }
            }

            if (roomTypesToDelete.Any())
            {
                _context.RoomTypes.RemoveRange(roomTypesToDelete);
                return await _context.SaveChangesAsync();
            }

            return 0;
        }

        #endregion

        #region Duplication

        public async Task<RoomType> DuplicateRoomTypeAsync(Guid sourceId, string newName, decimal? newPrice = null, bool copyImages = true, bool copyAmenities = true)
        {
            var source = await GetWithFullDetailsAsync(sourceId);
            if (source == null)
                throw new ArgumentException("Source room type not found");

            var duplicate = new RoomType
            {
                Id = Guid.NewGuid(),
                HotelId = source.HotelId,
                Name = newName,
                NameEn = source.NameEn,
                Description = source.Description,
                BasePrice = newPrice ?? source.BasePrice,
                MaxOccupancy = source.MaxOccupancy,
                AreaSqm = source.AreaSqm,
                BedType = source.BedType,
                BedCount = source.BedCount,
                BathroomCount = source.BathroomCount,
                HasBalcony = source.HasBalcony,
                HasSeaView = source.HasSeaView,
                Status = RoomTypeStatus.Active,
                SortOrder = await GetMaxSortOrderAsync(source.HotelId) + 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.RoomTypes.Add(duplicate);
            await _context.SaveChangesAsync();

            // Copy amenities
            if (copyAmenities && source.RoomTypeAmenities.Any())
            {
                var amenityIds = source.RoomTypeAmenities.Select(rta => rta.AmenityId).ToList();
                await UpdateAmenitiesAsync(duplicate.Id, amenityIds);
            }

            // Copy images
            if (copyImages && source.RoomTypeImages.Any())
            {
                foreach (var sourceImage in source.RoomTypeImages)
                {
                    var duplicateImage = new RoomTypeImage
                    {
                        Id = Guid.NewGuid(),
                        RoomTypeId = duplicate.Id,
                        ImageUrl = sourceImage.ImageUrl,
                        Caption = sourceImage.Caption,
                        IsPrimary = sourceImage.IsPrimary,
                        SortOrder = sourceImage.SortOrder,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    await AddImageAsync(duplicateImage);
                }
            }

            return duplicate;
        }

        #endregion

        #region Pricing Calculations

        public async Task<decimal> CalculateCurrentPriceAsync(Guid roomTypeId, DateTime date)
        {
            var roomType = await GetByIdAsync(roomTypeId);
            if (roomType == null)
                return 0;

            // TODO: Apply pricing rules when PricingRule entities are ready
            return roomType.BasePrice;
        }

        public async Task<Dictionary<Guid, decimal>> CalculateCurrentPricesAsync(List<Guid> roomTypeIds, DateTime date)
        {
            var result = new Dictionary<Guid, decimal>();

            foreach (var roomTypeId in roomTypeIds)
            {
                result[roomTypeId] = await CalculateCurrentPriceAsync(roomTypeId, date);
            }

            return result;
        }

        #endregion

        #region Sort Order Management

        public async Task<int> GetMaxSortOrderAsync(Guid hotelId)
        {
            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId)
                .MaxAsync(rt => (int?)rt.SortOrder) ?? 0;
        }

        public async Task UpdateSortOrdersAsync(List<(Guid roomTypeId, int sortOrder)> orders)
        {
            foreach (var (roomTypeId, sortOrder) in orders)
            {
                var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
                if (roomType != null)
                {
                    roomType.SortOrder = sortOrder;
                    roomType.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }

        #endregion

        #region Revenue Analytics (Placeholders)

        public async Task<Dictionary<Guid, decimal>> GetRevenueByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate)
        {
            // TODO: Implement when Booking and Payment entities are ready
            var roomTypeIds = await _context.RoomTypes
                .Where(rt => !hotelId.HasValue || rt.HotelId == hotelId.Value)
                .Select(rt => rt.Id)
                .ToListAsync();

            return roomTypeIds.ToDictionary(id => id, _ => 0m);
        }

        public async Task<Dictionary<Guid, int>> GetBookingCountsByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate)
        {
            // TODO: Implement when Booking entities are ready
            var roomTypeIds = await _context.RoomTypes
                .Where(rt => !hotelId.HasValue || rt.HotelId == hotelId.Value)
                .Select(rt => rt.Id)
                .ToListAsync();

            return roomTypeIds.ToDictionary(id => id, _ => 0);
        }

        public async Task<Dictionary<Guid, decimal>> GetOccupancyRatesByRoomTypeAsync(Guid? hotelId, DateTime fromDate, DateTime toDate)
        {
            // TODO: Implement when Booking entities are ready
            var roomTypeIds = await _context.RoomTypes
                .Where(rt => !hotelId.HasValue || rt.HotelId == hotelId.Value)
                .Select(rt => rt.Id)
                .ToListAsync();

            return roomTypeIds.ToDictionary(id => id, _ => 0m);
        }

        #endregion
    }
}
