import type { SoilDatabase } from "..";
import {
  isoCreateData,
  isoUpdateData,
  isoUpsertData,
  isoRemoveData,
  isoGetOwners,
  isoGetDataKeyValue,
  isoGetDataKeyFieldValue,
  isoQueryData,
  isoGetAllConnections,
  isoRemoveConnections,
  isoGetDataTypeValue,
  isoGetConnectionTypeData,
  isoGetConnectionType,
  isoCreateConnections,
  isoTrackEvent,
  isoChangeDataKey,
  isoUpdateFieldKey,
  isoGetDataKeyFieldKeyValue,
  isoUserDataList,
} from "./data";
import { get, push, queryOrderByChildEqualTo, update } from "./firebase-admin";
import type {
  CreateDataParams,
  UpdateDataParams,
  RemoveDataKeyParams,
  QueryDataParams,
  ModifyConnectionsType,
  ChangeDataKey,
  UpdateFieldKeyParams,
  Data,
} from "./types";

export const getDataKeyValue = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: string) =>
  isoGetDataKeyValue<T2>(get, dataType, dataKey);

export const getDataTypeValue = <T2 extends keyof SoilDatabase>(dataType: T2) => isoGetDataTypeValue<T2>(get, dataType);

export const getAllConnections = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: string) =>
  isoGetAllConnections(get, dataType, dataKey);

export const getConnectionType = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  dataType,
  dataKey,
  connectionType,
}: {
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) => isoGetConnectionType({ get, dataType, dataKey, connectionType });

export const getConnectionTypeData = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  dataType,
  dataKey,
  connectionType,
}: {
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) =>
  isoGetConnectionTypeData({
    get,
    dataType,
    dataKey,
    connectionType,
  });

export const getDataKeyFieldValue = <T2 extends keyof SoilDatabase, T3 extends keyof SoilDatabase[T2]>({
  dataType,
  dataKey,
  field,
}: {
  dataType: T2;
  dataKey: string;
  field: T3;
}) => isoGetDataKeyFieldValue({ get, dataType, dataKey, field });

export const getDataKeyFieldKeyValue = <T, T2 extends keyof SoilDatabase, T3 extends keyof Data<T2>>({
  dataType,
  dataKey,
  field,
  fieldKey,
}: {
  dataType: T2;
  dataKey: string;
  field: T3;
  fieldKey: string;
}) => isoGetDataKeyFieldKeyValue<T, T2, T3>({ get, dataType, dataKey, field, fieldKey });

export const createData = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess,
  connections,
  connectionAccess,
  now = Date.now(),
}: Omit<CreateDataParams<T, T2>, "update"> & {
  dataType: string;
  dataKey: string;
}) =>
  isoCreateData({
    update,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    data,
    owners,
    publicAccess,
    connections,
    connectionAccess,
    now,
  });

export const updateData = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  connections,
  publicAccess,
  includeUpdatedAt,
  makeGetRequests,
  connectionAccess,
  now,
}: Omit<UpdateDataParams<T, T2>, "update" | "get">) =>
  isoUpdateData({
    update,
    get,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    data,
    owners,
    connections,
    publicAccess,
    includeUpdatedAt,
    makeGetRequests,
    connectionAccess,
    now,
  });

export const updateFieldKey = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  field,
  fieldKey,
  now,
}: Omit<UpdateFieldKeyParams<T, T2>, "update" | "get">) =>
  isoUpdateFieldKey({
    update,
    get,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    field,
    fieldKey,
    data,
    now,
  });

export const upsertData = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess,
  connections,
  connectionAccess,
  includeUpdatedAt,
  makeGetRequests,
}: Omit<CreateDataParams<T, T2>, "update"> & Omit<UpdateDataParams<T, T2>, "update" | "get">) =>
  isoUpsertData({
    update,
    get,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    data,
    owners,
    publicAccess,
    connections,
    connectionAccess,
    includeUpdatedAt,
    makeGetRequests,
  });

export const queryData = <T extends SoilDatabase, T2 extends keyof SoilDatabase, T3 extends keyof T[T2]>({
  dataType,
  childKey,
  queryValue,
  limit,
}: Omit<QueryDataParams<T, T2, T3>, "queryOrderByChildEqualTo">) =>
  isoQueryData({ queryOrderByChildEqualTo, dataType, childKey, queryValue, limit });

export const removeData = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
}: Omit<RemoveDataKeyParams<T, T2>, "update" | "get" | "publicAccess" | "now">) =>
  isoRemoveData({
    update,
    get,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
  });

export const getOwners = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: string) =>
  isoGetOwners(get, dataType, dataKey);

export const getUserDataList = <T2 extends keyof SoilDatabase>({ uid, dataType }: { uid: string; dataType: T2 }) =>
  isoUserDataList({ get, uid, dataType });

export const createConnection = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  now = Date.now(),
  connections,
}: Omit<ModifyConnectionsType<T, T2>, "update">) =>
  isoCreateConnections({ update, updateObject, skipUpdate, connections, now });

export const removeConnection = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  connections,
  skipUpdate,
  updateObject,
}: Pick<ModifyConnectionsType<T, T2>, "skipUpdate" | "updateObject" | "connections">) =>
  isoRemoveConnections({ update, connections, skipUpdate, updateObject });

export const trackEvent = (eventName: string, metadata?: object) =>
  isoTrackEvent(push, eventName, "firebase-admin", metadata);

export const changeDataKey = async <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  existingDataType,
  existingDataKey,
  newDataType,
  newDataKey,
}: Omit<ChangeDataKey<T2, T22>, "update" | "get">) =>
  isoChangeDataKey({
    update,
    get,
    existingDataType,
    existingDataKey,
    newDataType,
    newDataKey,
  });
