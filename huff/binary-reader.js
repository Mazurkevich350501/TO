import * as fs from 'fs';
import {constants} from './constants';
import {Files} from './files';

export class BinaryReader {
    byteMask = parseInt('11111111', 2);
    bitMask = 1;
    fileSize = 0;
    hasValue = false;
    bufferSize = 100;
    getMore = null;
    bufferNodeSize = 8;
    buffer = null;
    readIndex = 0;
    readByteShift = 0;
    fd = null;
    prevReadSize = 0;

    constructor (fileName) {
        this.fileSize = Files.getFileSize(fileName);
        this.fd = fs.openSync(fileName, 'r');
        this.buffer = Buffer.alloc(this.bufferSize);
        fs.readSync(this.fd, this.buffer, 0, this.bufferSize, 0);
        console.log(this.buffer);
    }

    getHeader() {
        fs.readSync(fd, this.headerBuffer, 0, constants.headerSize, 0);
        return {
            byteAppendixSize: buffer[0]
        };
    }

    readBitAndIterate() {
        this.readFromFileIfNeeded();
        const byte = this.buffer[this.readIndex];
        const result = (byte >>> this.readByteShift) & 1;
        this.iterate(1);
        return result;
    }

    readByteAndIterate() {
        this.readFromFileIfNeeded();
        const firstPart = this.buffer.readUInt8(this.readIndex);
        const secondPart = this.buffer.readUInt8(this.readIndex + 1);
        const result = (firstPart >>> this.readByteShift)
            | ((secondPart << (8 - this.readByteShift)) & this.byteMask);
        this.iterate(8);
        return result;
    }

    readFromFileIfNeeded() {
        if (this.readIndex + 2 ===  this.bufferSize) {
            this.prevReadSize += (this.readIndex - 1);
            fs.readSync(this.fd, this.buffer, 0, this.bufferSize, this.prevReadSize);
            this.readIndex = 0;
        }
    }

    iterate(readBits) {
        const newReadByteShift = this.readByteShift + readBits;
        if (newReadByteShift >= 8) {
            this.readIndex += 1;
        }

        this.readByteShift = newReadByteShift % 8;
        // console.log('readByteShift', this.readByteShift, 'readIndex', this.readIndex)
    }
}