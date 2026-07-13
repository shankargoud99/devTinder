import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { addRequests, removeRequest } from "../redux/slices/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/requests/received");
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReview = async (status, requestId) => {
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!requests) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots" style={{ color: "var(--dc-accent)" }}></span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-lg">No pending requests</p>
        <p className="text-sm mt-1" style={{ color: "var(--dc-text-muted)" }}>
          Requests from interested developers will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto py-4">
      <h1 className="font-display text-xl font-semibold mb-2">Connection requests</h1>
      {requests.map((req) => {
        const from = req.fromUserId;
        return (
          <div key={req._id} className="dc-card p-4 flex items-center gap-4 branch-line state-pending">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={from.photoUrl} alt={from.firstName} />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {from.firstName} {from.lastName}
              </p>
              {from.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {from.skills.slice(0, 4).map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-sm border"
                style={{ background: "transparent", borderColor: "var(--dc-border)", color: "var(--dc-text-muted)" }}
                onClick={() => handleReview("rejected", req._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-sm border-none"
                style={{ background: "var(--dc-accent)", color: "#06170d" }}
                onClick={() => handleReview("accepted", req._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
