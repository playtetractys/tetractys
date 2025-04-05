import type { SoilDatabase } from "..";
import { Data } from "./types";

type DataType = keyof SoilDatabase;
type DataKey = string | number | symbol;

export const PATHS = {
  ADMINS: "admins",
  admin: (uid: string) => `${PATHS.ADMINS}/${uid}`,

  TRACKING: "tracking",
  trackingKey: (uid: string, trackingKey: string) => `${PATHS.TRACKING}/${uid}/${trackingKey}`,

  DATA: "data",
  dataType: (dataType: DataType) => `${PATHS.DATA}/${dataType}`,
  dataKey: (dataType: DataType, dataKey: DataKey) => `${PATHS.DATA}/${dataType}/${String(dataKey)}`,
  dataKeyField: <T extends DataType>(dataType: T, dataKey: DataKey, field: keyof Data<T>) =>
    `${PATHS.DATA}/${dataType}/${String(dataKey)}/${String(field)}`,
  dataKeyFieldKey: <T extends DataType>(dataType: T, dataKey: DataKey, field: keyof Data<T>, fieldKey: string) =>
    `${PATHS.DATA}/${dataType}/${String(dataKey)}/${String(field)}/${fieldKey}`,

  OWNERS: "owners",
  ownerDataType: (dataType: DataType) => `${PATHS.OWNERS}/${dataType}`,
  ownerDataKey: (dataType: DataType, dataKey: DataKey) => `${PATHS.OWNERS}/${dataType}/${String(dataKey)}`,
  ownerDataKeyUid: (dataType: DataType, dataKey: DataKey, uid: string) =>
    `${PATHS.OWNERS}/${dataType}/${String(dataKey)}/${uid}`,

  USER_DATA_LISTS: "userDataLists",
  userDataList: (uid: string) => `${PATHS.USER_DATA_LISTS}/${uid}`,
  userDataTypeList: (uid: string, dataType: DataType) => `${PATHS.USER_DATA_LISTS}/${uid}/${dataType}`,
  userDataKeyList: (uid: string, dataType: DataType, dataKey: DataKey) =>
    `${PATHS.USER_DATA_LISTS}/${uid}/${dataType}/${String(dataKey)}`,

  PUBLIC_DATA_LISTS: "publicDataLists",
  publicDataTypeList: (dataType: DataType) => `${PATHS.PUBLIC_DATA_LISTS}/${dataType}`,
  publicDataKeyList: (dataType: DataType, dataKey: DataKey) =>
    `${PATHS.PUBLIC_DATA_LISTS}/${dataType}/${String(dataKey)}`,

  CONNECTION_DATA_LISTS: "connectionDataLists",
  connectionDataListType: (dataType: DataType) => `${PATHS.CONNECTION_DATA_LISTS}/${dataType}`,
  connectionDataListKey: (dataType: DataType, dataKey: DataKey) =>
    `${PATHS.CONNECTION_DATA_LISTS}/${dataType}/${String(dataKey)}`,
  connectionDataListConnectionType: (dataType: DataType, dataKey: DataKey, connectionType: DataType) =>
    `${PATHS.CONNECTION_DATA_LISTS}/${dataType}/${String(dataKey)}/${connectionType}`,
  connectionDataListConnectionKey: (
    dataType: DataType,
    dataKey: DataKey,
    connectionType: DataType,
    connectionKey: DataKey
  ) => `${PATHS.CONNECTION_DATA_LISTS}/${dataType}/${String(dataKey)}/${connectionType}/${String(connectionKey)}`,
};

export const DB_DELIMITER = ":~~:";
export const generateDbKey = (...keys: string[]) => keys.join(DB_DELIMITER);
export const parseDbKey = (dbKey: string) => dbKey.split(DB_DELIMITER);

export const cleanPushKey = (key: string) => key.replace(/_/g, "aa");
