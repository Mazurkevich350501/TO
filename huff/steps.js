import * as fs from 'fs';
import {Files} from './files';


const getFrequencyArray = (fileContent) => {
    const length = fileContent.length;
    const symbolToFrequency = {};
    for (let i = 0; i < length; i++) {
        const symbol = fileContent.charAt(i);
        if (symbol in symbolToFrequency) {
            symbolToFrequency[symbol] ++;
        } else {
            symbolToFrequency[symbol] = 1;
        }
    }

    return Object.entries(symbolToFrequency)
        .map(([symbol, frequency]) => ({symbol, frequency}))
        .sort((a, b) => a.frequency - b.frequency)
}

const getHuffmanTree = (frequencyArray) => {
    const array = frequencyArray.slice();

    while (array.length > 1) {
        const node = {
            ['0']: array[0],
            ['1']: array[1],
            frequency: array[0].frequency + array[1].frequency
        }
        array.splice(0, 2);
        const insertIndex = array.findIndex(x => x.frequency > node.frequency);
        if (insertIndex === -1) {
            array.push(node);
        } else {
            array.splice(insertIndex, 0, node);
        }
    }

    return array[0]
}


const getSymbolToKeyMap = (huffmanTree) => {
    const result = {};
    const makeNewWave = (node, {key, size}) => {
        if (node.symbol) {
            result[node.symbol] = {key, size};
        } else {
            makeNewWave(node[0], {key: key << 1, size: size + 1});
            makeNewWave(node[1], {key: key << 1 | 1, size: size + 1});
        }
    } 

    makeNewWave(huffmanTree, {key: 0, size: 0});
    return result
}

const toBinaryAndWriteToFile = (fileContent, symbolToKeyMap, oFile) => {
    let needToAppend = false;
    const bufferSize = 1000000;
    const bufferNodeSize = 8;
    const buffer = new Int8Array(bufferSize);
    let bufferIndex = 0;
    let byteShift = 0;
    
    const length = fileContent.length;

    const fd = fs.openSync(oFile, 'w');
    fs.writeFileSync(fd, '');

    const appendToFile = () => {
        const bufferToWrite = !bufferSize
            ? buffer
            : buffer.slice(0, bufferIndex + 1);
            
        Files.writeBinary(oFile, Buffer.from(bufferToWrite.buffer));
        needToAppend = false;
    }

    const incBufferIndexAndSaveIfFull = () => {
        bufferIndex = bufferIndex < bufferSize - 1
            ? bufferIndex + 1
            : 0;
        
        if (!bufferIndex) {
            appendToFile();
        }

        buffer[bufferIndex] = 0;
    }

    const appendBufferAndSaveIfFull = ({key, size}) => {
        needToAppend = true;
        let keyChanged = key;
        let sizeChanged = size;

        while(true) {
            if (sizeChanged === 0) {
                return;
            }

            if (sizeChanged <= bufferNodeSize - byteShift) {
                buffer[bufferIndex] = buffer[bufferIndex] | (keyChanged << byteShift)
                byteShift += sizeChanged;
                if (byteShift === bufferNodeSize) {
                    byteShift = 0;
                    incBufferIndexAndSaveIfFull();
                }
                return;
            } else {
                sizeChanged = sizeChanged - (bufferNodeSize - byteShift);
                buffer[bufferIndex] = buffer[bufferIndex] | (keyChanged << byteShift)
                keyChanged >>> byteShift;
                byteShift = 0;
                incBufferIndexAndSaveIfFull();
            }
        }        
    }

    for (let i = 0; i < length; i++) {
        const symbol = fileContent.charAt(i);
        const key = symbolToKeyMap[symbol];
        appendBufferAndSaveIfFull(key);
    }

    if (needToAppend) {
        appendToFile();
    }

    fs.closeSync(fd);
}

export const Steps = {
    getFrequencyArray,
    getHuffmanTree,
    getSymbolToKeyMap,
    toBinaryAndWriteToFile,
}