import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import EmployeeTable from '../components/EmployeeTable'
import API from '../api/axios'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees')
      setEmployees(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    try {
      await API.delete(`/employees/${id}`)
      setEmployees(employees.filter((e) => e._id !== id))
    } catch (err) {
      alert('Delete failed')
    }
  }

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Employees" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <input type="text" placeholder="Search by name, email, department..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={() => navigate('/employees/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
              + Add Employee
            </button>
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading...</div>
          ) : (
            <EmployeeTable employees={filtered}
              onEdit={(id) => navigate(`/employees/edit/${id}`)}
              onDelete={handleDelete} />
          )}
        </main>
      </div>
    </div>
  )
}
