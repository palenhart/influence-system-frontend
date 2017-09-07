import { Rank } from './rank';
import { Division } from './division';

export class Corporateer {
    id: number;
    name: string;
    tributes: number;
    mainDivision: Division;
    rank: Rank;
    totalInfluence: number;
    lifetimeInfluence: number;
}
