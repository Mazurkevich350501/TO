import {Files} from './files';
import {CompressorSteps, DecompressorSteps} from './steps';
import {BinaryBuffer} from './binary-buffer';
import { BinaryReader } from './binary-reader';
import { getBufferSize } from './buffer-size-helper';


const compress = (iFile, oFile) => {
    const file = Files.getBinary(iFile);

    const frequencyArray = CompressorSteps.getFrequencyArray(file);
    if (!frequencyArray.length) {
        Files.writeBinary(oFile, Buffer.alloc(0));
        return;
    }

    const streamFileWriter = Files.getStreamFileWriter(oFile);
    const tree = CompressorSteps.getHuffmanTree(frequencyArray);
    
    const fileSize = Files.getFileSize(iFile);
    const buffer = new BinaryBuffer(getBufferSize(fileSize), streamFileWriter.writeToFile);
    CompressorSteps.reserveHeader(buffer);
    const symbolToKeyMap = CompressorSteps.getSymbolToKeyMapAndWriteHuffmanTreeToBuffer(tree, buffer);
    // console.log(symbolToKeyMap)

    CompressorSteps.toBinaryAndWriteToFile(file, symbolToKeyMap, buffer);
    CompressorSteps.writeBufferAppendixAndHeader(buffer, streamFileWriter);

    streamFileWriter.closeFile();
}

const decompress = (iFile, oFile) => {
    const reader = new BinaryReader(iFile);
    if (reader.fileSize < 2) {
        Files.writeText(oFile, '');
        reader.close()
        return;
    }
    const map = DecompressorSteps.getKeyToSymbol(reader);
    // console.log(map);
    const streamFileWriter = Files.getStreamFileWriter(oFile);
    const buffer = new BinaryBuffer(reader.bufferSize, streamFileWriter.writeToFile);

    let size = 0;
    let key = 0;
    while (true) {
        const bit = reader.readBitAndIterate();
        if (bit === null) {
            break;
        }
        key = bit << size ++ | key;
        if (map[size] && key in map[size]) {
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
}

export const compressor = {
    compress,
    decompress,
}