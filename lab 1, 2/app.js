import {map1} from './lab-1';
import {map2} from './lab-2';
import {mapToGraph} from './map-to-graph';
import {wave} from './wave';

const [
    lab,
    startNode,
    steps,
    stepsCount
] = process.argv.slice(2);

const graph = mapToGraph(lab === '1' ? map1 : map2);
const result = wave(graph, startNode, steps.split(','), stepsCount);
console.log(result);