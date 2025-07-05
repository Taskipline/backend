# Taskipline Backend

> Building discipline with taskipline! 🦄🌈✨

A robust Node.js/TypeScript backend service for the Taskipline platform with comprehensive authentication, role-based access control, API documentation, testing, and production-ready features.

## 🚀 Features

- **Authentication System**: Register, login, email verification, password reset
- **Role-Based Access Control**: Flexible permission system
- **Email Notifications**: Account verification and password reset emails
- **Security**: JWT tokens, password hashing, input validation, CORS, rate limiting
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schema validation
- **Logging**: Winston logger with file and console output
- **Error Handling**: Centralized error handling with custom error classes
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest and Supertest for unit and integration tests
- **Rate Limiting**: Configurable rate limiting for different endpoints
- **Health Checks**: Comprehensive health monitoring endpoints
- **Process Management**: PM2 configuration for production deployment

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: Nodemailer
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Logging**: Winston, Morgan
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Process Management**: PM2

## 📦 Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (see .env file)
4. Start the development server:

   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

```env
MONGO_DB_URI=mongodb://127.0.0.1:27017/taskipline
NODE_ENV=development
PORT=5000
JWT=your-jwt-secret
JWT_REFRESH=your-jwt-refresh-secret
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
VERIFICATION_CODE_EXP=30
```

## 📚 API Documentation

Visit `/api-docs` when the server is running to access the interactive Swagger documentation.

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/activate` - Activate user account
- `POST /api/auth/login` - User login
- `POST /api/auth/forgotPassword` - Request password reset
- `POST /api/auth/resetPassword` - Reset password
- `POST /api/auth/changePassword` - Change password (authenticated)

### Roles

- `GET /api/role` - Get all roles
- `GET /api/role/:id` - Get role by ID
- `POST /api/role/create` - Create new role

### Health Monitoring

- `GET /api/health` - Comprehensive health check
- `GET /api/health/live` - Liveness probe
- `GET /api/health/ready` - Readiness probe

## 🏗️ Project Structure

```
src/
├── api/           # Route definitions
├── config/        # Configuration files
├── controller/    # Request handlers
├── errors/        # Custom error classes
├── interface/     # TypeScript interfaces
├── middleware/    # Express middleware
├── model/         # Mongoose models
├── services/      # Business logic layer
├── utils/         # Utility functions
└── validation/    # Zod validation schemas
tests/             # Test files
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS protection
- XSS protection
- MongoDB injection prevention
- Rate limiting (general, auth, registration, password reset)
- Helmet security headers

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## 🚀 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Build and watch for changes
npm run build:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build artifacts
npm run clean
```

## 📊 Production Deployment

### Using PM2

```bash
# Build and start with PM2
npm run production:build

# Deploy updates
npm run production:deploy

# PM2 Commands
npm run pm2:start     # Start the application
npm run pm2:stop      # Stop the application
npm run pm2:restart   # Restart the application
npm run pm2:reload    # Reload with zero downtime
npm run pm2:delete    # Delete the application
npm run pm2:logs      # View logs
npm run pm2:monit     # Monitor application
```

### Manual Production Start

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔍 Monitoring & Health Checks

The application includes comprehensive health monitoring:

- **Liveness**: `/api/health/live` - Basic application health
- **Readiness**: `/api/health/ready` - Database connectivity check
- **Detailed**: `/api/health` - Comprehensive system information

Health checks include:

- Database connection status
- Memory usage statistics
- Application uptime
- Environment information
- Response time metrics

## 📈 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Registration**: 3 requests per hour
- **Password Reset**: 3 requests per hour

## 📋 TODO

- [x] Add TypeScript support
- [x] Implement authentication system
- [x] Add role-based permissions
- [x] Add unit tests
- [x] Add integration tests
- [x] Add API documentation (Swagger)
- [x] Add rate limiting
- [x] Add monitoring and health checks
- [x] Add production deployment configuration
- [ ] Add caching layer (Redis)
- [ ] Add audit logging
- [ ] Add 2FA support
- [ ] Add API versioning
- [ ] Add database migrations
- [ ] Add performance monitoring
- [ ] Add automated CI/CD pipeline

## 📄 License

ISC License
