export class Team {
  constructor(
    public name: string,
    public wins: number,
    public draws: number,
    public losses: number,
    public goalsFor: number,
    public goalsAgainst: number,
    public goalDifference: number,
    public points: number
  ) {}
}
