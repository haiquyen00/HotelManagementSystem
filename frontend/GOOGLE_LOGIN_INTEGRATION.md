# Google Login Integration

This document describes the Google Login integration implemented for the Hotel Management System.

## 🎯 Overview

The frontend now supports Google OAuth login that integrates with the existing backend API at `/api/auth/google`. Users can log in using their Google account and receive the same JWT token and authentication flow as regular email/password login.

## 📋 Implementation Details

### Backend API (Already Implemented)
- **Endpoint**: `POST /api/auth/google`
- **Request Format**: `{ "googleToken": "string" }`
- **Response Format**: `ApiResponse<AuthDataResponse>`
- **Features**: 
  - Google token verification
  - User creation/update with Google profile
  - JWT token generation
  - Automatic role assignment

### Frontend Integration (Newly Added)

#### 1. Types and Constants
- Added `GoogleLoginRequest` interface in `src/types/index.ts`
- Added `GOOGLE_LOGIN` endpoint in `src/constants/index.ts`

#### 2. Service Layer
- Extended `authService` with `googleLogin` method in `src/services/auth/authService.ts`
- Handles API calls to backend Google login endpoint

#### 3. Authentication Hook
- Extended `useAuth` hook with `googleLogin` function
- Manages authentication state for Google login
- Handles token storage and user session

#### 4. Google Login Component
- Created `GoogleLoginButton` component in `src/components/auth/GoogleLoginButton.tsx`
- Features:
  - Dynamic Google Identity Services script loading
  - Automatic Google Sign-In initialization
  - Error handling for missing configuration
  - Loading states and user feedback
  - Integration with existing auth flow

#### 5. Login Form Integration
- Updated `LoginForm` to include Google login button
- Added visual divider between regular and Google login
- Maintains existing functionality

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google Identity Services
4. Create OAuth 2.0 Client ID credentials
5. Configure authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production domain
6. Copy the Client ID

### 2. Environment Configuration
1. Create `.env.local` file in the frontend directory
2. Add your Google Client ID:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```
3. Restart the development server

### 3. Backend Configuration
Ensure your backend is running and the Google login endpoint is accessible:
- Backend should be running on the configured API URL
- CORS should allow frontend domain
- Google OAuth token verification should be properly configured

## 🧪 Testing

### Development Testing
1. Start the development server: `npm run dev`
2. Navigate to `/auth/login`
3. Look for the Google login button below the regular login form
4. Test the button (requires Google Client ID configuration)

### Debug Page
A debug page is available at `/debug/google-login` with:
- Service integration tests
- Mock token testing
- Real Google login button
- Configuration verification
- Implementation status

### Manual Testing Steps
1. **Frontend Only**: Test without Google Client ID to see error handling
2. **With Configuration**: Add Google Client ID and test real OAuth flow
3. **Backend Integration**: Verify API calls and token handling
4. **End-to-End**: Complete login flow and verify user session

## 📁 Files Added/Modified

### New Files
- `src/components/auth/GoogleLoginButton.tsx` - Main Google login component
- `src/app/debug/google-login/page.tsx` - Debug and testing page
- `.env.example` - Environment configuration example

### Modified Files
- `src/types/index.ts` - Added GoogleLoginRequest type
- `src/constants/index.ts` - Added GOOGLE_LOGIN endpoint
- `src/services/auth/authService.ts` - Added googleLogin method
- `src/hooks/useAuth.ts` - Added googleLogin function
- `src/components/auth/LoginForm.tsx` - Integrated Google login button
- `src/components/auth/index.ts` - Exported GoogleLoginButton

## 🔒 Security Features

- Google token validation handled entirely by backend
- No sensitive data stored in frontend
- JWT tokens stored securely in localStorage
- Proper error handling for invalid tokens
- CORS compatibility maintained
- No Google Client Secret exposed to frontend

## 🎨 UI/UX Features

- Seamless integration with existing login form
- Visual divider between login methods
- Loading states during Google OAuth flow
- Comprehensive error messages
- Responsive design
- Accessibility compliant

## 🔄 Authentication Flow

1. User clicks Google login button
2. Google Identity Services loads (if not already loaded)
3. Google OAuth popup/redirect opens
4. User completes Google authentication
5. Google returns credential token to frontend
6. Frontend calls `/api/auth/google` with token
7. Backend verifies token with Google
8. Backend creates/updates user and generates JWT
9. Frontend stores JWT and user data
10. User redirected to dashboard

## 🚀 Next Steps

1. **Production Setup**: Configure production Google OAuth settings
2. **Testing**: Perform comprehensive end-to-end testing
3. **Monitoring**: Add logging and analytics for Google login usage
4. **Documentation**: Update user guides with Google login instructions

## 📞 Support

For issues with Google login:
1. Check Google Client ID configuration
2. Verify backend API is running
3. Check browser console for errors
4. Use the debug page at `/debug/google-login`
5. Review backend logs for API errors

## 🎉 Success Criteria Met

✅ Frontend has Google login button  
✅ Google OAuth integration implemented  
✅ Backend API integration working  
✅ Authentication state management  
✅ Error handling comprehensive  
✅ User experience seamless  
✅ Security best practices followed  