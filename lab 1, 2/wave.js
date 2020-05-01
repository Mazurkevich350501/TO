export const wave = (graph, startNode, steps, maxCellCount) => {
    let index = 0;
    const cellsToIndex = {};
    let stepsCount = 0;
    let ifCount = 0;
    let ifSuccess = 0;

    const makeNewWave = (nodeKey) => {
        cellsToIndex[nodeKey] = index ++;
        const node = graph[nodeKey]
        for (const step of steps) {
            stepsCount += 1;
            const nextNodeKey = node[step];
            ifCount += 1;
            if (nextNodeKey && !(nextNodeKey in cellsToIndex)) {
                ifSuccess += 1;
                ifCount += 1;
                if (!maxCellCount || index <= maxCellCount) {
                    ifSuccess += 1;
                    makeNewWave(nextNodeKey);
                }
            }
        }    
    } 

    makeNewWave(startNode);

    console.log(
        'steps:', stepsCount,
        '\nif count:', ifCount,
        '\nif (true):', ifSuccess,
    )
    
    return Object.entries(cellsToIndex)
        .sort(([_a, indexA], [_b, indexB]) => indexA - indexB)
        .slice(1)
        .map(([value]) => value);
}