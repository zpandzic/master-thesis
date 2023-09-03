import Container from '@mui/material/Container';
import React from 'react';
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';
import UserContextProvider from './context/UserContextProvider';
import { Home, Login, MyFilters, MyPortal, MyPosts, Register } from './pages';
import { Categories, CreateCategoryForm, CreatePost, Layout } from './components';

// Create a browser router with a fallback component for unmatched routes
const router = createBrowserRouter([{ path: '*', Component: Root }]);

// Root component containing all the routes
function Root() {
  return (
    <Layout>
      {/* Define the application routes */}
      <Routes>
        {/* Category related routes */}
        <Route path="/categories/create" element={<CreateCategoryForm />} />
        <Route path="/categories/:id/edit" element={<CreateCategoryForm />} />
        <Route path="/categories/:id" element={<Categories />} />
        <Route path="/categories" element={<Categories />} />

        {/* Post related routes */}
        <Route path="/post/create/:categoryId" element={<CreatePost />} />

        {/* User related routes */}
        <Route path="/filters" element={<MyFilters />} />
        <Route path="/posts" element={<MyPosts />} />
        <Route path="/posts/:postId" element={<MyPosts />} />
        <Route path="/portal" element={<MyPortal />} />

        {/* Authentication related routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home route */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}

// Main App component
export default function App() {
  return (
    <Container maxWidth="lg">
      {/* Wrap the entire application in User Context Provider for state management */}
      <UserContextProvider>
        {/* Provide router functionality to the application */}
        <RouterProvider router={router} />
      </UserContextProvider>
    </Container>
  );
}
