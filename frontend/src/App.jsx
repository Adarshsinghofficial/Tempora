// src/App.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between py-4 px-6">
          <h1 className="text-2xl font-extrabold text-gray-800">Tempora</h1>
          <nav className="space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Upload
            </NavLink>
            <NavLink
              to="/download"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Download
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6 bg-gray">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} Tempora. All rights reserved.
      </footer>
    </div>
  );
}
