import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";

import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { isClerkLoaded, isSignedIn } = useAuthReq();

  // Sync user with backend
  useUserSync();

  // Wait for Clerk to load
  if (!isClerkLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={isSignedIn ? <ProfilePage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/create"
            element={isSignedIn ? <CreatePage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/edit/:id"
            element={
              isSignedIn ? <EditProductPage /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;