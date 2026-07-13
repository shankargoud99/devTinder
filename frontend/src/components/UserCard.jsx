const UserCard = ({ user, onInterested, onIgnore, actionsDisabled }) => {
  if (!user) return null;
  const { firstName, lastName, age, gender, about, skills, photoUrl } = user;

  return (
    <div className="dc-card p-6 flex flex-col items-center text-center max-w-sm w-full mx-auto">
      <div className="avatar mb-4">
        <div className="w-24 rounded-full ring-2" style={{ "--tw-ring-color": "var(--dc-border)" }}>
          <img src={photoUrl} alt={firstName} />
        </div>
      </div>

      <h2 className="font-display text-xl font-semibold">
        {firstName} {lastName}
      </h2>
      {(age || gender) && (
        <p className="text-sm mt-0.5" style={{ color: "var(--dc-text-muted)" }}>
          {age && `${age}`}
          {age && gender && " · "}
          {gender}
        </p>
      )}

      {about && (
        <p className="text-sm mt-3" style={{ color: "var(--dc-text-muted)" }}>
          {about}
        </p>
      )}

      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      {(onInterested || onIgnore) && (
        <div className="flex gap-3 mt-6 w-full">
          {onIgnore && (
            <button
              disabled={actionsDisabled}
              className="btn flex-1 border"
              style={{ background: "transparent", borderColor: "var(--dc-border)", color: "var(--dc-text-muted)" }}
              onClick={() => onIgnore(user._id)}
            >
              Ignore
            </button>
          )}
          {onInterested && (
            <button
              disabled={actionsDisabled}
              className="btn flex-1 border-none"
              style={{ background: "var(--dc-accent)", color: "#06170d" }}
              onClick={() => onInterested(user._id)}
            >
              Interested
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
