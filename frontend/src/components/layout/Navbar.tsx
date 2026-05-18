import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, User as UserIcon, Sun, Moon, LayoutDashboard, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass fixed left-0 right-0 top-0 z-50 px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              GigFlow
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/10 text-sm font-medium transition-colors">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/10 text-foreground/70 hover:text-primary transition-all active:scale-95"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-4 pl-2 border-l border-border/50">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold leading-tight">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{user.role}</span>
              </div>
              
              <div className="relative group">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-white shadow-lg group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                  <UserIcon size={18} />
                </button>
                
                {/* Profile Dropdown Simulation */}
                <div className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200">
                  <div className="px-4 py-2 border-b border-border/50 mb-1">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
