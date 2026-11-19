import { Marquee } from "@/components/ui/Marquee";
import { VIBE_MESSAGES } from "@/lib/data/homepage";

/** Live vibe ticker under the hero — opposite direction from the top strip. */
export function MessageTicker() {
  return (
    <div aria-label="Party Wagon vibe messages">
      <Marquee
        messages={VIBE_MESSAGES}
        tone="rose"
        direction="right"
        scrollLinked
      />
    </div>
  );
}
