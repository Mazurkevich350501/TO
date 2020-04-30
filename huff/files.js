import * as fs from 'fs';

const getText = (fileName) => {
    return fs.readFileSync(fileName, 'utf8');
}

const writeText = (fileName, text) => {
    return fs.writeFileSync(fileName, text);
}

const getBinary = (fileName) => {
    return fs.readFileSync(fileName, 'binary');
}

const writeBinary = (fileName, data) => {
    return fs.writeFileSync(fileName, data);
}

const appendToFile = (fileName, data) => {
    return fs.appendFileSync(fileName, data,);
}

const getFileSize = (fileName) => {
    const stats = fs.statSync(fileName)
    return stats.size;
}

const getStreamFileWriter = (fileName) => {
    const fd = fs.openSync(fileName, 'w');
    fs.writeFileSync(fd, '');

    return {
        writeToFile: (buffer) => {
            console.log('writeToFile', fd);

            fs.appendFileSync(fileName, Buffer.from(buffer.buffer));
        },
        writeToFilePosition: (position, buffer) => {
            fs.writeSync(fd, buffer, 0, buffer.length, position);
        },
        closeFile: () => {
            fs.closeSync(fd)
        },
    }
}

export const Files = {
    getText,
    writeText,
    getBinary,
    writeBinary,
    appendToFile,
    getFileSize,
    getStreamFileWriter,
}