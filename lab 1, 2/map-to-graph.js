export const mapToGraph = (map) => {
    const result = {};

    map.forEach((line, vIndex) => {
        line.forEach((item, hIndex) => {
            if (item) {
                result[item] = {
                    up: map[vIndex - 1] && map[vIndex - 1][hIndex],
                    down: map[vIndex + 1] && map[vIndex + 1][hIndex],
                    left: line[hIndex - 1],
                    right: line[hIndex + 1],
                }
            }
        });  
    });

    return result;
}