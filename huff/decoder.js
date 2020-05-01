import {BinaryReader} from './binary-reader';
import {Files} from './files';
import {DecompressorSteps} from './steps';
import { BinaryBuffer } from './binary-buffer';


const reader = new BinaryReader('res.file');
const map = DecompressorSteps.getKeyToSymbol(reader);

const streamFileWriter = Files.getStreamFileWriter('res.txt');
const buffer = new BinaryBuffer(120, streamFileWriter.writeToFile);

let size = 0;
let key = 0;
console.log(map)
while (true) {
    const bit = reader.readBitAndIterate();
    if (bit === null) {
        break;
    }
    key = bit << size ++ | key;
    if (map[size] && map[size][key]) {
        map[size][key];
        buffer.appendBufferAndSaveIfFull({key: map[size][key], size: buffer.bufferNodeSize});
        key = size = 0;
    }
}

if (buffer.hasValue) {
    const bufferToWrite = buffer.buffer.slice(0, buffer.bufferIndex)
    streamFileWriter.writeToFile(bufferToWrite);
}

streamFileWriter.closeFile();
