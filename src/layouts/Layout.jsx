import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, LogOut, Sun, Moon, Users, Bell, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 dark:bg-slate-950 text-white flex flex-col border-r border-slate-800 dark:border-slate-800 transition-colors duration-200">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Helpdesk
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            to={`/users/${user.id}`}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname.startsWith(`/users/${user.id}`) ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <User size={20} />
            Perfil
          </Link>

          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link
            to="/tickets"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname.startsWith('/tickets') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Ticket size={20} />
            Chamados
          </Link>

          {user?.role === 'ADMIN' && (<Link
            to="/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname.startsWith('/users') && !location.pathname.startsWith(`/users/${user.id}`) ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Users size={20} />
            Usuários
          </Link>)}

          {user?.role !== 'ADMIN' && (<Link
            to="/notifications"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname.startsWith('/notifications') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bell size={20} />
            Notificações
          </Link>)}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white mb-2" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            {location.pathname === '/' ? 'Dashboard' : 'Gestão de Chamados'}
          </h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8 text-slate-900 dark:text-slate-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

