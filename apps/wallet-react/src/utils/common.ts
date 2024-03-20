/**
 * This function is used to capitalise the first
 * letter in a given phrase
 *
 * @param {string} phrase - phrase to be capitalized
 * @returns {string} - the capitalized phrase
 */
export function capitalize(phrase: string): string {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/**
 * This functions takes a phrase and returns every word capitalized
 *
 * @param {strubg} phrase - phrase whoses words need be capitalized
 * @returns {string} - the phrase with all words starting with capital letters
 */
export function capitalizeEveryWord(phrase: string): string {
  return phrase
    .split(' ')
    .map((_) => capitalize(_))
    .join(' ');
}

/**
 * This function removes underscores(_) in a word
 * and seperate in different words, all capitalized.
 *
 * @param word - Key of the claim to cleanup
 * @returns {string} - text without underscores
 */
export function removeUnderscoresFromWord(word: string): string {
  return word
    .split('_')
    .map((jj) => capitalize(jj))
    .join(' ');
}

/**
 * This function is used to remove the dots (.)
 * from a domain and return clear text without the tld
 *
 * @param domain - the domain that needs transformation
 * @returns {string} - the string gotten from domain
 */
export function domainToClearString(domain: string) {
  const splitedDomain = domain.split('.');
  return splitedDomain.slice(0, splitedDomain.length - 1).join(' ');
}
