// import {Files} from './files';
import {compressor} from './compressor';

const [
    iFile,
    command,
    oFile,
] = process.argv.slice(2);

// console.time('execution time');
switch (command) {
    case '-c': return compressor.compress(iFile, oFile);
    case '-x': return compressor.decompress(iFile, oFile);
}


// console.timeEnd('execution time');

// const sizeBefore = Files.getFileSize(iFile);
// const sizeAfter = Files.getFileSize(oFile);
// console.log('size before:', sizeBefore);
// console.log('size after:', sizeAfter);
// console.log('compression:', sizeBefore / sizeAfter);
