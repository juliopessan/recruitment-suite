# Recruitment Suite - React Frontend

Modern, responsive web UI for the Recruitment Suite candidate evaluation system.

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running at http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── common/          # Shared components (Button, Card, etc.)
│   └── layouts/         # Layout components (MainLayout, AuthLayout)
├── pages/               # Page components
│   ├── candidates/      # Candidate management pages
│   ├── jobs/            # Job management pages
│   └── evaluations/     # Evaluation pages
├── services/            # API client and services
├── store/               # Redux state management
│   └── slices/          # Redux slices for different features
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── styles/              # Global styles
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Type check
npm run type-check
```

## Key Features

### Authentication
- Login/logout functionality
- JWT token management
- Protected routes

### Candidate Management
- View all candidates with pagination
- Create new candidates
- Edit candidate information
- Delete candidates
- Search and filter

### Job Management
- List all job openings
- Create new jobs
- Edit job details
- Delete jobs
- Search by title/company

### Evaluations
- Run evaluations for candidates
- View evaluation results
- Score breakdown visualization
- Recommendation status (GO/HOLD/NO_GO)
- Evaluation history

### Dashboard
- Overview metrics
- Recent candidates
- Recent jobs
- Success rates
- Quick actions

## Technology Stack

- **React** 18.2 - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Recharts** - Charts and graphs
- **React Toastify** - Notifications

## State Management

Redux is used for global state management with the following slices:

- **auth** - Authentication state and user info
- **candidates** - Candidate list and current selection
- **jobs** - Job list and current selection
- **evaluations** - Evaluation results and history
- **ui** - UI state (modals, toasts, sidebar)

## API Integration

The API client is located in `src/services/api.ts` and provides methods for:

- Candidates CRUD operations
- Jobs CRUD operations
- Running evaluations
- Retrieving evaluation results
- Getting evaluation history

All API calls automatically include JWT token in the Authorization header.

## Styling

### TailwindCSS

- Utility-first CSS framework
- Custom components defined in `src/index.css`
- Responsive design (mobile-first)
- Dark mode support (can be enabled)

### Color Scheme

- Primary: Orange (#FF5800) - Avanade brand
- Secondary: Purple/Magenta
- Accent: Green, Yellow, Red for status indicators

## Forms

React Hook Form is used for form management with validation.

Example:

```tsx
import { useForm } from 'react-hook-form'

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>Name is required</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Type Safety

TypeScript types are defined in `src/types/index.ts`:

- `Candidate` - Candidate profile
- `Job` - Job opening
- `Evaluation` - Evaluation result
- `User` - User authentication
- `AuthState` - Auth redux state

## Routing

React Router v6 is used for navigation with the following routes:

```
/                   - Dashboard
/login             - Login page
/candidates        - Candidates list
/candidates/new    - Create candidate
/candidates/:id    - View candidate
/candidates/:id/edit - Edit candidate
/jobs              - Jobs list
/jobs/new          - Create job
/jobs/:id          - View job
/jobs/:id/edit     - Edit job
/evaluations       - Evaluations list
/evaluations/:id   - View evaluation
```

## Error Handling

- API errors are caught and displayed via toast notifications
- Form validation errors are shown inline
- Network errors are handled gracefully
- Unauthorized access (401) redirects to login

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_PATH=/api
VITE_APP_TITLE=Recruitment Suite
```

## Development Workflow

1. Create a feature branch
2. Make changes in components/pages/services
3. Test locally with `npm run dev`
4. Run linting with `npm run lint`
5. Run type check with `npm run type-check`
6. Commit and push

## Performance Optimization

- Code splitting by routes
- Lazy loading of components
- Memoization of expensive components
- Efficient Redux selectors
- Asset optimization with Vite

## Testing

Tests are written with Vitest and React Testing Library:

```bash
npm run test              # Run tests
npm run test:ui          # Run with UI
npm run test:coverage    # Coverage report
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deploy to Server

```bash
# Option 1: Static hosting (Vercel, Netlify, etc.)
# Upload dist folder

# Option 2: Server with Node.js
npm install -g serve
serve -s dist

# Option 3: Docker
docker build -t recruitment-suite-frontend .
docker run -p 3000:3000 recruitment-suite-frontend
```

## Contributing

1. Follow the project structure
2. Use TypeScript for type safety
3. Use TailwindCSS for styling
4. Keep components small and reusable
5. Add tests for new features

## Troubleshooting

### Port 3000 Already in Use

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3001,
}
```

### API Connection Issues

Ensure:
- Backend is running on `http://localhost:8000`
- `VITE_API_URL` is correctly configured in `.env`
- CORS is enabled on backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Future Enhancements

- WebSocket support for real-time updates
- Advanced analytics and charts
- Bulk operations (import/export)
- User preferences and settings
- Email notifications
- Mobile app (React Native)
- PWA support
- Offline mode

## Support

For issues or questions:
1. Check the documentation
2. Review existing issues
3. Create a new GitHub issue
4. Contact the development team

## License

MIT License - See LICENSE file in root

---

**Version:** 1.0.0  
**Status:** MVP (Minimum Viable Product)  
**Last Updated:** 2026-07-08
