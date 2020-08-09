let uniqueID = 0;

const uniqueIdMixin = {
    methods: {
        getUniqueId() {
            let tempId = uniqueID;
            uniqueID++;
            return tempId;
        }
    }
}

export default uniqueIdMixin