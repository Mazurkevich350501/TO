import * as fs from 'fs';
import {Files} from './files';
import {constants} from './constants';

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


const getSymbolToKeyMapAndWriteHuffmanTreeToBuffer = (huffmanTree, buffer) => {
    const result = {};
    const makeNewWave = (node, {key, size}) => {
        if (node.symbol) {
            result[node.symbol] = {key, size: size || 1};
            console.log(`1'${node.symbol}|${node.symbol.charCodeAt(0).toString(2).padStart(8, '0')}'`)
            buffer.appendBufferAndSaveIfFull({key: 1, size: 1});
            buffer.appendBufferAndSaveIfFull({key: node.symbol.charCodeAt(0), size: buffer.bufferNodeSize});
        } else {
            console.log(`0`)
            buffer.appendBufferAndSaveIfFull({key: 0, size: 1});
            makeNewWave(node[0], {key: key << 1, size: size + 1});
            makeNewWave(node[1], {key: key << 1 | 1, size: size + 1});
        }
    } 

    makeNewWave(huffmanTree, {key: 0, size: 0});
    console.log(result);
    return result
}

const toBinaryAndWriteToFile = (fileContent, symbolToKeyMap, buffer) => {
    const length = fileContent.length;
    for (let i = 0; i < length; i++) {
        const symbol = fileContent.charAt(i);
        const key = symbolToKeyMap[symbol];
        buffer.appendBufferAndSaveIfFull(key);
    }
}

const reserveHeader = (buffer) => {
    buffer.appendBufferAndSaveIfFull({key: 255, size: constants.headerSize * buffer.bufferNodeSize});
}

const writeBufferAppendixAndHeader = (buffer, streamFileWriter, treeHeader) => {
    if (buffer.hasValue) {
        const bufferToWrite = buffer.buffer.slice(0, buffer.bufferIndex + 1)
        console.log('buffer', bufferToWrite);
        streamFileWriter.writeToFile(bufferToWrite);
    }

    // const header = Buffer.from([buffer.getByteAppendixLength()]);
    // streamFileWriter.writeToFilePosition(0, header);
}

export const CompressorSteps = {
    getFrequencyArray,
    getHuffmanTree,
    getSymbolToKeyMapAndWriteHuffmanTreeToBuffer,
    toBinaryAndWriteToFile,
    writeBufferAppendixAndHeader,
    reserveHeader,
}

const getSymbolToKey = (binaryReader, header) => {
    const result = {};
    let key = 0;
    let keySize = 0;
    do {
        const bit = binaryReader.readBitAndIterate()
        if (!bit) {
            key <<= 1;
            keySize += 1;
        } else {
            const byte = binaryReader.readByteAndIterate();
            const symbol = String.fromCharCode(byte);
            result[symbol] = {key, size: keySize };
            while (key & 1) {key >>>= 1; keySize -= 1;}
            key |= 1;
        }
    } while (keySize)

    return result
}

export const DecompressorSteps = {
    getSymbolToKey,
}