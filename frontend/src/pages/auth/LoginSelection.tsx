import { Link } from 'react-router-dom';

function LoginSelection(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">LOGIN PORTAL</h1>
        </div>

        {/* Login Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
          {/* User Login Button */}
          <Link to="/login-user">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl px-12 py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[240px]">
              USER LOGIN
            </button>
          </Link>

          {/* Store Login Button */}
          <Link to="/login-store">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[240px]">
              STORE LOGIN
            </button>
          </Link>

          {/* Admin Login Button */}
          <Link to="/login-admin">
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold text-xl px-12 py-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[240px]">
              ADMIN LOGIN
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">© 2026 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
