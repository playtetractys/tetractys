const path = require("path");
const fs = require("fs");

const authIsAdmin = "root.child('admins').child(auth.uid).val() === true";
const authUidIsUid = "auth.uid === $uid";
const authNotNull = "auth !== null";
const isNumber = "newData.isNumber()";
const authIsDataOwner = (dataType: string, dataKey: string = "$dataKey") =>
  `root.child('owners').child(${dataType}).child(${dataKey}).child(auth.uid).exists()`;
const authIsConnectingDataOwner =
  "root.child('owners').child($connectionType).child($connectionKey).child(auth.uid).exists()";

// Data Connection Access
const connectionAccessType = "data.child('connectionAccess/connectionType').val()";
const connectionAccessKey = "data.child('connectionAccess/connectionKey').val()";
const uidDataType = "data.child('connectionAccess/uidDataType').val()";
const readConnectionAccessBoolean = "data.child('connectionAccess/read').val() === true";
const writeConnectionAccessBoolean = "data.child('connectionAccess/write').val() === true";
const connectionAccess = `root.child('connectionDataLists').child(${connectionAccessType}).child(${connectionAccessKey}).child(${uidDataType}).child(auth.uid).exists()`;
const userIsAppUser = "root.child('data/appUser').child(auth.uid).exists()";

const rootData = "root.child('data').child($dataType).child($dataKey)";

const publicAccess = "data.child('publicAccess').val() === true";
const rootDataPublicAccess = `${rootData}.child('publicAccess').val() === true`;

const dataReadRules = (dataType: string) =>
  `data.val() === null || (${publicAccess} && ${authNotNull}) || ${authIsDataOwner(
    dataType
  )} || (${readConnectionAccessBoolean} && ${connectionAccess})`;

const dataWriteRules = (dataType: string) =>
  `${authIsDataOwner(dataType)} || (${writeConnectionAccessBoolean} && ${connectionAccess})`;

const isPublicDataType = (dataType: string) => `root.child('publicDataType').child(${dataType}).val() === true`;
const isPublicDataTypeAndAuth = (dataType: string) => `${isPublicDataType(dataType)} && ${authNotNull}`;

const isUserWOwerPublicDataType = (dataType: string) =>
  `root.child('publicDataType').child(${dataType}).val() === true`;

const rules = {
  ".read": authIsAdmin,
  ".write": authIsAdmin,
  appVersion: { ".read": true },
  appSettings: { ".read": true },
  credits: {
    $uid: {
      ".read": authUidIsUid,
    },
  },
  tracking: {
    $uid: {
      $trackingKey: {
        ".read": authUidIsUid,
        ".write": `!data.exists() && ${authNotNull} && ${authUidIsUid}`,
      },
    },
  },
  userDataLists: {
    $uid: {
      ".read": authUidIsUid,
      ".write": authUidIsUid,
      $dataType: {
        $dataKey: {
          ".read": dataReadRules("$dataType"),
          ".write": dataWriteRules("$dataType"),
          ".validate": isNumber,
        },
      },
    },
  },
  publicDataLists: {
    $dataType: {
      ".read": authNotNull,
      $dataKey: {
        ".write": authIsDataOwner("$dataType"),
        ".validate": isNumber,
      },
    },
  },
  data: {
    profile: {
      $uid: {
        ".read": authUidIsUid,
        ".write": authUidIsUid,
      },
    },
    userState: {
      $uid: {
        ".read": authUidIsUid,
      },
    },
    galaxy: {
      $galaxyKey: {
        ".read": `root.child('userState/galaxyKey').val() === $galaxyKey`,
      },
    },
    sector: {
      $sectorKey: {
        ".read": `root.child('userState/sectorKey').val() === $sectorKey`,
      },
    },
    star: {
      $starKey: {
        ".read": `root.child('userState/starKey').val() === $starKey`,
      },
    },
    planet: {
      $planetKey: {
        ".read": `root.child('userState/planetKey').val() === $planetKey`,
      },
    },
    tetractys: {
      $tetractysKey: {
        ".read": authUidIsUid,
      },
    },
    admiral: {
      $admiralKey: {
        ".read": authNotNull,
        ".write": authIsDataOwner("admiral", "$admiralKey"),
      },
    },
    admiralState: {
      $admiralStateKey: {
        ".read": authIsDataOwner("admiralState", "$admiralStateKey"),
      },
    },
    ship: {
      $shipKey: {
        ".read": authIsDataOwner("ship", "$shipKey"),
      },
    },
  },
  owners: {
    $dataType: {
      $dataKey: {
        ".read": "data.val() === null || data.child(auth.uid).exists()",
        ".write": "!data.exists() || newData.child(auth.uid).exists()",
        $uid: {
          ".read": authUidIsUid,
          ".write": authUidIsUid,
        },
      },
    },
  },
  connectionDataLists: {
    $dataType: {
      ".read": isPublicDataType("$dataType"),
      $dataKey: {
        ".read": `data.val() === null || (${rootDataPublicAccess} && ${authNotNull}) || ${authIsDataOwner(
          "$dataType"
        )}`,
        $connectionType: {
          ".read": isPublicDataType("$connectionType"),
          ".write": isPublicDataTypeAndAuth("$connectionType"),
          $connectionKey: {
            ".read": true,
            ".validate": isNumber,
          },
        },
      },
    },
  },
};

fs.writeFileSync(path.resolve(__dirname, "./database.rules.json"), `${JSON.stringify({ rules }, null, 2)}\n`);
