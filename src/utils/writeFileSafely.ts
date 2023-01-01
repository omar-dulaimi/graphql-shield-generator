import fs from 'fs';
import path from 'path';
import { formatFile } from './formatFile';

export const writeFileSafely = async (writeLocation: string, content: any) => {
  if (fs.existsSync(writeLocation)) {
    fs.rmSync(writeLocation);
  }

  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, await formatFile(content));
};
