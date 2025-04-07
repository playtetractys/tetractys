import { WaitlistContextProviderComponent } from "@/contexts/waitlistContext";

import { InitialStory } from "@/components/initial-story";

export default function Home() {
  return (
    <WaitlistContextProviderComponent>
      <InitialStory />
    </WaitlistContextProviderComponent>
  );
}
