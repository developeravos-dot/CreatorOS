export const normalizeText = (
  value: string,
): string => value.trim();

export const normalizeIdentifier = (
  value: string,
): string => value.trim().toLowerCase();

export const normalizeTags = (
  tags: readonly string[],
): readonly string[] =>
  Object.freeze(
    [
      ...new Set(
        tags
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ],
  );

export const ensureNonEmpty = (
  value: string | undefined,
  field: string,
  issues: string[],
): void => {
  if (!value?.trim()) {
    issues.push(`${field} is required.`);
  }
};