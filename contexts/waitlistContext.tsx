"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";

// Services
import { type User } from "firebase/auth";
import { addToWaitlist } from "@/services/api";
import { signInAnon } from "@/soil/services/auth";
import type { FirebaseOptions } from "firebase/app";
import { initializeFirebase } from "@/soil/services/init";
import { get, onValue, set, update } from "@/soil/services/firebase";

// Helpers
import { getDomain } from "@/utils/isProd";
import { INVITE_CODE_KEY } from "@/services/constants";

import type { UserData, WaitListData } from "@/services/types";

type BaseWaitlistContext = {
  initiallyLoading: boolean;
  isAdmin: Nullable<boolean>;
  user: Maybe<User>;
  userData: Maybe<Nullable<UserData>>;
  userUid: Maybe<string>;
  /** Function to call when the user submits their email. Should handle API logic. */
  handleAddToWaitList: (email: string) => void | Promise<void>;
  /** The user's initial position when they first signed up. */
  originalPosition: number | null;
  /** The user's current position in the waitlist. */
  currentPosition: number | null;
  /** The total number of people currently on the waitlist. */
  waitListTotal: number;
  /** The user's waitlist data. */
  userWaitListData: Maybe<Nullable<WaitListData[string]>>;
  /** The unique referral link for the user to share. Null if not yet available. */
  shareLinkUrl: string | null;
  /** The number of people who have signed up using the user's referral link. */
  successfulInvites: number;
  /** Whether the modal is open */
  isModalOpen: boolean;
  /** Function to update the modal open state */
  setIsModalOpen: (isModalOpen: boolean) => void;
};
const FIREBASE_OPTIONS = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_OPTIONS!) as FirebaseOptions;

const WaitlistContext = createContext<Maybe<BaseWaitlistContext>>(undefined);

export const useWaitlistContext = () => {
  const useContextResult = useContext(WaitlistContext);

  if (!useContextResult) throw new Error("You must wrap your component in an instance of WaitlistContext");

  return useContextResult;
};

export const WaitlistContextProviderComponent = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState<Nullable<boolean>>(false);
  const [initiallyLoading, setInitiallyLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const inviteCode = searchParams.get(INVITE_CODE_KEY);
    if (inviteCode) {
      localStorage.setItem(INVITE_CODE_KEY, inviteCode);
    }
  }, [searchParams]);

  useEffect(() => {
    initializeFirebase(FIREBASE_OPTIONS, async (u) => {
      if (u?.uid) {
        get(`admins/${u.uid}`)
          .then((val) => setIsAdmin(Boolean(val)))
          .catch(() => setIsAdmin(false));

        setUser(u);
        setInitiallyLoading(false);
      } else {
        setUser(undefined);
        setIsAdmin(false);
        signInAnon();
      }
    });

    return () => {
      setUser(undefined);
      setIsAdmin(false);
    };
  }, []);

  const [userData, setUserData] = useState<Nullable<UserData>>();
  useEffect(() => {
    if (user?.uid) return onValue(`users/${user.uid}`, setUserData);

    setUserData(undefined);
  }, [user]);

  const [waitListData, setWaitListData] = useState<Nullable<WaitListData>>();
  useEffect(() => {
    if (user?.uid) {
      return onValue<WaitListData>("waitList", setWaitListData);
    }

    setWaitListData(undefined);
  }, [user]);

  const userWaitListData = useMemo(() => (user?.uid ? waitListData?.[user?.uid] : null), [waitListData, user?.uid]);
  const waitListTotal = useMemo(() => Object.keys(waitListData ?? {}).length, [waitListData]);
  const originalPosition = useMemo(() => {
    if (!waitListData) return null;

    const sortedWaitListData = Object.entries(waitListData).sort((a, b) => a[1].createdAt - b[1].createdAt);
    const userIndex = sortedWaitListData.findIndex(([key]) => key === user?.uid);

    return userIndex + 1;
  }, [waitListData, user?.uid]);

  const currentPosition = useMemo(() => {
    if (!originalPosition) return null;
    const newPosition = originalPosition - (userWaitListData?.successfulInvites ?? 0);

    return newPosition >= 1 ? newPosition : 1;
  }, [originalPosition, userWaitListData]);

  const handleAddToWaitList = useCallback(
    async (email: string) => {
      if (!user) throw new Error("You must be logged in to join the waitlist");

      const inviteCodeLs = localStorage.getItem(INVITE_CODE_KEY);

      await addToWaitlist(email, inviteCodeLs as string);

      if (userData) {
        await update<Partial<UserData>>(`users/${user.uid}`, {
          email,
          updatedAt: Date.now(),
          inviteCode: inviteCodeLs as string,
        });
      } else {
        await set<UserData>(`users/${user.uid}`, { email, createdAt: Date.now(), inviteCode: inviteCodeLs as string });
      }
    },
    [user, userData]
  );

  const ctx = useMemo(
    () => ({
      initiallyLoading,
      user,
      userData,
      userUid: user?.uid,
      isAdmin,
      handleAddToWaitList,
      originalPosition,
      currentPosition,
      waitListTotal,
      userWaitListData,
      shareLinkUrl: user?.uid ? `${getDomain()}/?${INVITE_CODE_KEY}=${user?.uid}` : null,
      successfulInvites: userWaitListData?.successfulInvites ?? 0,
      isModalOpen,
      setIsModalOpen,
    }),
    [
      initiallyLoading,
      user,
      userData,
      user?.uid,
      isAdmin,
      handleAddToWaitList,
      userWaitListData,
      waitListData,
      originalPosition,
      currentPosition,
      waitListTotal,
      isModalOpen,
      setIsModalOpen,
    ]
  );

  return <WaitlistContext.Provider value={ctx}>{children}</WaitlistContext.Provider>;
};
