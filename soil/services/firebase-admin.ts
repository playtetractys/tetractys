import admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
import { CreateRequest, getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import { cleanPushKey } from "./paths";

// Types
import type { ServiceAccount } from "firebase-admin/app";
import type { QueryByKeyLimitParams, QueryByKeyStartAndEndAtParams, QueryOrderByChildParams } from "./types";

const getRef = (path: string, allowRootQuery: boolean = false) => {
  if (!path || (!allowRootQuery && path === "/")) throw new Error("We don't like root queries");

  return getDatabase().ref(path);
};

export const createUser = (createRequest: CreateRequest) => getAuth().createUser(createRequest);

export const get = <T>(path: string) =>
  getRef(path)
    .get()
    .then((snap) => snap.val() as Nullable<T>);

export const onChildAdded = <T>(path: string, cb: (val: Nullable<T>, key: string) => void) =>
  getRef(path).on("child_added", (snap) => cb(snap.val(), snap.key!));

export const push = <T>(path: string, data: T) => getRef(path).push(data);

export const pushKey = (path: string) => cleanPushKey(getRef(path).push().key!);

export const set = <T>(path: string, data: T) => getRef(path).set(data);

export const update = <T extends object>(path: string, data: T, allowRootQuery: boolean = false) =>
  getRef(path, allowRootQuery).update(data);

export const onValue = <T>(path: string, cb: (val: Nullable<T>) => void) =>
  getRef(path).on("value", (snap) => cb(snap.val()));

export const queryOrderByChildEqualTo = <T>({ path, childKey, queryValue, limit = 1000 }: QueryOrderByChildParams) =>
  getRef(path)
    .orderByChild(String(childKey))
    .equalTo(queryValue)
    .limitToFirst(limit)
    .once("value")
    .then((snap) => snap.val() as Nullable<T>);

export const queryByKeyLimit = <T>({ path, limit, order = "limitToFirst" }: QueryByKeyLimitParams) =>
  getRef(path)
    .orderByKey()
    [order](limit)
    .once("value")
    .then((snap) => snap.val() as Nullable<T>);

export const queryByKeyStartAndEndAt = <T>({ path, startAt, endAt }: QueryByKeyStartAndEndAtParams) =>
  getRef(path)
    .orderByKey()
    .startAt(startAt)
    .endAt(endAt)
    .once("value")
    .then((snap) => snap.val() as Nullable<T>);

let initialized = false;
export const initializeAdminApp = (
  appOptions?: ServiceAccount,
  databaseURL?: string,
  { isDev }: { isDev?: boolean } = { isDev: false }
) => {
  const init = () => {
    if (!admin.apps.length && !initialized) {
      admin.initializeApp(
        appOptions && databaseURL
          ? {
              credential: admin.credential.cert(appOptions),
              databaseURL,
            }
          : undefined
      );
      initialized = true;
    }
  };

  if (isDev)
    try {
      init();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  else init();
};

export function initializeBackendApp() {
  const { TETRACTYS_SERVICE_ACCOUNT } = process.env;
  if (!TETRACTYS_SERVICE_ACCOUNT) throw new Error("TETRACTYS_SERVICE_ACCOUNT is not set");

  initializeAdminApp(
    JSON.parse(TETRACTYS_SERVICE_ACCOUNT) as ServiceAccount,
    `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
  );
}

export const remove = (path: string) => getRef(path).remove();

export const transactionWithCb = <T>(path: string, cb: (val: Nullable<T>) => T) => getRef(path).transaction(cb);

export const updateUser = (uid: string, updateRequest: UpdateRequest) => getAuth().updateUser(uid, updateRequest);

export const generatePasswordResetLink = (uid: string) => getAuth().generatePasswordResetLink(uid);

export const getSignedUrl = (bucket: string, path: string) => {
  const fileRef = getStorage().bucket(bucket).file(path);

  return getDownloadURL(fileRef);
};

export const listUsers = async (pageToken?: string, users: UserRecord[] = []): Promise<UserRecord[]> => {
  const result = await getAuth().listUsers(1000, pageToken);
  const newUsers = [...users, ...result.users];

  if (result.pageToken) {
    return listUsers(result.pageToken, newUsers);
  }

  return newUsers;
};

export const deleteUser = (uid: string) => getAuth().deleteUser(uid);

export const verifyIdToken = (token: string) => getAuth().verifyIdToken(token);
