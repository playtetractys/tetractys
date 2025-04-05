import type { SoilDatabase } from "..";

// Constants
import { PATHS } from "./paths";

// Types
import type {
  Data,
  DataList,
  RemoveDataKeyParams,
  CreateDataParams,
  UpdateDataParams,
  GetFunction,
  OnConnectionTypeChildAddedParams,
  OnDataValueParams,
  GetOwnerDataParams,
  QueryDataParams,
  ModifyConnectionsType,
  TrackingData,
  Connections,
  ChangeDataKey,
  UpdateObject,
  OnDataFieldValueParams,
  UpdateFieldKeyParams,
} from "./types";

/*
 ██████╗ ███╗   ██╗    ██╗ ██████╗ ███████╗███████╗    ██╗   ██╗ █████╗ ██╗     ██╗   ██╗███████╗
██╔═══██╗████╗  ██║   ██╔╝██╔═══██╗██╔════╝██╔════╝    ██║   ██║██╔══██╗██║     ██║   ██║██╔════╝
██║   ██║██╔██╗ ██║  ██╔╝ ██║   ██║█████╗  █████╗      ██║   ██║███████║██║     ██║   ██║█████╗
██║   ██║██║╚██╗██║ ██╔╝  ██║   ██║██╔══╝  ██╔══╝      ╚██╗ ██╔╝██╔══██║██║     ██║   ██║██╔══╝
╚██████╔╝██║ ╚████║██╔╝   ╚██████╔╝██║     ██║          ╚████╔╝ ██║  ██║███████╗╚██████╔╝███████╗
 ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═════╝ ╚═╝     ╚═╝           ╚═══╝  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝
*/
export const isoOnUserDataListValue = (
  onValue: (path: string, cb: (val: Nullable<DataList>) => void) => VoidFunction,
  uid: string,
  cb: (userData: Nullable<DataList>) => void
) => onValue(PATHS.userDataList(uid), cb);

export const isoOnDataKeyValue = <T2 extends keyof SoilDatabase>({
  onValue,
  dataType,
  dataKey,
  cb,
}: OnDataValueParams<T2>) => onValue(PATHS.dataKey(dataType, dataKey), cb);

export const isoOnToGetTypeChildAdded = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  onChildAdded,
  dataType,
  dataKey,
  connectionType,
  cb,
}: OnConnectionTypeChildAddedParams<T, T2>) =>
  onChildAdded(PATHS.connectionDataListConnectionType(dataType, dataKey, connectionType), cb);

/*
 ██████╗ ███████╗████████╗
██╔════╝ ██╔════╝╚══██╔══╝
██║  ███╗█████╗     ██║
██║   ██║██╔══╝     ██║
╚██████╔╝███████╗   ██║
 ╚═════╝ ╚══════╝   ╚═╝
*/
/** DO NOT USE outside of strongly typed services */
export const isoGetAdminValue = (get: (path: string) => Promise<boolean | null>, uid: string) => get(PATHS.admin(uid));

export const isoGetDataKeyValue = <T2 extends keyof SoilDatabase>(get: GetFunction, dataType: T2, dataKey: string) =>
  get<Data<T2>>(PATHS.dataKey(dataType, dataKey));

export const isoGetDataTypeValue = <T2 extends keyof SoilDatabase>(get: GetFunction, dataType: T2) =>
  get<Record<string, Data<T2>>>(PATHS.dataType(dataType));

export const isoGetAllConnections = <T2 extends keyof SoilDatabase>(get: GetFunction, dataType: T2, dataKey: string) =>
  get<DataList>(PATHS.connectionDataListKey(dataType, dataKey));

export const isoGetAllConnectionsByType = <T2 extends keyof SoilDatabase>(get: GetFunction, dataType: T2) =>
  get<Record<string, DataList>>(PATHS.connectionDataListType(dataType));

export const isoUserDataList = <T2 extends keyof SoilDatabase>({
  get,
  uid,
  dataType,
}: {
  get: GetFunction;
  uid: string;
  dataType: T2;
}) => get<DataList[T2]>(PATHS.userDataTypeList(uid, dataType));

export const isoGetConnectionType = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  get,
  dataType,
  dataKey,
  connectionType,
}: {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) => get<DataList[T22]>(PATHS.connectionDataListConnectionType(dataType, dataKey, connectionType));

export const isoGetConnectionTypeData = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  get,
  dataType,
  dataKey,
  connectionType,
}: {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) =>
  isoGetConnectionType({ get, dataType, dataKey, connectionType }).then((dataList) =>
    Promise.all(
      Object.keys(dataList || {}).map((key) =>
        get<Data<T22> & { key: string }>(PATHS.dataKey(connectionType, key)).then((d) => (d ? { ...d, key } : null))
      )
    )
  );

