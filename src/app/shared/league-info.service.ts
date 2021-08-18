import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { leagueDetails } from '../sports/soccer/league/league.component';

@Injectable({ providedIn: 'root' })
export class LeagueInfoService {
  leagueDetails: leagueDetails = {
    leagueName: '',
    season: '',
    leagueId: 0,
    gameday: 0,
    gamedays: 0,
    amountTeams: 0,
    gamesPerGameday: 0,
    specialPos: [''],
    penalties: [{ team: '', points: 0 }],
    hasPenalties: false
  };

  constructor(private firestore: AngularFirestore) { }

  /**
   * Fetches all the league info to the database.
   */
  fetchLeagueInfo() {
    this.fetchLeagueInfoTemplate('soccer-eng-1-2016', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g2', 'g3', 'g1', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-1-2017', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-1-2018', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-1-2019', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g4', '', 'g3', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-1-2020', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-1-2021', 39, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g5', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-eng-2-2020', 40, 46, 24, 12, ['g1', 'g1', 'g3', 'g3', 'g3', 'g3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel'], [{ team: 'Sheffield Wednesday', points: 6 }]);
    this.fetchLeagueInfoTemplate('soccer-eng-2-2021', 40, 46, 24, 12, ['g1', 'g1', 'g3', 'g3', 'g3', 'g3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-eng-3-2020', 41, 46, 24, 12, ['g1', 'g1', 'g3', 'g3', 'g3', 'g3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-eng-3-2021', 41, 46, 24, 12, ['g1', 'g1', 'g3', 'g3', 'g3', 'g3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-eng-4-2021', 42, 46, 24, 12, ['g1', 'g1', 'g1', 'g3', 'g3', 'g3', 'g3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-esp-1-2016', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g2', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-esp-1-2017', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-esp-1-2018', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-esp-1-2019', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-esp-1-2020', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g1', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-esp-1-2021', 140, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-fin-1-2021', 244, 22, 12, 6, ['g1', 'g1', 'g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g3', 'g3', 'g3', 'g3']);

    this.fetchLeagueInfoTemplate('soccer-fra-1-2020', 61, 38, 20, 10, ['g1', 'g1', 'g2', 'g3', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-fra-1-2021', 61, 38, 20, 10, ['g1', 'g1', 'g2', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-ger-1-2016', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g2', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ger-1-2017', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g1', 'g3', 'g4', '', 'g3', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ger-1-2018', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ger-1-2019', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ger-1-2020', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g5', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ger-1-2021', 78, 34, 18, 9, ['g1', 'g1', 'g1', 'g1', 'g3', 'g5', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-ger-2-2021', 79, 34, 18, 9, ['g1', 'g1', 'g2', '', '', '', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-ger-11-2021', 81, 0, 64, 32, ['g1']);

    this.fetchLeagueInfoTemplate('soccer-ita-1-2016', 135, 38, 20, 10, ['g1', 'g1', 'g2', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ita-1-2017', 135, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g4', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ita-1-2018', 135, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', '', 'g3', 'g4', 'g3', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel'], [{ team: 'Chievo', points: 3 }]);
    this.fetchLeagueInfoTemplate('soccer-ita-1-2019', 135, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g4', 'g3', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ita-1-2020', 135, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);
    this.fetchLeagueInfoTemplate('soccer-ita-1-2021', 135, 38, 20, 10, ['g1', 'g1', 'g1', 'g1', 'g3', 'g5', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-nor-1-2021', 103, 30, 16, 8, ['g2', 'g5', 'g5', '', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-swe-1-2021', 113, 30, 16, 8, ['g2', 'g5', 'g5', '', '', '', '', '', '', '', '', '', '', 'rel2', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-tur-1-2021', 203, 38, 20, 10, ['g2', 'g2', 'g5', 'g5', '', '', '', '', '', '', '', '', '', '', '', '', 'rel', 'rel', 'rel', 'rel']);

    this.fetchLeagueInfoTemplate('soccer-usa-1-2020', 253, 27, 26, 20, ['g1']);
    this.fetchLeagueInfoTemplate('soccer-usa-1-2021', 253, 46, 27, 10, ['g1']);
  }

  /**
   * Sets the league info
   *
   * @param {string} leagueName - The selected league season name
   * @param {number} id - The id of the league in the API
   * @param {number} gamedays - The amount of gamedays this season
   * @param {number} amountTeams - The amount of teams this season
   * @param {number} gamesPerGameday - The amount of games per gameday this season
   * @param {Array<string>} specialPos - Contains the information for the special position assignments
   * @param {Array<{ team: string, points: number }>} penalties - Contains the information for what teams got point penalties
   */
  fetchLeagueInfoTemplate(leagueName: string, id: number, gamedays: number, amountTeams: number, gamesPerGameday: number, specialPos: Array<string>, penalties?: Array<{ team: string, points: number }>
  ) {
    let hasPenalties = false;
    if (!penalties) {
      penalties = [{ team: '', points: 0 }];
    } else {
      hasPenalties = true;
    }

    this.firestore.collection(`${leagueName}`).doc('league-info').set({
      id: id,
      gamedays: gamedays,
      amountTeams: amountTeams,
      gamesPerGameday: gamesPerGameday,
      specialPos: specialPos,
      penalties: penalties,
      hasPenalties: hasPenalties
    });
  }

  /**
   * Gets the league info from the database
   *
   * @returns - The league info
   */
  getLeagueInfo() {
    return this.firestore
      .collection(this.leagueDetails.leagueName)
      .doc('league-info')
      .valueChanges()
      .pipe(
        take(1),
        map((data: any) => {
          this.leagueDetails.leagueId = data.id;
          this.leagueDetails.gameday = data.gamedays;
          this.leagueDetails.gamedays = data.gamedays;
          this.leagueDetails.amountTeams = data.amountTeams;
          this.leagueDetails.gamesPerGameday = data.gamesPerGameday;
          this.leagueDetails.specialPos = data.specialPos;
          this.leagueDetails.hasPenalties = data.hasPenalties;

          if (data.hasPenalties) {
            this.leagueDetails.penalties = data.penalties;
          } else {
            this.leagueDetails.penalties = [{ team: '', points: 0 }];
          }

          return this.leagueDetails;
        })
      );
  }

  /**
   * Checks if the league exists in the database
   *
   * @param {string} leagueName - The name of the league
   * @returns {boolean} - If the league exists
   */
  doesLeagueExist(leagueName: string) {
    return this.firestore
      .collection(leagueName)
      .doc('league-info')
      .valueChanges()
      .pipe(
        take(1),
        map((data) => {
          if (data != undefined) {
            return true;
          }
          return false;
        })
      );
  }
}
