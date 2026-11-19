import { Marquee } from "@/components/ui/Marquee";
import { ANNOUNCEMENT_MESSAGES } from "@/lib/data/homepage";

export function AnnouncementBar() {
  return (
    <div aria-label="Promotional announcements">
      <Marquee
        messages={ANNOUNCEMENT_MESSAGES}
        tone="midnight"
        direction="left"
        scrollLinked
      />
    </div>
  );
}
