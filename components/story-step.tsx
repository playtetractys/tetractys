"use client";

import Link from "next/link";

// Components
import { StepAudio } from "@/components/story-audio";

// Helpers
import { scriptFont } from "@/utils/fonts";

// Types
import type { StoryStep } from "@/services/types";

export function StoryStep({
  storyStep,
  handleAction,
}: {
  storyStep: StoryStep;
  handleAction: (actionKey: string) => void;
}) {
  return (
    <div className={`${scriptFont.className} flex flex-col gap-4 relative items-center`}>
      {storyStep.audio && (
        <div className="h-12 w-12 md:h-14 md:w-14">
          <StepAudio audio={storyStep.audio} handleAutoPlay />
        </div>
      )}
      <p className="mb-4 text-center bg-black/50 rounded-lg p-4 flex-1 text-white font-pixel md:text-xl leading-relaxed">
        {storyStep?.text}
      </p>
      {storyStep?.buttons && (
        <div className="max-w-96 w-fit mx-auto flex flex-col gap-4 mb-10">
          {storyStep?.buttons &&
            Object.entries(storyStep?.buttons).map(([actionKey, button]) =>
              button.useHref ? (
                <Link key={actionKey} href={button.href} className="btn">
                  {button.text}
                </Link>
              ) : (
                <button key={actionKey} onClick={() => handleAction(actionKey)} className="btn">
                  {button.text}
                </button>
              )
            )}
        </div>
      )}
    </div>
  );
}
