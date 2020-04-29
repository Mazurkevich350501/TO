export const wave = (graph, startNode, steps, maxCellCount) => {
    let index = 0;
    const cellsToIndex = {};

    const makeNewWave = (nodeKey) => {
        cellsToIndex[nodeKey] = index ++;
        const node = graph[nodeKey]
        for (const step of steps) {
            const nextNodeKey = node[step];
            if (nextNodeKey && !(nextNodeKey in cellsToIndex)) {
                if (!maxCellCount || index <= maxCellCount) {
                    makeNewWave(nextNodeKey);
                }
            }
        }    
    } 

    makeNewWave(startNode);
    
    return Object.entries(cellsToIndex)
        .sort(([_a, indexA], [_b, indexB]) => indexA - indexB)
        .slice(1)
        .map(([value]) => value);
}