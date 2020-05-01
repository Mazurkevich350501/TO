export const getBufferSize = (fileSize) => {
    const bufferSize = Math.floor(fileSize / 4);
    const minSize = 2000;
    const maxSize = 10000000;
    return bufferSize < minSize 
        ? minSize
        : bufferSize > maxSize
            ? maxSize
            : bufferSize;
}