import { PlayerType } from "../types";
import GraphNode from "./graph";

export class Game {
    constructor(startScore, decreaseList, firstPlayer) {
        const rootNode = new GraphNode(startScore);
        rootNode.expand(decreaseList);
        HeuristicEvaluation.apply(rootNode);

        this.rootNode = rootNode; 
        this.currentNode = rootNode;
        this.firstPlayer = PlayerType[firstPlayer];
    }

    play(point, isAI) {
        let prevScore = this.currentNode.score; 
        if (isAI) {
            let max = false;
            if (this.firstPlayer === PlayerType.COMPUTER)
                max = true;
            
            this.currentNode = this.currentNode.children.sort((a,b) => a.heuristicValue - b.heuristicValue).slice(max ? 0 : -1).pop()
        }else{
            this.currentNode = this.currentNode.children.find(node => node.score === this.currentNode.score - point);
        }

        return {
            value: prevScore - this.currentNode.score,
            canPlay: this.currentNode.children.length > 0
        }
    }
}

export const HeuristicEvaluation = {
    apply: node => {
        if (node.children.length === 0) {
            const value = (node.level - 1) % 2 === 0 ? 1 : -1;
            node.setHeuristicValue(value);
            return value;
        }

        let temp = node.children.map(child => HeuristicEvaluation.apply(child));

        const value = node.level  % 2 === 0 ? Math.max(...temp) : Math.min(...temp);
        node.setHeuristicValue(value);
        return value;
    }
}

