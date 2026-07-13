import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import api from "../utils/api";
import { addUser, removeUser } from "../redux/slices/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [checked, setChecked] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile/view");
      dispatch(addUser(res.data.data));
    } catch (err) {
      dispatch(removeUser());
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots" style={{ color: "var(--dc-accent)" }}></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