export const isoGetUserDataTypeData = <T2 extends keyof SoilDatabase>({
  get,
  dataType,
  uid,
}: {
  get: GetFunction;
  dataType: T2;
  uid: string;
}) =>
  isoUserDataList({ get, uid, dataType }).then((dataList) =>
    Promise.all(
      Object.keys(dataList || {}).map((key) =>
        get<Data<T2> & { key: string }>(PATHS.dataKey(dataType, key)).then((d) => (d ? { ...d, key } : null))
      )
    )
  );

export const isoGetConnectionTypeConnections = <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  get,
  dataType,
  dataKey,
  connectionType,
}: {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  connectionType: T22;
}) =>
  isoGetConnectionType({ get, dataType, dataKey, connectionType }).then((dataList) =>
    Promise.all(
      Object.keys(dataList || {}).map((key) => get<DataList>(PATHS.connectionDataListKey(connectionType, key)))
    )
  );

export const isoGetDataKeyFieldValue = <T2 extends keyof SoilDatabase, T3 extends keyof Data<T2>>({
  get,
  dataType,
  dataKey,
  field,
}: {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  field: T3;
}) => get<Data<T2>[T3]>(PATHS.dataKeyField(dataType, dataKey, field));

export const isoGetDataKeyFieldKeyValue = <T, T2 extends keyof SoilDatabase, T3 extends keyof Data<T2>>({
  get,
  dataType,
  dataKey,
  field,
  fieldKey,
}: {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  field: T3;
  fieldKey: string;
}) => get<T>(PATHS.dataKeyFieldKey(dataType, dataKey, field, fieldKey));

export const isoQueryData = <T extends SoilDatabase, T2 extends keyof SoilDatabase, T3 extends keyof T[T2]>({
  queryOrderByChildEqualTo,
  dataType,
  childKey,
  queryValue,
  limit,
}: QueryDataParams<T, T2, T3>) =>
  queryOrderByChildEqualTo<T[T2]>({ path: PATHS.dataType(dataType), childKey, limit, queryValue: String(queryValue) });

/*
 ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗ ███████╗
██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗██╔════╝
██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██████╔╝███████╗
██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██║  ██║███████║
 ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝
*/
export const isoGetOwner = <T2 extends keyof SoilDatabase>({ get, dataType, dataKey, uid }: GetOwnerDataParams<T2>) =>
  get<boolean>(PATHS.ownerDataKeyUid(dataType, dataKey, uid));

export const isoGetOwners = (get: GetFunction, dataType: keyof SoilDatabase, dataKey: string) =>
  get<Record<string, number>>(PATHS.ownerDataKey(dataType, dataKey));

export const isoGetOwnersByType = (get: GetFunction, dataType: keyof SoilDatabase) =>
  get<Record<string, Record<string, number>>>(PATHS.ownerDataType(dataType));

/*
██████╗  █████╗ ████████╗ █████╗
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
██║  ██║███████║   ██║   ███████║
██║  ██║██╔══██║   ██║   ██╔══██║
██████╔╝██║  ██║   ██║   ██║  ██║
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
*/
export const isoCreateData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  updateObject = {},
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess = false,
  connections,
  connectionAccess,
  now = Date.now(),
  readOnly = false,
}: CreateDataParams<T, T2>) => {
  owners.forEach((uid) => {
    updateObject[PATHS.ownerDataKeyUid(dataType, dataKey, uid)] = now;
    updateObject[PATHS.userDataKeyList(uid, dataType, dataKey)] = now;
  });

  updateObject[PATHS.dataKey(dataType, dataKey)] = {
    ...data,
    createdAt: now,
    updatedAt: now,
    publicAccess,
    readOnly,
    connectionAccess: connectionAccess || null,
  };

  connections?.forEach(({ type, key }) => {
    updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, type, key)] = now;
    updateObject[PATHS.connectionDataListConnectionKey(type, key, dataType, dataKey)] = now;
  });

  if (publicAccess) updateObject[PATHS.publicDataKeyList(dataType, dataKey)] = now;
  /* eslint-enable no-param-reassign */

  return skipUpdate
    ? { updateObject, dataKey: dataKey }
    : update("/", updateObject, true).then(() => ({ updateObject, dataKey: dataKey }));
};

