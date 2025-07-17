# 🐛 Troubleshooting Guide

## Backend Issues

### 1. Backend không khởi động được

**Vấn đề:** `Unable to connect to SQL Server`
```bash
# Kiểm tra SQL Server service
services.msc → SQL Server (MSSQLSERVER)

# Test connection string
sqlcmd -S (localdb)\mssqllocaldb -Q "SELECT 1"

# Recreate LocalDB instance
sqllocaldb delete mssqllocaldb
sqllocaldb create mssqllocaldb
```

**Vấn đề:** `Migration pending`
```bash
# Check migration status
dotnet ef migrations list --project ../Business

# Apply migrations
dotnet ef database update --project ../Business

# Reset database (nếu cần)
dotnet ef database drop --project ../Business
dotnet ef database update --project ../Business
```

### 2. JWT Token Issues

**Vấn đề:** `JWT token invalid`
- Kiểm tra SecretKey >= 32 characters
- Verify Issuer/Audience settings
- Check token expiry time

**Vấn đề:** `Unauthorized 401`
```csharp
// Check JWT middleware order in Program.cs
app.UseAuthentication();  // Must be before
app.UseAuthorization();   // authorization
```

### 3. CORS Errors

**Vấn đề:** `CORS policy blocked`
```csharp
// Add CORS before routing
app.UseCors("YourPolicy");
app.UseRouting();
```

**Check allowed origins:**
```json
{
  "CorsSettings": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

## Frontend Issues

### 1. Frontend không kết nối được API

**Vấn đề:** `Network Error`
```bash
# Kiểm tra API URL
echo $NEXT_PUBLIC_API_URL

# Test API endpoint
curl http://localhost:5186/api/health

# Check CORS trong browser console
```

**Vấn đề:** `Environment variables không load`
```bash
# Restart development server
npm run dev

# Check .env.local exists và có NEXT_PUBLIC_ prefix
```

### 2. Build Errors

**Vấn đề:** `TypeScript errors`
```bash
# Type checking
npm run type-check

# Fix common issues
npm run lint --fix
```

**Vấn đề:** `Module not found`
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
```

### 3. Styling Issues

**Vấn đề:** `Tailwind classes không work`
```bash
# Check tailwind.config.js content paths
# Restart dev server after config changes
```

## Database Issues

### 1. Migration Errors

**Vấn đề:** `Column already exists`
```bash
# Reset migrations
rm -rf Migrations/
dotnet ef migrations add InitialCreate --project ../Business
dotnet ef database update --project ../Business
```

**Vấn đề:** `Foreign key constraint fails`
```bash
# Check entity relationships
# Verify navigation properties
# Drop database và recreate
dotnet ef database drop --project ../Business --force
```

### 2. Performance Issues

**Vấn đề:** `Slow queries`
```sql
-- Check query execution plan
SET STATISTICS IO ON
-- Your query here

-- Add indexes
CREATE INDEX IX_Rooms_HotelId ON Rooms(HotelId);
```

## Email Issues

### 1. Email không gửi được

**Vấn đề:** `SMTP authentication failed`
- Verify Gmail App Password (không phải password thường)
- Check 2FA enabled
- Test với tool khác (Postman, Thunderbird)

**Vấn đề:** `Connection timeout`
```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,              // TLS port
    "EnableSsl": true,
    "Timeout": 30000         // 30 seconds
  }
}
```

## Deployment Issues

### 1. Production Build Errors

**Vấn đề:** `Build failed`
```bash
# Check for warnings trong build output
npm run build 2>&1 | tee build.log

# Fix TypeScript strict mode issues
# Remove unused imports
```

**Vấn đề:** `Environment variables missing`
```bash
# Set production environment variables
# Verify NEXT_PUBLIC_ prefix cho client-side variables
```

## Performance Debugging

### 1. Backend Performance
```csharp
// Add logging để track slow operations
using var activity = ActivitySource.StartActivity("GetHotels");
_logger.LogInformation("Starting GetHotels operation");

var stopwatch = Stopwatch.StartNew();
// Your operation
stopwatch.Stop();
_logger.LogInformation("GetHotels took {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);
```

### 2. Frontend Performance
```javascript
// React DevTools Profiler
// Lighthouse audit
// Network tab trong browser DevTools
```

## Getting Help

### 1. Log Files Locations
- Backend: `logs/` folder
- Frontend: Browser console + Network tab
- Database: SQL Server logs

### 2. Debug Mode
```bash
# Backend: Enable detailed errors
"DetailedErrors": true,
"IncludeExceptionDetails": true

# Frontend: Enable debug mode
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Contact Support
- Check GitHub issues
- Stack Overflow với tags: `.net-8`, `next.js`, `entity-framework`
- Project documentation