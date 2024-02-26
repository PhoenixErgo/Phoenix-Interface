import Big from 'big.js';

/**
 * Determines if a given number has more than a specified number of decimal places.
 *
 * @param {number} num - The number to be checked for decimal places
 * @param {number} decimals - The maximum number of decimal places to check against. The function determines
 *                            if `num` has more than this number of decimal places.
 * @returns {boolean} - Returns `true` if `num` has more than `decimals` decimal places, otherwise `false`.
 *
 * @example
 * // Returns false because 1.2345 does not have more than 4 decimal places
 * hasDecimals(1.2345, 4);
 *
 * @example
 * // Returns true because 1.234567 has more than 5 decimal places
 * hasDecimals(1.234567, 5);
 */
export function hasDecimals(num: number, decimals: number): boolean {
  const bigNum = new Big(num);
  const scaledAndRounded = bigNum.times(new Big(10).pow(decimals)).round(0);
  const scaledBackDown = scaledAndRounded.div(new Big(10).pow(decimals));
  return !bigNum.eq(scaledBackDown);
}

export function convertBigToBigInt(bigJsValue: Big): bigint {
  let [base, exponent] = bigJsValue.toString().split('e');
  // @ts-ignore
  exponent = exponent ? parseInt(exponent, 10) : 0;

  const decimalIndex = base.indexOf('.');

  if (decimalIndex !== -1) {
    const decimalPlaces = base.length - decimalIndex - 1;
    base = base.replace('.', '');
    // @ts-ignore
    exponent -= decimalPlaces;
  }

  return BigInt(base) * BigInt(10) ** BigInt(exponent);
}

export function localStorageKeyExists(key: string): boolean {
  const value = localStorage.getItem(key);
  return value !== null;
}

export function formatBigIntWithDecimalsRounded(
  bigintValue: bigint,
  precision: number,
  decimals: number
): string {
  const divisor = BigInt(10) ** BigInt(precision);
  let scaledValue = (bigintValue * BigInt(10) ** BigInt(decimals + 1)) / divisor; // Scale value for rounding
  const roundOff = BigInt(5); // For rounding
  scaledValue += roundOff; // Add 5 for rounding
  const roundedValue = scaledValue / BigInt(10); // Remove the extra scale

  let result = roundedValue.toString();
  // Ensure the string has at least `decimals + 1` length for integer part + decimals
  result = result.padStart(decimals + 1, '0');
  // Insert decimal point at the correct position
  result = result.slice(0, -decimals) + '.' + result.slice(-decimals);

  return result;
}

export function getTicker(network: string | null) {
  switch (network) {
    case '2':
      return 'ERG';
    case '3':
      return 'ERG';
    case '4':
    case '5':
    case '6':
      return 'ALPH';
    default:
      return 'ERG';
  }
}
