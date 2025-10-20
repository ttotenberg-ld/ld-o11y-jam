# React Flask Sample Application

A full-stack application demonstrating React Error Boundaries with a Python Flask backend.

## Features

- **React Frontend** with Error Boundaries on all components
- **Python Flask Backend** with RESTful API endpoints
- **Error Handling**: Comprehensive error boundaries following React best practices
- **Sample Components**:
  - User List: Fetches and displays users from the API
  - Random Data Generator: Generates random data on demand
  - Buggy Component: Demonstrates error boundary functionality

## Project Structure

```
ld-o11y-jam/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.js      # Error boundary class component
│   │   │   ├── ErrorBoundary.css
│   │   │   ├── UserList.js           # User list component
│   │   │   ├── UserList.css
│   │   │   ├── RandomData.js         # Random data generator
│   │   │   ├── RandomData.css
│   │   │   ├── BuggyComponent.js     # Error testing component
│   │   │   └── BuggyComponent.css
│   │   ├── App.js                    # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## API Endpoints

The Flask backend provides the following endpoints:

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get a specific user by ID
- `POST /api/users` - Create a new user
- `GET /api/random-data` - Generate random data
- `GET /api/simulate-error` - Simulate server errors (for testing)

## Error Boundaries

This application demonstrates React Error Boundaries as described in the [official React documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

### Implementation Details

Each component in the application is wrapped in an ErrorBoundary component that:

1. **Catches rendering errors** in child components
2. **Displays a fallback UI** when errors occur
3. **Logs error details** to the console for debugging
4. **Provides a reset button** to recover from errors

The ErrorBoundary is implemented as a class component (required by React) and includes:

- `getDerivedStateFromError()` - Updates state to trigger fallback UI
- `componentDidCatch()` - Logs error information
- Custom fallback messages per component
- Error detail display for development

### Testing Error Boundaries

The BuggyComponent includes a button that intentionally throws an error to demonstrate how ErrorBoundary catches and handles it. Click "Trigger Error" to see the error boundary in action.

## Development

### Running Tests

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Frontend build:
```bash
cd frontend
npm run build
```

## Notes

- The frontend uses CORS to communicate with the backend
- Error boundaries only catch errors in rendering, not in event handlers or async code
- Each component has its own error boundary for isolation
- The backend includes error simulation endpoints for testing

## Learn More

- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Create React App Documentation](https://create-react-app.dev/)
