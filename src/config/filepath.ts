import { fileURLToPath } from 'url';
import path from 'path';

const __filename:string = fileURLToPath(import.meta.url);
const __dirname:string = path.dirname(__filename);

export { __dirname };
