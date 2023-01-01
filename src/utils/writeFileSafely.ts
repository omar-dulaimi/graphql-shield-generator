import fs from 'fs';
import path from 'path';
import { formatFile } from './formatFile';
import removeDir from './removeDir';

export const writeFileSafely = async (writeLocation: string, content: any) => {
  await removeDir(writeLocation, true);

  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, await formatFile(content));
};
