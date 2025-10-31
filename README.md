# MBTI Personality Test Web Application

A modern, responsive web application for taking Myers-Briggs Type Indicator (MBTI) personality assessments. Built with React.js frontend, Express.js backend, and MongoDB database.

![MBTI Test App](https://img.shields.io/badge/MBTI-Personality%20Test-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## ✨ Features

- **🧠 Comprehensive MBTI Assessment**: 16+ scientifically-designed questions
- **📱 Responsive Design**: Works seamlessly on mobile and desktop
- **🎨 Modern UI/UX**: Beautiful animations and interactions using Framer Motion
- **📊 Detailed Results**: Complete personality type analysis with strengths and career suggestions
- **🔒 Session Management**: Secure user sessions with progress tracking
- **📚 Educational Content**: Articles about personality types and psychology
- **📞 Contact System**: User support and inquiry system
- **🔄 Real-time Progress**: Live progress tracking during test
- **📈 Analytics**: Statistical insights and test completion rates
- **🐳 Docker Ready**: Complete containerization for easy deployment

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 18 with functional components and hooks
- **Styling**: Styled-components with responsive design
- **State Management**: React Context API with useReducer
- **Routing**: React Router v6 with protected routes
- **Animations**: Framer Motion for smooth transitions
- **Icons**: FontAwesome for consistent iconography
- **API Client**: Axios with interceptors and error handling

### Backend (Express.js)
- **Framework**: Express.js with modern middleware
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Joi for request validation
- **Architecture**: RESTful API with proper error handling
- **Algorithm**: Custom MBTI calculation engine

### Database (PostgreSQL)
- **Users**: Session management and user data
- **Questions**: MBTI test questions (loaded from JSON file)
- **Responses**: User answers with timestamps
- **Results**: Calculated personality types and scores
- **Admins**: Admin authentication
- **AIAnalyses**: AI-generated analysis reports
- **WebsiteStats**: Website analytics and tracking

## 📋 Project Structure

```
hkmbti/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout/      # Header, Footer, Layout
│   │   │   └── ErrorBoundary/
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/          # Page components
│   │   │   ├── Home/       # Landing page
│   │   │   ├── About/      # MBTI information
│   │   │   ├── MBTITest/   # Test initiation
│   │   │   ├── Questions/  # Test interface
│   │   │   ├── Results/    # Test results
│   │   │   ├── Articles/   # Educational content
│   │   │   └── Contact/    # Contact page
│   │   ├── services/       # API communication
│   │   ├── styles/         # Theme and styling
│   │   └── App.js          # Main application
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx configuration
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── data/               # Static data and type definitions
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB data models
│   ├── routes/            # API endpoint handlers
│   ├── utils/             # Utility functions
│   ├── Dockerfile         # Backend container
│   ├── server.js          # Main server file
│   └── package.json
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6.0 or higher)
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hkmbti
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file (copy from .env.example)
   cp .env.example .env
   
   # Start MongoDB locally
   mongod
   
   # Start backend server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:9090
   - Backend API: http://localhost:9091
   - API Health Check: http://localhost:9091/api/health

### Option 2: Docker Deployment

1. **Clone and start with Docker Compose**
   ```bash
   git clone <repository-url>
   cd hkmbti
   
   # Start all services
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:9090
   - Backend API: http://localhost:9091
   - PostgreSQL: localhost:5432

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# PostgreSQL Connection (Option 1: Use DATABASE_URL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/mbti_db

# PostgreSQL Connection (Option 2: Use individual variables)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=mbti_db
# DB_USER=postgres
# DB_PASSWORD=password
# DB_SSL=false

# For Docker deployment
DATABASE_URL=postgresql://postgres:password123@postgres:5432/mbti_db
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:9091
```

### PostgreSQL Configuration

The application automatically creates database tables on first startup using Sequelize sync. The database schema includes:

- Users table for session management
- Questions table (loaded from JSON file)
- Responses table for user answers
- Results table for MBTI type calculations
- Admin table for authentication
- AIAnalysis table for AI-generated reports
- WebsiteStat table for analytics
- Proper indexes for performance

**Note**: Questions are loaded from `backend/data/questions.json` file, not stored in the database.

## 📊 API Endpoints

### Authentication & Sessions
- `POST /api/auth/session` - Create new test session
- `GET /api/auth/session/:id` - Get session details
- `PATCH /api/auth/session/:id` - Update session

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/test/:sessionId` - Get paginated questions
- `GET /api/questions/category/:category` - Get questions by category

### Responses
- `POST /api/responses` - Submit question response
- `GET /api/responses/session/:sessionId` - Get user responses
- `GET /api/responses/progress/:sessionId` - Get completion progress

### Results
- `POST /api/results/calculate/:sessionId` - Calculate MBTI result
- `GET /api/results/:sessionId` - Get basic results
- `GET /api/results/detailed/:sessionId` - Get detailed results

### Articles
- `GET /api/articles` - Get educational articles
- `GET /api/articles/:id` - Get specific article
- `GET /api/articles/featured` - Get featured articles

## 🧪 MBTI Calculation Algorithm

The application implements a sophisticated MBTI calculation system:

1. **Question Scoring**: Each question maps to one of four dimensions (EI, SN, TF, JP)
2. **Direction Handling**: Questions can be positively or negatively oriented
3. **Scale Processing**: 7-point Likert scale with neutral midpoint
4. **Type Determination**: Dominant preference in each dimension
5. **Confidence Calculation**: Strength of preference percentages
6. **Result Generation**: Comprehensive personality profile

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) - Main brand color
- **Secondary**: Pink (#ec4899) - Accent and highlights
- **Accent**: Cyan (#06b6d4) - Call-to-action elements
- **Neutrals**: Grayscale from white to charcoal
- **Status**: Success, warning, error, info colors

### Typography
- **Font Family**: Inter (modern, readable)
- **Scale**: Modular scale from 12px to 60px
- **Weights**: Light to extrabold (300-800)

### Components
- Responsive grid system
- Consistent spacing (4px base unit)
- Modern border radius and shadows
- Smooth animations and transitions

## 🚀 Deployment

### Production Deployment with Docker

1. **Environment Setup**
   ```bash
   # Update environment variables for production
   # Set MONGODB_URI, API URLs, etc.
   ```

2. **Build and Deploy**
   ```bash
   # Build production images
   docker-compose -f docker-compose.yml build
   
   # Deploy to production
   docker-compose -f docker-compose.yml up -d
   ```

3. **Security Considerations**
   - Update MongoDB passwords
   - Enable HTTPS/SSL
   - Configure proper CORS origins
   - Set up monitoring and logging
   - Regular security updates

### Manual Deployment

1. **Backend Deployment**
   ```bash
   cd backend
   npm install --production
   npm run build  # if applicable
   npm start
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   npm install
   npm run build
   # Serve build/ directory with nginx/apache
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for type safety (future enhancement)
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design compatibility
- Follow the established code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Carl Jung** - Original psychological type theory
- **Myers-Briggs Foundation** - MBTI development
- **16Personalities** - Inspiration for modern MBTI testing
- **React Community** - Excellent ecosystem and tools
- **Open Source Contributors** - Amazing libraries and tools

## 📞 Support

For support, email support@mbtitest.com or create an issue in the GitHub repository.

---

**Disclaimer**: This MBTI test is designed for educational and entertainment purposes only. It should not be used for clinical diagnosis or as the sole basis for important life decisions. For professional psychological assessment, please consult with a qualified mental health practitioner.

## 🔮 Future Enhancements

- [ ] TypeScript migration for better type safety
- [ ] Advanced analytics dashboard
- [ ] Social sharing of results
- [ ] Multi-language support
- [ ] Advanced question algorithms
- [ ] User account system
- [ ] Result comparison features
- [ ] Mobile app development
- [ ] Integration with career services
- [ ] Advanced reporting and insights 
