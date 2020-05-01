import {Files} from './files';
import {CompressorSteps} from './steps';
import {BinaryBuffer} from './binary-buffer';
import { BinaryReader } from './binary-reader';


const compress = (iFile, oFile) => {
    const file = Files.getText(iFile);

    const frequencyArray = CompressorSteps.getFrequencyArray(file);
    
    const streamFileWriter = Files.getStreamFileWriter(oFile);
    const tree = CompressorSteps.getHuffmanTree(frequencyArray);
    
    const buffer = new BinaryBuffer(12, streamFileWriter.writeToFile);
    CompressorSteps.reserveHeader(buffer);
    const symbolToKeyMap = CompressorSteps.getSymbolToKeyMapAndWriteHuffmanTreeToBuffer(tree, buffer);
    console.log(Object.keys(symbolToKeyMap).reduce((r, x) => {
        if (!(symbolToKeyMap[x].size in r)) {
            r[symbolToKeyMap[x].size] = {};
        }
        r[symbolToKeyMap[x].size][symbolToKeyMap[x].key] = x.charCodeAt(0);
        return r;
    }, {}));

    CompressorSteps.toBinaryAndWriteToFile(file, symbolToKeyMap, buffer);
    CompressorSteps.writeBufferAppendixAndHeader(buffer, streamFileWriter);
    console.log(buffer.getByteAppendixLength())

    streamFileWriter.closeFile();
}

const decompress = (iFile, oFile) => {
    const reader = new BinaryReader(iFile);

}

export const compressor = {
    compress,
    decompress,
}