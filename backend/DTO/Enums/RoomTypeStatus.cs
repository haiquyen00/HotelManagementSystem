namespace DTO.Enums
{
    /// <summary>
    /// Trạng thái của Room Type
    /// </summary>
    public enum RoomTypeStatus
    {
        /// <summary>
        /// Có sẵn
        /// </summary>
        Available = 0,

        /// <summary>
        /// Không có sẵn
        /// </summary>
        Unavailable = 1,

        /// <summary>
        /// Đang bảo trì
        /// </summary>
        Maintenance = 2,

        /// <summary>
        /// Đã ngừng hoạt động
        /// </summary>
        Discontinued = 3
    }
}
