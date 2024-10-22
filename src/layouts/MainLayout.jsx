import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { group, polizas, pagos2, logo } from "../assets/assets";
import AppRoutes from "../routes/AppRoutes";
import UserInfo from "../components/UserInfo";
import { useUserActions } from "../hooks/useUserActions";
import UserInfoModal from "../components/UserInfoModal";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';

function MainLayout() {
  const [selectedSection, setSelectedSection] = useState("home");
  const { handleEditProfile, handleLogout } = useUserActions();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "CLIENTES", path: "/clients", icon: group },
    { name: "POLIZAS", path: "/policies", icon: polizas },
    { name: "PAGOS", path: "/payments", icon: pagos2, className: "h-10 w-auto" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <aside className={`bg-cyan-50 shadow-xl shadow-cyan-100 md:rounded-r-3xl md:flex md:flex-col md:items-center md:w-1/5 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <Link
          to="/"
          onClick={() => {
            setSelectedSection("home");
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center justify-center p-6 mb-3 w-full hover:bg-cyan-50 transition-colors duration-200"
        >
          <img src={logo} alt="Pagos" className="h-20 w-auto" />
        </Link>
        <nav className="flex-1 w-full px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => {
                setSelectedSection(item.name.toLowerCase());
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center space-x-4 p-4 h-24 rounded-lg transition-all duration-200 ${
                selectedSection === item.name.toLowerCase()
                  ? "bg-cyan-400 text-white shadow-md"
                  : "text-gray-600 hover:bg-cyan-100 hover:text-cyan-600"
              }`}
            >
              <img src={item.icon} alt={item.name} className="h-10 w-10" />
              <span className="text-lg font-medium text-center w-24">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-cyan-50 shadow-sm px-12 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={toggleMobileMenu} className="mr-2 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Bienvenido a {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </h1>
          </div>
          <UserInfo
            user={user}
            onOpenEditModal={openEditModal}
            onLogout={() => setIsLogoutModalOpen(true)}
          />
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
              <AppRoutes openEditModal={openEditModal} />
            </div>
          </div>
        </main>
      </div>

      <UserInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        user={user}
      />
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <Toaster position="top-center" />
    </div>
  );
}

export default MainLayout;


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Link } from 'react-router-dom';
// import { group, polizas, pagos } from '../assets/assets';
// import AppRoutes from '../routes/AppRoutes';
// import UserInfo from '../components/UserInfo';

// function MainLayout() {
//   const [selectedSection, setSelectedSection] = useState('clients');

//   return (
//     <Router>
//       <div className="flex min-h-screen">
//         <aside className="w-1/5 bg-blue-50 flex flex-col items-center p-4 space-y-4">
//           <Link
//             to="/clients"
//             onClick={() => setSelectedSection('clients')}
//             className={`w-full h-24 p-4 flex flex-row justify-center gap-x-12 items-center rounded-lg shadow-md ${
//               selectedSection === 'clients' ? 'bg-gray-200' : 'bg-white'
//             }`}
//           >
//             <span className="text-base font-semibold">CLIENTES</span>
//             <img src={group} alt="Clientes" className="h-12 w-auto" />
//           </Link>

//           <Link
//             to="/policies"
//             onClick={() => setSelectedSection('policies')}
//             className={`w-full h-24 p-4 flex flex-row justify-center gap-x-12 items-center rounded-lg shadow-md ${
//               selectedSection === 'policies' ? 'bg-gray-200' : 'bg-white'
//             }`}
//           >
//             <span className="text-base font-semibold">POLIZAS</span>
//             <img src={polizas} alt="Polizas" className="h-12 w-auto" />
//           </Link>

//           <Link
//             to="/payments"
//             onClick={() => setSelectedSection('payments')}
//             className={`w-full h-24 p-4 flex flex-row justify-center gap-x-12 items-center rounded-lg shadow-md ${
//               selectedSection === 'payments' ? 'bg-gray-200' : 'bg-white'
//             }`}
//           >
//             <span className="text-base font-semibold">PAGOS</span>
//             <img src={pagos} alt="Pagos" className="h-12 w-auto" />
//           </Link>
//         </aside>

//         <main className="flex-1 p-8">
//           <AppRoutes />
//         </main>

//         <UserInfo />
//       </div>
//     </Router>
//   );
// }

// export default MainLayout;
