import * as shell from 'src/app-shell/types';

export default interface ITeam {
    id: string;
    name: string;
    players: string[];
    outfits: IOutfit[]
}

export interface IOutfit {
    name: string;
    colors: string[];
}