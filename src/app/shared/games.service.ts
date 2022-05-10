import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { leagueDetails } from '../sports/soccer/league/league.component';

@Injectable({ providedIn: 'root' })
export class GamesService {
  httpOptions = {
    headers: new HttpHeaders(environment.apiSports),
  };

  standings: any = [];
  games: any = [];
  allGames: any = [];
  allSeasonGames: any = [];

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

  showMatchDetails = false;
  matchDetails = {
    i: 0,
    date: 0,
    homeLogo: '',
    awayLogo: '',
    home: '',
    away: '',
    homeGoals: 0,
    awayGoals: 0,
    homeHalftimeGoals: 0,
    awayHalftimeGoals: 0,
    possessionHome: 0,
    possessionAway: 0,
    shotsHome: 0,
    shotsAway: 0,
    shotsOnGoalHome: 0,
    shotsOnGoalAway: 0,
    cornersHome: 0,
    cornersAway: 0
  };

  private showMatchDetailsSource = new BehaviorSubject(this.showMatchDetails);
  currentShowMatchDetails = this.showMatchDetailsSource.asObservable();

  private matchDetailsSource = new BehaviorSubject(this.matchDetails);
  currentMatchDetails = this.matchDetailsSource.asObservable();

  private gamesSource = new BehaviorSubject(this.games);
  currentGames = this.gamesSource.asObservable();

  currentTeamsSource = new Subject<any>();

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  /**
   * Gets the status for the data API to see how many requests have already been made today.
   */
  getStatus() {
    this.http
      .get('https://v3.football.api-sports.io/status', this.httpOptions)
      .pipe(take(1))
      .subscribe((responseData: any) => {
        console.log(responseData);
      });
  }

  /**
   * Fetches the teams of this league's season to the database.
   *
   * @returns - The teams of this league's season
   */
  fetchTeams() {
    let teams: any = [];

    return this.http
      .get(
        `https://v3.football.api-sports.io/teams?league=${this.leagueDetails.leagueId}&season=${this.leagueDetails.season}`,
        this.httpOptions
      )
      .pipe(
        take(1),
        map((responseData: any) => {
          for (let i = 0; i < responseData.response.length; i++) {
            const element = responseData.response[i];
            teams.push({ name: element.team.name, logo: element.team.logo });
          }
          let firebaseTeams = { teams };
          this.firestore
            .collection(this.leagueDetails.leagueName)
            .doc('teams')
            .set(firebaseTeams);
          return responseData;
        })
      );
  }

  /**
   * Fetches the games of this league's season to the database.
   *
   * @returns - The games of this league's season
   */
  fetchGames() {
    let gamedaysArray: any = [];
    for (let i = 0; i < this.leagueDetails.gamedays; i++) {
      gamedaysArray.push([]);
    }
    return this.http
      .get(
        `https://v3.football.api-sports.io/fixtures?league=${this.leagueDetails.leagueId}&season=${this.leagueDetails.season}`,
        this.httpOptions
      )
      .pipe(
        take(1),
        map((responseData: any) => {
          // let additionalGamedays = this.leagueDetails.gamedays;
          // let lastRoundName = '';

          for (let i = 0; i < responseData.response.length; i++) {
            const element = responseData.response[i];

            if (element.fixture.status.short != 'CANC') {
              let gameday = +element.league.round.slice(-2);
              gameday = +('0' + gameday).slice(-2);

              // console.log('fetchGames', gameday);

              let getTimeDate = new Date(element.fixture.date).getTime();

              // if (isNaN(gameday) && lastRoundName != element.league.round && element.league.round.includes('MLS Cup')) {
              //   console.log("check", lastRoundName + element.fixture.date);
              //   additionalGamedays++;
              //   lastRoundName = element.league.round;
              //   gameday = additionalGamedays;
              //   gamedaysArray.push([]);
              // } else if (isNaN(gameday) && lastRoundName === element.league.round) {
              //   gameday = additionalGamedays;
              // } else if (isNaN(gameday) && !element.league.round.includes('MLS Cup')) {
              //   continue;
              // }

              // if (element.teams.home.name === 'Borussia Monchengladbach') {
              //   element.teams.home.name = 'Borussia Mgladbach';
              // } else if (element.teams.away.name === 'Borussia Monchengladbach') {
              //   element.teams.away.name = 'Borussia Mgladbach';
              // }
              // if (element.teams.home.name === 'VfL BOCHUM') {
              //   element.teams.home.name = 'VfL Bochum';
              // } else if (element.teams.away.name === 'VfL BOCHUM') {
              //   element.teams.away.name = 'VfL Bochum';
              // }
              // if (element.teams.home.name === 'SpVgg Greuther Furth') {
              //   element.teams.home.name = 'Greuther Furth';
              // } else if (element.teams.away.name === 'SpVgg Greuther Furth') {
              //   element.teams.away.name = 'Greuther Furth';
              // }

              gamedaysArray[gameday - 1].push({
                home: element.teams.home.name,
                away: element.teams.away.name,
                halftimeHome: element.score.halftime.home,
                halftimeAway: element.score.halftime.away,
                fulltimeHome: element.score.fulltime.home,
                fulltimeAway: element.score.fulltime.away,
                logoHome: element.teams.home.logo,
                logoAway: element.teams.away.logo,
                possessionHome: 0,
                possessionAway: 0,
                shotsHome: 0,
                shotsAway: 0,
                shotsOnGoalHome: 0,
                shotsOnGoalAway: 0,
                cornersHome: 0,
                cornersAway: 0,
                date: getTimeDate,
              });
            }
          }
          for (let i = 0; i < gamedaysArray.length; i++) {
            this.sortGames(gamedaysArray[i]);
          }

          this.firestore
            .collection(`${this.leagueDetails.leagueName}`)
            .doc('games')
            .set({ ...gamedaysArray });

          return responseData;
        })
      );
  }

