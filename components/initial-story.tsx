"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Services
import { StoryStep, StoryPage } from "@/services/types";
import { useWaitlistContext } from "@/contexts/waitlistContext";

// Components
import { Story } from "@/components/story";
import { WaitList } from "@/components/wait-list";
import { Modal } from "@/components/modal";

const STORY = [
  {
    storyPageKey: "page-1",
    storyStepKey: "trillionaire1",
  },
  {
    storyPageKey: "page-2",
    storyStepKey: "trillionaire2",
  },
  {
    storyPageKey: "page-3",
    storyStepKey: "trillionaire3",
  },
] as const;

const STORY_PAGES = {
  "page-1": {
    image: "/intro/mining-drones.png",
    imageAlt: "Image of mining drones",
    title: "The Trillionaire",
  },
  "page-2": {
    image: "/intro/crash.png",
    imageAlt: "image of markets crashing",
    title: "The Crash",
  },
  "page-3": {
    image: "/intro/earth.jpg",
    imageAlt: "image of the earth",
    title: "The Gift",
  },
} as const;

const STORY_STEPS = {
  trillionaire1: {
    audio: "/intro/mining-drones.m4a",
    text: "In 2033, a mysterious tech trillionaire was able to start a space-based mining company that used Artificially Intelligent spacecraft to harvest, refine, and transport valuable minerals from the asteroid belt. Over the course of 3 decades he flooded the market with gold, silver, and dozens of other rare minerals.",
    buttons: {
      next: {
        text: "Next",
        primary: true,
      },
    },
  },
  trillionaire2: {
    audio: "/intro/mining-drones-2.m4a",
    text: "Around the year 2065, global markets began to crash while industry all over the world boomed from the availability of cheap minerals. Especially the industries around AI and robotics.",
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
  trillionaire3: {
    audio: "/intro/trillionaire-dies.mp3",
    text: "When this trillionaire died, he distributed his fortune evenly to every human on Earth and every human that would be born for 100 years. Nobody knew how much money he had but when the first bank transfers started, the people of Earth soon realized he had enough money to make money meaningless.",
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

  const handleAction = useCallback(
    (actionKey: string) => {
      if (actionKey === "waitlist") setIsModalOpen(true);
      else setStoryIndex((p) => (actionKey === "next" ? p + 1 : p - 1));
    },
    [setIsModalOpen]
  );

  return (
    <>
      <Story storyPage={storyPage} storyStep={storyStep} handleAction={handleAction} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <WaitList />
      </Modal>
      {Object.entries(STORY_PAGES).map(([key, page]) => (
        <Image
          key={key}
          priority
          src={page.image}
          alt={page.imageAlt}
          className="absolute bottom-full right-full"
          width={600}
          height={600}
        />
      ))}
    </>
  );
}
