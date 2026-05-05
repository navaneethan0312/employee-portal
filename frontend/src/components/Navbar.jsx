export default function Navbar({ title }) {
  const username = localStorage.getItem('username')
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {username?.[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-gray-600">{username}</span>
      </div>
    </header>
  )
}
