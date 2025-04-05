// Services
import { upsertData } from "./client-data";
import { firebaseStorageDelete, firebaseStoragePut, firebaseStoragePutResumable, pushKey } from "./firebase";

// Helpers
import { getDownloadURL } from "firebase/storage";

// Constants
import { PATHS } from "./paths";

// Types
import type { SoilDatabase } from "..";
import type { CreateDataParams } from "./types";

export const uploadFile = async ({
  connections,
  owners,
  file,
  fileType,
  dataKey = pushKey(PATHS.dataType("soilFile")),
  publicAccess = false,
}: Pick<CreateDataParams<SoilDatabase, "soilFile">, "connections" | "owners" | "publicAccess"> & {
  dataKey?: string;
  file: Blob | Uint8Array | ArrayBuffer;
  fileType: string;
}) => {
  const downloadUrl = await firebaseStoragePut(PATHS.dataKey("soilFile", dataKey), file, fileType);

  await upsertData({
    dataType: "soilFile",
    dataKey,
    connections,
    owners,
    data: { downloadUrl },
    publicAccess,
  });

  return { dataKey, downloadUrl };
};

export const uploadFileResumable = ({
  connections,
  owners,
  file,
  dataKey = pushKey(PATHS.dataType("soilFile")),
  publicAccess = false,
}: Pick<CreateDataParams<SoilDatabase, "soilFile">, "connections" | "owners" | "publicAccess"> & {
  dataKey?: string;
  file: Blob | Uint8Array | ArrayBuffer;
}) => {
  const task = firebaseStoragePutResumable(PATHS.dataKey("soilFile", dataKey), file);

  const triggerUpsertData = async () => {
    const downloadUrl = await getDownloadURL((await task).ref);

    await upsertData({
      dataType: "soilFile",
      dataKey,
      connections,
      owners,
      data: { downloadUrl },
      publicAccess,
    });

    return downloadUrl;
  };

  return { task, dataKey, triggerUpsertData };
};

export function deleteSoilFile(dataKey: string) {
  return firebaseStorageDelete(PATHS.dataKey("soilFile", dataKey));
}
