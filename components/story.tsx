"use client";

import Image from "next/image";

// Components
import { StoryStep } from "@/components/story-step";

// Helpers
import { useAnimatedTransitionClasses } from "@/hooks/useAnimatedTransitionClasses";
import type { StoryPage, StoryStep as StoryStepType } from "@/services/types";

export function Story({
  storyPage,
  storyStep,
  handleAction,
}: {
  storyPage: StoryPage;
  storyStep: StoryStepType;
  handleAction: (actionKey: string) => void;
}) {
  const [storyPageToUse, storyPageTransitionClasses] = useAnimatedTransitionClasses(storyPage);
  const [storyStepToUse, storyStepTransitionClasses] = useAnimatedTransitionClasses(storyStep);

  if (!storyPageToUse || !storyStepToUse) return <div />;

  return (
    <>
      <Image
        src={storyPageToUse.image || "/adventure/the_sea.jpg"}
        alt={storyPageToUse.imageAlt || "mysterious background"}
        className={`aspect-video object-cover border-purple-400/30 border-1 shadow-black shadow-2xl rounded-lg mb-4 md:mb-10 transition-all animate__animated ${storyPageTransitionClasses}`}
        width={600}
        height={600}
      />

      <div
        className={`max-w-[1000px] mx-auto overflow-y-auto transition-all animate__animated ${storyStepTransitionClasses}`}
      >
        <StoryStep storyStep={storyStepToUse} handleAction={handleAction} />
      </div>
    </>
  );
}
