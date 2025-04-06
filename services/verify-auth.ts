import { getOwners } from "@/soil/services/server-data";
import { get, verifyIdToken } from "@/soil/services/firebase-admin";
import type { UserState } from "./types";

const { FIREBASE_PROJECT_ID } = process.env;
const ROOT_URI = `https://console.firebase.google.com/u/0/project/${FIREBASE_PROJECT_ID}/database/${FIREBASE_PROJECT_ID}-default-rtdb/data/`;

export async function verifyAuth(request: Request) {
  // Get authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("Unauthorized");
    return new Error("Unauthorized");
  }

  // Verify Firebase token
  try {
    const token = authHeader.split("Bearer ")[1];
    return verifyIdToken(token);
  } catch (error) {
    console.error("Invalid token", error);
    return new Error("Invalid token");
  }
}

export async function verifyTetractysOwnership(request: Request) {
  const { searchParams } = new URL(request.url);
  const tetractysKey = searchParams.get("tetractysKey");
  if (!tetractysKey) return new Error("Missing tetractysKey parameter");

  const authResponse = await verifyAuth(request);
  if (authResponse instanceof Error || !authResponse.uid) return new Error(`Unauthorized: ${authResponse.message}`);

  if (!tetractysKey) return new Error("Missing tetractysKey parameter");
  console.log(`${ROOT_URI}~2Fdata~2Ftetractys~2F${tetractysKey}`);

  const owners = await getOwners("tetractys", tetractysKey);
  if (!owners?.[authResponse.uid]) {
    return new Error(`Unauthorized: ${authResponse.uid} is not an owner of ${tetractysKey}`);
  }

  const creditsPath = `userState/${authResponse.uid}/aiCredits`;
  const credits = await get<UserState["aiCredits"]>(creditsPath);
  if (!credits || credits <= 0) return new Error("Insufficient credits");

  return { tetractysKey, authResponse };
}

export async function verifyAdmin(request: Request) {
  const authResponse = await verifyAuth(request);
  if (authResponse instanceof Error || !authResponse.uid) return new Error(`Unauthorized: ${authResponse.message}`);

  const admins = await get<Record<string, boolean>>("admins");
  if (!admins?.[authResponse.uid]) return new Error("Unauthorized: Not an admin");

  return true;
}