  /**
   * Sorts the specific gameday by date.
   *
   * @param gameday - The currently to be sorted gameday
   * @returns - The sorted gameday
   */
  sortGames(gameday: any) {
    gameday.sort(function (a: any, b: any) {
      return a.date - b.date;
    });
    return gameday;
  }

  /**
   * Gets the teams from the database and initialises the standings
   *
   * @returns - The initialised standings
   */
  getTeams() {
    return this.firestore
      .collection(this.leagueDetails.leagueName)
      .doc('teams')
      .get()
      .pipe(
        take(1),
        map((response: any) => {
          let teams = response.data();
          this.standings = [];
          for (const team of teams.teams) {
            this.standings.push({
              team: team.name,
              logo: team.logo,
              gamesPlayed: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              gf: 0,
              ga: 0,
              gd: 0,
              points: 0,
              current: '',
            });
          }
          return this.standings;
        })
      );
  }

  /**
   * Gets all the games of this league's season from the database.
   *
   * @returns - The games of this league's season
   */
  getAllSeasonGames() {
    return this.firestore
      .collection(`${this.leagueDetails.leagueName}`)
      .doc('games')
      .get()
      .pipe(
        take(1),
        map((response) => {
          let allSeasonGamesData = response.data();
          this.allSeasonGames = allSeasonGamesData;
          console.log('asGD', allSeasonGamesData);
          return this.allSeasonGames;
        })
      );
  }

  /**
   * Sets this services's match details to the passed match details.
   *
   * @param matchDetails - The details of the currently selected match
   */
  changeMatchDetails(matchDetails: any) {
    this.showMatchDetails = true;

    this.matchDetails.i = matchDetails.i;
    this.matchDetails.date = matchDetails.date;
    this.matchDetails.homeLogo = matchDetails.homeLogo;
    this.matchDetails.awayLogo = matchDetails.awayLogo;
    this.matchDetails.home = matchDetails.home;
    this.matchDetails.away = matchDetails.away;
    this.matchDetails.homeGoals = matchDetails.homeGoals;
    this.matchDetails.awayGoals = matchDetails.awayGoals;
    this.matchDetails.homeHalftimeGoals = matchDetails.homeHalftimeGoals;
    this.matchDetails.awayHalftimeGoals = matchDetails.awayHalftimeGoals;
    this.matchDetails.possessionHome = matchDetails.possessionHome;
    this.matchDetails.possessionAway = matchDetails.possessionAway;
    this.matchDetails.shotsHome = matchDetails.shotsHome;
    this.matchDetails.shotsAway = matchDetails.shotsAway;
    this.matchDetails.shotsOnGoalHome = matchDetails.shotsOnGoalHome;
    this.matchDetails.shotsOnGoalAway = matchDetails.shotsOnGoalAway;
    this.matchDetails.cornersHome = matchDetails.cornersHome;
    this.matchDetails.cornersAway = matchDetails.cornersAway;

    this.changeMatchDetailsNext();
  }

  /**
   * Informs the components which subscribed that the currently selected match has been changed.
   */
  changeMatchDetailsNext() {
    this.showMatchDetailsSource.next(this.showMatchDetails);
    this.matchDetailsSource.next(this.matchDetails);
    this.currentTeamsSource.next(this.matchDetails.i);
  }

  /**
   * Sets the service's gameday to the passed gameday.
   *
   * @param gameday - The currently selected gameday
   */
  changeGameday(gameday: number) {
    this.leagueDetails.gameday = gameday;
  }

  /**
   * Changes a game's date.
   *
   * @param index - The gameday index of the game
   * @param date - The new date
   */
  changeDate(index: number, date: number) {
    this.matchDetails.date = date;
    this.games[index].date = date;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].date = date;
    this.gamesSource.next(this.games);
    this.updateAllSeasonGames(this.allSeasonGames);
  }

  /**
   * Sets the service's standings to the passed standings.
   *
   * @param standings - The standings of this league's season
   */
  updateStandings(standings: any) {
    this.standings = standings;
  }

  /**
   * Sets the service's allGames to the passed allGames.
   *
   * @param allGames - The games from gameday one until the selected gameday of this league's season
   */
  updateAllGames(allGames: any) {
    this.allGames = allGames;
  }

  /**
   * Sets the service's allSeasonGames to the passed allSeasonGames.
   *
   * @param allSeasonGames - All the games of this league's season
   */
  updateAllSeasonGames(allSeasonGames: any) {
    this.allSeasonGames = allSeasonGames;
    localStorage.setItem(
      `${this.leagueDetails.leagueName}-games`,
      JSON.stringify(this.allSeasonGames)
    );
  }

  /**
   * Sets the service's games to the passed games.
   *
   * @param games - The games of this gameday
   */
  updateGames(games: any) {
    this.games = games;
    this.gamesSource.next(this.games);
  }
}
