import React from 'react'
import { Route, BrowserRouter as Router, Routes} from 'react-router'
import Register from './pages/usermanagment/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './pages/usermanagment/Login';
import Dashboard from './pages/dashboard/page/Dasbboard';
import Forecast from './pages/dashboard/page/forecast';
import Dashboardv2 from './pages/dashboard/page/dash_v2';
import Taskboard from './pages/task/page/Taskboard';
import Taskboardv2 from './pages/task/page/tasv2';

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/register' element={<Register></Register>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login></Login>} />
        <Route path='/forecast' element={<Forecast />} />
        <Route path='/dashboardv2' element={<Dashboardv2 />} />
        <Route path='/taskboard' element={<Taskboard />} />
        <Route path='/taskv2' element={<Taskboardv2 />} />
      </Routes>
    </Router>
  )
}

export default App