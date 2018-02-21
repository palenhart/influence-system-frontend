import { Corporateer } from "./corporateer";
import { Division } from "./division";

export class Auction {

    id: number;
    beginningTimestamp: string;
    endingTimestamp: string;
    title: String;
    description: String;
    highestBidder: Corporateer;
    creator: Corporateer;
    usableInfluenceDivision: Division;
    highestBid: number;
    currentBid: number;
    minBid: number;
    minStep: number;
}
