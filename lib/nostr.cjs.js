"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var nostr_tools_exports = {};
__export(nostr_tools_exports, {
  keygen: () => keygen_exports
});
module.exports = __toCommonJS(nostr_tools_exports);

// keygen.ts
var keygen_exports = {};
__export(keygen_exports, {
  ed25519Keygen: () => ed25519Keygen,
  useFetchImplementation: () => useFetchImplementation
});
var ed25519 = __toESM(require("@noble/ed25519"));
var import_hkdf = require("@noble/hashes/hkdf");
var import_sha256 = require("@noble/hashes/sha256");
var _fetch;
try {
  _fetch = fetch;
} catch {
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
function Stringify(arg) {
  return JSON.parse(JSON.stringify(
    arg,
    (key, value) => typeof value === "bigint" ? value.toString() : value
  ));
}
async function ed25519Keygen(username, caip10, sig, password) {
  if (sig.length < 64)
    throw new Error("Signature too short; length should be 65 bytes");
  let inputKey = (0, import_sha256.sha256)(
    ed25519.utils.hexToBytes(
      sig.toLowerCase().startsWith("0x") ? sig.slice(2) : sig
    )
  );
  let info = `${caip10}:${username}`;
  let salt = (0, import_sha256.sha256)(`${info}:${password ? password : ""}:${sig.slice(-64)}`);
  let hashKey = (0, import_hkdf.hkdf)(import_sha256.sha256, inputKey, salt, info, 42);
  let privateKey = ed25519.utils.hashToPrivateScalar(hashKey);
  let publicKey = await ed25519.getPublicKey(privateKey);
  return [Stringify(privateKey), ed25519.utils.bytesToHex(publicKey)];
}

// index.ts
var secp256k1 = __toESM(require("@noble/secp256k1"));
var import_hmac = require("@noble/hashes/hmac");
var import_sha2562 = require("@noble/hashes/sha256");
secp256k1.utils.hmacSha256Sync = (key, ...msgs) => (0, import_hmac.hmac)(import_sha2562.sha256, key, secp256k1.utils.concatBytes(...msgs));
secp256k1.utils.sha256Sync = (...msgs) => (0, import_sha2562.sha256)(secp256k1.utils.concatBytes(...msgs));
