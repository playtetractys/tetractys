"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Services
import { initializeFirebase } from "@/soil/services/init";
import { useUserData } from "@/soil/hooks/useUserData";
import { createData, getAdminValue, updateData } from "@/soil/services/client-data";
import { useDataKeyValue } from "@/soil/hooks/useDataKeyValue";
import { signInAnon } from "@/soil/services/auth";

// Helpers
import { generateDbKey, parseDbKey } from "@/soil/services/paths";

// Types
import type { FirebaseOptions } from "firebase/app";
import type { User } from "firebase/auth";
import type { Data, StatefulData } from "@/soil/services/types";
import { useValue } from "../hooks/useValue";
import { Credits } from "@/services/types";
import { useParams } from "next/navigation";

type BaseSoilContext = {
  initiallyLoading: boolean;
  isAdmin: Nullable<boolean>;
  user: Maybe<User>;
  userData: StatefulData<"user">;
  userUid: Maybe<string>;
  didFetchSettings: boolean;
  settings: Record<string, string>;
  credits: Maybe<Nullable<Credits>>;
  isCreditsModalOpen: boolean;
  setIsCreditsModalOpen: (isOpen: boolean) => void;
  tetractysKey: Maybe<string>;
  tetractyses: (Data<"tetractys"> & { key: string })[];
  tetractysData: Record<string, StatefulData<"tetractys">>;
  tetractys: StatefulData<"tetractys">;
};

const SoilContext = createContext<Maybe<BaseSoilContext>>(undefined);

export const useSoilContext = () => {
  const useContextResult = useContext(SoilContext);

  if (!useContextResult) throw new Error("You must wrap your component in an instance of SoilContext");

  return useContextResult;
};

type TProps = { children: ReactNode; firebaseOptions: FirebaseOptions };

export const SoilContextProviderComponent = ({ children, firebaseOptions }: TProps) => {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState<Nullable<boolean>>(false);
  const [initiallyLoading, setInitiallyLoading] = useState(true);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);

  useEffect(() => {
    initializeFirebase(firebaseOptions, async (u) => {
      if (u?.uid) {
        if (!u.isAnonymous) {
          getAdminValue(u.uid)
            .then(setIsAdmin)
            .catch(() => setIsAdmin(false));
        }

        setUser(u);
        setInitiallyLoading(false);
      } else {
        setIsAdmin(false);
        setUser(undefined);
        signInAnon();
      }
    });

    return () => {
      setUser(undefined);
      setIsAdmin(false);
    };
  }, [firebaseOptions]);

  const getUserUid = useCallback(() => {
    if (!user?.uid) throw new Error("User not found");

    return user.uid;
  }, [user?.uid]);

  const userData = useDataKeyValue("user", user?.uid);
  const credits = useValue<Credits>(user?.uid && !user?.isAnonymous ? `credits/${user?.uid}` : undefined);

  const { data: settingsData, fetched: didFetchSettings } = useUserData({
    uid: user?.uid,
    dataType: "soilUserSettings",
    fetchData: true,
    enabled: Boolean(user?.uid),
  });
  const settings = useMemo(
    () =>
      Object.entries(settingsData).reduce(
        (prev, [key, setting]) =>
          setting && parseDbKey(key)[1] ? { ...prev, [parseDbKey(key)[1]]: setting.value } : prev,
        {} as Record<string, string>
      ),
    [settingsData]
  );
  const setSetting = useCallback(
    async (settingsKey: string, value: string) => {
      if (user?.uid) {
        const dataKey = generateDbKey(user.uid, settingsKey);
        if (settingsData[dataKey]) {
          return updateData({
            dataType: "soilUserSettings",
            dataKey,
            data: { value },
            owners: [user.uid],
          });
        }

        return createData({
          dataType: "soilUserSettings",
          dataKey,
          data: { value },
          owners: [user.uid],
        });
      }

      return undefined;
    },
    [settingsData, user?.uid]
  );

  const {
    dataArray: tetractyses,
    data: tetractysData,
    fetched: didFetchTetractyses,
  } = useUserData({
    uid: user?.uid,
    dataType: "tetractys",
    includeArray: true,
    fetchData: true,
    enabled: Boolean(user?.uid),
  });

  const params = useParams();
  const tetractysKey = params.tetractysKey && (params.tetractysKey as string);

  const tetractys = useMemo(() => {
    if (!didFetchTetractyses) return undefined;
    if (!tetractysKey || !tetractysData[tetractysKey]) return null;
    return tetractysData[tetractysKey];
  }, [tetractysKey, tetractysData, didFetchTetractyses]);

  const ctx = useMemo(
    () => ({
      initiallyLoading,
      user,
      getUserUid,
      userData,
      userUid: user?.uid,
      isAdmin,
      didFetchSettings,
      settings,
      setSetting,
      credits,
      isCreditsModalOpen,
      setIsCreditsModalOpen,
      tetractyses,
      tetractysData,
      tetractysKey,
      tetractys,
    }),
    [
      initiallyLoading,
      user,
      getUserUid,
      userData,
      user?.uid,
      isAdmin,
      didFetchSettings,
      settings,
      setSetting,
      credits,
      isCreditsModalOpen,
      tetractyses,
      tetractysData,
      tetractysKey,
      tetractys,
    ]
  );

  return <SoilContext.Provider value={ctx}>{children}</SoilContext.Provider>;
};
