import type { RecaptchaVerifier } from "firebase/auth";
import type { SoilDatabase } from "..";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export type StandardDataFields = {
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  connectionAccess?: {
    connectionType: keyof SoilDatabase;
    connectionKey: string;
    uidDataType: keyof SoilDatabase;
    read: boolean;
    write: boolean;
  };
  readOnly?: boolean;
};

export type User = StandardDataFields &
  Readonly<{
    uid: string;
    email?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    photoUrl?: string;
  }>;

export type Data<T2 extends keyof SoilDatabase> = StandardDataFields & {
  key?: string;
  publicAccess: Nullable<boolean>;
} & SoilDatabase[T2];

export type StatefulData<T2 extends keyof SoilDatabase> = Maybe<Nullable<Data<T2>>>;

export type DataList = Record<keyof SoilDatabase, Record<string, number>>;

export type UpdateObject<
  T extends SoilDatabase = SoilDatabase,
  T2 extends keyof SoilDatabase = keyof SoilDatabase
> = Record<
  string,
  T[T2] | null | boolean | number | string | object | ValueOf<T[T2]> | T[T2][keyof T[T2]][keyof T[T2][keyof T[T2]]]
>;

export type StatefulDataType<T2 extends keyof SoilDatabase> = Record<string, Nullable<StatefulData<T2>>>;

export type TrackingData = {
  createdAt: number;
  metadata: Nullable<object>;
};

export type GetFunction = <GT>(path: string) => Promise<GT | null>;

export type GetDataKeyValueParams<T2 extends keyof SoilDatabase> = {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
};

export type GetDataTypeValueParams<T2 extends keyof SoilDatabase> = {
  get: GetFunction;
  dataType: T2;
};

export type CudDataParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = {
  update: (path: string, d: UpdateObject<T, T2>, allowRootQuery?: boolean, isDelete?: boolean) => Promise<void>;
  updateObject?: UpdateObject<T, T2>;
  skipUpdate?: boolean;
  dataType: T2;
  dataKey: string;
  publicAccess?: boolean;
  readOnly?: boolean;
  now?: number;
};

export type Connections = {
  type: keyof SoilDatabase;
  key: string;
}[];

export type CreateDataParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = CudDataParams<T, T2> & {
  data: T[T2];
  owners: string[];
  connections?: Connections;
  connectionAccess?: StandardDataFields["connectionAccess"];
};

export type ChangeDataKey<T2 extends keyof SoilDatabase, T22 extends keyof SoilDatabase> = Pick<
  CudDataParams<SoilDatabase, T2>,
  "update"
> & {
  get: GetFunction;
  existingDataType: T2;
  existingDataKey: string;
  newDataType?: T22;
  newDataKey: string;
};

export type UpdateDataParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = CudDataParams<T, T2> & {
  get: GetFunction;
  data: Partial<T[T2]>;
  owners?: string[];
  connections?: Connections;
  connectionAccess?: StandardDataFields["connectionAccess"];
  /** Pass `false` if all `connections` and `owners` are being provided to avoid unnecessary requests */
  makeGetRequests?: boolean;
  makeConnectionsRequests?: boolean;
  makeOwnersRequests?: boolean;
  /** Pass `false` if you do not want to update this field (such as in the case of unnecessarily triggering a firebase update function) */
  includeUpdatedAt?: boolean;
};

export type UpdateFieldKeyParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = Omit<
  CudDataParams<T, T2>,
  "publicAccess" | "readOnly"
> & {
  get: GetFunction;
  field: keyof Data<T2>;
  fieldKey: string;
  data: T[T2][keyof T[T2]][keyof T[T2][keyof T[T2]]] | any;
};

export type RemoveDataKeyParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = CudDataParams<T, T2> & {
  get: GetFunction;
  existingOwners?: Nullable<string[]>;
  existingConnections?: DataList;
};

export type GetOwnerDataParams<T2 extends keyof SoilDatabase> = {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
  uid: string;
};

export type GetOwnersDataParams<T2 extends keyof SoilDatabase> = {
  get: GetFunction;
  dataType: T2;
  dataKey: string;
};

export type OnDataValueParams<T2 extends keyof SoilDatabase> = {
  onValue: (path: string, cb: (val: Nullable<Data<T2>>) => void) => VoidFunction;
  dataType: T2;
  dataKey: string;
  cb: (data: Nullable<Data<T2>>) => void;
};

export type OnConnectionTypeChildAddedParams<T extends SoilDatabase, T2 extends keyof SoilDatabase> = {
  onChildAdded: (path: string, cb: (val: Nullable<T[T2]>, key: string) => void) => VoidFunction;
  dataType: T2;
  dataKey: string;
  connectionType: keyof SoilDatabase;
  cb: (data: Nullable<T[T2]>) => void;
};

export type QueryOrderByChildParams = {
  path: string;
  childKey: string | number | symbol;
  queryValue: string | number | boolean;
  limit?: number;
};

export type QueryByKeyLimitParams = {
  path: string;
  limit: number;
  order?: "limitToLast" | "limitToFirst";
};

export type QueryByKeyStartAndEndAtParams = {
  path: string;
  startAt: string;
  endAt: string;
};

export type QueryDataParams<T extends SoilDatabase, T2 extends keyof SoilDatabase, T3 extends keyof T[T2]> = {
  queryOrderByChildEqualTo: <QT>(params: QueryOrderByChildParams) => Promise<Nullable<QT>>;
  dataType: T2;
  childKey: T3;
  queryValue: T[T2][T3];
  limit?: number;
};

export type ModifyConnectionsType<T extends SoilDatabase, T2 extends keyof SoilDatabase> = Pick<
  CudDataParams<T, T2>,
  "update" | "updateObject" | "now" | "skipUpdate"
> & {
  connections: {
    dataType: keyof SoilDatabase;
    dataKey: string;
    connectionType: keyof SoilDatabase;
    connectionKey: string;
  }[];
};

export type OnDataFieldValueParams<T2 extends keyof SoilDatabase, T22 extends keyof Data<T2>> = {
  onValue: (path: string, cb: (val: Nullable<Data<T2>[T22]>) => void) => VoidFunction;
  dataType: T2;
  dataKey: string;
  field: T22;
  cb: (data: Nullable<Data<T2>[T22]>) => void;
};
