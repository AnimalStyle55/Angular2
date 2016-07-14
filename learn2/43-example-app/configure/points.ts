export class PointsManager {
  static pointsLeft(stats: Stats): number {
    return stats.totalPoints - this.pointsUsed(stats);
  }
  static pointsUsed(stats: Stats): number {
    return Math.pow(parseInt(stats.additionalStrength), 2) + Math.pow(parseInt(stats.additionalDexterity), 2);
  }
}

export class Stats {
  additionalStrength: string;
  additionalDexterity: string;
  totalPoints: number;
  constructor(as: string, ad: string, tp: number) {
    this.additionalDexterity = ad;
    this.additionalStrength = as;
    this.totalPoints = tp;
  }
}
