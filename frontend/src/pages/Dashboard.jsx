import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import API from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, departments: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/employees').then((res) => {
      const employees = res.data
      const active = employees.filter((e) => e.status === 'Active').length
      const departments = [...new Set(employees.map((e) => e.department))].length
      setStats({ total: employees.length, active, departments })
    })
  }, [])

  const cards = [
    { label: 'Total Employees', value: stats.total, color: 'bg-blue-600', icon: '👥' },
    { label: 'Active Employees', value: stats.active, color: 'bg-green-500', icon: '✅' },
    { label: 'Departments', value: stats.departments, color: 'bg-purple-500', icon: '🏢' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Welcome back, {localStorage.getItem('username')} 👋
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.label} className={`${card.color} text-white rounded-2xl p-6 shadow`}>
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-4xl font-bold">{card.value}</div>
                <div className="text-sm mt-1 opacity-80">{card.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <button onClick={() => navigate('/employees')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                View All Employees
              </button>
              <button onClick={() => navigate('/employees/add')}
                className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                Add New Employee
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
