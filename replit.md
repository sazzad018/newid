# Advanced Teacher ID Card Generator

## Overview

This is a comprehensive teacher ID card generator application built with a modern full-stack architecture. The application allows users to create professional teacher ID cards with customizable templates, QR codes, and batch processing capabilities. It features a React frontend with TypeScript, an Express backend, and uses Drizzle ORM for database operations. The application supports both single card generation and bulk processing via CSV uploads, with advanced features like drag-and-drop editing, image cropping, and multiple export formats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Custom component library based on Radix UI primitives with Tailwind CSS for styling
- **State Management**: React Hook Form for form handling, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming and shadcn/ui component system

### Backend Architecture
- **Server**: Express.js with TypeScript running in ESM mode
- **Development Setup**: Vite middleware integration for seamless development experience
- **Storage Layer**: Abstracted storage interface with in-memory implementation, designed to be easily replaceable with database implementations
- **API Design**: RESTful API structure with `/api` prefix for all backend routes

### Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL with Neon Database serverless driver
- **Schema Design**: Comprehensive schema for teachers, card templates, QR settings, and layout configurations
- **Validation**: Zod schemas for runtime type checking and validation across client and server

### Key Features Architecture
- **Card Generation**: Multi-step form with real-time preview and canvas-based editing
- **Template System**: Configurable card templates with gradient backgrounds and customizable styling
- **QR Code Integration**: Multiple QR code types (ID, full info, custom text, URLs) with adjustable sizing
- **Image Processing**: Client-side image resizing, cropping, and optimization
- **Batch Processing**: CSV upload and parsing for bulk card generation
- **Export System**: Multiple export formats (PNG, PDF) with print optimization

### External Service Integration
- **Image Handling**: Client-side processing using HTML5 Canvas API for image manipulation
- **PDF Generation**: Client-side PDF creation using jsPDF library
- **QR Code Generation**: QRCode.js library for dynamic QR code creation
- **File Processing**: CSV parsing and processing for batch operations

### Development Tooling
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
- **Code Quality**: ESM modules throughout, modern JavaScript features
- **Hot Reload**: Vite HMR integration for development experience

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-orm**: Modern TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools
- **express**: Web framework for the backend API server
- **react**: Frontend UI library with hooks and modern patterns
- **@vitejs/plugin-react**: Vite plugin for React development and building

### UI and Styling Libraries
- **@radix-ui/***: Comprehensive collection of accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Library for creating type-safe component variants
- **clsx**: Utility for conditional CSS class names

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching library
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation library

### Specialized Libraries
- **QRCode.js**: QR code generation (loaded via CDN)
- **html2canvas**: Screenshot/image generation from DOM elements (loaded via CDN)
- **jsPDF**: Client-side PDF generation (loaded via CDN)
- **date-fns**: Date manipulation and formatting utilities
- **wouter**: Minimalist client-side routing

### Development and Build Tools
- **typescript**: Static type checking and enhanced developer experience
- **vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **postcss**: CSS post-processing for Tailwind CSS compilation

### Session and Security
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user state management