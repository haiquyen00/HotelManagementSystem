using Business.Model;
using Business.Model.Enums;
using DTO.Base;
using DTO.Room;
using DTO.Hotel;
using DTO.Enums;
using Microsoft.Extensions.Logging;
using Repositories.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly IRoomTypeRepository _roomTypeRepository;
        private readonly IAmenityRepository _amenityRepository;
        private readonly Repositories.Hotel.IHotelRepository _hotelRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly ILogger<RoomTypeService> _logger;

        public RoomTypeService(
            IRoomTypeRepository roomTypeRepository,
            IAmenityRepository amenityRepository,
            Repositories.Hotel.IHotelRepository hotelRepository,
            IRoomRepository roomRepository,
            ILogger<RoomTypeService> logger)
        {
            _roomTypeRepository = roomTypeRepository;
            _amenityRepository = amenityRepository;
            _hotelRepository = hotelRepository;
            _roomRepository = roomRepository;
            _logger = logger;
        }

        public async Task<ServiceResult<RoomTypeDto>> GetByIdAsync(Guid id)
        {
            try
            {
                var roomType = await _roomTypeRepository.GetWithFullDetailsAsync(id);
                if (roomType == null)
                {
                    return ServiceResult<RoomTypeDto>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "Id", Value = id }
                    });
                }

                var roomTypeDto = MapToDto(roomType);
                return ServiceResult<RoomTypeDto>.SuccessResult(roomTypeDto, "Lấy thông tin loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room type by id {Id}", id);
                return ServiceResult<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin loại phòng");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetAllAsync()
        {
            try
            {
                var roomTypes = await _roomTypeRepository.GetAllWithFullDetailsAsync();
                var roomTypeDtos = roomTypes.Select(MapToDto);
                return ServiceResult<IEnumerable<RoomTypeDto>>.SuccessResult(roomTypeDtos, "Lấy danh sách loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all room types");
                return ServiceResult<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách loại phòng");
            }
        }

        public async Task<ServiceResult<PagedResult<RoomTypeDto>>> GetPagedAsync(RoomTypeFilterRequest request)
        {
            try
            {
                var (roomTypes, totalCount) = await _roomTypeRepository.GetPagedAsync(
                    request.Page, 
                    request.PageSize, 
                    request.HotelId, 
                    request.Search, 
                    request.Status, 
                    request.MinPrice, 
                    request.MaxPrice,
                    request.MinOccupancy,
                    request.MaxOccupancy,
                    request.BedType,
                    request.HasBalcony,
                    request.HasSeaView,
                    request.AmenityIds,
                    request.SortBy ?? "name",
                    request.SortDirection == "desc");

                var roomTypeDtos = roomTypes.Select(MapToDto).ToList();
                
                var pagedResult = new PagedResult<RoomTypeDto>
                {
                    Data = roomTypeDtos,
                    CurrentPage = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize),
                    TotalItems = totalCount
                };

                return ServiceResult<PagedResult<RoomTypeDto>>.SuccessResult(pagedResult, "Lấy danh sách loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting paged room types");
                return ServiceResult<PagedResult<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách loại phòng");
            }
        }

        public async Task<ServiceResult<RoomTypeDto>> CreateAsync(CreateRoomTypeRequest request)
        {
            try
            {
                // Single hotel system - sử dụng default hotel ID
                var defaultHotelId = await GetDefaultHotelIdAsync();
                if (defaultHotelId == Guid.Empty)
                {
                    return ServiceResult<RoomTypeDto>.ErrorResult("Chưa có khách sạn được thiết lập trong hệ thống", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_006", Message = "Cần tạo khách sạn trước khi thêm loại phòng", Field = "HotelId", Value = null }
                    });
                }

                // Check if room type name exists in this hotel (default hotel)
                var nameExists = await _roomTypeRepository.NameExistsAsync(request.Name, defaultHotelId);
                if (nameExists)
                {
                    return ServiceResult<RoomTypeDto>.ErrorResult("Tên loại phòng đã tồn tại", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_003", Message = "Tên loại phòng đã tồn tại trong khách sạn này", Field = "Name", Value = request.Name }
                    });
                }

                // Validate amenities exist if provided
                if (request.AmenityIds != null && request.AmenityIds.Any())
                {
                    foreach (var amenityId in request.AmenityIds)
                    {
                        var amenity = await _amenityRepository.GetByIdAsync(amenityId);
                        if (amenity == null)
                        {
                            return ServiceResult<RoomTypeDto>.ErrorResult("Tiện ích không tồn tại", new List<ErrorDetail>
                            {
                                new ErrorDetail { Code = "RMT_007", Message = $"Tiện ích với ID {amenityId} không tồn tại", Field = "AmenityIds", Value = amenityId }
                            });
                        }
                    }
                }

                // Create new room type với default hotel ID
                var roomType = new RoomType
                {
                    // Id sẽ được tự động tạo bởi BaseEntity
                    Name = request.Name,
                    NameEn = request.NameEn,
                    Description = request.Description,
                    BasePrice = request.BasePrice,
                    MaxOccupancy = request.MaxOccupancy,
                    AreaSqm = request.AreaSqm,
                    BedType = Enum.Parse<BedType>(request.BedType, true),
                    BedCount = request.BedCount,
                    BathroomCount = request.BathroomCount,
                    HasBalcony = request.HasBalcony,
                    HasSeaView = request.HasSeaView,
                    Status = Business.Model.Enums.RoomTypeStatus.Active, // Default status
                    SortOrder = request.SortOrder,
                    HotelId = defaultHotelId // Sử dụng default hotel ID thay vì request.HotelId
                    // CreatedAt và UpdatedAt cũng được tự động set bởi BaseEntity
                };

                // Tạo room type trước
                var createdRoomType = await _roomTypeRepository.CreateAsync(roomType);

                // Thêm amenities nếu có
                if (request.AmenityIds != null && request.AmenityIds.Any())
                {
                    foreach (var amenityId in request.AmenityIds)
                    {
                        await _roomTypeRepository.AddAmenityAsync(createdRoomType.Id, amenityId);
                    }
                }

                // Thêm images nếu có
                if (request.Images != null && request.Images.Any())
                {
                    foreach (var imageRequest in request.Images)
                    {
                        var roomTypeImage = new RoomTypeImage
                        {
                            RoomTypeId = createdRoomType.Id,
                            ImageUrl = imageRequest.ImageUrl,
                            Caption = imageRequest.Caption,
                            IsPrimary = imageRequest.IsPrimary,
                            SortOrder = imageRequest.SortOrder
                        };
                        await _roomTypeRepository.AddImageAsync(roomTypeImage);
                    }
                }

                // Lấy lại room type với full details để return
                var roomTypeWithDetails = await _roomTypeRepository.GetWithFullDetailsAsync(createdRoomType.Id);
                var roomTypeDto = MapToDto(roomTypeWithDetails ?? createdRoomType);
                
                return ServiceResult<RoomTypeDto>.SuccessResult(roomTypeDto, "Tạo loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room type");
                return ServiceResult<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi tạo loại phòng");
            }
        }

        public async Task<ServiceResult<RoomTypeDto>> UpdateAsync(Guid id, UpdateRoomTypeRequest request)
        {
            try
            {
                var existingRoomType = await _roomTypeRepository.GetByIdAsync(id);
                if (existingRoomType == null)
                {
                    return ServiceResult<RoomTypeDto>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "Id", Value = id }
                    });
                }

                // Check if new name conflicts with other room types in the same hotel
                if (!string.IsNullOrEmpty(request.Name) && request.Name != existingRoomType.Name)
                {
                    var nameExists = await _roomTypeRepository.NameExistsAsync(request.Name, existingRoomType.HotelId, existingRoomType.Id);
                    if (nameExists)
                    {
                        return ServiceResult<RoomTypeDto>.ErrorResult("Tên loại phòng đã tồn tại", new List<ErrorDetail>
                        {
                            new ErrorDetail { Code = "RMT_003", Message = "Tên loại phòng đã tồn tại trong khách sạn này", Field = "Name", Value = request.Name }
                        });
                    }
                }

                // Update properties
                if (!string.IsNullOrEmpty(request.Name))
                    existingRoomType.Name = request.Name;
                if (!string.IsNullOrEmpty(request.NameEn))
                    existingRoomType.NameEn = request.NameEn;
                if (!string.IsNullOrEmpty(request.Description))
                    existingRoomType.Description = request.Description;
                
                existingRoomType.BasePrice = request.BasePrice;
                existingRoomType.MaxOccupancy = request.MaxOccupancy;
                existingRoomType.AreaSqm = request.AreaSqm;
                
                if (!string.IsNullOrEmpty(request.BedType))
                    existingRoomType.BedType = Enum.Parse<BedType>(request.BedType, true);
                
                existingRoomType.BedCount = request.BedCount;
                existingRoomType.BathroomCount = request.BathroomCount;
                existingRoomType.HasBalcony = request.HasBalcony;
                existingRoomType.HasSeaView = request.HasSeaView;
                
                // Convert DTO.Enums.RoomTypeStatus to Business.Model.Enums.RoomTypeStatus
                existingRoomType.Status = ConvertRoomTypeStatus(request.Status);
                
                existingRoomType.SortOrder = request.SortOrder;

                existingRoomType.UpdatedAt = DateTime.UtcNow;

                var updatedRoomType = await _roomTypeRepository.UpdateAsync(existingRoomType);
                var roomTypeDto = MapToDto(updatedRoomType);
                
                return ServiceResult<RoomTypeDto>.SuccessResult(roomTypeDto, "Cập nhật loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room type {Id}", id);
                return ServiceResult<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi cập nhật loại phòng");
            }
        }

        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            try
            {
                var existingRoomType = await _roomTypeRepository.GetByIdAsync(id);
                if (existingRoomType == null)
                {
                    return ServiceResult<bool>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "Id", Value = id }
                    });
                }

                // Check if room type has active bookings (business rule)
                // TODO: Implement when Booking entity is available
                // var hasActiveBookings = await _roomTypeRepository.HasActiveBookingsAsync(id);
                // if (hasActiveBookings)
                // {
                //     return ServiceResult<bool>.ErrorResult("Không thể xóa loại phòng có booking đang hoạt động", new List<ErrorDetail>
                //     {
                //         new ErrorDetail { Code = "RMT_004", Message = "Loại phòng này có booking đang hoạt động, không thể xóa", Field = "Id", Value = id }
                //     });
                // }

                var result = await _roomTypeRepository.DeleteAsync(id);
                return ServiceResult<bool>.SuccessResult(result, "Xóa loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room type {Id}", id);
                return ServiceResult<bool>.ErrorResult("Có lỗi xảy ra khi xóa loại phòng");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByHotelIdAsync(Guid hotelId)
        {
            try
            {
                var roomTypes = await _roomTypeRepository.GetByHotelIdAsync(hotelId);
                var roomTypeDtos = roomTypes.Select(MapToDto);
                return ServiceResult<IEnumerable<RoomTypeDto>>.SuccessResult(roomTypeDtos, "Lấy danh sách loại phòng theo khách sạn thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room types by hotel {HotelId}", hotelId);
                return ServiceResult<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách loại phòng");
            }
        }

        public async Task<ServiceResult<RoomTypeDto>> GetWithFullDetailsAsync(Guid id)
        {
            try
            {
                var roomType = await _roomTypeRepository.GetWithFullDetailsAsync(id);
                if (roomType == null)
                {
                    return ServiceResult<RoomTypeDto>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "Id", Value = id }
                    });
                }

                var roomTypeDto = MapToDto(roomType);
                return ServiceResult<RoomTypeDto>.SuccessResult(roomTypeDto, "Lấy thông tin chi tiết loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting room type full details {Id}", id);
                return ServiceResult<RoomTypeDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin chi tiết loại phòng");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetWithAmenitiesAsync(Guid hotelId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> SearchAsync(string searchTerm, Guid? hotelId = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return ServiceResult<IEnumerable<RoomTypeDto>>.ErrorResult("Từ khóa tìm kiếm không được trống", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_005", Message = "Từ khóa tìm kiếm không được trống", Field = "SearchTerm", Value = searchTerm }
                    });
                }

                var roomTypes = await _roomTypeRepository.SearchAsync(searchTerm, hotelId);
                var roomTypeDtos = roomTypes.Select(MapToDto);
                return ServiceResult<IEnumerable<RoomTypeDto>>.SuccessResult(roomTypeDtos, "Tìm kiếm loại phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching room types with term {SearchTerm}", searchTerm);
                return ServiceResult<IEnumerable<RoomTypeDto>>.ErrorResult("Có lỗi xảy ra khi tìm kiếm loại phòng");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeAvailabilityDto>>> GetAvailableForDatesAsync(Guid hotelId, DateTime checkIn, DateTime checkOut, int guests)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> IsAvailableForDatesAsync(Guid roomTypeId, DateTime checkIn, DateTime checkOut, int roomsNeeded = 1)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> AssignAmenitiesAsync(Guid roomTypeId, AssignAmenitiesRequest request)
        {
            try
            {
                // Validate room type exists
                var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
                if (roomType == null)
                {
                    return ServiceResult<bool>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "RoomTypeId", Value = roomTypeId }
                    });
                }

                // Validate all amenities exist
                foreach (var amenityId in request.AmenityIds)
                {
                    var amenity = await _amenityRepository.GetByIdAsync(amenityId);
                    if (amenity == null)
                    {
                        return ServiceResult<bool>.ErrorResult("Tiện ích không tồn tại", new List<ErrorDetail>
                        {
                            new ErrorDetail { Code = "RMT_007", Message = $"Tiện ích với ID {amenityId} không tồn tại", Field = "AmenityIds", Value = amenityId }
                        });
                    }
                }

                // Clear existing amenities if ReplaceExisting is true
                if (request.ReplaceExisting)
                {
                    await _roomTypeRepository.ClearAmenitiesAsync(roomTypeId);
                }

                // Add new amenities
                foreach (var amenityId in request.AmenityIds)
                {
                    await _roomTypeRepository.AddAmenityAsync(roomTypeId, amenityId);
                }

                return ServiceResult<bool>.SuccessResult(true, "Gán tiện ích thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning amenities to room type {RoomTypeId}", roomTypeId);
                return ServiceResult<bool>.ErrorResult("Có lỗi xảy ra khi gán tiện ích");
            }
        }

        public async Task<ServiceResult<bool>> RemoveAmenityAsync(Guid roomTypeId, Guid amenityId)
        {
            try
            {
                // Validate room type exists
                var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
                if (roomType == null)
                {
                    return ServiceResult<bool>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "RoomTypeId", Value = roomTypeId }
                    });
                }

                // Validate amenity exists
                var amenity = await _amenityRepository.GetByIdAsync(amenityId);
                if (amenity == null)
                {
                    return ServiceResult<bool>.ErrorResult("Tiện ích không tồn tại", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_007", Message = "Tiện ích không tồn tại", Field = "AmenityId", Value = amenityId }
                    });
                }

                // Remove amenity from room type
                var result = await _roomTypeRepository.RemoveAmenityAsync(roomTypeId, amenityId);
                
                return result 
                    ? ServiceResult<bool>.SuccessResult(true, "Xóa tiện ích thành công")
                    : ServiceResult<bool>.ErrorResult("Tiện ích không được gán cho loại phòng này");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing amenity {AmenityId} from room type {RoomTypeId}", amenityId, roomTypeId);
                return ServiceResult<bool>.ErrorResult("Có lỗi xảy ra khi xóa tiện ích");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByAmenityAsync(Guid amenityId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> AddImageAsync(Guid roomTypeId, RoomTypeImageDto image)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> RemoveImageAsync(Guid roomTypeId, Guid imageId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> UpdateImageOrderAsync(Guid roomTypeId, List<Guid> imageIds)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> SetPrimaryImageAsync(Guid roomTypeId, Guid imageId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<decimal>> CalculatePriceAsync(Guid roomTypeId, DateTime checkIn, DateTime checkOut, int guests)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> UpdatePricingAsync(Guid roomTypeId, decimal newBasePrice)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> BulkUpdatePricingAsync(BulkUpdateRoomTypePriceRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> UpdateStatusAsync(Guid roomTypeId, DTO.Enums.RoomTypeStatus status)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeDto>>> GetByStatusAsync(DTO.Enums.RoomTypeStatus status, Guid? hotelId = null)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> BulkDeleteAsync(List<Guid> ids)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> BulkUpdateStatusAsync(List<Guid> ids, DTO.Enums.RoomTypeStatus status)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<int>> BulkCreateAsync(List<CreateRoomTypeRequest> requests)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<RoomTypeDto>> DuplicateRoomTypeAsync(Guid roomTypeId, DuplicateRoomTypeRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<RoomTypeDto>> CreateFromTemplateAsync(Guid templateId, CreateRoomTypeFromTemplateRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<RoomTypeStatsDto>> GetStatisticsAsync(Guid roomTypeId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<IEnumerable<RoomTypeSummaryDto>>> GetPopularTypesAsync(Guid hotelId, int topCount = 5)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<decimal>> GetAverageRatingAsync(Guid roomTypeId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<decimal>> GetTotalRevenueAsync(Guid roomTypeId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ValidateCapacityAsync(Guid roomTypeId, int requestedGuests)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> ValidateAmenityCompatibilityAsync(Guid roomTypeId, List<Guid> amenityIds)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<bool>> CanDeleteAsync(Guid roomTypeId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<byte[]>> ExportToExcelAsync(RoomTypeFilterRequest filter)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<byte[]>> ExportToPdfAsync(Guid roomTypeId)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<string>> GenerateReportAsync(Guid hotelId, DateTime fromDate, DateTime toDate)
        {
            throw new NotImplementedException();
        }

        // Room Management Methods
        public async Task<ServiceResult<RoomDto>> CreateRoomForRoomTypeAsync(Guid roomTypeId, CreateRoomForRoomTypeRequest request)
        {
            try
            {
                // Validate room type exists
                var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
                if (roomType == null)
                {
                    return ServiceResult<RoomDto>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "RoomTypeId", Value = roomTypeId }
                    });
                }

                // Check if room number already exists
                var roomNumberExists = await _roomRepository.RoomNumberExistsAsync(request.RoomNumber);
                if (roomNumberExists)
                {
                    return ServiceResult<RoomDto>.ErrorResult("Số phòng đã tồn tại", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RM_001", Message = "Số phòng này đã được sử dụng", Field = "RoomNumber", Value = request.RoomNumber }
                    });
                }

                // Create new room
                var room = new Room
                {
                    RoomNumber = request.RoomNumber,
                    Floor = request.Floor,
                    Status = RoomStatus.Available, // Default status
                    MaintenanceNotes = request.MaintenanceNotes,
                    RoomTypeId = roomTypeId
                };

                var createdRoom = await _roomRepository.CreateAsync(room);
                var roomDto = MapRoomToDto(createdRoom);

                return ServiceResult<RoomDto>.SuccessResult(roomDto, "Tạo phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room for room type {RoomTypeId}", roomTypeId);
                return ServiceResult<RoomDto>.ErrorResult("Có lỗi xảy ra khi tạo phòng");
            }
        }

        public async Task<ServiceResult<List<RoomDto>>> BulkCreateRoomsForRoomTypeAsync(Guid roomTypeId, BulkCreateRoomsForRoomTypeRequest request)
        {
            try
            {
                // Validate room type exists
                var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
                if (roomType == null)
                {
                    return ServiceResult<List<RoomDto>>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "RoomTypeId", Value = roomTypeId }
                    });
                }

                var createdRooms = new List<RoomDto>();
                var errors = new List<ErrorDetail>();

                foreach (var roomRequest in request.Rooms)
                {
                    // Check if room number already exists
                    var roomNumberExists = await _roomRepository.RoomNumberExistsAsync(roomRequest.RoomNumber);
                    if (roomNumberExists)
                    {
                        errors.Add(new ErrorDetail 
                        { 
                            Code = "RM_001", 
                            Message = $"Số phòng {roomRequest.RoomNumber} đã tồn tại", 
                            Field = "RoomNumber", 
                            Value = roomRequest.RoomNumber 
                        });
                        continue;
                    }

                    // Create room
                    var room = new Room
                    {
                        RoomNumber = roomRequest.RoomNumber,
                        Floor = roomRequest.Floor,
                        Status = RoomStatus.Available,
                        MaintenanceNotes = roomRequest.MaintenanceNotes,
                        RoomTypeId = roomTypeId
                    };

                    var createdRoom = await _roomRepository.CreateAsync(room);
                    createdRooms.Add(MapRoomToDto(createdRoom));
                }

                if (errors.Any() && !createdRooms.Any())
                {
                    return ServiceResult<List<RoomDto>>.ErrorResult("Không thể tạo phòng nào", errors);
                }

                var message = errors.Any() 
                    ? $"Tạo {createdRooms.Count} phòng thành công, {errors.Count} phòng bị lỗi"
                    : $"Tạo {createdRooms.Count} phòng thành công";

                var result = ServiceResult<List<RoomDto>>.SuccessResult(createdRooms, message);
                result.Errors = errors; // Gán errors riêng biệt
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk creating rooms for room type {RoomTypeId}", roomTypeId);
                return ServiceResult<List<RoomDto>>.ErrorResult("Có lỗi xảy ra khi tạo phòng hàng loạt");
            }
        }

        public async Task<ServiceResult<IEnumerable<RoomDto>>> GetRoomsByRoomTypeIdAsync(Guid roomTypeId)
        {
            try
            {
                // Validate room type exists
                var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
                if (roomType == null)
                {
                    return ServiceResult<IEnumerable<RoomDto>>.ErrorResult("Không tìm thấy loại phòng", new List<ErrorDetail>
                    {
                        new ErrorDetail { Code = "RMT_001", Message = "Loại phòng không tồn tại", Field = "RoomTypeId", Value = roomTypeId }
                    });
                }

                var rooms = await _roomRepository.GetByRoomTypeIdAsync(roomTypeId);
                var roomDtos = rooms.Select(MapRoomToDto);

                return ServiceResult<IEnumerable<RoomDto>>.SuccessResult(roomDtos, "Lấy danh sách phòng thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting rooms by room type {RoomTypeId}", roomTypeId);
                return ServiceResult<IEnumerable<RoomDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách phòng");
            }
        }

        // Helper Methods
        
        /// <summary>
        /// Lấy ID của khách sạn mặc định (hotel đầu tiên trong hệ thống)
        /// Cho single hotel system
        /// </summary>
        private async Task<Guid> GetDefaultHotelIdAsync()
        {
            try
            {
                var hotels = await _hotelRepository.GetAllAsync();
                var firstHotel = hotels?.FirstOrDefault();
                return firstHotel?.Id ?? Guid.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting default hotel ID");
                return Guid.Empty;
            }
        }
        
        private RoomTypeDto MapToDto(RoomType roomType)
        {
            return new RoomTypeDto
            {
                Id = roomType.Id,
                Name = roomType.Name,
                NameEn = roomType.NameEn,
                Description = roomType.Description,
                BasePrice = roomType.BasePrice,
                MaxOccupancy = roomType.MaxOccupancy,
                AreaSqm = roomType.AreaSqm,
                BedType = roomType.BedType.ToString(),
                BedCount = roomType.BedCount,
                BathroomCount = roomType.BathroomCount,
                HasBalcony = roomType.HasBalcony,
                HasSeaView = roomType.HasSeaView,
                Status = roomType.Status.ToString(),
                SortOrder = roomType.SortOrder,
                HotelId = roomType.HotelId,
                Images = roomType.RoomTypeImages?.Select(i => new RoomTypeImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    Caption = i.Caption,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder
                }).ToList() ?? new List<RoomTypeImageDto>(),
                Amenities = roomType.RoomTypeAmenities?.Select(rta => new AmenityDto
                {
                    Id = rta.Amenity.Id,
                    Name = rta.Amenity.Name,
                    Description = rta.Amenity.Description,
                    Icon = rta.Amenity.Icon
                }).ToList() ?? new List<AmenityDto>(),
                Rooms = roomType.Rooms?.Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    Floor = r.Floor,
                    Status = r.Status.ToString(),
                    MaintenanceNotes = r.MaintenanceNotes,
                    RoomTypeId = r.RoomTypeId,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList() ?? new List<RoomDto>(),
                CreatedAt = roomType.CreatedAt,
                UpdatedAt = roomType.UpdatedAt
            };
        }
        
        private RoomDto MapRoomToDto(Room room)
        {
            return new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                Floor = room.Floor,
                Status = room.Status.ToString(),
                MaintenanceNotes = room.MaintenanceNotes,
                RoomTypeId = room.RoomTypeId,
                RoomType = room.RoomType != null ? new RoomTypeDto
                {
                    Id = room.RoomType.Id,
                    Name = room.RoomType.Name,
                    NameEn = room.RoomType.NameEn,
                    Description = room.RoomType.Description,
                    BasePrice = room.RoomType.BasePrice,
                    MaxOccupancy = room.RoomType.MaxOccupancy,
                    AreaSqm = room.RoomType.AreaSqm,
                    BedType = room.RoomType.BedType.ToString(),
                    BedCount = room.RoomType.BedCount,
                    BathroomCount = room.RoomType.BathroomCount,
                    HasBalcony = room.RoomType.HasBalcony,
                    HasSeaView = room.RoomType.HasSeaView,
                    Status = room.RoomType.Status.ToString(),
                    SortOrder = room.RoomType.SortOrder,
                    HotelId = room.RoomType.HotelId,
                    CreatedAt = room.RoomType.CreatedAt,
                    UpdatedAt = room.RoomType.UpdatedAt
                } : null,
                CreatedAt = room.CreatedAt,
                UpdatedAt = room.UpdatedAt
            };
        }

        private RoomType MapToEntity(CreateRoomTypeRequest request, Guid hotelId)
        {
            return new RoomType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                NameEn = request.NameEn,
                Description = request.Description,
                BasePrice = request.BasePrice,
                MaxOccupancy = request.MaxOccupancy,
                AreaSqm = request.AreaSqm,
                BedType = Enum.Parse<BedType>(request.BedType, true),
                BedCount = request.BedCount,
                BathroomCount = request.BathroomCount,
                HasBalcony = request.HasBalcony,
                HasSeaView = request.HasSeaView,
                Status = Business.Model.Enums.RoomTypeStatus.Active,
                SortOrder = request.SortOrder,
                HotelId = hotelId, // Sử dụng parameter thay vì request.HotelId
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Convert DTO.Enums.RoomTypeStatus to Business.Model.Enums.RoomTypeStatus
        /// </summary>
        private Business.Model.Enums.RoomTypeStatus ConvertRoomTypeStatus(DTO.Enums.RoomTypeStatus dtoStatus)
        {
            return dtoStatus switch
            {
                DTO.Enums.RoomTypeStatus.Available => Business.Model.Enums.RoomTypeStatus.Active,
                DTO.Enums.RoomTypeStatus.Unavailable => Business.Model.Enums.RoomTypeStatus.Inactive,
                DTO.Enums.RoomTypeStatus.Maintenance => Business.Model.Enums.RoomTypeStatus.Maintenance,
                DTO.Enums.RoomTypeStatus.Discontinued => Business.Model.Enums.RoomTypeStatus.Inactive,
                _ => Business.Model.Enums.RoomTypeStatus.Active
            };
        }
    }
}
