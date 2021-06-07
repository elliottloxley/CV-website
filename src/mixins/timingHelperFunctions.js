const timingHelperFunctions = {
    methods: {
        getEaseInTiming(elapsed, start, end, total) {
            return end * (elapsed /= total) * elapsed + start;
        }
    }
}

export default timingHelperFunctions;