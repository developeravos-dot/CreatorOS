import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);

    return statSync(fullPath).isDirectory()
      ? walk(fullPath)
      : [fullPath];
  });
}

describe('AVOS stage test contract', () => {
  it('contains no hard-coded stage-count assertions', () => {
    const mediaRoot = join(__dirname, '..');

    const stageSpecs = walk(mediaRoot).filter((file) =>
      file.endsWith('-stage.service.spec.ts'),
    );

    const forbiddenPatterns = [
      /totalStages\s*\)\s*\.\s*(?:toBe|toEqual|toStrictEqual)\(\s*\d+\s*\)/s,
      /\.stages\s*\)\s*\.\s*toHaveLength\(\s*\d+\s*\)/s,
      /\.stages\.length\s*\)\s*\.\s*(?:toBe|toEqual|toStrictEqual)\(\s*\d+\s*\)/s,
      /getBlueprint\(\)\.stages\s*\)\s*\.\s*toHaveLength\(\s*\d+\s*\)/s,
    ];

    const violations = stageSpecs.flatMap((file) => {
      const content = readFileSync(file, 'utf8');

      return forbiddenPatterns.some((pattern) =>
        pattern.test(content),
      )
        ? [file]
        : [];
    });

    expect(stageSpecs.length).toBeGreaterThan(0);
    expect(violations).toEqual([]);
  });
});
