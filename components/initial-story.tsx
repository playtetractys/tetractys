"use client";

import { useCallback, useEffect, useState } from "react";
import { Story } from "./story";
import { StoryStep } from "@/services/types";
import { StoryPage } from "@/services/types";
import { WaitList } from "./wait-list";
import { useWaitlistContext } from "@/contexts/waitlistContext";
import { Modal } from "./modal";

const STORY = [
  {
    storyPageKey: "page-1",
    storyStepKey: "step-1",
  },
  {
    storyPageKey: "page-1",
    storyStepKey: "step-2",
  },
  {
    storyPageKey: "page-2",
    storyStepKey: "step-3",
  },
] as const;

const STORY_PAGES = {
  "page-1": {
    image: "/intro/galaxy.png",
    imageAlt: "image of the milky way galaxy",
  },
  "page-2": {
    image: "/intro/earth.jpg",
    imageAlt: "image of the earth",
  },
} as const;

const STORY_STEPS = {
  "step-1": {
    text: "Initial Story Step 1",
    audio: "/intro/intro.mp3",
    buttons: {
      next: {
        text: "Next",
        primary: true,
      },
    },
  },
  "step-2": {
    text: "Initial Story Step 2",
    audio: "/intro/ship.mp3",
    buttons: {
      previous: {
        text: "Previous",
      },
      next: {
        text: "Next",
        primary: true,
      },
    },
  },
  "step-3": {
    text: "Initial Story Step 3",
    audio: "/intro/intro.mp3",
    buttons: {
      previous: {
        text: "Previous",
      },
      waitlist: {
        text: "Join Waitlist",
        primary: true,
      },
    },
  },
} as const;

export function InitialStory() {
  const { isModalOpen, setIsModalOpen } = useWaitlistContext();
  const [storyIndex, setStoryIndex] = useState(0);
  const [story, setStory] = useState<(typeof STORY)[number]>(STORY[storyIndex]);
  const [storyPage, setStoryPage] = useState<StoryPage>(STORY_PAGES[story.storyPageKey]);
  const [storyStep, setStoryStep] = useState<StoryStep>(STORY_STEPS[story.storyStepKey]);

  useEffect(() => {
    const newStory = STORY[storyIndex];
    setStory(newStory);
    setStoryPage(STORY_PAGES[newStory.storyPageKey]);
    setStoryStep(STORY_STEPS[newStory.storyStepKey]);
  }, [storyIndex]);

  const handleAction = useCallback((actionKey: string) => {
    if (actionKey === "waitlist") setIsModalOpen(true);
    else setStoryIndex((p) => (actionKey === "next" ? p + 1 : p - 1));
  }, []);

  return (
    <>
      <Story storyPage={storyPage} storyStep={storyStep} handleAction={handleAction} />;
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <WaitList />
      </Modal>
    </>
  );
}
