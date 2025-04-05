import { useEffect, useState } from "react";
import type { SoilDatabase } from "..";

// Services
import { getOwner } from "../services/client-data";

export const useIsOwner = (
  dataType: keyof SoilDatabase,
  dataKey: Maybe<Nullable<string>>,
  uid: Maybe<Nullable<string>>
) => {
  const [isOwner, setIsOwner] = useState<Nullable<boolean>>();

  useEffect(() => {
    if (dataKey && uid) {
      getOwner({ dataType, dataKey, uid })
        .then(setIsOwner)
        .catch((e) => {
          console.error(e); // eslint-disable-line no-console
          setIsOwner(false);
        });
    }
  }, [dataType, dataKey, uid]);

  return isOwner;
};
