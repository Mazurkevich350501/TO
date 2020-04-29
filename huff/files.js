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

export const Files = {
    getText,
    writeText,
    getBinary,
    writeBinary,
    appendToFile,
    getFileSize,
}