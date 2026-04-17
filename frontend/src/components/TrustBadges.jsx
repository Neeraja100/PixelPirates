const badges = ["No data stored permanently", "Session-based analysis only", "Delete anytime"];

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-[8px] border border-white/15 bg-white/10 px-3 py-2 text-sm text-mirror-muted"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
