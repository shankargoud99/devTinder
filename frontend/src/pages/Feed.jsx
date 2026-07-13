import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { addFeed, removeUserFromFeed } from "../redux/slices/feedSlice";
import UserCard from "../components/UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const fetchFeed = async () => {
    try {
      const res = await api.get("/user/feed?page=1&limit=10");
      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!feed) fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (status, userId) => {
    try {
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!feed) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-dots" style={{ color: "var(--dc-accent)" }}></span>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-lg">No new developers right now</p>
        <p className="text-sm mt-1" style={{ color: "var(--dc-text-muted)" }}>
          Check back later — new profiles show up as more developers join.
        </p>
      </div>
    );
  }

  const [topUser] = feed;

  return (
    <div className="flex justify-center py-8">
      <UserCard
        user={topUser}
        onInterested={(id) => handleAction("interested", id)}
        onIgnore={(id) => handleAction("ignored", id)}
      />
    </div>
  );
};

export default Feed;
