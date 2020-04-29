import {Files} from './files';
import {Steps} from './steps';

const compress = (iFile, oFile) => {
    const file = Files.getText(iFile);
    const frequencyArray = Steps.getFrequencyArray(file);
    const tree = Steps.getHuffmanTree(frequencyArray);
    const symbolToKeyMap = Steps.getSymbolToKeyMap(tree);
    Steps.toBinaryAndWriteToFile(file, symbolToKeyMap, oFile);
}

const decompress = (iFile, oFile) => {
    // const file = Files.getText(iFile);
    // const frequencyArray = Steps.getFrequencyArray(file);
    // const tree = Steps.getHuffmanTree(frequencyArray);
    // const symbolToKeyMap = Steps.getSymbolToKeyMap(tree);
    // Steps.toBinaryAndWriteToFile(file, symbolToKeyMap, oFile);
}

export const compressor = {
    compress,
    decompress,
}