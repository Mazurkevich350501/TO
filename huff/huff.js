import {Files} from './files';
import {compressor} from './compressor';

const [
    iFile,
    command,
    oFile,
] = process.argv.slice(2);

console.time('execution time');
switch (command) {
    case '-c': compressor.compress(iFile, oFile);
        break;
    case '-x': compressor.decompress(iFile, oFile);
        break;
}


console.timeEnd('execution time');

const sizeBefore = Files.getFileSize(iFile);
const sizeAfter = Files.getFileSize(oFile);
console.log('size before:', sizeBefore);
console.log('size after:', sizeAfter);
console.log('compression:', sizeBefore / sizeAfter);
