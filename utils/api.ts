import { NextApiRequest } from "next";
import type { IncomingMessage } from "http";

export const absoluteUrl = (req: NextApiRequest | IncomingMessage) => {
  let protocol = "https:";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (host && host.indexOf("localhost") > -1) {
    protocol = "http:";
  }

  return {
    protocol,
    host,
    origin: `${protocol}//${host}`,
    fullUrl: `${protocol}//${host}${req.url}`,
  };
};
