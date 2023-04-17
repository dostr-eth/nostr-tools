"use strict";
var NostrTools = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod3) => function __require() {
    return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
  };
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
  var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
    isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
    mod3
  ));
  var __toCommonJS = (mod3) => __copyProps(__defProp({}, "__esModule", { value: true }), mod3);

  // <define:process>
  var init_define_process = __esm({
    "<define:process>"() {
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
      init_define_process();
    }
  });

  // index.ts
  var nostr_tools_exports = {};
  __export(nostr_tools_exports, {
    keygen: () => keygen_exports
  });
  init_define_process();

  // keygen.ts
  var keygen_exports = {};
  __export(keygen_exports, {
    ed25519Keygen: () => ed25519Keygen,
    useFetchImplementation: () => useFetchImplementation
  });
  init_define_process();

  // node_modules/@noble/ed25519/lib/esm/index.js
  init_define_process();
  var nodeCrypto = __toESM(require_crypto(), 1);
  var _0n = BigInt(0);
  var _1n = BigInt(1);
  var _2n = BigInt(2);
  var _255n = BigInt(255);
  var CURVE_ORDER = _2n ** BigInt(252) + BigInt("27742317777372353535851937790883648493");
  var CURVE = Object.freeze({
    a: BigInt(-1),
    d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
    P: _2n ** _255n - BigInt(19),
    l: CURVE_ORDER,
    n: CURVE_ORDER,
    h: BigInt(8),
    Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
    Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
  });
  var MAX_256B = _2n ** BigInt(256);
  var SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
  var SQRT_D = BigInt("6853475219497561581579357271197624642482790079785650197046958215289687604742");
  var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
  var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
  var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
  var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
  var ExtendedPoint = class {
    constructor(x, y, z, t) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.t = t;
    }
    static fromAffine(p) {
      if (!(p instanceof Point)) {
        throw new TypeError("ExtendedPoint#fromAffine: expected Point");
      }
      if (p.equals(Point.ZERO))
        return ExtendedPoint.ZERO;
      return new ExtendedPoint(p.x, p.y, _1n, mod(p.x * p.y));
    }
    static toAffineBatch(points) {
      const toInv = invertBatch(points.map((p) => p.z));
      return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
      return this.toAffineBatch(points).map(this.fromAffine);
    }
    equals(other) {
      assertExtPoint(other);
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      const X1Z2 = mod(X1 * Z2);
      const X2Z1 = mod(X2 * Z1);
      const Y1Z2 = mod(Y1 * Z2);
      const Y2Z1 = mod(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    negate() {
      return new ExtendedPoint(mod(-this.x), this.y, this.z, mod(-this.t));
    }
    double() {
      const { x: X1, y: Y1, z: Z1 } = this;
      const { a } = CURVE;
      const A = mod(X1 ** _2n);
      const B = mod(Y1 ** _2n);
      const C = mod(_2n * mod(Z1 ** _2n));
      const D = mod(a * A);
      const E = mod(mod((X1 + Y1) ** _2n) - A - B);
      const G = D + B;
      const F = G - C;
      const H = D - B;
      const X3 = mod(E * F);
      const Y3 = mod(G * H);
      const T3 = mod(E * H);
      const Z3 = mod(F * G);
      return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    add(other) {
      assertExtPoint(other);
      const { x: X1, y: Y1, z: Z1, t: T1 } = this;
      const { x: X2, y: Y2, z: Z2, t: T2 } = other;
      const A = mod((Y1 - X1) * (Y2 + X2));
      const B = mod((Y1 + X1) * (Y2 - X2));
      const F = mod(B - A);
      if (F === _0n)
        return this.double();
      const C = mod(Z1 * _2n * T2);
      const D = mod(T1 * _2n * Z2);
      const E = D + C;
      const G = B + A;
      const H = D - C;
      const X3 = mod(E * F);
      const Y3 = mod(G * H);
      const T3 = mod(E * H);
      const Z3 = mod(F * G);
      return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    precomputeWindow(W) {
      const windows = 1 + 256 / W;
      const points = [];
      let p = this;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        for (let i = 1; i < 2 ** (W - 1); i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    }
    wNAF(n, affinePoint) {
      if (!affinePoint && this.equals(ExtendedPoint.BASE))
        affinePoint = Point.BASE;
      const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
      if (256 % W) {
        throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      }
      let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
      if (!precomputes) {
        precomputes = this.precomputeWindow(W);
        if (affinePoint && W !== 1) {
          precomputes = ExtendedPoint.normalizeZ(precomputes);
          pointPrecomputes.set(affinePoint, precomputes);
        }
      }
      let p = ExtendedPoint.ZERO;
      let f = ExtendedPoint.ZERO;
      const windows = 1 + 256 / W;
      const windowSize = 2 ** (W - 1);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n;
        }
        if (wbits === 0) {
          let pr = precomputes[offset];
          if (window % 2)
            pr = pr.negate();
          f = f.add(pr);
        } else {
          let cached = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            cached = cached.negate();
          p = p.add(cached);
        }
      }
      return ExtendedPoint.normalizeZ([p, f])[0];
    }
    multiply(scalar, affinePoint) {
      return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
    }
    multiplyUnsafe(scalar) {
      let n = normalizeScalar(scalar, CURVE.l, false);
      const G = ExtendedPoint.BASE;
      const P0 = ExtendedPoint.ZERO;
      if (n === _0n)
        return P0;
      if (this.equals(P0) || n === _1n)
        return this;
      if (this.equals(G))
        return this.wNAF(n);
      let p = P0;
      let d = this;
      while (n > _0n) {
        if (n & _1n)
          p = p.add(d);
        d = d.double();
        n >>= _1n;
      }
      return p;
    }
    isSmallOrder() {
      return this.multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
    }
    isTorsionFree() {
      return this.multiplyUnsafe(CURVE.l).equals(ExtendedPoint.ZERO);
    }
    toAffine(invZ = invert(this.z)) {
      const { x, y, z } = this;
      const ax = mod(x * invZ);
      const ay = mod(y * invZ);
      const zz = mod(z * invZ);
      if (zz !== _1n)
        throw new Error("invZ was invalid");
      return new Point(ax, ay);
    }
    fromRistrettoBytes() {
      legacyRist();
    }
    toRistrettoBytes() {
      legacyRist();
    }
    fromRistrettoHash() {
      legacyRist();
    }
  };
  ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod(CURVE.Gx * CURVE.Gy));
  ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
  function assertExtPoint(other) {
    if (!(other instanceof ExtendedPoint))
      throw new TypeError("ExtendedPoint expected");
  }
  function assertRstPoint(other) {
    if (!(other instanceof RistrettoPoint))
      throw new TypeError("RistrettoPoint expected");
  }
  function legacyRist() {
    throw new Error("Legacy method: switch to RistrettoPoint");
  }
  var RistrettoPoint = class {
    constructor(ep) {
      this.ep = ep;
    }
    static calcElligatorRistrettoMap(r0) {
      const { d } = CURVE;
      const r = mod(SQRT_M1 * r0 * r0);
      const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
      let c = BigInt(-1);
      const D = mod((c - d * r) * mod(r + d));
      let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
      let s_ = mod(s * r0);
      if (!edIsNegative(s_))
        s_ = mod(-s_);
      if (!Ns_D_is_sq)
        s = s_;
      if (!Ns_D_is_sq)
        c = r;
      const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
      const s2 = s * s;
      const W0 = mod((s + s) * D);
      const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
      const W2 = mod(_1n - s2);
      const W3 = mod(_1n + s2);
      return new ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
    }
    static hashToCurve(hex) {
      hex = ensureBytes(hex, 64);
      const r1 = bytes255ToNumberLE(hex.slice(0, 32));
      const R1 = this.calcElligatorRistrettoMap(r1);
      const r2 = bytes255ToNumberLE(hex.slice(32, 64));
      const R2 = this.calcElligatorRistrettoMap(r2);
      return new RistrettoPoint(R1.add(R2));
    }
    static fromHex(hex) {
      hex = ensureBytes(hex, 32);
      const { a, d } = CURVE;
      const emsg = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint";
      const s = bytes255ToNumberLE(hex);
      if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s))
        throw new Error(emsg);
      const s2 = mod(s * s);
      const u1 = mod(_1n + a * s2);
      const u2 = mod(_1n - a * s2);
      const u1_2 = mod(u1 * u1);
      const u2_2 = mod(u2 * u2);
      const v = mod(a * d * u1_2 - u2_2);
      const { isValid, value: I } = invertSqrt(mod(v * u2_2));
      const Dx = mod(I * u2);
      const Dy = mod(I * Dx * v);
      let x = mod((s + s) * Dx);
      if (edIsNegative(x))
        x = mod(-x);
      const y = mod(u1 * Dy);
      const t = mod(x * y);
      if (!isValid || edIsNegative(t) || y === _0n)
        throw new Error(emsg);
      return new RistrettoPoint(new ExtendedPoint(x, y, _1n, t));
    }
    toRawBytes() {
      let { x, y, z, t } = this.ep;
      const u1 = mod(mod(z + y) * mod(z - y));
      const u2 = mod(x * y);
      const { value: invsqrt } = invertSqrt(mod(u1 * u2 ** _2n));
      const D1 = mod(invsqrt * u1);
      const D2 = mod(invsqrt * u2);
      const zInv = mod(D1 * D2 * t);
      let D;
      if (edIsNegative(t * zInv)) {
        let _x = mod(y * SQRT_M1);
        let _y = mod(x * SQRT_M1);
        x = _x;
        y = _y;
        D = mod(D1 * INVSQRT_A_MINUS_D);
      } else {
        D = D2;
      }
      if (edIsNegative(x * zInv))
        y = mod(-y);
      let s = mod((z - y) * D);
      if (edIsNegative(s))
        s = mod(-s);
      return numberTo32BytesLE(s);
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
    toString() {
      return this.toHex();
    }
    equals(other) {
      assertRstPoint(other);
      const a = this.ep;
      const b = other.ep;
      const one = mod(a.x * b.y) === mod(a.y * b.x);
      const two = mod(a.y * b.y) === mod(a.x * b.x);
      return one || two;
    }
    add(other) {
      assertRstPoint(other);
      return new RistrettoPoint(this.ep.add(other.ep));
    }
    subtract(other) {
      assertRstPoint(other);
      return new RistrettoPoint(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
      return new RistrettoPoint(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
      return new RistrettoPoint(this.ep.multiplyUnsafe(scalar));
    }
  };
  RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
  RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var Point = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    static fromHex(hex, strict = true) {
      const { d, P } = CURVE;
      hex = ensureBytes(hex, 32);
      const normed = hex.slice();
      normed[31] = hex[31] & ~128;
      const y = bytesToNumberLE(normed);
      if (strict && y >= P)
        throw new Error("Expected 0 < hex < P");
      if (!strict && y >= MAX_256B)
        throw new Error("Expected 0 < hex < 2**256");
      const y2 = mod(y * y);
      const u = mod(y2 - _1n);
      const v = mod(d * y2 + _1n);
      let { isValid, value: x } = uvRatio(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n) === _1n;
      const isLastByteOdd = (hex[31] & 128) !== 0;
      if (isLastByteOdd !== isXOdd) {
        x = mod(-x);
      }
      return new Point(x, y);
    }
    static async fromPrivateKey(privateKey) {
      return (await getExtendedPublicKey(privateKey)).point;
    }
    toRawBytes() {
      const bytes2 = numberTo32BytesLE(this.y);
      bytes2[31] |= this.x & _1n ? 128 : 0;
      return bytes2;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
    toX25519() {
      const { y } = this;
      const u = mod((_1n + y) * invert(_1n - y));
      return numberTo32BytesLE(u);
    }
    isTorsionFree() {
      return ExtendedPoint.fromAffine(this).isTorsionFree();
    }
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
    negate() {
      return new Point(mod(-this.x), this.y);
    }
    add(other) {
      return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiply(scalar) {
      return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
  };
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
  Point.ZERO = new Point(_0n, _1n);
  function concatBytes(...arrays) {
    if (!arrays.every((a) => a instanceof Uint8Array))
      throw new Error("Expected Uint8Array list");
    if (arrays.length === 1)
      return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, pad);
      pad += arr.length;
    }
    return result;
  }
  var hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Uint8Array expected");
    let hex = "";
    for (let i = 0; i < uint8a.length; i++) {
      hex += hexes[uint8a[i]];
    }
    return hex;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToBytes: expected string, got " + typeof hex);
    }
    if (hex.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex");
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0)
        throw new Error("Invalid byte sequence");
      array[i] = byte;
    }
    return array;
  }
  function numberTo32BytesBE(num) {
    const length = 32;
    const hex = num.toString(16).padStart(length * 2, "0");
    return hexToBytes(hex);
  }
  function numberTo32BytesLE(num) {
    return numberTo32BytesBE(num).reverse();
  }
  function edIsNegative(num) {
    return (mod(num) & _1n) === _1n;
  }
  function bytesToNumberLE(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    return BigInt("0x" + bytesToHex(Uint8Array.from(uint8a).reverse()));
  }
  function bytes255ToNumberLE(bytes2) {
    return mod(bytesToNumberLE(bytes2) & _2n ** _255n - _1n);
  }
  function mod(a, b = CURVE.P) {
    const res = a % b;
    return res >= _0n ? res : b + res;
  }
  function invert(number2, modulo = CURVE.P) {
    if (number2 === _0n || modulo <= _0n) {
      throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
    }
    let a = mod(number2, modulo);
    let b = modulo;
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while (a !== _0n) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function invertBatch(nums, p = CURVE.P) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (num === _0n)
        return acc;
      tmp[i] = acc;
      return mod(acc * num, p);
    }, _1n);
    const inverted = invert(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
      if (num === _0n)
        return acc;
      tmp[i] = mod(acc * tmp[i], p);
      return mod(acc * num, p);
    }, inverted);
    return tmp;
  }
  function pow2(x, power) {
    const { P } = CURVE;
    let res = x;
    while (power-- > _0n) {
      res *= res;
      res %= P;
    }
    return res;
  }
  function pow_2_252_3(x) {
    const { P } = CURVE;
    const _5n = BigInt(5);
    const _10n = BigInt(10);
    const _20n = BigInt(20);
    const _40n = BigInt(40);
    const _80n = BigInt(80);
    const x2 = x * x % P;
    const b2 = x2 * x % P;
    const b4 = pow2(b2, _2n) * b2 % P;
    const b5 = pow2(b4, _1n) * x % P;
    const b10 = pow2(b5, _5n) * b5 % P;
    const b20 = pow2(b10, _10n) * b10 % P;
    const b40 = pow2(b20, _20n) * b20 % P;
    const b80 = pow2(b40, _40n) * b40 % P;
    const b160 = pow2(b80, _80n) * b80 % P;
    const b240 = pow2(b160, _80n) * b80 % P;
    const b250 = pow2(b240, _10n) * b10 % P;
    const pow_p_5_8 = pow2(b250, _2n) * x % P;
    return { pow_p_5_8, b2 };
  }
  function uvRatio(u, v) {
    const v3 = mod(v * v * v);
    const v7 = mod(v3 * v3 * v);
    const pow = pow_2_252_3(u * v7).pow_p_5_8;
    let x = mod(u * v3 * pow);
    const vx2 = mod(v * x * x);
    const root1 = x;
    const root2 = mod(x * SQRT_M1);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === mod(-u);
    const noRoot = vx2 === mod(-u * SQRT_M1);
    if (useRoot1)
      x = root1;
    if (useRoot2 || noRoot)
      x = root2;
    if (edIsNegative(x))
      x = mod(-x);
    return { isValid: useRoot1 || useRoot2, value: x };
  }
  function invertSqrt(number2) {
    return uvRatio(_1n, number2);
  }
  function modlLE(hash2) {
    return mod(bytesToNumberLE(hash2), CURVE.l);
  }
  function equalBytes(b1, b2) {
    if (b1.length !== b2.length) {
      return false;
    }
    for (let i = 0; i < b1.length; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }
    return true;
  }
  function ensureBytes(hex, expectedLength) {
    const bytes2 = hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
    if (typeof expectedLength === "number" && bytes2.length !== expectedLength)
      throw new Error(`Expected ${expectedLength} bytes`);
    return bytes2;
  }
  function normalizeScalar(num, max, strict = true) {
    if (!max)
      throw new TypeError("Specify max value");
    if (typeof num === "number" && Number.isSafeInteger(num))
      num = BigInt(num);
    if (typeof num === "bigint" && num < max) {
      if (strict) {
        if (_0n < num)
          return num;
      } else {
        if (_0n <= num)
          return num;
      }
    }
    throw new TypeError("Expected valid scalar: 0 < scalar < max");
  }
  function adjustBytes25519(bytes2) {
    bytes2[0] &= 248;
    bytes2[31] &= 127;
    bytes2[31] |= 64;
    return bytes2;
  }
  function checkPrivateKey(key) {
    key = typeof key === "bigint" || typeof key === "number" ? numberTo32BytesBE(normalizeScalar(key, MAX_256B)) : ensureBytes(key);
    if (key.length !== 32)
      throw new Error(`Expected 32 bytes`);
    return key;
  }
  function getKeyFromHash(hashed) {
    const head = adjustBytes25519(hashed.slice(0, 32));
    const prefix = hashed.slice(32, 64);
    const scalar = modlLE(head);
    const point = Point.BASE.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  var _sha512Sync;
  async function getExtendedPublicKey(key) {
    return getKeyFromHash(await utils.sha512(checkPrivateKey(key)));
  }
  async function getPublicKey(privateKey) {
    return (await getExtendedPublicKey(privateKey)).pointBytes;
  }
  Point.BASE._setWindowSize(8);
  var crypto = {
    node: nodeCrypto,
    web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
  };
  var utils = {
    TORSION_SUBGROUP: [
      "0100000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
      "0000000000000000000000000000000000000000000000000000000000000080",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
      "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
      "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
    ],
    bytesToHex,
    hexToBytes,
    concatBytes,
    getExtendedPublicKey,
    mod,
    invert,
    hashToPrivateScalar: (hash2) => {
      hash2 = ensureBytes(hash2);
      if (hash2.length < 40 || hash2.length > 1024)
        throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
      return mod(bytesToNumberLE(hash2), CURVE.l - _1n) + _1n;
    },
    randomBytes: (bytesLength = 32) => {
      if (crypto.web) {
        return crypto.web.getRandomValues(new Uint8Array(bytesLength));
      } else if (crypto.node) {
        const { randomBytes } = crypto.node;
        return new Uint8Array(randomBytes(bytesLength).buffer);
      } else {
        throw new Error("The environment doesn't have randomBytes function");
      }
    },
    randomPrivateKey: () => {
      return utils.randomBytes(32);
    },
    sha512: async (...messages) => {
      const message = concatBytes(...messages);
      if (crypto.web) {
        const buffer = await crypto.web.subtle.digest("SHA-512", message.buffer);
        return new Uint8Array(buffer);
      } else if (crypto.node) {
        return Uint8Array.from(crypto.node.createHash("sha512").update(message).digest());
      } else {
        throw new Error("The environment doesn't have sha512 function");
      }
    },
    precompute(windowSize = 8, point = Point.BASE) {
      const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
      cached._setWindowSize(windowSize);
      cached.multiply(_2n);
      return cached;
    },
    sha512Sync: void 0
  };
  Object.defineProperties(utils, {
    sha512Sync: {
      configurable: false,
      get() {
        return _sha512Sync;
      },
      set(val) {
        if (!_sha512Sync)
          _sha512Sync = val;
      }
    }
  });

  // node_modules/@noble/hashes/esm/hkdf.js
  init_define_process();

  // node_modules/@noble/hashes/esm/_assert.js
  init_define_process();
  function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error(`Wrong positive integer: ${n}`);
  }
  function bool(b) {
    if (typeof b !== "boolean")
      throw new Error(`Expected boolean, not ${b}`);
  }
  function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new TypeError(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
  }
  function hash(hash2) {
    if (typeof hash2 !== "function" || typeof hash2.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(hash2.outputLen);
    number(hash2.blockLen);
  }
  function exists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  }
  var assert = {
    number,
    bool,
    bytes,
    hash,
    exists,
    output
  };
  var assert_default = assert;

  // node_modules/@noble/hashes/esm/utils.js
  init_define_process();

  // node_modules/@noble/hashes/esm/cryptoBrowser.js
  init_define_process();
  var crypto2 = {
    node: void 0,
    web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
  };

  // node_modules/@noble/hashes/esm/utils.js
  var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  var rotr = (word, shift) => word << 32 - shift | word >>> shift;
  var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  if (!isLE)
    throw new Error("Non little-endian hardware is not supported");
  var hexes2 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function utf8ToBytes(str) {
    if (typeof str !== "string") {
      throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
    }
    return new TextEncoder().encode(str);
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    if (!(data instanceof Uint8Array))
      throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
    return data;
  }
  var Hash = class {
    clone() {
      return this._cloneInto();
    }
  };
  function wrapConstructor(hashConstructor) {
    const hashC = (message) => hashConstructor().update(toBytes(message)).digest();
    const tmp = hashConstructor();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashConstructor();
    return hashC;
  }

  // node_modules/@noble/hashes/esm/hmac.js
  init_define_process();
  var HMAC = class extends Hash {
    constructor(hash2, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      assert_default.hash(hash2);
      const key = toBytes(_key);
      this.iHash = hash2.create();
      if (typeof this.iHash.update !== "function")
        throw new TypeError("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash2.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      pad.fill(0);
    }
    update(buf) {
      assert_default.exists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      assert_default.exists(this);
      assert_default.bytes(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
  hmac.create = (hash2, key) => new HMAC(hash2, key);

  // node_modules/@noble/hashes/esm/hkdf.js
  function extract(hash2, ikm, salt) {
    assert_default.hash(hash2);
    if (salt === void 0)
      salt = new Uint8Array(hash2.outputLen);
    return hmac(hash2, toBytes(salt), toBytes(ikm));
  }
  var HKDF_COUNTER = new Uint8Array([0]);
  var EMPTY_BUFFER = new Uint8Array();
  function expand(hash2, prk, info, length = 32) {
    assert_default.hash(hash2);
    assert_default.number(length);
    if (length > 255 * hash2.outputLen)
      throw new Error("Length should be <= 255*HashLen");
    const blocks = Math.ceil(length / hash2.outputLen);
    if (info === void 0)
      info = EMPTY_BUFFER;
    const okm = new Uint8Array(blocks * hash2.outputLen);
    const HMAC2 = hmac.create(hash2, prk);
    const HMACTmp = HMAC2._cloneInto();
    const T = new Uint8Array(HMAC2.outputLen);
    for (let counter = 0; counter < blocks; counter++) {
      HKDF_COUNTER[0] = counter + 1;
      HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
      okm.set(T, hash2.outputLen * counter);
      HMAC2._cloneInto(HMACTmp);
    }
    HMAC2.destroy();
    HMACTmp.destroy();
    T.fill(0);
    HKDF_COUNTER.fill(0);
    return okm.slice(0, length);
  }
  var hkdf = (hash2, ikm, salt, info, length) => expand(hash2, extract(hash2, ikm, salt), info, length);

  // node_modules/@noble/hashes/esm/sha256.js
  init_define_process();

  // node_modules/@noble/hashes/esm/_sha2.js
  init_define_process();
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  var SHA2 = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      assert_default.exists(this);
      const { view, buffer, blockLen } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      assert_default.exists(this);
      assert_default.output(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // node_modules/@noble/hashes/esm/sha256.js
  var Chi = (a, b, c) => a & b ^ ~a & c;
  var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
  var SHA256_K = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var IV = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W = new Uint32Array(64);
  var SHA256 = class extends SHA2 {
    constructor() {
      super(64, 32, 8, false);
      this.A = IV[0] | 0;
      this.B = IV[1] | 0;
      this.C = IV[2] | 0;
      this.D = IV[3] | 0;
      this.E = IV[4] | 0;
      this.F = IV[5] | 0;
      this.G = IV[6] | 0;
      this.H = IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var SHA224 = class extends SHA256 {
    constructor() {
      super();
      this.A = 3238371032 | 0;
      this.B = 914150663 | 0;
      this.C = 812702999 | 0;
      this.D = 4144912697 | 0;
      this.E = 4290775857 | 0;
      this.F = 1750603025 | 0;
      this.G = 1694076839 | 0;
      this.H = 3204075428 | 0;
      this.outputLen = 28;
    }
  };
  var sha256 = wrapConstructor(() => new SHA256());
  var sha224 = wrapConstructor(() => new SHA224());

  // keygen.ts
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
      utils.hexToBytes(
        sig.toLowerCase().startsWith("0x") ? sig.slice(2) : sig
      )
    );
    let info = `${caip10}:${username}`;
    let salt = sha256(`${info}:${password ? password : ""}:${sig.slice(-64)}`);
    let hashKey = hkdf(sha256, inputKey, salt, info, 42);
    let privateKey = utils.hashToPrivateScalar(hashKey);
    let publicKey = await getPublicKey(privateKey);
    return [Stringify(privateKey), utils.bytesToHex(publicKey)];
  }

  // node_modules/@noble/secp256k1/lib/esm/index.js
  init_define_process();
  var nodeCrypto2 = __toESM(require_crypto(), 1);
  var _0n2 = BigInt(0);
  var _1n2 = BigInt(1);
  var _2n2 = BigInt(2);
  var _3n = BigInt(3);
  var _8n = BigInt(8);
  var CURVE2 = Object.freeze({
    a: _0n2,
    b: BigInt(7),
    P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h: _1n2,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
  });
  function weistrass(x) {
    const { a, b } = CURVE2;
    const x2 = mod2(x * x);
    const x3 = mod2(x2 * x);
    return mod2(x3 + a * x + b);
  }
  var USE_ENDOMORPHISM = CURVE2.a === _0n2;
  var ShaError = class extends Error {
    constructor(message) {
      super(message);
    }
  };
  var JacobianPoint = class {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    static fromAffine(p) {
      if (!(p instanceof Point2)) {
        throw new TypeError("JacobianPoint#fromAffine: expected Point");
      }
      return new JacobianPoint(p.x, p.y, _1n2);
    }
    static toAffineBatch(points) {
      const toInv = invertBatch2(points.map((p) => p.z));
      return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
      return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
    }
    equals(other) {
      if (!(other instanceof JacobianPoint))
        throw new TypeError("JacobianPoint expected");
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      const Z1Z1 = mod2(Z1 * Z1);
      const Z2Z2 = mod2(Z2 * Z2);
      const U1 = mod2(X1 * Z2Z2);
      const U2 = mod2(X2 * Z1Z1);
      const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
      const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
      return U1 === U2 && S1 === S2;
    }
    negate() {
      return new JacobianPoint(this.x, mod2(-this.y), this.z);
    }
    double() {
      const { x: X1, y: Y1, z: Z1 } = this;
      const A = mod2(X1 * X1);
      const B = mod2(Y1 * Y1);
      const C = mod2(B * B);
      const x1b = X1 + B;
      const D = mod2(_2n2 * (mod2(x1b * x1b) - A - C));
      const E = mod2(_3n * A);
      const F = mod2(E * E);
      const X3 = mod2(F - _2n2 * D);
      const Y3 = mod2(E * (D - X3) - _8n * C);
      const Z3 = mod2(_2n2 * Y1 * Z1);
      return new JacobianPoint(X3, Y3, Z3);
    }
    add(other) {
      if (!(other instanceof JacobianPoint))
        throw new TypeError("JacobianPoint expected");
      const { x: X1, y: Y1, z: Z1 } = this;
      const { x: X2, y: Y2, z: Z2 } = other;
      if (X2 === _0n2 || Y2 === _0n2)
        return this;
      if (X1 === _0n2 || Y1 === _0n2)
        return other;
      const Z1Z1 = mod2(Z1 * Z1);
      const Z2Z2 = mod2(Z2 * Z2);
      const U1 = mod2(X1 * Z2Z2);
      const U2 = mod2(X2 * Z1Z1);
      const S1 = mod2(mod2(Y1 * Z2) * Z2Z2);
      const S2 = mod2(mod2(Y2 * Z1) * Z1Z1);
      const H = mod2(U2 - U1);
      const r = mod2(S2 - S1);
      if (H === _0n2) {
        if (r === _0n2) {
          return this.double();
        } else {
          return JacobianPoint.ZERO;
        }
      }
      const HH = mod2(H * H);
      const HHH = mod2(H * HH);
      const V = mod2(U1 * HH);
      const X3 = mod2(r * r - HHH - _2n2 * V);
      const Y3 = mod2(r * (V - X3) - S1 * HHH);
      const Z3 = mod2(Z1 * Z2 * H);
      return new JacobianPoint(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiplyUnsafe(scalar) {
      const P0 = JacobianPoint.ZERO;
      if (typeof scalar === "bigint" && scalar === _0n2)
        return P0;
      let n = normalizeScalar2(scalar);
      if (n === _1n2)
        return this;
      if (!USE_ENDOMORPHISM) {
        let p = P0;
        let d2 = this;
        while (n > _0n2) {
          if (n & _1n2)
            p = p.add(d2);
          d2 = d2.double();
          n >>= _1n2;
        }
        return p;
      }
      let { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
      let k1p = P0;
      let k2p = P0;
      let d = this;
      while (k1 > _0n2 || k2 > _0n2) {
        if (k1 & _1n2)
          k1p = k1p.add(d);
        if (k2 & _1n2)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n2;
        k2 >>= _1n2;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new JacobianPoint(mod2(k2p.x * CURVE2.beta), k2p.y, k2p.z);
      return k1p.add(k2p);
    }
    precomputeWindow(W) {
      const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
      const points = [];
      let p = this;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        for (let i = 1; i < 2 ** (W - 1); i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    }
    wNAF(n, affinePoint) {
      if (!affinePoint && this.equals(JacobianPoint.BASE))
        affinePoint = Point2.BASE;
      const W = affinePoint && affinePoint._WINDOW_SIZE || 1;
      if (256 % W) {
        throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
      }
      let precomputes = affinePoint && pointPrecomputes2.get(affinePoint);
      if (!precomputes) {
        precomputes = this.precomputeWindow(W);
        if (affinePoint && W !== 1) {
          precomputes = JacobianPoint.normalizeZ(precomputes);
          pointPrecomputes2.set(affinePoint, precomputes);
        }
      }
      let p = JacobianPoint.ZERO;
      let f = JacobianPoint.ZERO;
      const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
      const windowSize = 2 ** (W - 1);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n2;
        }
        if (wbits === 0) {
          let pr = precomputes[offset];
          if (window % 2)
            pr = pr.negate();
          f = f.add(pr);
        } else {
          let cached = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            cached = cached.negate();
          p = p.add(cached);
        }
      }
      return { p, f };
    }
    multiply(scalar, affinePoint) {
      let n = normalizeScalar2(scalar);
      let point;
      let fake;
      if (USE_ENDOMORPHISM) {
        const { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
        let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
        let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new JacobianPoint(mod2(k2p.x * CURVE2.beta), k2p.y, k2p.z);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(n, affinePoint);
        point = p;
        fake = f;
      }
      return JacobianPoint.normalizeZ([point, fake])[0];
    }
    toAffine(invZ = invert2(this.z)) {
      const { x, y, z } = this;
      const iz1 = invZ;
      const iz2 = mod2(iz1 * iz1);
      const iz3 = mod2(iz2 * iz1);
      const ax = mod2(x * iz2);
      const ay = mod2(y * iz3);
      const zz = mod2(z * iz1);
      if (zz !== _1n2)
        throw new Error("invZ was invalid");
      return new Point2(ax, ay);
    }
  };
  JacobianPoint.BASE = new JacobianPoint(CURVE2.Gx, CURVE2.Gy, _1n2);
  JacobianPoint.ZERO = new JacobianPoint(_0n2, _1n2, _0n2);
  var pointPrecomputes2 = /* @__PURE__ */ new WeakMap();
  var Point2 = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes2.delete(this);
    }
    hasEvenY() {
      return this.y % _2n2 === _0n2;
    }
    static fromCompressedHex(bytes2) {
      const isShort = bytes2.length === 32;
      const x = bytesToNumber(isShort ? bytes2 : bytes2.subarray(1));
      if (!isValidFieldElement(x))
        throw new Error("Point is not on curve");
      const y2 = weistrass(x);
      let y = sqrtMod(y2);
      const isYOdd = (y & _1n2) === _1n2;
      if (isShort) {
        if (isYOdd)
          y = mod2(-y);
      } else {
        const isFirstByteOdd = (bytes2[0] & 1) === 1;
        if (isFirstByteOdd !== isYOdd)
          y = mod2(-y);
      }
      const point = new Point2(x, y);
      point.assertValidity();
      return point;
    }
    static fromUncompressedHex(bytes2) {
      const x = bytesToNumber(bytes2.subarray(1, 33));
      const y = bytesToNumber(bytes2.subarray(33, 65));
      const point = new Point2(x, y);
      point.assertValidity();
      return point;
    }
    static fromHex(hex) {
      const bytes2 = ensureBytes2(hex);
      const len = bytes2.length;
      const header = bytes2[0];
      if (len === 32 || len === 33 && (header === 2 || header === 3)) {
        return this.fromCompressedHex(bytes2);
      }
      if (len === 65 && header === 4)
        return this.fromUncompressedHex(bytes2);
      throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
    }
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(normalizePrivateKey(privateKey));
    }
    static fromSignature(msgHash, signature, recovery) {
      msgHash = ensureBytes2(msgHash);
      const h = truncateHash(msgHash);
      const { r, s } = normalizeSignature(signature);
      if (recovery !== 0 && recovery !== 1) {
        throw new Error("Cannot recover signature: invalid recovery bit");
      }
      const prefix = recovery & 1 ? "03" : "02";
      const R = Point2.fromHex(prefix + numTo32bStr(r));
      const { n } = CURVE2;
      const rinv = invert2(r, n);
      const u1 = mod2(-h * rinv, n);
      const u2 = mod2(s * rinv, n);
      const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("Cannot recover signature: point at infinify");
      Q.assertValidity();
      return Q;
    }
    toRawBytes(isCompressed = false) {
      return hexToBytes2(this.toHex(isCompressed));
    }
    toHex(isCompressed = false) {
      const x = numTo32bStr(this.x);
      if (isCompressed) {
        const prefix = this.hasEvenY() ? "02" : "03";
        return `${prefix}${x}`;
      } else {
        return `04${x}${numTo32bStr(this.y)}`;
      }
    }
    toHexX() {
      return this.toHex(true).slice(2);
    }
    toRawX() {
      return this.toRawBytes(true).slice(1);
    }
    assertValidity() {
      const msg = "Point is not on elliptic curve";
      const { x, y } = this;
      if (!isValidFieldElement(x) || !isValidFieldElement(y))
        throw new Error(msg);
      const left = mod2(y * y);
      const right = weistrass(x);
      if (mod2(left - right) !== _0n2)
        throw new Error(msg);
    }
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
    negate() {
      return new Point2(this.x, mod2(-this.y));
    }
    double() {
      return JacobianPoint.fromAffine(this).double().toAffine();
    }
    add(other) {
      return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
      return this.add(other.negate());
    }
    multiply(scalar) {
      return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const P = JacobianPoint.fromAffine(this);
      const aP = a === _0n2 || a === _1n2 || this !== Point2.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
      const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
      const sum = aP.add(bQ);
      return sum.equals(JacobianPoint.ZERO) ? void 0 : sum.toAffine();
    }
  };
  Point2.BASE = new Point2(CURVE2.Gx, CURVE2.Gy);
  Point2.ZERO = new Point2(_0n2, _0n2);
  function sliceDER(s) {
    return Number.parseInt(s[0], 16) >= 8 ? "00" + s : s;
  }
  function parseDERInt(data) {
    if (data.length < 2 || data[0] !== 2) {
      throw new Error(`Invalid signature integer tag: ${bytesToHex2(data)}`);
    }
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len) {
      throw new Error(`Invalid signature integer: wrong length`);
    }
    if (res[0] === 0 && res[1] <= 127) {
      throw new Error("Invalid signature integer: trailing length");
    }
    return { data: bytesToNumber(res), left: data.subarray(len + 2) };
  }
  function parseDERSignature(data) {
    if (data.length < 2 || data[0] != 48) {
      throw new Error(`Invalid signature tag: ${bytesToHex2(data)}`);
    }
    if (data[1] !== data.length - 2) {
      throw new Error("Invalid signature: incorrect length");
    }
    const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
    const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
    if (rBytesLeft.length) {
      throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex2(rBytesLeft)}`);
    }
    return { r, s };
  }
  var Signature = class {
    constructor(r, s) {
      this.r = r;
      this.s = s;
      this.assertValidity();
    }
    static fromCompact(hex) {
      const arr = hex instanceof Uint8Array;
      const name = "Signature.fromCompact";
      if (typeof hex !== "string" && !arr)
        throw new TypeError(`${name}: Expected string or Uint8Array`);
      const str = arr ? bytesToHex2(hex) : hex;
      if (str.length !== 128)
        throw new Error(`${name}: Expected 64-byte hex`);
      return new Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
    }
    static fromDER(hex) {
      const arr = hex instanceof Uint8Array;
      if (typeof hex !== "string" && !arr)
        throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
      const { r, s } = parseDERSignature(arr ? hex : hexToBytes2(hex));
      return new Signature(r, s);
    }
    static fromHex(hex) {
      return this.fromDER(hex);
    }
    assertValidity() {
      const { r, s } = this;
      if (!isWithinCurveOrder(r))
        throw new Error("Invalid Signature: r must be 0 < r < n");
      if (!isWithinCurveOrder(s))
        throw new Error("Invalid Signature: s must be 0 < s < n");
    }
    hasHighS() {
      const HALF = CURVE2.n >> _1n2;
      return this.s > HALF;
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, CURVE2.n - this.s) : this;
    }
    toDERRawBytes(isCompressed = false) {
      return hexToBytes2(this.toDERHex(isCompressed));
    }
    toDERHex(isCompressed = false) {
      const sHex = sliceDER(numberToHexUnpadded(this.s));
      if (isCompressed)
        return sHex;
      const rHex = sliceDER(numberToHexUnpadded(this.r));
      const rLen = numberToHexUnpadded(rHex.length / 2);
      const sLen = numberToHexUnpadded(sHex.length / 2);
      const length = numberToHexUnpadded(rHex.length / 2 + sHex.length / 2 + 4);
      return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
    }
    toRawBytes() {
      return this.toDERRawBytes();
    }
    toHex() {
      return this.toDERHex();
    }
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      return numTo32bStr(this.r) + numTo32bStr(this.s);
    }
  };
  function concatBytes2(...arrays) {
    if (!arrays.every((b) => b instanceof Uint8Array))
      throw new Error("Uint8Array list expected");
    if (arrays.length === 1)
      return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const arr = arrays[i];
      result.set(arr, pad);
      pad += arr.length;
    }
    return result;
  }
  var hexes3 = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex2(uint8a) {
    if (!(uint8a instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    let hex = "";
    for (let i = 0; i < uint8a.length; i++) {
      hex += hexes3[uint8a[i]];
    }
    return hex;
  }
  var POW_2_256 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
  function numTo32bStr(num) {
    if (typeof num !== "bigint")
      throw new Error("Expected bigint");
    if (!(_0n2 <= num && num < POW_2_256))
      throw new Error("Expected number < 2^256");
    return num.toString(16).padStart(64, "0");
  }
  function numTo32b(num) {
    const b = hexToBytes2(numTo32bStr(num));
    if (b.length !== 32)
      throw new Error("Error: expected 32 bytes");
    return b;
  }
  function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToNumber: expected string, got " + typeof hex);
    }
    return BigInt(`0x${hex}`);
  }
  function hexToBytes2(hex) {
    if (typeof hex !== "string") {
      throw new TypeError("hexToBytes: expected string, got " + typeof hex);
    }
    if (hex.length % 2)
      throw new Error("hexToBytes: received invalid unpadded hex" + hex.length);
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0)
        throw new Error("Invalid byte sequence");
      array[i] = byte;
    }
    return array;
  }
  function bytesToNumber(bytes2) {
    return hexToNumber(bytesToHex2(bytes2));
  }
  function ensureBytes2(hex) {
    return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes2(hex);
  }
  function normalizeScalar2(num) {
    if (typeof num === "number" && Number.isSafeInteger(num) && num > 0)
      return BigInt(num);
    if (typeof num === "bigint" && isWithinCurveOrder(num))
      return num;
    throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
  }
  function mod2(a, b = CURVE2.P) {
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow22(x, power) {
    const { P } = CURVE2;
    let res = x;
    while (power-- > _0n2) {
      res *= res;
      res %= P;
    }
    return res;
  }
  function sqrtMod(x) {
    const { P } = CURVE2;
    const _6n = BigInt(6);
    const _11n = BigInt(11);
    const _22n = BigInt(22);
    const _23n = BigInt(23);
    const _44n = BigInt(44);
    const _88n = BigInt(88);
    const b2 = x * x * x % P;
    const b3 = b2 * b2 * x % P;
    const b6 = pow22(b3, _3n) * b3 % P;
    const b9 = pow22(b6, _3n) * b3 % P;
    const b11 = pow22(b9, _2n2) * b2 % P;
    const b22 = pow22(b11, _11n) * b11 % P;
    const b44 = pow22(b22, _22n) * b22 % P;
    const b88 = pow22(b44, _44n) * b44 % P;
    const b176 = pow22(b88, _88n) * b88 % P;
    const b220 = pow22(b176, _44n) * b44 % P;
    const b223 = pow22(b220, _3n) * b3 % P;
    const t1 = pow22(b223, _23n) * b22 % P;
    const t2 = pow22(t1, _6n) * b2 % P;
    return pow22(t2, _2n2);
  }
  function invert2(number2, modulo = CURVE2.P) {
    if (number2 === _0n2 || modulo <= _0n2) {
      throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
    }
    let a = mod2(number2, modulo);
    let b = modulo;
    let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod2(x, modulo);
  }
  function invertBatch2(nums, p = CURVE2.P) {
    const scratch = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (num === _0n2)
        return acc;
      scratch[i] = acc;
      return mod2(acc * num, p);
    }, _1n2);
    const inverted = invert2(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
      if (num === _0n2)
        return acc;
      scratch[i] = mod2(acc * scratch[i], p);
      return mod2(acc * num, p);
    }, inverted);
    return scratch;
  }
  var divNearest = (a, b) => (a + b / _2n2) / b;
  var ENDO = {
    a1: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
    b1: -_1n2 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
    a2: BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
    b2: BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
    POW_2_128: BigInt("0x100000000000000000000000000000000")
  };
  function splitScalarEndo(k) {
    const { n } = CURVE2;
    const { a1, b1, a2, b2, POW_2_128 } = ENDO;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = mod2(k - c1 * a1 - c2 * a2, n);
    let k2 = mod2(-c1 * b1 - c2 * b2, n);
    const k1neg = k1 > POW_2_128;
    const k2neg = k2 > POW_2_128;
    if (k1neg)
      k1 = n - k1;
    if (k2neg)
      k2 = n - k2;
    if (k1 > POW_2_128 || k2 > POW_2_128) {
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function truncateHash(hash2) {
    const { n } = CURVE2;
    const byteLength = hash2.length;
    const delta = byteLength * 8 - 256;
    let h = bytesToNumber(hash2);
    if (delta > 0)
      h = h >> BigInt(delta);
    if (h >= n)
      h -= n;
    return h;
  }
  var _sha256Sync;
  var _hmacSha256Sync;
  function isWithinCurveOrder(num) {
    return _0n2 < num && num < CURVE2.n;
  }
  function isValidFieldElement(num) {
    return _0n2 < num && num < CURVE2.P;
  }
  function normalizePrivateKey(key) {
    let num;
    if (typeof key === "bigint") {
      num = key;
    } else if (typeof key === "number" && Number.isSafeInteger(key) && key > 0) {
      num = BigInt(key);
    } else if (typeof key === "string") {
      if (key.length !== 64)
        throw new Error("Expected 32 bytes of private key");
      num = hexToNumber(key);
    } else if (key instanceof Uint8Array) {
      if (key.length !== 32)
        throw new Error("Expected 32 bytes of private key");
      num = bytesToNumber(key);
    } else {
      throw new TypeError("Expected valid private key");
    }
    if (!isWithinCurveOrder(num))
      throw new Error("Expected private key: 0 < key < n");
    return num;
  }
  function normalizeSignature(signature) {
    if (signature instanceof Signature) {
      signature.assertValidity();
      return signature;
    }
    try {
      return Signature.fromDER(signature);
    } catch (error) {
      return Signature.fromCompact(signature);
    }
  }
  Point2.BASE._setWindowSize(8);
  var crypto3 = {
    node: nodeCrypto2,
    web: typeof self === "object" && "crypto" in self ? self.crypto : void 0
  };
  var TAGGED_HASH_PREFIXES = {};
  var utils2 = {
    bytesToHex: bytesToHex2,
    hexToBytes: hexToBytes2,
    concatBytes: concatBytes2,
    mod: mod2,
    invert: invert2,
    isValidPrivateKey(privateKey) {
      try {
        normalizePrivateKey(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    _bigintTo32Bytes: numTo32b,
    _normalizePrivateKey: normalizePrivateKey,
    hashToPrivateKey: (hash2) => {
      hash2 = ensureBytes2(hash2);
      if (hash2.length < 40 || hash2.length > 1024)
        throw new Error("Expected 40-1024 bytes of private key as per FIPS 186");
      const num = mod2(bytesToNumber(hash2), CURVE2.n - _1n2) + _1n2;
      return numTo32b(num);
    },
    randomBytes: (bytesLength = 32) => {
      if (crypto3.web) {
        return crypto3.web.getRandomValues(new Uint8Array(bytesLength));
      } else if (crypto3.node) {
        const { randomBytes } = crypto3.node;
        return Uint8Array.from(randomBytes(bytesLength));
      } else {
        throw new Error("The environment doesn't have randomBytes function");
      }
    },
    randomPrivateKey: () => {
      return utils2.hashToPrivateKey(utils2.randomBytes(40));
    },
    sha256: async (...messages) => {
      if (crypto3.web) {
        const buffer = await crypto3.web.subtle.digest("SHA-256", concatBytes2(...messages));
        return new Uint8Array(buffer);
      } else if (crypto3.node) {
        const { createHash } = crypto3.node;
        const hash2 = createHash("sha256");
        messages.forEach((m) => hash2.update(m));
        return Uint8Array.from(hash2.digest());
      } else {
        throw new Error("The environment doesn't have sha256 function");
      }
    },
    hmacSha256: async (key, ...messages) => {
      if (crypto3.web) {
        const ckey = await crypto3.web.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
        const message = concatBytes2(...messages);
        const buffer = await crypto3.web.subtle.sign("HMAC", ckey, message);
        return new Uint8Array(buffer);
      } else if (crypto3.node) {
        const { createHmac } = crypto3.node;
        const hash2 = createHmac("sha256", key);
        messages.forEach((m) => hash2.update(m));
        return Uint8Array.from(hash2.digest());
      } else {
        throw new Error("The environment doesn't have hmac-sha256 function");
      }
    },
    sha256Sync: void 0,
    hmacSha256Sync: void 0,
    taggedHash: async (tag, ...messages) => {
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = await utils2.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes2(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return utils2.sha256(tagP, ...messages);
    },
    taggedHashSync: (tag, ...messages) => {
      if (typeof _sha256Sync !== "function")
        throw new ShaError("sha256Sync is undefined, you need to set it");
      let tagP = TAGGED_HASH_PREFIXES[tag];
      if (tagP === void 0) {
        const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
        tagP = concatBytes2(tagH, tagH);
        TAGGED_HASH_PREFIXES[tag] = tagP;
      }
      return _sha256Sync(tagP, ...messages);
    },
    precompute(windowSize = 8, point = Point2.BASE) {
      const cached = point === Point2.BASE ? point : new Point2(point.x, point.y);
      cached._setWindowSize(windowSize);
      cached.multiply(_3n);
      return cached;
    }
  };
  Object.defineProperties(utils2, {
    sha256Sync: {
      configurable: false,
      get() {
        return _sha256Sync;
      },
      set(val) {
        if (!_sha256Sync)
          _sha256Sync = val;
      }
    },
    hmacSha256Sync: {
      configurable: false,
      get() {
        return _hmacSha256Sync;
      },
      set(val) {
        if (!_hmacSha256Sync)
          _hmacSha256Sync = val;
      }
    }
  });

  // index.ts
  utils2.hmacSha256Sync = (key, ...msgs) => hmac(sha256, key, utils2.concatBytes(...msgs));
  utils2.sha256Sync = (...msgs) => sha256(utils2.concatBytes(...msgs));
  return __toCommonJS(nostr_tools_exports);
})();
