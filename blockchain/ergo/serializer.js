let ergolib;

if (typeof window !== "undefined") {
  ergolib = require("ergo-lib-wasm-browser");
}

export async function encodeNum(n, isInt = false) {
  if (isInt) return (await ergolib).Constant.from_i32(n).encode_to_base16()
  else return (await ergolib).Constant.from_i64((await ergolib).I64.from_str(n)).encode_to_base16()
}

export async function decodeNum(n, isInt = false) {
  if (isInt) return (await ergolib).Constant.decode_from_base16(n).to_i32()
  else return (await ergolib).Constant.decode_from_base16(n).to_i64().to_str()

}

export async function encodeHex(reg) {
  return (await ergolib).Constant.from_byte_array(Buffer.from(reg, 'hex')).encode_to_base16()
}

export function decodeHexString(hexString){
  return Uint8Array.from(Buffer.from(hexString, 'hex'))
}




function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


export function ergToNano(erg) {
  if (erg === undefined) return 0
  if (erg.startsWith('.')) return parseInt(erg.slice(1) + '0'.repeat(9 - erg.length + 1))
  let parts = erg.split('.')
  if (parts.length === 1) parts.push('')
  if (parts[1].length > 9) return 0
  return parseInt(parts[0] + parts[1] + '0'.repeat(9 - parts[1].length))
}

export async function encodeCollection(collection) {
  const utf8Encode = new TextEncoder();
  const lib = await ergolib;
  const values = [
    collection.collectionLogoURL,
    collection.collectionFeaturedImageURL,
    collection.collectionBannerImageURL,
    collection.collectionCategory
  ];

  return lib.Constant.from_js(values.map((elem) => utf8Encode.encode(elem))).encode_to_base16();
}

export async function encodeSocials(socialMedia){

  const socials = [];

  const utf8Encode = new TextEncoder();

  const lib = await ergolib;

  for (const [key, value] of socialMedia) {
    socials.push(lib.array_as_tuple([key, value].map((elem) => utf8Encode.encode(elem))))
  }

  return (await ergolib).Constant.from_js(socials).encode_to_base16()
}