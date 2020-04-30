
export class BinaryBuffer {
    hasValue = false;
    bufferSize = 0;
    onFullFilling = null;
    bufferNodeSize = 8;
    buffer = null;
    bufferIndex = 0;
    byteShift = 0;
    
    constructor (size, onFullFilling) {
        this.bufferSize = size;
        this.onFullFilling = onFullFilling;
        this.buffer = new Int8Array(size)
    }

    getByteAppendixLength() {
        return !this.byteShift 
            ? this.byteShift
            : this.bufferNodeSize - this.byteShift;
    }

    appendBufferAndSaveIfFull({key, size}) {
        this.hasValue = true;
        let keyChanged = key;
        let sizeChanged = size;

        while(true) {
            if (sizeChanged === 0) {
                return;
            }
            if (sizeChanged <= this.bufferNodeSize - this.byteShift) {
                this.buffer[this.bufferIndex] = this.buffer[this.bufferIndex] | (keyChanged << this.byteShift)
                this.byteShift += sizeChanged;
                if (this.byteShift === this.bufferNodeSize) {
                    this.byteShift = 0;
                    this.incBufferIndexAndSaveIfFull();
                }
                return;
            } else {
                sizeChanged = sizeChanged - (this.bufferNodeSize - this.byteShift);
                this.buffer[this.bufferIndex] = this.buffer[this.bufferIndex] | (keyChanged << this.byteShift)
                keyChanged >>>= (this.bufferNodeSize - this.byteShift);
                this.byteShift = 0;
                this.incBufferIndexAndSaveIfFull();
            }
        }    
    }

    incBufferIndexAndSaveIfFull() {
        this.bufferIndex = this.bufferIndex < this.bufferSize - 1
            ? this.bufferIndex + 1
            : 0;
        
        if (!this.bufferIndex) {
            this.onFullFilling(this.buffer);
            this.hasValue = false;
        }
    
        this.buffer[this.bufferIndex] = 0;
    }
}