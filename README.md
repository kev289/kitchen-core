# GourmetDev

A Next.js application for sharing recipes with user authentication, favorites, and email notifications.

## Overview

This project uses:
- Next.js 16 with the App Router
- React 19 and TypeScript
- MongoDB with Mongoose
- JWT-based authentication with access and refresh tokens
- Protected API routes and page access control
- Google OAuth2 email sending via Nodemailer
- A shared `AuthProvider` and `FavoritesProvider`

## Features

- Public recipe feed on `/`
- View full recipe details at `/recipes/[id]`
- User registration on `/register`
- User login on `/login`
- Favorite recipes via `/favorites`
- Create a new recipe on `/crear`
- Persistent auth cookies for session management
- Email welcome message after registration

## Project Structure

- `src/app/`
  - `page.tsx` - home feed
  - `recipes/[id]/page.tsx` - recipe detail page
  - `login/page.tsx` - login form
  - `register/page.tsx` - new user registration
  - `crear/page.tsx` - create recipe form
  - `favorites/page.tsx` - saved favorites list
  - `api/` - route handlers for auth, recipes, and favorites
  - `layout.tsx` - application layout and providers
- `src/components/`
  - `Navbar.tsx` - top navigation bar
  - `RecipeCard.tsx` - recipe preview card
  - `FavoriteButton.tsx` - favorite toggle button
- `src/context/`
  - `AuthContext.tsx` - client auth state and session checks
  - `FavoritesContext.tsx` - favorite recipe state
- `src/services/`
  - `auth.service.ts` - registration and login logic
  - `recipe.service.ts` - recipe CRUD operations
  - `favorite.service.ts` - favorite toggle logic
  - `email.service.ts` - Gmail OAuth email sending
- `src/lib/`
  - `mongodb.ts` - MongoDB singleton connection
  - `auth.ts` - JWT generation, verification, and password hashing
  - `validations.ts` - Zod schemas for request validation
- `src/models/`
  - `User.ts` - user schema
  - `Recipe.ts` - recipe schema
  - `Favorite.ts` - favorite schema

## API Routes

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - authenticate and set cookies
- `POST /api/auth/logout` - clear auth cookies
- `GET /api/auth/me` - return current user based on cookie
- `GET /api/recipes` - list recipes
- `POST /api/recipes` - create recipe (authenticated)
- `GET /api/recipes/[id]` - get recipe detail
- `GET /api/favorites` - get user favorites
- `POST /api/favorites` - toggle favorite recipe

## Data Models

### User
- `name`
- `email`
- `password`

### Recipe
- `name`
- `image`
- `preparationTime`
- `difficulty`
- `ingredients`
- `steps`
- `servings`
- `author`

### Favorite
- `userId`
- `recipeId`

## Environment Variables

Create a `.env` file with these values:

```bash
MONGODB_URI=<your mongodb connection string>
JWT_SECRET=<your jwt secret>
NEXT_PUBLIC_API_URL=http://localhost:3000
EMAIL_CLIENT_ID=<google oauth client id>
EMAIL_CLIENT_SECRET=<google oauth client secret>
EMAIL_REFRESH_TOKEN=<google oauth refresh token>
EMAIL_FROM=<sender email address>
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- `src/proxy.ts` contains middleware rules for public and protected routes.
- `src/app/layout.tsx` wraps every page in the auth and favorites providers.
- Comments in source files are now English-only.
