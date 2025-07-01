namespace Business.Model.Enums
{
    public enum UserRole
    {
        Admin,
        Manager,
        Staff,
        Customer
    }

    public enum RoomStatus
    {
        Available,
        Occupied,
        Cleaning,
        Maintenance,
        OutOfOrder
    }

    public enum RoomTypeStatus
    {
        Active,
        Inactive,
        Maintenance
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        CheckedIn,
        CheckedOut,
        Cancelled,
        NoShow
    }

    public enum PaymentStatus
    {
        Pending,
        Paid,
        PartiallyPaid,
        Refunded,
        Failed
    }

    public enum PaymentMethod
    {
        Cash,
        CreditCard,
        DebitCard,
        BankTransfer,
        OnlinePayment,
        Wallet
    }

    public enum DiscountType
    {
        Percentage,
        FixedAmount
    }

    public enum CouponStatus
    {
        Active,
        Paused,
        Expired
    }

    public enum CustomerType
    {
        All,
        New,
        Returning,
        VIP
    }

    public enum ChatStatus
    {
        Open,
        Assigned,
        Resolved,
        Closed
    }

    public enum MessageType
    {
        Text,
        Image,
        File,
        SystemNotification
    }

    public enum SenderType
    {
        Customer,
        Staff,
        System
    }

    public enum BedType
    {
        Single,
        Twin,
        Double,
        Queen,
        King,
        SuperKing
    }

    public enum BookingSource
    {
        Website,
        Phone,
        WalkIn,
        OnlineTravelAgency
    }

    public enum LoyaltyTier
    {
        Bronze,
        Silver,
        Gold,
        Platinum
    }
}
