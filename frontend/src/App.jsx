import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { SendMoney } from "./pages/SendMoney"
import { Dashboard } from "./pages/Dashboard"
import { Transactions } from "./pages/Transactions"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard or signup based on auth */}
        <Route path="/" element={
          localStorage.getItem("token")
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/signup" replace />
        } />

        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />

        {/* Protected Routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/send' element={
          <ProtectedRoute>
            <SendMoney />
          </ProtectedRoute>
        } />
        <Route path='/transactions' element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
