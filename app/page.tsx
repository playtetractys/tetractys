import { WaitlistContextProviderComponent } from "@/contexts/waitlistContext";

import { InitialStory } from "@/components/initial-story";

export default function Home() {
  return (
    <div className="grow w-full flex flex-col justify-around items-center pb-2">
      <WaitlistContextProviderComponent>
        <InitialStory />
      </WaitlistContextProviderComponent>
    </div>
  );
}
