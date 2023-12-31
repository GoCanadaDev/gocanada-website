/**
 * Given a string, when it has zero-width spaces in it, then remove them
 *
 * @param {String} stringToTrim The string to be trimmed of unicode spaces
 *
 * @return the trimmed string
 *
 * Regex for zero-width space Unicode characters.
 *
 * U+200B zero-width space.
 * U+200C zero-width non-joiner.
 * U+200D zero-width joiner.
 * U+200E left-to-right mark.
 * U+200F right-to-left mark.
 * U+FEFF zero-width non-breaking space.
 */
export function zeroWidthTrim(stringToTrim: string) {
  const ZERO_WIDTH_SPACES_REGEX =
    /([\u200B]+|[\u200C]+|[\u200D]+|[\u200E]+|[\u200F]+|[\uFEFF]+)/g

  const trimmedString = stringToTrim.replace(ZERO_WIDTH_SPACES_REGEX, "")

  return trimmedString
}
