import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import PostDetail from './pages/PostDetail.jsx';
import MyPosts from './pages/MyPosts.jsx';
import AddPost from './pages/AddPost.jsx';

const router = createBrowserRouter([

  {
    path: "/", element: <App />,

    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute authentication={false}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute authentication={false}>
            <Login />
          </ProtectedRoute>
        )
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute authentication={false}>
            <Register />
          </ProtectedRoute>
        )
      },
      {
        path: "/forgot-password",
        element:
          (
            <ProtectedRoute authentication={false}>
              <ForgotPassword />
            </ProtectedRoute>
          )
      },
      {
        path: "/reset-password/:token",
        element:
          (
            <ProtectedRoute authentication={false}>
              <ResetPassword />
            </ProtectedRoute>
          )
      },
      {
        path: "/verify-email/:token",
        element: (
          <ProtectedRoute authentication={false}>
            <VerifyEmail />
          </ProtectedRoute>
        )

      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute authentication={true}>
            <Profile />
          </ProtectedRoute>
        )
      },

      {
        path: "/my-posts",
        element: (
          <ProtectedRoute authentication={true}>
            <MyPosts />
          </ProtectedRoute>
        )
      },

      {
        path: "/posts/:postId",
        element: (
          <ProtectedRoute authentication={false}>
            <PostDetail />
          </ProtectedRoute>
        )
      },

      {
        path: "/add-post",
        element: (
          <ProtectedRoute authentication={true}>
            <AddPost/>
          </ProtectedRoute>
        )
      },

      {
        path: "/edit-post/:postId",
        element: (
          <ProtectedRoute authentication={true}>
            <AddPost/>
          </ProtectedRoute>
        )
      },

      {
        path: '*',
        element: <NotFound />
      }
    ]

  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
