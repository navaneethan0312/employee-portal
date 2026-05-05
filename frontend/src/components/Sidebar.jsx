import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/employees', label: 'Employees', icon: '👥' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="w-60 bg-blue-700 text-white flex flex-col py-6">
      <div className="px-6 mb-8">
        <div className="text-xl font-bold">Employee Portal</div>
        <div className="text-blue-200 text-xs mt-1">Management System</div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive ? 'bg-white text-blue-700' : 'text-blue-100 hover:bg-blue-600'}`}>
            <span>{link.icon}</span>{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 mt-4">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-100 hover:bg-blue-600 transition">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  )
}
