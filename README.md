# AI Health & Wellbeing Weight Tracker App

A Progressive Web App (PWA) for tracking weight and visualizing progress over time, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Core Functionality](#core-functionality)
  - [Authentication](#authentication)
  - [Weight Tracking](#weight-tracking)
  - [Data Visualization](#data-visualization)
- [Key Components](#key-components)
- [Database](#database)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Performance Features](#performance-features)
- [User Experience Improvements](#user-experience-improvements)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Overview

This app allows users to track their weight over time, visualize progress through charts, and monitor key metrics such as current weight, 30-day change, total change, and average weight. It's built as a Progressive Web App, allowing for installation on devices for offline access.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form
- **Data Visualization**: Chart.js with react-chartjs-2
- **Date Handling**: date-fns
- **Date Picker**: react-datepicker
- **Schema Validation**: Zod
- **PWA Support**: next-pwa

## Project Structure

```
ai-health-wellbeing-app/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── components/         # React components
│   ├── diagnostic/         # Diagnostic pages
│   ├── lib/                # Core utilities and functions
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── db.ts           # Database operations
│   │   ├── schema.sql      # Database schema
│   │   ├── supabase.ts     # Supabase client setup
│   │   └── types.ts        # TypeScript type definitions
│   ├── reset-password/     # Password reset pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Main app page
├── public/                 # Static assets
├── .env.local              # Environment variables (create from sample)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16.8.0 or later)
- npm or yarn
- Supabase account (for database and authentication)

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-health-wellbeing-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Database Setup

1. Create a new Supabase project
2. Execute the schema in `app/lib/schema.sql` to create the necessary tables
3. Set up authentication providers in the Supabase dashboard

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Core Functionality

### Authentication

The app uses Supabase Authentication with the following features:
- Email/password signup and signin
- Password reset functionality
- Auth state persistence
- Protected routes for authenticated users

Key files:
- `app/lib/auth.ts` - Authentication utility functions
- `app/components/AuthForm.tsx` - Authentication form UI

### Weight Tracking

Users can:
- Add new weight entries with a date
- View historical entries in a list with infinite scrolling
- Edit existing entries
- Delete entries
- View calculated statistics
- Entries are unique per date - adding a weight for an existing date updates the previous entry

Key files:
- `app/lib/db.ts` - Database operations for weight entries
- `app/components/WeightForm.tsx` - Form for adding/editing entries
- `app/components/WeightList.tsx` - List view of weight entries with infinite scrolling

### Data Visualization

The app visualizes weight data through:
- Interactive line chart showing weight progress with time period filtering
- Statistics cards displaying key metrics

Key files:
- `app/components/WeightChart.tsx` - Chart visualization with time filtering
- `app/components/Stats.tsx` - Statistics calculation and display

## Key Components

### Main Page Component (`app/page.tsx`)

The root component that manages:
- Authentication state
- Data fetching for weight entries
- CRUD operations for weight entries
- Conditional rendering based on auth state
- Optimized data handling for charts vs. lists

### Authentication Form (`app/components/AuthForm.tsx`)

Handles:
- User signup
- User signin
- Password reset requests
- Form validation

### Weight Form (`app/components/WeightForm.tsx`)

Form for:
- Adding new weight entries
- Editing existing entries
- Date selection via DatePicker
- Form validation with React Hook Form
- Detects and shows notification when updating existing entries
- Auto-scrolls to the form when adding new entries

### Dashboard Tabs (`app/components/DashboardTabs.tsx`)

Toggles between:
- Chart view (visualization)
- List view (historical entries with infinite scrolling)

### Stats Component (`app/components/Stats.tsx`)

Calculates and displays:
- Current weight
- 30-day weight change (based on averaging periods for stability)
- Total change (uses 3-month or earliest weight as baseline if available)
- Average weight

### Weight Chart (`app/components/WeightChart.tsx`)

Visualizes:
- Weight progress over time using Chart.js
- Time period filtering (1 month, 3 months, 6 months, all time)
- Intelligent data sampling for large datasets
- Gradient fill for better visualization
- Interactive tooltips
- Responsive design

## Database

The app uses a single main table in Supabase:

**weight_entries**
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to auth.users)
- `weight`: float
- `date`: date
- `created_at`: timestamp

The schema can be found in `app/lib/schema.sql`.

## Authentication Flow

1. User signs up or signs in through the AuthForm
2. Supabase handles the authentication and returns a session
3. The app stores the session and updates the UI accordingly
4. Protected data is fetched using the authenticated user's ID
5. Auth state changes are managed through Supabase's auth listener

## State Management

The app uses React's useState and useEffect hooks for local state management:
- User authentication state
- Weight entries data (both paginated and complete datasets)
- UI state (active tabs, forms visibility, time periods, etc.)

## Performance Features

The app includes several performance optimizations:

### Infinite Scrolling
- Implemented in the weight history list view
- Uses Intersection Observer API for efficient scroll detection
- Loads more entries as the user scrolls to the bottom
- Reduces initial load time and improves performance

### Paginated Database Queries
- Database queries use pagination with Supabase's range queries
- Only fetches data that's currently needed instead of entire dataset
- Combines efficient data loading for list view with comprehensive data for charts

### Optimized Chart Rendering
- Time period filtering (1M, 3M, 6M, All) to focus on relevant data
- Data point sampling for large datasets to maintain performance
- Dynamic scaling of chart display based on data density
- Uses separate optimized dataset for visualization

## User Experience Improvements

- Floating action button (FAB) for easily adding weight entries from anywhere in the app
- Responsive mobile-friendly design for authentication forms
- Auto-scrolling to entry form when adding new weights
- Intelligent date handling preventing duplicate entries
- Visual feedback when updating existing entries
- Confirmation dialogs when actions would affect existing data
- Optimized input fields and buttons for mobile devices
- Improved 30-day change calculation based on averaging periods for more stable metrics
- Unique entries per date to maintain data integrity

## Common Tasks

### Adding a New Feature

1. Identify which component(s) need modification
2. Update the relevant files in the `components` directory
3. If it involves data, update the database operations in `lib/db.ts`
4. If it involves types, update `lib/types.ts`

### Modifying the Database Schema

1. Update the schema in `lib/schema.sql`
2. Apply changes to your Supabase project
3. Update the TypeScript types in `lib/types.ts`
4. Update any affected database operations in `lib/db.ts`

### Styling Changes

The app uses Tailwind CSS for styling:
1. Modify the global styles in `globals.css`
2. Update component-specific styles in the respective component files
3. For theme customization, edit `tailwind.config.ts`

## Troubleshooting

### Authentication Issues

- Check Supabase connection in the diagnostic page (`/diagnostic`)
- Verify environment variables are set correctly
- Check browser console for any errors
- The app includes a "Force Sign Out" button for stuck authentication states

### Database Connection Issues

- Ensure Supabase URL and key are correct in `.env.local`
- Check if the tables exist in your Supabase project
- Verify database permissions in Supabase dashboard

### Performance Issues

- If chart rendering is slow, try using a shorter time period filter
- For very large datasets, the app automatically samples data points
- Check network requests to ensure pagination is working correctly

## Future Enhancements

Potential areas for expansion:
- Add multiple metrics tracking (body measurements, exercise, etc.)
- Implement goal setting and progress tracking
- Add data export functionality
- Enhance visualization with more chart types
- Add user preferences (metric/imperial units, dark mode, etc.)
- Implement social sharing features
- Add notifications and reminders