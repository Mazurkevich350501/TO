import {BinaryReader} from './binary-reader';
import {Files} from './files';
import {DecompressorSteps} from './steps';


const reader = new BinaryReader('res.file');
const map = DecompressorSteps.getSymbolToKey(reader);
console.log(map);


// console.log('asd');
// const a = Files.getBinary('res.file');
// // console.log(BitArray.fromBuffer(Buffer.from(a)));
// console.log(Buffer.from(a));