export class Rank {

    constructor(influenceToBuy: number) {
        this.influenceToBuy = influenceToBuy;
    }

    name: string;
    tributesPerWeek: number;
    influenceToBuy: number;
    level: number;
    buyingAllowed: boolean;
}
