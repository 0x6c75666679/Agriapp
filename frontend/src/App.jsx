import React from 'react'
import { Route, BrowserRouter as Router, Routes} from 'react-router'
import Register from './usermanagment/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './usermanagment/Login';
import Dashboard from './usermanagment/Dasbboard';
import Weather from './usermanagment/Weathercard';
import Forecast from './usermanagment/forecast';
import Dashboardv2 from './usermanagment/dash_v2';
const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/register' element={<Register></Register>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login></Login>} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/forecast' element={<Forecast />} />
        <Route path='/dashboardv2' element={<Dashboardv2 />} />
      </Routes>
    </Router>
  )
}

export default App