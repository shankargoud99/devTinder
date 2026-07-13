import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { addConnections } from "../redux/slices/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await api.get("/user/connections");
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connections) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots" style={{ color: "var(--dc-accent)" }}></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-lg">No connections yet</p>
        <p className="text-sm mt-1" style={{ color: "var(--dc-text-muted)" }}>
          Accepted requests will show up here — head to the feed to find developers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto py-4">
      <h1 className="font-display text-xl font-semibold mb-2">Your connections</h1>
      {connections.map((conn) => (
        <Link
          key={conn._id}
          to={`/chat/${conn._id}`}
          className="dc-card p-4 flex items-center gap-4 branch-line state-connected hover:opacity-90"
        >
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={conn.photoUrl} alt={conn.firstName} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {conn.firstName} {conn.lastName}
            </p>
            {conn.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {conn.skills.slice(0, 4).map((s) => (
                  <span key={s} className="skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm" style={{ color: "var(--dc-accent)" }}>
            Message →
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Connections;
