import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { removeUser } from "../redux/slices/userSlice";
import { disconnectSocket } from "../utils/socket";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pendingCount = requests?.length || 0;

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      // even if the API call fails, clear local state so the user isn't stuck
    } finally {
      disconnectSocket();
      dispatch(removeUser());
      navigate("/login");
    }
  };

  return (
    <div className="border-b" style={{ borderColor: "var(--dc-border)", background: "var(--dc-surface)" }}>
      <div className="navbar max-w-5xl mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span style={{ color: "var(--dc-accent)" }}>&gt;_</span>
            DevConnect
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm hover:opacity-80" style={{ color: "var(--dc-text-muted)" }}>
              Feed
            </Link>
            <Link to="/connections" className="text-sm hover:opacity-80" style={{ color: "var(--dc-text-muted)" }}>
              Connections
            </Link>
            <Link to="/requests" className="relative text-sm hover:opacity-80" style={{ color: "var(--dc-text-muted)" }}>
              Requests
              {pendingCount > 0 && (
                <span
                  className="absolute -top-2 -right-3 text-[10px] font-mono px-1.5 rounded-full"
                  style={{ background: "var(--dc-warning)", color: "#1a1200" }}
                >
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar cursor-pointer">
                <div className="w-9 rounded-full ring-1" style={{ "--tw-ring-color": "var(--dc-border)" }}>
                  <img src={user.photoUrl} alt={user.firstName} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu mt-3 z-10 w-44 p-2 rounded-box shadow"
                style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)" }}
              >
                <li className="px-3 py-1 text-xs" style={{ color: "var(--dc-text-muted)" }}>
                  {user.firstName} {user.lastName}
                </li>
                <li>
                  <Link to="/profile">Edit profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