export const isoUpdateData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  get,
  updateObject = {},
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners = [],
  connections,
  publicAccess = false,
  connectionAccess,
  now = Date.now(),
  includeUpdatedAt = true,
  makeGetRequests = true,
  makeConnectionsRequests = true,
  makeOwnersRequests = true,
  readOnly = false,
}: UpdateDataParams<T, T2>) => {
  type NewData = typeof data & { publicAccess: boolean; updatedAt?: number };

  const newData = { ...data, publicAccess, readOnly } as NewData;
  if (includeUpdatedAt) newData.updatedAt = now;

  /* eslint-disable no-param-reassign */
  if (connectionAccess) updateObject[PATHS.dataKeyField(dataType, dataKey, "connectionAccess")] = connectionAccess;

  Object.entries(newData).forEach(([childKey, childVal]) => {
    updateObject[PATHS.dataKeyField(dataType, dataKey, childKey as keyof Data<T2>)] = childVal;
  });

  if (makeGetRequests && makeOwnersRequests) {
    const existingOwners = await isoGetOwners(get, dataType, dataKey);
    Object.keys(existingOwners || {}).forEach((uid) => {
      updateObject[PATHS.userDataKeyList(uid, dataType, dataKey)] = now;
    });
  }

  owners.forEach((uid) => {
    updateObject[PATHS.ownerDataKeyUid(dataType, dataKey, uid)] = now;
    updateObject[PATHS.userDataKeyList(uid, dataType, dataKey)] = now;
  });

  if (publicAccess) updateObject[PATHS.publicDataKeyList(dataType, dataKey)] = now;

  if (makeGetRequests && makeConnectionsRequests) {
    const existingConnections = await isoGetAllConnections(get, dataType, dataKey);
    if (existingConnections) {
      const existingConnectionEntries = Object.entries(existingConnections) as [
        keyof typeof existingConnections,
        ValueOf<typeof existingConnections>
      ][];

      existingConnectionEntries.forEach(([dType, dObject]) =>
        Object.keys(dObject).forEach((dKey) => {
          updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, dType, dKey)] = now;
          updateObject[PATHS.connectionDataListConnectionKey(dType, dKey, dataType, dataKey)] = now;
        })
      );
    }
  }
  connections?.forEach(({ type, key }) => {
    updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, type, key)] = now;
    updateObject[PATHS.connectionDataListConnectionKey(type, key, dataType, dataKey)] = now;
  });
  /* eslint-enable no-param-reassign */

  return skipUpdate ? updateObject : update("/", updateObject, true).then(() => ({ updateObject, dataKey }));
};

export const isoUpdateFieldKey = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  get,
  updateObject = {},
  skipUpdate,
  dataType,
  dataKey,
  field,
  fieldKey,
  data,
  now = Date.now(),
}: UpdateFieldKeyParams<T, T2>) => {
  updateObject[PATHS.dataKeyFieldKey(dataType, dataKey, field, fieldKey)] = data;

  const existingOwners = await isoGetOwners(get, dataType, dataKey);
  Object.keys(existingOwners || {}).forEach((uid) => {
    updateObject[PATHS.userDataKeyList(uid, dataType, dataKey)] = now;
  });

  const existingConnections = await isoGetAllConnections(get, dataType, dataKey);
  if (existingConnections) {
    const existingConnectionEntries = Object.entries(existingConnections) as [
      keyof typeof existingConnections,
      ValueOf<typeof existingConnections>
    ][];

    existingConnectionEntries.forEach(([dType, dObject]) =>
      Object.keys(dObject).forEach((dKey) => {
        updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, dType, dKey)] = now;
        updateObject[PATHS.connectionDataListConnectionKey(dType, dKey, dataType, dataKey)] = now;
      })
    );
  }

  return skipUpdate ? updateObject : update("/", updateObject, true).then(() => ({ updateObject, dataKey }));
};

export const isoUpsertData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  get,
  updateObject,
  skipUpdate,
  dataType,
  dataKey,
  data,
  owners,
  publicAccess = false,
  connections,
  connectionAccess,
  includeUpdatedAt = true,
  makeGetRequests = true,
  readOnly = false,
}: CreateDataParams<T, T2> & UpdateDataParams<T, T2>) => {
  const dataCreatedAt = await isoGetDataKeyFieldValue({
    get,
    dataType,
    dataKey,
    field: "createdAt",
  }).catch(() => {});

  if (dataCreatedAt) {
    return isoUpdateData({
      update,
      get,
      updateObject,
      skipUpdate,
      data: { ...data },
      dataType,
      dataKey,
      publicAccess,
      owners,
      connections,
      connectionAccess,
      includeUpdatedAt,
      makeGetRequests,
      readOnly,
    });
  }

  return isoCreateData({
    update,
    updateObject,
    skipUpdate,
    data,
    dataType,
    dataKey,
    owners,
    publicAccess,
    connections,
    connectionAccess,
    readOnly,
  });
};

export const isoCreateConnections = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  updateObject = {},
  skipUpdate,
  now = Date.now(),
  connections,
}: ModifyConnectionsType<T, T2>) => {
  connections.forEach(({ dataType, dataKey, connectionType, connectionKey }) => {
    /* eslint-disable no-param-reassign */
    updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, connectionType, connectionKey)] = now;
    updateObject[PATHS.connectionDataListConnectionKey(connectionType, connectionKey, dataType, dataKey)] = now;
    /* eslint-enable no-param-reassign */
  });

  return skipUpdate ? updateObject : update("/", updateObject, true).then(() => updateObject);
};

