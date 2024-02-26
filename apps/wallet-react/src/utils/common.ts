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
