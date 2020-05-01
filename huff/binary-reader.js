import * as fs from 'fs';
import {getBufferSize} from './buffer-size-helper';
import {Files} from './files';


export class BinaryReader {
    byteMask = parseInt('11111111', 2);
    fileSize = 0;
    byteAppendixSize = 0;
    bufferSize = 0;
    bufferNodeSize = 8;
    buffer = null;
    readIndex = 0;
    readByteShift = 0;
    fd = null;
    prevReadSize = 0;

    constructor (fileName) {
        this.fileSize = Files.getFileSize(fileName);
        this.bufferSize = getBufferSize(this.fileSize);
        if (!this.fileSize) return;
        this.fd = fs.openSync(fileName, 'r');
        this.buffer = Buffer.alloc(this.bufferSize);
        fs.readSync(this.fd, this.buffer, 0, this.bufferSize, 0);
        this.byteAppendixSize = this.getHeader().byteAppendixSize;
    }

    getHeader() {
        const byteAppendixSize = this.readByteAndIterate();
        return {byteAppendixSize};
    }

    readBitAndIterate() {
        if (!this.canRead(1)) return null;
        this.readFromFileIfNeeded();
        const byte = this.buffer[this.readIndex];
        const result = (byte >>> this.readByteShift) & 1;
        this.iterate(1);
        return result;
    }

    readByteAndIterate() {
        if (!this.canRead(this.bufferNodeSize)) return null;
        this.readFromFileIfNeeded();
        const firstPart = this.buffer.readUInt8(this.readIndex);
        const secondPart = this.buffer.readUInt8(this.readIndex + 1);
        const result = (firstPart >>> this.readByteShift)
            | ((secondPart << (this.bufferNodeSize - this.readByteShift)) & this.byteMask);
        this.iterate(this.bufferNodeSize);
        return result;
    }

    readFromFileIfNeeded() {
        if (this.readIndex + 2 === this.bufferSize && this.prevReadSize < this.fileSize - this.bufferSize) {
            this.prevReadSize += (this.readIndex);
            fs.readSync(this.fd, this.buffer, 0, this.bufferSize, this.prevReadSize);
            this.readIndex = 0;
        }
    }

    iterate(readBits) {
        const newReadByteShift = this.readByteShift + readBits;
        if (newReadByteShift >= this.bufferNodeSize) {
            this.readIndex += 1;
        }

        this.readByteShift = newReadByteShift % this.bufferNodeSize;
    }

    canRead() {
        return this.prevReadSize + this.readIndex + (this.readByteShift + this.byteAppendixSize) / 8 < this.fileSize;
    }
}