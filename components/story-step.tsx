"use client";

// Components
import { StepAudio } from "@/components/story-audio";

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
    <div className="font-mono flex flex-col gap-4 relative justify-around items-center">
      {storyStep.audio && (
        <div className="h-12 w-12 md:h-14 md:w-14">
          <StepAudio audio={storyStep.audio} handleAutoPlay />
        </div>
      )}
      <p className="mb-4 text-center bg-black/50 rounded-lg px-4 flex-1 text-white font-pixel md:text-xl leading-relaxed">
        {storyStep?.text}
      </p>

      <div className="max-w-96 w-fit mx-auto flex gap-4 mb-10">
        {Object.entries(storyStep.buttons).map(([actionKey, button]) => (
          <button
            key={actionKey}
            onClick={() => handleAction(actionKey)}
            className={`btn ${button.primary ? "btn-primary" : ""}`}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}
