# EdTech Course Tracker

An internal web application for tracking course updates across grades 1-12 for an EdTech company.

## Features

- **Authentication System**: Secure login with role-based access control
  - Manager: Full CRUD operations on courses
  - Employee: Read-only access
- **Course Management**: Track textbook and workbook status for all courses
- **Advanced Filtering**: Filter by grade, discipline, and completion status
- **Responsive Design**: Professional dark-themed interface optimized for all devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies, bcrypt password hashing
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository or download the ZIP file

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edtech-courses?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

Replace with your actual MongoDB connection string and a secure JWT secret.

### Database Setup

1. **Seed test users**:
\`\`\`bash
npm run seed:users
\`\`\`

This creates two test accounts:
- Manager: `manager@edtech.com` / `manager123`
- Employee: `employee@edtech.com` / `employee123`

2. **Import sample courses** (optional):
\`\`\`bash
node --loader ts-node/esm scripts/import-courses.ts
\`\`\`

This imports sample course data across all grades (1-12).

### Development

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy from v0

Click the "Publish" button in the top right of the v0 interface to deploy directly to Vercel.

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Import the repository in Vercel

3. Add environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing

4. Deploy

### Post-Deployment

After deployment, run the seed script to create initial users:

1. Connect to your deployment via terminal or use Vercel's serverless function
2. Run the seed script with your production MongoDB URI

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── courses/       # Course CRUD endpoints
│   ├── dashboard/         # Main dashboard and course pages
│   └── login/             # Login page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── course-filters.tsx
│   ├── course-form.tsx
│   ├── course-table.tsx
│   ├── dashboard-header.tsx
│   └── login-form.tsx
├── lib/
│   ├── models/            # Mongoose schemas
│   ├── auth.ts            # Authentication utilities
│   ├── mongodb.ts         # Database connection
│   └── utils.ts
├── scripts/
│   ├── seed-users.ts      # User seeding script
│   └── import-courses.ts  # Course import script
└── types/
    └── global.d.ts        # TypeScript declarations
\`\`\`

## User Roles

### Manager
- Full access to all features
- Can create, edit, update, and delete courses
- Can view all course information

### Employee
- Read-only access
- Can view all courses and filter data
- Cannot modify or delete courses

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens stored in HTTP-only cookies
- Server-side authentication with middleware
- Role-based authorization on API routes
- Secure session management

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List courses (with filters)
- `POST /api/courses` - Create course (Manager only)
- `GET /api/courses/[id]` - Get single course
- `PUT /api/courses/[id]` - Update course (Manager only)
- `DELETE /api/courses/[id]` - Delete course (Manager only)

## Importing Excel Data

To import data from the provided Excel sheet:

1. Download the Excel file
2. Open `scripts/import-courses.ts`
3. Replace the `sampleCourses` array with your actual data
4. Run the import script

Or use the xlsx library to parse the Excel file directly:

\`\`\`typescript
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('path/to/excel.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);
\`\`\`

## Support

For issues or questions, contact your system administrator.

## License

Internal use only - EdTech Company
