// import {
//   array_as_tuple,
//   Constant,
//   I64,
// } from 'ergo-lib-wasm-browser';
//
//
//
//
// export async function encodeNum(n: number, isInt: boolean = false): Promise<string> {
//   if (isInt) return Constant.from_i32(n).encode_to_base16();
//   else return Constant.from_i64(I64.from_str(n.toString())).encode_to_base16();
// }
//
// export async function decodeNum(n: number, isInt: boolean = false): Promise<string | number> {
//   if (isInt) return Constant.decode_from_base16(n.toString()).to_i32();
//   else return Constant.decode_from_base16(n.toString()).to_i64().to_str();
// }
//
// export async function encodeHex(str: string): Promise<string> {
//   return Constant.from_byte_array(Buffer.from(str, 'hex')).encode_to_base16();
// }
//
// export async function decodeHexString(hexString: string): Promise<Uint8Array> {
//   return Uint8Array.from(Buffer.from(hexString, 'hex'))
// }
//
// function toHexString(byteArray: Uint8Array): string {
//   return Array.from(byteArray, function(byte) {
//     return ('0' + (byte & 0xFF).toString(16)).slice(-2);
//   }).join('');
// }
//
// export function ergToNano(erg: string): number {
//   if (erg === undefined) return 0;
//   if (erg.startsWith('.')) return parseInt(erg.slice(1) + '0'.repeat(9 - erg.length + 1));
//   let parts = erg.split('.');
//   if (parts.length === 1) parts.push('');
//   if (parts[1].length > 9) return 0;
//   return parseInt(parts[0] + parts[1] + '0'.repeat(9 - parts[1].length));
// }
//
// export async function encodeCollection(collection: CollectionInfo): Promise<string> {
//   const utf8Encode = new TextEncoder();
//   const values = [
//     collection.collectionLogoURL,
//     collection.collectionFeaturedImageURL,
//     collection.collectionBannerImageURL,
//     collection.collectionCategory
//   ];
//
//   return Constant.from_js(values.map((elem) => utf8Encode.encode(elem))).encode_to_base16();
// }
//
// export async function encodeSocials(socialMedia: Map<string, string>): Promise<string> {
//   const socials = [];
//
//   const utf8Encode = new TextEncoder();
//
//   for (const [key, value] of socialMedia) {
//     socials.push(array_as_tuple([key, value].map((elem) => utf8Encode.encode(elem))));
//   }
//
//   return Constant.from_js(socials).encode_to_base16();
// }