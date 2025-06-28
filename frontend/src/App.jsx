import React from 'react'
import { Route, BrowserRouter as Router, Routes} from 'react-router'
import Register from './usermanagment/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './usermanagment/Login';
import Dashboard from './usermanagment/Dasbboard';

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path='/register' element={<Register></Register>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login></Login>} />
      </Routes>
    </Router>
  )
}

export default App