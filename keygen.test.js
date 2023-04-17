/* eslint-env jest */
const fetch = require('node-fetch')
const { keygen } = require('./lib/nostr.cjs')
globalThis.crypto = require('crypto')
require('dotenv').config({path: '.env'})

keygen.useFetchImplementation(fetch)

let address = '0x0d2C290bb3fE24D8D566268d5c41527c519715Db' // ← signing checksummed ethereum pubkey/address
let caip10 = `eip155:1:${address}`

// @dev : uses arbitrary signature not linked to any ethereum account to test key generation
// SHOULD result in successful key generation
test('ed25519 Keypair from Deterministic Signature and Identifiers', async () => {
  let username = 'my-key'
  let signature = 'f'.padEnd(130, 'f')
  let password = 'hello world'
  expect(
    await keygen.ed25519Keygen(username, caip10, signature, password)
  ).toEqual([
    '2446079970879875534625288097698089547721086425684254238033389593391155679990',
    'f190a7b57c4e6d24b6beadb0056b5668234510f78c1f95a8dc0dd8af16cb7137'
  ])

  // without password
  expect(await keygen.ed25519Keygen(username, caip10, signature)).toEqual([
    '4563769215953396381567705028820106256908059201729449186620742679838714540378',
    '54a961a431f234b6192b5a8794342f30f9c8a85191ba0d3330ca229a223f3ba7'
  ])

  // 0x+hex signature; SHOULD BE agnostic to '0x' prefix
  expect(
    await keygen.ed25519Keygen(username, caip10, '0x' + signature, password)
  ).toEqual([
    '2446079970879875534625288097698089547721086425684254238033389593391155679990',
    'f190a7b57c4e6d24b6beadb0056b5668234510f78c1f95a8dc0dd8af16cb7137'
  ])
})
