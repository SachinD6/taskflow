import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlineShieldCheck } from "react-icons/hi";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <HiOutlineViewGrid size={22} />
                <span>TaskFlow</span>
            </div>
            <div className="navbar-links">
                <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                >
                    Dashboard
                </Link>
                {isAdmin && (
                    <span className="admin-badge">
                        <HiOutlineShieldCheck size={14} />
                        Admin
                    </span>
                )}
            </div>
            <div className="navbar-right">
                <span className="user-greeting">Hey, {user.name?.split(" ")[0]}</span>
                <button onClick={handleLogout} className="btn-logout">
                    <HiOutlineLogout size={18} />
                    Logout
                </button>
            </div>
        </nav>
    );
}
