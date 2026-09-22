import { Outlet } from 'react-router'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout

// Outlet -Render the matching child route of the parent route. - In beginner language:Put the correct page here.