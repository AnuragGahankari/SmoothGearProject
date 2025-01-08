import React, { useContext } from 'react'
import { GarageContext } from './context/GarageContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddGarage from './pages/Admin/AddGarage';
import GaragesList from './pages/Admin/List';
import Login from './pages/Login';
import GarageAppointments from './pages/Garage/GarageAppointments';
import GarageDashboard from './pages/Garage/GarageDashboard';
import GarageProfile from './pages/Garage/GarageProfile';

const App = () => {

  const { dToken } = useContext(GarageContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-garage' element={<AddGarage />} />
          <Route path='/garage-list' element={<GaragesList />} />
          <Route path='/garage-dashboard' element={<GarageDashboard />} />
          <Route path='/garage-appointments' element={<GarageAppointments />} />
          <Route path='/garage-profile' element={<GarageProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App