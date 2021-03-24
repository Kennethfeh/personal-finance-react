# Personal Finance React Frontend

A modern React application for the Personal Finance API, providing a comprehensive user interface for managing personal finances with full CRUD operations.

## Features

- 🔐 **Authentication**: User registration and login with JWT tokens
- 📊 **Dashboard**: Overview of financial health with key metrics and recent activity
- 💰 **Transaction Management**: Add, view, filter, and delete income/expense transactions
- 🎯 **Budget Tracking**: Create and monitor budgets with visual progress indicators
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Modern Architecture**: Built with React 18, Context API, and React Router

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing with protected routes
- **Context API** - State management for authentication and data
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with flexbox/grid layouts

## Prerequisites

- Node.js 16+ and npm
- Personal Finance API running on `http://localhost:3000`

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Open in browser**: Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Navbar.js       # Navigation component
│   ├── Navbar.css      # Navigation styles
│   └── ProtectedRoute.js # Route protection component
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication context and hooks
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Dashboard overview
│   ├── Transactions.js # Transaction management
│   ├── Budgets.js      # Budget tracking
│   └── Auth.css        # Authentication page styles
├── services/           # API services
│   └── api.js          # Axios configuration and interceptors
├── App.js              # Main application component
├── App.css             # Global styles
└── index.js            # Application entry point
```

## Features Overview

### Authentication System
- JWT-based authentication with automatic token management
- Registration and login forms with validation
- Protected routes that require authentication
- Automatic redirect to login on token expiration
- Context-based authentication state management

### Dashboard
- Financial overview with key metrics:
  - Total balance calculation
  - Monthly income tracking
  - Monthly expense tracking
  - Active budget count
- Recent transactions preview
- Quick navigation to detailed sections

### Transaction Management
- **Add Transactions**: Create new income or expense entries
- **View All Transactions**: List all transactions with sorting
- **Filter Transactions**: Filter by income/expense type
- **Delete Transactions**: Remove unwanted transactions
- **Transaction Details**: Description, amount, category, and date
- **Real-time Updates**: Immediate UI updates after operations

### Budget Management
- **Create Budgets**: Set spending limits for categories
- **Visual Progress**: Progress bars showing spending vs budget
- **Alert System**: Color-coded warnings when approaching limits
- **Budget Status**: Track if on track, approaching limit, or over budget
- **Active/Inactive**: Toggle budgets on and off
- **Delete Budgets**: Remove outdated budget categories

## API Integration

The frontend communicates with the Personal Finance API:

- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: JWT token in Authorization header
- **Automatic Error Handling**: Logout on 401 responses
- **Request Interceptors**: Automatic token attachment

### API Endpoints Used
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get current user profile
- `GET /transactions` - Fetch all transactions
- `POST /transactions` - Create new transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /budgets` - Fetch all budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

## Development

### Authentication Flow
1. User submits login/registration form
2. API returns JWT token and user data
3. Token stored in localStorage
4. AuthContext provides authentication state
5. Protected routes check authentication status
6. Automatic logout on token expiration

### State Management
- **AuthContext**: Manages user authentication state
- **Local State**: Component-level state for forms and data
- **Real-time Updates**: Optimistic UI updates for better UX

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Flexible layouts using CSS Grid and Flexbox
- Touch-friendly interface elements
- Consistent spacing and typography

## Browser Support

- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

## License

MIT License
