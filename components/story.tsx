"use client";

import Image from "next/image";

// Components
import { StoryStep } from "@/components/story-step";

// Helpers
import { useAnimatedTransitionClasses } from "@/hooks/useAnimatedTransitionClasses";

// Types
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
      <div className="relative w-full h-[300px] md:h-[400px] mb-4 md:mb-10">
        <Image
          priority
          src={storyPageToUse.image}
          alt={storyPageToUse.imageAlt}
          className={`object-cover w-full h-full transition-all animate__animated ${storyPageTransitionClasses}`}
          width={1200}
          height={400}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {storyPageToUse.title && (
        <h1
          className={`text-3xl md:text-4xl font-mono my-8 text-center animate__animated ${storyPageTransitionClasses}`}
        >
          {storyPageToUse.title}
        </h1>
      )}

      <div
        className={`max-w-[1000px] mx-auto overflow-y-auto transition-all animate__animated ${storyStepTransitionClasses}`}
      >
        <StoryStep storyStep={storyStepToUse} handleAction={handleAction} />
      </div>
    </>
  );
}
