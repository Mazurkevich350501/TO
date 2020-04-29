import * as BitArray from 'node-bitarray';
import {Files} from './files';

console.log('asd');
const a = Files.getBinary('res.file');
console.log(BitArray.fromBuffer(Buffer.from(a)));
console.log(Buffer.from(a));