/*
██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗███████╗
██╔══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔════╝
██████╔╝█████╗  ██╔████╔██║██║   ██║██║   ██║█████╗
██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██╔══╝
██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ███████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚══════╝
*/
export const isoRemoveData = async <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  get,
  updateObject = {},
  skipUpdate,
  dataType,
  dataKey,
  existingOwners,
  existingConnections,
}: Omit<RemoveDataKeyParams<T, T2>, "publicAccess" | "now">) => {
  /* eslint-disable no-param-reassign */
  (
    Object.entries(existingConnections || (await isoGetAllConnections(get, dataType, dataKey)) || {}) as [
      keyof typeof existingConnections,
      ValueOf<DataList>
    ][]
  ).forEach(([dType, dKeys]) =>
    Object.keys(dKeys).forEach((dKey) => {
      updateObject[PATHS.connectionDataListConnectionKey(dType, dKey, dataType, dataKey)] = null;
    })
  );
  updateObject[PATHS.connectionDataListKey(dataType, dataKey)] = null;

  updateObject[PATHS.dataKey(dataType, dataKey)] = null;

  updateObject[PATHS.publicDataKeyList(dataType, dataKey)] = null;

  (existingOwners || Object.keys((await isoGetOwners(get, dataType, dataKey)) || {})).forEach((uid) => {
    updateObject[PATHS.userDataKeyList(uid, dataType, dataKey)] = null;
    updateObject[PATHS.ownerDataKeyUid(dataType, dataKey, uid)] = null;
  });
  /* eslint-enable no-param-reassign */

  return skipUpdate ? updateObject : update("/", updateObject, true, true).then(() => updateObject);
};

export const isoRemoveConnections = <T extends SoilDatabase, T2 extends keyof SoilDatabase>({
  update,
  updateObject = {},
  skipUpdate,
  connections,
}: ModifyConnectionsType<T, T2>) => {
  connections.forEach(({ dataType, dataKey, connectionType, connectionKey }) => {
    /* eslint-disable no-param-reassign */
    updateObject[PATHS.connectionDataListConnectionKey(dataType, dataKey, connectionType, connectionKey)] = null;
    updateObject[PATHS.connectionDataListConnectionKey(connectionType, connectionKey, dataType, dataKey)] = null;
    /* eslint-enable no-param-reassign */
  });

  return skipUpdate ? updateObject : update("/", updateObject, true).then(() => updateObject);
};

export const isoTrackEvent = (
  push: (path: string, data: TrackingData) => { key: Nullable<string> },
  uid: string,
  trackingKey: string,
  metadata?: object
) =>
  push(PATHS.trackingKey(uid, trackingKey), {
    createdAt: Date.now(),
    metadata: metadata || null,
  });

export const isoChangeDataKey = async <T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase>({
  update,
  get,
  existingDataType,
  existingDataKey,
  newDataType,
  newDataKey,
}: ChangeDataKey<T2, T22>) => {
  const existingData = await isoGetDataKeyValue(get, existingDataType, existingDataKey);
  if (!existingData) throw new Error(`No data found`);

  const { connectionAccess, publicAccess, readOnly, ...data } = existingData;

  const existingOwners = Object.keys((await isoGetOwners(get, existingDataType, existingDataKey)) || []);

  const existingConnections = (await isoGetAllConnections(get, existingDataType, existingDataKey)) || ({} as DataList);

  const connections = (Object.entries(existingConnections) as [keyof SoilDatabase, Record<string, number>][]).reduce(
    (prev, [type, dataList]) => {
      prev.push(...Object.keys(dataList).map((key) => ({ type, key })));

      return [...prev];
    },
    [] as Connections
  );

  const updateObject: UpdateObject<SoilDatabase, T2> = {};

  await isoCreateData<SoilDatabase, T2>({
    update,
    updateObject,
    skipUpdate: true,
    data: data as unknown as SoilDatabase[T2],
    dataType: (newDataType || existingDataType) as unknown as typeof existingDataType,
    dataKey: newDataKey,
    owners: existingOwners,
    publicAccess: publicAccess || undefined,
    readOnly,
    connections,
    connectionAccess,
  });

  await isoRemoveData({
    update,
    get,
    updateObject,
    dataType: existingDataType,
    dataKey: existingDataKey,
    existingConnections,
    existingOwners,
  });

  return {
    connections,
    owners: existingOwners,
  };
};

export const isoOnDataKeyFieldValue = <T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>>({
  onValue,
  dataType,
  dataKey,
  field,
  cb,
}: OnDataFieldValueParams<T2, T22>) => onValue(PATHS.dataKeyField(dataType, dataKey, field), cb);
