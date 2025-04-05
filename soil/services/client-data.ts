import {
  isoCreateData,
  isoUpdateData,
  isoUpsertData,
  isoRemoveData,
  isoGetOwner,
  isoGetOwners,
  isoGetDataKeyValue,
  isoOnDataKeyValue,
  isoGetAdminValue,
  isoCreateConnections,
  isoGetDataTypeValue,
  isoGetConnectionTypeData,
  isoGetAllConnections,
  isoGetDataKeyFieldValue,
  isoGetConnectionTypeConnections,
  isoRemoveConnections,
  isoChangeDataKey,
  isoGetConnectionType,
  isoOnDataKeyFieldValue,
  isoUpdateFieldKey,
  isoGetDataKeyFieldKeyValue,
  isoGetUserDataTypeData,
} from "./data";
import { get, update, soilUpdate, onValue } from "./firebase";

// Types
import type {
  CreateDataParams,
  GetDataKeyValueParams,
  UpdateDataParams,
  RemoveDataKeyParams,
  OnDataValueParams,
  GetOwnerDataParams,
  ModifyConnectionsType,
  ChangeDataKey,
  OnDataFieldValueParams,
  Data,
  UpdateFieldKeyParams,
} from "./types";
import type { SoilDatabase } from "..";

export const getDataKeyValue = <T2 extends keyof SoilDatabase>({
  dataType,
  dataKey,
}: Omit<GetDataKeyValueParams<T2>, "get">) => isoGetDataKeyValue(get, dataType, dataKey);

export const getDataKeyFieldValue = <T2 extends keyof SoilDatabase, T3 extends keyof Data<T2>>({
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

export const getDataTypeValue = <T2 extends keyof SoilDatabase>({
  dataType,
}: Omit<GetDataKeyValueParams<T2>, "get" | "dataKey">) => isoGetDataTypeValue(get, dataType);

export const onDataKeyValue = <T2 extends keyof SoilDatabase>({
  dataType,
  dataKey,
  cb,
}: Omit<OnDataValueParams<T2>, "onValue">) => isoOnDataKeyValue({ onValue, dataType, dataKey, cb });

export const createData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess,
  connections,
  connectionAccess,
}: Omit<CreateDataParams<T, T2>, "update">) =>
  isoCreateData({
    update: soilUpdate,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    data,
    owners,
    publicAccess,
    connections,
    connectionAccess,
  });

export const updateData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  connections,
  publicAccess,
  includeUpdatedAt,
  connectionAccess,
  makeGetRequests,
  makeConnectionsRequests,
  makeOwnersRequests,
}: Omit<UpdateDataParams<T, T2>, "update" | "get" | "updateDataHandler" | "updateListHandler">) =>
  isoUpdateData({
    update: soilUpdate,
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
    connectionAccess,
    makeGetRequests,
    makeConnectionsRequests,
    makeOwnersRequests,
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
    update: soilUpdate,
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

export const upsertData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess,
  connections,
  includeUpdatedAt,
  connectionAccess,
  makeGetRequests,
  makeConnectionsRequests,
  makeOwnersRequests,
}: Omit<CreateDataParams<T, T2> & UpdateDataParams<T, T2>, "update" | "get">) =>
  isoUpsertData({
    update: soilUpdate,
    get,
    updateObject,
    skipUpdate,
    dataType,
    dataKey,
    data,
    owners,
    publicAccess,
    connections,
    includeUpdatedAt,
    connectionAccess,
    makeGetRequests,
    makeConnectionsRequests,
    makeOwnersRequests,
  });

export const createConnection = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  now = Date.now(),
  connections,
}: Omit<ModifyConnectionsType<T, T2>, "update">) =>
  isoCreateConnections({ update: soilUpdate, updateObject, skipUpdate, connections, now });

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
}) =>
  isoGetConnectionType({
    get,
    dataType,
    dataKey,
    connectionType,
  });

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

export const getConnectionTypeConnections = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  dataType,
  dataKey,
  connectionType,
}: {
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) =>
  isoGetConnectionTypeConnections({
    get,
    dataType,
    dataKey,
    connectionType,
  });

export const getUserDataTypeData = <T2 extends keyof SoilDatabase>({ dataType, uid }: { dataType: T2; uid: string }) =>
  isoGetUserDataTypeData({ get, dataType, uid });

export const removeData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
}: Omit<RemoveDataKeyParams<T, T2>, "update" | "get" | "now" | "publicAccess">) =>
  isoRemoveData({ update: soilUpdate, get, updateObject, skipUpdate, dataType, dataKey });

export const getOwners = <T2 extends keyof SoilDatabase>(dataType: T2, dataKey: string) =>
  isoGetOwners(get, dataType, dataKey);

export const getOwner = <T2 extends keyof SoilDatabase>({
  dataType,
  dataKey,
  uid,
}: Omit<GetOwnerDataParams<T2>, "get">) => isoGetOwner({ get, dataType, dataKey, uid });

export const getAdminValue = (uid: string) => isoGetAdminValue(get, uid);

export const removeConnection = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  connections,
  skipUpdate,
  updateObject,
}: Pick<ModifyConnectionsType<T, T2>, "skipUpdate" | "updateObject" | "connections">) =>
  isoRemoveConnections({ update, connections, skipUpdate, updateObject });

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

export const onDataKeyFieldValue = <T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>>({
  dataType,
  dataKey,
  field,
  cb,
}: Omit<OnDataFieldValueParams<T2, T22>, "onValue">) =>
  isoOnDataKeyFieldValue({ onValue, dataType, dataKey, field, cb });
