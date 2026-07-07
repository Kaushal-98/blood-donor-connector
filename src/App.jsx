import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Badges from './pages/Badges'
import ProfileSetup from './pages/ProfileSetup'
import HealthTips from './pages/HealthTips'
import PostRequest from './pages/PostRequest'
import Requests from './pages/Requests'
import RequestDetail from './pages/RequestDetail'
import Dashboard from './pages/Dashboard'
import NearbyDonors from './pages/NearbyDonors'
import NearbyHospitals from './pages/NearbyHospitals'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/health-tips" element={<ProtectedRoute><HealthTips /></ProtectedRoute>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/post-request" element={<ProtectedRoute><PostRequest /></ProtectedRoute>} />
      <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/nearby-donors" element={<ProtectedRoute><NearbyDonors /></ProtectedRoute>} />
      <Route path="/nearby-hospitals" element={<ProtectedRoute><NearbyHospitals /></ProtectedRoute>} />
      <Route path="/chat/:responseId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    </Routes>
  )
}

export default App