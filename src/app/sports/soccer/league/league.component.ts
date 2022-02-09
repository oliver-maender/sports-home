import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { take } from 'rxjs/operators';
import { GamesService } from 'src/app/shared/games.service';
import { LeagueInfoService } from 'src/app/shared/league-info.service';

export interface leagueDetails {
  leagueName: string,
  season: string,
  leagueId: number,
  gameday: number,
  gamedays: number,
  amountTeams: number,
  gamesPerGameday: number,
  specialPos: Array<string>,
  penalties: Array<{ team: string, points: number }>,
  hasPenalties: boolean
}

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  changedStandings: any = [];
  previousStandings: any = [];
  standings: any = [];
  games: any = [];
  allGames: any = [];
  allSeasonGames: any = {};

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

  initialCall = true;

  routeSubscription!: Subscription;
  currentTeamSubscription!: Subscription;
  currentMatchDetailsSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gamesService: GamesService,
    private leagueInfoService: LeagueInfoService
  ) { }

  /**
   * Initialises the website with checking the route and subscribes to value changes of the variable to show or not show the match details.
   */
  ngOnInit(): void {
    this.checkForRoute();
    // this.getStatus();
    this.changeSelectedTeams();

    this.currentMatchDetailsSubscription = this.gamesService.currentShowMatchDetails.subscribe((data) => {
      this.showMatchDetails = data;
    });
  }

  /**
   * Checks for the route to display the correct league.
   */
  checkForRoute() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      if (params['name']) {
        this.leagueDetails.leagueName = params['name'];
      } else {
        this.leagueDetails.leagueName = 'soccer-ger-1-2020';
      }
      this.getLeagueInfo();
    });
  }

  /**
   * Initiates the function to fetch the league info to the database.
   */
  fetchLeagueInfo() {
    this.leagueInfoService.fetchLeagueInfo();
  }

  /**
   * Gets the league details to display the characteristics of this league.
   */
  getLeagueInfo() {
    this.leagueInfoService.leagueDetails.leagueName =
      this.leagueDetails.leagueName;
    this.leagueInfoService
      .getLeagueInfo()
      .pipe(take(1))
      .subscribe((data) => {
        this.leagueDetails = data;
        this.leagueDetails.season = this.leagueDetails.leagueName.slice(-4);
        this.initialCall = true;
        this.gamesService.leagueDetails = this.leagueDetails;
        this.leagueInfoService.leagueDetails = this.leagueDetails;
        this.getTeams();
        // this.fetchTeams();
        // this.fetchGames();
      });
  }

  /**
   * Initiates the function to get the status for the data API to see how many requests have already been made today.
   */
  getStatus() {
    this.gamesService.getStatus();
  }

  /**
   * Initiates the function to fetch the teams from this league to the database.
   */
  fetchTeams() {
    this.gamesService
      .fetchTeams()
      .pipe(take(1))
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  /**
   * Initiates the function to fetch the games from this league to the database.
   */
  fetchGames() {
    this.gamesService
      .fetchGames()
      .pipe(take(1))
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  /**
   * Sets all goals to null, so that it looks like the league's season would have not been played (yet).
   */
  setAllGoalsToNull() {
    for (let i = 0; i < Object.keys(this.allSeasonGames).length; i++) {
      const gameday = this.allSeasonGames[i];
      for (const game of gameday) {
        game.halftimeHome = null;
        game.halftimeAway = null;
        game.fulltimeHome = null;
        game.fulltimeAway = null;
      }
    }
    this.gamesService.updateAllSeasonGames(this.allSeasonGames);
  }

  /**
   * Gets the teams for this league's season from the database or the local storage if available.
   */
  getTeams() {
    if (localStorage.getItem(`${this.leagueDetails.leagueName}-teams`)) {
      this.standings = JSON.parse(
        localStorage.getItem(`${this.leagueDetails.leagueName}-teams`) || ''
      );
      this.showMatchDetails = false;
      this.getAllGames();
    } else {
      this.gamesService
        .getTeams()
        .pipe(take(1))
        .subscribe((standings) => {
          this.standings = standings;
          localStorage.setItem(
            `${this.leagueDetails.leagueName}-teams`,
            JSON.stringify(this.standings)
          );
          this.getAllGames();
        });
    }
  }

  /**
   * Gets the games of one gameday from the array which contains all games of this league's season.
   */
  getGames() {
    this.games = [];

    for (let i = 0; i < this.allGames[this.leagueDetails.gameday - 1].length; i++) {
      this.games.push(this.allGames[this.leagueDetails.gameday - 1][i]);
    }
    this.showMatchDetails = false;
    this.gamesService.updateGames(this.games);
  }

  /**
   * Gets the games for this league's season from the database or the local storage if available.
   */
  getAllGames() {
    if (localStorage.getItem(`${this.leagueDetails.leagueName}-games`)) {
      this.allSeasonGames = JSON.parse(
        localStorage.getItem(`${this.leagueDetails.leagueName}-games`) || ''
      );
      if (this.initialCall) {
        this.determineGameday();
        this.initialCall = false;
      } else {
        this.processAllGames();
      }
    } else {
      console.log('From FB');
      this.gamesService
        .getAllSeasonGames()
        .pipe(take(1))
        .subscribe((allSeasonGamesData) => {
          this.allSeasonGames = allSeasonGamesData;
          if (this.initialCall) {
            this.determineGameday();
            this.initialCall = false;
          } else {
            this.processAllGames();
          }
        });
    }
  }

  /**
   * Checks when the next game is and shows the gameday right before
   */
  determineGameday() {
    let currentDate = new Date().getTime();
    for (let i = 0; i < Object.keys(this.allSeasonGames).length; i++) {
      if (this.allSeasonGames[i][0].date > currentDate) {
        if (i > 0) {
          this.leagueDetails.gameday = i;
        } else {
          this.leagueDetails.gameday = 1;
        }
        break;
      }
    }
    this.processAllGames();
  }

  /**
   * Gets all games of this league's season from gameday one until the currently selected gameday.
   */
  processAllGames() {
    this.allGames = [];
    for (let i = 0; i < this.leagueDetails.gameday; i++) {
      this.allGames.push(this.allSeasonGames[i]);
    }
    this.gamesService.updateAllGames(this.allGames);
    this.gamesService.updateAllSeasonGames(this.allSeasonGames);
    this.getGames();
    this.setStandingsToZero();
    this.calculateStandings();
  }

  /**
   * Sets all standings values to zero so that the standings can be calculated again from zero.
   */
  setStandingsToZero() {
    for (let i = 0; i < this.standings.length; i++) {
      this.standings[i].gamesPlayed = 0;
      this.standings[i].wins = 0;
      this.standings[i].draws = 0;
      this.standings[i].losses = 0;
      this.standings[i].gf = 0;
      this.standings[i].ga = 0;
      this.standings[i].gd = 0;
      this.standings[i].points = 0;
    }
    this.gamesService.updateStandings(this.standings);
  }

  /**
   * Changes the selected team in the standings so that you can see which two teams in the standings are currently shown in match details
   */
  changeSelectedTeams() {
    this.currentTeamSubscription =
      this.gamesService.currentTeamsSource.subscribe((data) => {
        for (let i = 0; i < this.standings.length; i++) {
          const element = this.standings[i];

          if (element.team === this.games[data].home) {
            this.standings[i].current = 'home';
          } else if (element.team === this.games[data].away) {
            this.standings[i].current = 'away';
          } else {
            this.standings[i].current = '';
          }
        }
      });
  }

  /**
   * Calculates the standings depending on how the games ended, skips games without a valid result and sorts them afterwads.
   */
  calculateStandings() {
    for (let i = 0; i < this.allGames.length; i++) {
      if (i >= this.leagueDetails.gamedays) {
        continue;
      }
      const gameday = this.allGames[i];
      for (const game of gameday) {
        if (game.fulltimeHome === null) {
          continue;
        }
        if (game.fulltimeHome > game.fulltimeAway) {
          this.calculateStandingsValues(game.home, 1, 1, 0, 0, game.fulltimeHome, 3, game.away, 1, 0, 0, 1, game.fulltimeAway, 0);
        } else if (game.fulltimeHome < game.fulltimeAway) {
          this.calculateStandingsValues(game.home, 1, 0, 0, 1, game.fulltimeHome, 0, game.away, 1, 1, 0, 0, game.fulltimeAway, 3);
        } else {
          this.calculateStandingsValues(game.home, 1, 0, 1, 0, game.fulltimeHome, 1, game.away, 1, 0, 1, 0, game.fulltimeAway, 1);
        }
      }
      if (i === this.allGames.length - 2) {
        this.previousStandings = JSON.parse(JSON.stringify(this.standings)); // Bad performance but best non third party solution I found
        this.calculateGoalDifferenceAndPenalties(this.previousStandings);
      }
    }
    if (this.allGames.length < 2) {
      this.previousStandings = JSON.parse(JSON.stringify(this.standings)); // Bad performance but best non third party solution I found
      this.calculateGoalDifferenceAndPenalties(this.previousStandings);
    }
    this.calculateGoalDifferenceAndPenalties(this.standings);
    this.sortStandings();
  }

  /**
   * Calculates the goal difference and penalties if applicable for the passed standings
   *
   * @param {any} selectedStandings - The standings for which this should be calculated
   */
  calculateGoalDifferenceAndPenalties(selectedStandings: any) {
    for (let i = 0; i < selectedStandings.length; i++) {
      const element = selectedStandings[i];
      selectedStandings[i].gd = element.gf - element.ga;
    }
    if (this.leagueDetails.hasPenalties) {
      for (const penalty of this.leagueDetails.penalties) {
        for (const team of selectedStandings) {
          if (team.team === penalty.team) {
            team.points -= penalty.points;
            break;
          }
        }
      }
    }
  }

  /**
   * Sorts the standings and previous standings checks if it's gameday 1.
   */
  sortStandings() {
    this.previousStandings.sort(function (a: any, b: any) {
      return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team);
    });

    this.standings.sort(function (a: any, b: any) {
      return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team);
    });

    this.gamesService.updateStandings(this.standings);

    if (this.leagueDetails.gameday > 1) {
      this.checkForStandingsChanges();
    } else {
      for (let i = 0; i < this.standings.length; i++) {
        this.changedStandings[i] = 0;
      }
    }
  }

  /**
   * It checks how the team changed from the gameday before to this gameday and saves this in the changedStandings array.
   */
  checkForStandingsChanges() {
    this.changedStandings = [];
    for (let i = 0; i < this.standings.length; i++) {
      const place = this.standings[i];
      if (place.team !== this.previousStandings[i].team) {
        for (let j = 0; j < this.previousStandings.length; j++) {
          const element = this.previousStandings[j];
          const team = place.team;
          if (element.team === team) {
            this.changedStandings[i] = j - i;
            break;
          }
        }
      }
      else {
        this.changedStandings[i] = 0;
      }
    }
  }

  /**
   * Changes the values in the standings for the specific teams.
   *
   * @param {string} hName - The home team's name
   * @param {number} hGP - The home team's change of games played
   * @param {number} hW - The home team's change of wins
   * @param {number} hD - The home team's change of draws
   * @param {number} hL - The home team's change of losses
   * @param {number} hG - The home team's change of goals scored
   * @param {number} hP - The home team's change of points
   * @param {string} aName - The away team's name
   * @param {number} aGP - The away team's change of games played
   * @param {number} aW - The away team's change of wins
   * @param {number} aD - The away team's change of draws
   * @param {number} aL - The away team's change of losses
   * @param {number} aG - The away team's change of goals scored
   * @param {number} aP - The away team's change of points
   */
  calculateStandingsValues(
    hName: string, hGP: number, hW: number, hD: number, hL: number, hG: number, hP: number,
    aName: string, aGP: number, aW: number, aD: number, aL: number, aG: number, aP: number
  ) {
    for (let i = 0; i < this.standings.length; i++) {
      const element = this.standings[i];
      if (element.team === hName) {
        this.standings[i].gamesPlayed += hGP;
        this.standings[i].wins += hW;
        this.standings[i].draws += hD;
        this.standings[i].losses += hL;
        this.standings[i].gf += hG;
        this.standings[i].ga += aG;
        this.standings[i].points += hP;
      } else if (element.team === aName) {
        this.standings[i].gamesPlayed += aGP;
        this.standings[i].wins += aW;
        this.standings[i].draws += aD;
        this.standings[i].losses += aL;
        this.standings[i].gf += aG;
        this.standings[i].ga += hG;
        this.standings[i].points += aP;
      }
    }
  }

  /**
   * Changes the standings value after a game's result has changed depending on how the game result was before and how it is now and sorts the standings again.
   * This is a huge function because it checks many different game outcomes.
   *
   * @param {number} index - The gameday index of the game
   * @param {number} homeGoals - The new amount of goals the home team scored
   * @param {number} awayGoals - The new amount of goals the away team scored
   */
  changeStandings(index: number, homeGoals: number, awayGoals: number) {
    if (homeGoals < 0 || awayGoals < 0) {
      return;
    }
    const game = this.games[index];
    if (game.fulltimeHome > game.fulltimeAway && game.fulltimeAway != null) {
      if (homeGoals < awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 0, -1, 0, 1, -3, game.away, 0, 1, 0, -1, 3);
      } else if (homeGoals === awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 0, -1, 1, 0, -2, game.away, 0, 0, 1, -1, 1);
      } else if (homeGoals === null || awayGoals === null) {
        this.changeStandingsValues(game.home, -1, -1, 0, 0, -3, game.away, -1, 0, 0, -1, 0);
      }
    } else if (
      game.fulltimeHome < game.fulltimeAway &&
      game.fulltimeHome != null
    ) {
      if (homeGoals > awayGoals && awayGoals != null) {
        this.changeStandingsValues(game.home, 0, 1, 0, -1, 3, game.away, 0, -1, 0, 1, -3);
      } else if (homeGoals === awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 0, 0, 1, -1, 1, game.away, 0, -1, 1, 0, -2);
      } else if (homeGoals === null || awayGoals === null) {
        this.changeStandingsValues(game.home, -1, 0, 0, -1, 0, game.away, -1, -1, 0, 0, -3);
      }
    } else if (
      game.fulltimeHome === game.fulltimeAway &&
      game.fulltimeHome != null
    ) {
      if (homeGoals > awayGoals && awayGoals != null) {
        this.changeStandingsValues(game.home, 0, 1, -1, 0, 2, game.away, 0, 0, -1, 1, -1);
      } else if (homeGoals < awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 0, 0, -1, 1, -1, game.away, 0, 1, -1, 0, 2);
      } else if (homeGoals === null || awayGoals === null) {
        this.changeStandingsValues(game.home, -1, 0, -1, 0, -1, game.away, -1, 0, -1, 0, -1);
      }
    } else if (
      (game.fulltimeHome === null && game.fulltimeAway != null) ||
      (game.fulltimeHome != null && game.fulltimeAway === null) ||
      (game.fulltimeHome === null && game.fulltimeAway === null)
    ) {
      if (homeGoals > awayGoals && awayGoals != null) {
        this.changeStandingsValues(game.home, 1, 1, 0, 0, 3, game.away, 1, 0, 0, 1, 0);
      } else if (homeGoals < awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 1, 0, 0, 1, 0, game.away, 1, 1, 0, 0, 3);
      } else if (homeGoals === awayGoals && homeGoals != null) {
        this.changeStandingsValues(game.home, 1, 0, 1, 0, 1, game.away, 1, 0, 1, 0, 1);
      }
    }

    this.changeStandingsGoals(game.home, homeGoals, game.fulltimeHome, game.away, awayGoals, game.fulltimeAway);

    this.games[index].fulltimeHome = homeGoals;
    this.games[index].fulltimeAway = awayGoals;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].fulltimeHome = homeGoals;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].fulltimeAway = awayGoals;

    this.gamesService.updateGames(this.games);
    this.gamesService.updateAllSeasonGames(this.allSeasonGames);
    this.sortStandings();
  }

  /**
   * Changes most values in the standings for the specific teams.
   *
   * @param {string} hName - The home team's name
   * @param {number} hGP - The home team's change of games played
   * @param {number} hW - The home team's change of wins
   * @param {number} hD - The home team's change of draws
   * @param {number} hL - The home team's change of losses
   * @param {number} hP - The home team's change of points
   * @param {string} aName - The away team's name
   * @param {number} aGP - The away team's change of games played
   * @param {number} aW - The away team's change of wins
   * @param {number} aD - The away team's change of draws
   * @param {number} aL - The away team's change of losses
   * @param {number} aP - The away team's change of points
   */
  changeStandingsValues(
    hName: string, hGP: number, hW: number, hD: number, hL: number, hP: number,
    aName: string, aGP: number, aW: number, aD: number, aL: number, aP: number
  ) {
    if (this.leagueDetails.gameday > this.leagueDetails.gamedays) {
      return;
    }
    for (let i = 0; i < this.standings.length; i++) {
      const element = this.standings[i];
      if (element.team === hName) {
        this.standings[i].gamesPlayed += hGP;
        this.standings[i].wins += hW;
        this.standings[i].draws += hD;
        this.standings[i].losses += hL;
        this.standings[i].points += hP;
      } else if (element.team === aName) {
        this.standings[i].gamesPlayed += aGP;
        this.standings[i].wins += aW;
        this.standings[i].draws += aD;
        this.standings[i].losses += aL;
        this.standings[i].points += aP;
      }
    }
  }

  /**
   * Changes the goals for and goals against values in the standings for the specific teams and calculates the goal difference for each team.
   *
   * @param {string} hName - The home team's name
   * @param {number} hG - The home team's new amount of goals scored
   * @param {number} hFG - The home team's old amount of goals scored
   * @param {string} aName - The away team's name
   * @param {number} aG - The away team's new amount of goals scored
   * @param {number} aFG - The away team's old amount of goals scored
   */
  changeStandingsGoals(hName: string, hG: number, hFG: number, aName: string, aG: number, aFG: number) {
    if (this.leagueDetails.gameday > this.leagueDetails.gamedays) {
      return;
    }
    for (let i = 0; i < this.standings.length; i++) {
      const element = this.standings[i];
      if (element.team === hName) {
        this.standings[i].gf += hG - hFG;
        this.standings[i].ga += aG - aFG;
        this.standings[i].gd = this.standings[i].gf - this.standings[i].ga;
      } else if (element.team === aName) {
        this.standings[i].gf += aG - aFG;
        this.standings[i].ga += hG - hFG;
        this.standings[i].gd = this.standings[i].gf - this.standings[i].ga;
      }
    }
  }

  /**
   * Changes the halftime for and goals against values in the standings for the specific teams.
   *
   * @param {number} index - The gameday index of the game
   * @param {number} homeHalftimeGoals - The home team's amount of goals scored at halftime
   * @param {number} awayHalftimeGoals - The away team's amount of goals scored at halftime
   */
  changeHalftime(
    index: number,
    homeHalftimeGoals: number,
    awayHalftimeGoals: number
  ) {
    this.games[index].halftimeHome = homeHalftimeGoals;
    this.games[index].halftimeAway = awayHalftimeGoals;

    this.allSeasonGames[this.leagueDetails.gameday - 1][index].halftimeHome =
      homeHalftimeGoals;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].halftimeAway =
      awayHalftimeGoals;

    this.gamesService.updateGames(this.games);
    this.gamesService.updateAllSeasonGames(this.allSeasonGames);
  }

  /**
   * Changes the displayed season of the league.
   *
   * @param {number} season - The now selected season
   */
  changeSeason(season: number) {
    let changeSeason = +this.leagueDetails.season + season;
    let newSeason = this.leagueDetails.leagueName
      .slice(0, -4)
      .concat(changeSeason.toString());

    this.leagueInfoService
      .doesLeagueExist(newSeason)
      .pipe(take(1))
      .subscribe((exists) => {
        if (exists) {
          this.router.navigate([`../${newSeason}`], { relativeTo: this.route });
        }
      });
  }

  /**
   * Changes the displayed gameday for the league's season.
   *
   * @param {number} index - The now selected gameday
   */
  changeGameday(index: number) {
    if (this.allSeasonGames[index - 1]) {
      window.scrollTo(0, 0);
      this.leagueDetails.gameday = index;
      this.gamesService.changeGameday(this.leagueDetails.gameday);
      this.getAllGames();
    }
  }

  /**
   * Changes the stats in the games array.
   *
   * @param index - The index of the game
   * @param possessionHome - The amount of home possession in %
   * @param possessionAway - The amount of away possession in %
   * @param shotsHome - The home team's amount of shots
   * @param shotsAway - The away team's amount of shots
   * @param shotsOnGoalHome - The home team's amount of shots on goal
   * @param shotsOnGoalAway - The away team's amount of shots on goal
   * @param cornersHome - The home team's amount of corners
   * @param cornersAway - The away team's amount of corners
   */
  changeStats(index: number, possessionHome: number, possessionAway: number, shotsHome: number, shotsAway: number, shotsOnGoalHome: number, shotsOnGoalAway: number, cornersHome: number, cornersAway: number) {
    this.games[index].possessionHome = possessionHome;
    this.games[index].possessionAway = possessionAway;
    this.games[index].shotsHome = shotsHome;
    this.games[index].shotsAway = shotsAway;
    this.games[index].shotsOnGoalHome = shotsOnGoalHome;
    this.games[index].shotsOnGoalAway = shotsOnGoalAway;
    this.games[index].cornersHome = cornersHome;
    this.games[index].cornersAway = cornersAway;

    this.allSeasonGames[this.leagueDetails.gameday - 1][index].possessionHome =
      possessionHome;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].possessionAway =
      possessionAway;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].shotsHome =
      shotsHome;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].shotsAway =
      shotsAway;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].shotsOnGoalHome =
      shotsOnGoalHome;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].shotsOnGoalAway =
      shotsOnGoalAway;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].cornersHome =
      cornersHome;
    this.allSeasonGames[this.leagueDetails.gameday - 1][index].cornersAway =
      cornersAway;

    this.gamesService.updateGames(this.games);
    this.gamesService.updateAllSeasonGames(this.allSeasonGames);
  }

  /**
   * Closes the match details.
   */
  closeMatchDetails() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      this.showMatchDetails = false;
    }, 500);
  }

  /**
   * Updates the league data to the current state in the firestore.
   */
  onUpdateLeagueData() {
    localStorage.removeItem(`${this.leagueDetails.leagueName}-games`);
    window.location.reload();
  }

  /**
   * Unsubscribes to all possible subscriptions if necessary.
   */
  ngOnDestroy(): void {
    this.currentMatchDetailsSubscription.unsubscribe();
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.currentTeamSubscription) {
      this.currentTeamSubscription.unsubscribe();
    }
  }
}
