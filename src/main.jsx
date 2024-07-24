import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import Login from './routes/Login'
import '../src/assets/styles/main.css'
import ProtectedRoute from './routes/ProtectedRoute'
import Menu from './routes/Menu'
import { AuthProvider } from './auth/AuthProvider'
import { RouterProvider, createBrowserRouter, Route } from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/menu",
        element: <Menu />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
