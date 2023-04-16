class GraphNode {
    constructor(score, parent = null, children = [], level = 0, heuristicValue = 0) {
        this.score = score; 
        this.parent = parent;
        this.children = children; 
        this.level = level;
        this.heuristicValue = heuristicValue;
    }

    getChildren() {
        return this.children;
    }

    expand(decreaseList) { 
        if (this.score < Math.min(...decreaseList))
            return; 
        
        let nextGen = []
        decreaseList.forEach(decreaseNumber => {
            if (this.score - decreaseNumber < 0)
                return;

            nextGen.push(new GraphNode(this.score - decreaseNumber, this, [], this.level + 1));
        });

        this.children = nextGen;
        this.children.forEach(node => node.expand(decreaseList));
    }

    setHeuristicValue(value) {
        this.heuristicValue = value;
    }

    show() {
        const indent = Array(this.level + 1).join("|   ");
        console.log(indent + " -> Level: " + this.level + " score: " + this.score + " H-Value: ", this.heuristicValue);
        this.children.forEach(child => child.show())
    }
}

export default GraphNode;