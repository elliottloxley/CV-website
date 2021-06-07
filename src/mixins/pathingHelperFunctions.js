const pathingHelperFunctions = {
    methods: {
        squaredPointDistance(coord1, coord2) {
            return Math.pow((coord1[0]-coord2[0]), 2) + Math.pow((coord1[1]-coord2[1]), 2);
        },
        pointDistance(coord1, coord2) {
            return Math.sqrt(Math.pow((coord1[0]-coord2[0]), 2) + Math.pow((coord1[1]-coord2[1]), 2));
        },
        pathDistance(path) { //takes array of arrays [[1,1],[1,0],[0,0]]
            let totalDistance = 0;
            for(let i = 0; i < path.length - 1; i++) {
                totalDistance +=  this.pointDistance(path[i], path[i+1]);
            }

            return totalDistance;
        },
        pathSplitDistances(path) {
            let distances = [];
            for(let i = 0; i < path.length - 1; i++) {
                distances.push(this.pointDistance(path[i], path[i+1]));
            }

            return distances;
        },
        pathSplitDistancesProportions(path) {
            let total = this.pathDistance(path);

            let distances = [];
            for(let i = 0; i < path.length - 1; i++) {
                distances.push(this.pointDistance(path[i], path[i+1]) / total);
            }

            return distances;
        },
        pathTotalAndSplitDistances(path) {
            let totalDistance = 0;
            let distances = [];

            for(let i = 0; i < path.length - 1; i++) {
                let distance = this.pointDistance(path[i], path[i+1])
                distances.push(distance);
                totalDistance +=  distance;
            }

            return {total: totalDistance, split: distances};
        },
        getTimePerPathSegment(path, totalTime) {
            let pathInfo = this.pathTotalAndSplitDistances(path);
            let proportionalTimings = [];

            let unitSpeed = (pathInfo.total) / totalTime;

            for(let i = 0; i < pathInfo.split.length; i++) {
                proportionalTimings.push((pathInfo.split[i]) / unitSpeed);
            }

            return proportionalTimings;
        },
        getTimePerPathSegmentScaled(absoluteCoords, lineLength, totalTime) {
            let absoluteDistances = this.pathSplitDistances(absoluteCoords);
            let proportions = absoluteDistances.map((val) => {return val / lineLength});

            return proportions.map((val) => {return val * totalTime});
        },
        getPercentDistanceOfEachNode(path) {
            let proportions = this.pathSplitDistancesProportions(path);
            let nodePercentages = [0];
            let sum = 0;

            for(let i = 0; i < proportions.length; i++) {
                sum += proportions[i];

                nodePercentages.push(sum);
            }

            return nodePercentages;
        },
    }
}

export default pathingHelperFunctions;