var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// keygen.ts
var keygen_exports = {};
__export(keygen_exports, {
  ed25519Keygen: () => ed25519Keygen,
  useFetchImplementation: () => useFetchImplementation
});
import * as ed25519 from "@noble/ed25519";
import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
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
  let inputKey = sha256(
    ed25519.utils.hexToBytes(
      sig.toLowerCase().startsWith("0x") ? sig.slice(2) : sig
    )
  );
  let info = `${caip10}:${username}`;
  let salt = sha256(`${info}:${password ? password : ""}:${sig.slice(-64)}`);
  let hashKey = hkdf(sha256, inputKey, salt, info, 42);
  let privateKey = ed25519.utils.hashToPrivateScalar(hashKey);
  let publicKey = await ed25519.getPublicKey(privateKey);
  return [Stringify(privateKey), ed25519.utils.bytesToHex(publicKey)];
}

// index.ts
import * as secp256k1 from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 as sha2562 } from "@noble/hashes/sha256";
secp256k1.utils.hmacSha256Sync = (key, ...msgs) => hmac(sha2562, key, secp256k1.utils.concatBytes(...msgs));
secp256k1.utils.sha256Sync = (...msgs) => sha2562(secp256k1.utils.concatBytes(...msgs));
export {
  keygen_exports as keygen
};
