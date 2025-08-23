# Overview

Serene is a meditation application built with a modern full-stack architecture. The app provides guided meditation sessions with breathing animations, ambient sounds, timer functionality, and progress tracking. It features a calming, nature-inspired design with customizable user settings for breathing patterns, sound preferences, and notifications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom color schemes for meditation themes (sage, ocean, earth)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: Modular component architecture with reusable UI components

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route handlers
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation (prepared for database integration)
- **Development Setup**: Hot reload with Vite middleware in development mode

## Data Storage Solutions
- **Current Implementation**: In-memory storage using Maps for sessions and settings
- **Database Ready**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Schema Design**: 
  - Meditation sessions table with duration, sounds, completion status
  - User settings table with breathing preferences, sound volumes, notifications
- **Migration Support**: Drizzle Kit configured for database migrations

## Key Features Architecture
- **Timer System**: Custom meditation timer hook with session tracking
- **Audio Management**: Web Audio API integration for ambient sounds with volume controls
- **Breathing Animation**: Configurable breathing patterns (4-7-8, 4-4-4-4, 6-2-6-2)
- **Progress Tracking**: Session statistics including total minutes, session count, and streak tracking
- **Responsive Design**: Mobile-first approach with adaptive navigation

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for server production builds
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Error Handling**: Centralized error handling with toast notifications
- **Performance**: Query caching and optimistic updates for responsive user experience

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI components for accessibility
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **express**: Web application framework for Node.js
- **vite**: Build tool and development server

## Database Integration
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-kit**: Database migration and introspection tools
- **connect-pg-simple**: PostgreSQL session store (prepared for future use)

## UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

## Development Tools
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment

## Audio and Media
- **embla-carousel-react**: Carousel component for sound selection
- Web Audio API (native browser API for audio processing)

## Form and Validation
- **@hookform/resolvers**: Form validation resolvers
- **drizzle-zod**: Zod integration for schema validation
- **zod**: TypeScript-first schema validation

The application is designed to be easily deployable and scalable, with clear separation between frontend and backend concerns, and preparation for database integration when needed.