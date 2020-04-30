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
    // CompressorSteps.reserveHeader(buffer);
    const symbolToKeyMap = CompressorSteps.getSymbolToKeyMapAndWriteHuffmanTreeToBuffer(tree, buffer);

    CompressorSteps.toBinaryAndWriteToFile(file, symbolToKeyMap, buffer);
    CompressorSteps.writeBufferAppendixAndHeader(buffer, streamFileWriter);
    console.log(buffer.buffer);

    streamFileWriter.closeFile();
}

const decompress = (iFile, oFile) => {
    const reader = new BinaryReader(iFile);

}

export const compressor = {
    compress,
    decompress,
}