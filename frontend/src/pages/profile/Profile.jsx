import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserInfo, updateUserPassword, deleteUser } from '../../api/userApi';
import Sidebar from '../dashboard/components/Sidebar';
import Header from '../dashboard/components/Header';
import { LogOut, Trash2, User, Mail, Shield } from 'lucide-react';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=User&background=34A853&color=fff&size=128';

const Profile = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', role: 'User', joinDate: '2024-01-01', lastLogin: '2024-06-01 12:00' });
  const [editUser, setEditUser] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatar, setAvatar] = useState(AVATAR_PLACEHOLDER);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [passwordDialogError, setPasswordDialogError] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setUser({
          name: data.username,
          email: data.email,
          role: data.role || 'User',
          joinDate: data.joinDate || '2024-01-01',
          lastLogin: data.lastLogin || '2024-06-01 12:00',
        });
        setEditUser({ name: data.username, email: data.email });
        setAvatar(data.profilePicture || AVATAR_PLACEHOLDER);
      } catch (err) {
        setError('Failed to load user info.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleUserChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateUserInfo(editUser);
      setUser({ ...user, ...editUser });
      setMessage('Profile updated successfully!');
      setShowInfoModal(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Add a helper function for password strength
  const isStrongPassword = (password) => {
    // At least 8 chars, one uppercase, one lowercase, one number, one special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (!isStrongPassword(passwords.newPassword)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      setLoading(false);
      return;
    }
    try {
      await updateUserPassword(passwords.oldPassword, passwords.newPassword);
      setMessage('Password updated successfully!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (err) {
      setError('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowInfoModal(false);
    setShowPasswordModal(false);
    setShowDeleteModal(false);
    setMessage('');
    setError('');
    setEditUser({ name: user.name, email: user.email });
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#34A853" />
          <circle cx="350" cy="350" r="60" fill="#60A5FA" />
          <rect x="200" y="50" width="120" height="120" rx="60" fill="#A7F3D0" />
        </svg>
      </div>
      <Sidebar sidebarCollapsed={sidebarCollapsed} className="bg-green-100 z-10" />
      <div className="flex-1 flex flex-col z-10">
        <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title="Profile" className="bg-green-50" />
        <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-green-100 relative">
            {/* Avatar - Display only */}
            <div className="mb-4">
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full border-4 border-green-200 shadow object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-1 flex items-center justify-center gap-2"><User className="w-6 h-6 text-green-400" />{user.name || 'User Name'}</h2>
            <p className="text-green-700 text-sm flex items-center justify-center gap-2"><Mail className="w-4 h-4 text-green-300" />{user.email || 'user@email.com'}</p>
            <div className="flex flex-col gap-2 mt-4 w-full items-center">
              <span className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded"><Shield className="w-4 h-4 text-green-400" />Role: {user.role}</span>
            </div>
            {/* Action Buttons */}
            <div className="w-full flex flex-col space-y-4 mt-8">
              <button
                className="w-full flex items-center justify-between p-5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 shadow transition-colors text-green-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => { setShowInfoModal(true); setMessage(''); setError(''); }}
                tabIndex={0}
                title="Edit your profile information"
              >
                <span className="flex items-center gap-2"><User className="w-5 h-5 text-green-400" />Update Info</span>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                className="w-full flex items-center justify-between p-5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 shadow transition-colors text-green-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => { setShowPasswordModal(true); setMessage(''); setError(''); }}
                tabIndex={0}
                title="Change your password"
              >
                <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />Change Password</span>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                className="w-full flex items-center justify-between p-5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 shadow transition-colors text-red-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => { setShowDeleteModal(true); setMessage(''); setError(''); }}
                tabIndex={0}
                title="Delete your account"
              >
                <span className="flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-400" />Delete Account</span>
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                className="w-full flex items-center justify-between p-5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow transition-colors text-gray-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleLogout}
                tabIndex={0}
                title="Logout from your account"
              >
                <span className="flex items-center gap-2"><LogOut className="w-5 h-5 text-gray-400" />Logout</span>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Modals (unchanged) */}
          {showInfoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl" onClick={closeModals}>&times;</button>
                <h3 className="text-xl font-bold text-green-800 mb-4">Update Info</h3>
                {message && <div className="text-green-600 mb-2">{message}</div>}
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <form onSubmit={handleUserSubmit} className="flex flex-col space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-green-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editUser.name}
                      onChange={handleUserChange}
                      className="w-full border border-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-green-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser.email}
                      onChange={handleUserChange}
                      className="w-full border border-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      type="button"
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      onClick={() => {
                        setPendingUpdate({ ...editUser });
                        setShowPasswordDialog(true);
                        setPasswordDialogError('');
                        setConfirmPassword('');
                        setPasswordAttempts(0);
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex-1 font-semibold"
                      onClick={closeModals}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showPasswordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl" onClick={closeModals}>&times;</button>
                <h3 className="text-xl font-bold text-green-800 mb-4">Change Password</h3>
                {(message || error) && (
                  <div className={`w-full px-3 py-2 mb-3 text-sm text-center rounded ${message ? 'text-green-600 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>
                    {message || error}
                  </div>
                )}
                {passwordAttempts > 0 && passwordAttempts < 3 && (
                  <div className="w-full text-xs text-gray-500 text-center mb-2">
                    {`Attempt ${passwordAttempts} of 3`}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit} className="flex flex-col space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-green-700">Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwords.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-green-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                  {!message && !error && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                    <div className="w-full text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3 text-sm text-center">
                      Passwords do not match.
                    </div>
                  )}
                  {!message && !error && passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && !isStrongPassword(passwords.newPassword) && (
                    <div className="w-full text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3 text-sm text-center">
                      Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                    </div>
                  )}
                  <div>
                    <label className="block mb-1 font-medium text-green-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-green-200 px-3 py-2 rounded focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex-1 font-semibold"
                      disabled={loading}
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex-1 font-semibold"
                      onClick={closeModals}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl" onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}>&times;</button>
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2"><Trash2 className="w-6 h-6 text-red-400" />Delete Account</h3>
                <p className="mb-4 text-red-700">Are you sure you want to delete your account? This action cannot be undone.</p>
                {deleteError && (
                  <div className="w-full text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3 text-sm text-center">
                    {deleteError}
                  </div>
                )}
                <input
                  type="password"
                  className="w-full border border-red-200 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex-1 font-semibold"
                    disabled={deleteLoading || !deletePassword}
                    onClick={async () => {
                      setDeleteError('');
                      setDeleteLoading(true);
                      try {
                        await deleteUser(deletePassword);
                        // Log out: clear tokens and redirect
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        setShowDeleteModal(false);
                        setDeletePassword('');
                        setDeleteError('');
                        setDeleteLoading(false);
                        // Optionally show a message, then redirect
                        window.location.href = '/login';
                      } catch (err) {
                        setDeleteError(err?.response?.data?.message || 'Failed to delete account. Please check your password.');
                        setDeleteLoading(false);
                      }
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex-1 font-semibold"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showPasswordDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4 text-green-800">Confirm Password</h2>
                {passwordDialogError && (
                  <div className="w-full text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3 text-sm text-center">
                    {passwordDialogError}
                  </div>
                )}
                {passwordAttempts > 0 && passwordAttempts < 3 && (
                  <div className="w-full text-xs text-gray-500 text-center mb-2">
                    {`Attempt ${passwordAttempts} of 3`}
                  </div>
                )}
                <input
                  type="password"
                  className="w-full border border-green-200 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <div className="flex gap-4 w-full">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    onClick={async () => {
                      if (!pendingUpdate) return;
                      setLoading(true);
                      setPasswordDialogError('');
                      try {
                        await updateUserInfo({ ...pendingUpdate, password: confirmPassword });
                        setUser({ ...user, ...pendingUpdate });
                        setMessage('Profile updated successfully!');
                        setShowInfoModal(false);
                        setShowPasswordDialog(false);
                        setConfirmPassword('');
                        setPendingUpdate(null);
                        setPasswordAttempts(0);
                        setPasswordDialogError('');
                      } catch (err) {
                        const backendMsg = err?.response?.data?.message || 'Failed to update profile. Please check your password.';
                        setPasswordDialogError(backendMsg);
                        setPasswordAttempts(prev => {
                          const next = prev + 1;
                          if (next >= 3) {
                            setShowPasswordDialog(false);
                            setConfirmPassword('');
                            setPendingUpdate(null);
                            setTimeout(() => setPasswordAttempts(0), 500); // reset after closing
                            setPasswordDialogError('');
                          }
                          return next;
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="flex-1 bg-gray-200 text-green-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setConfirmPassword('');
                      setPendingUpdate(null);
                      setPasswordDialogError('');
                      setPasswordAttempts(0);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile; 