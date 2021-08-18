import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GamesService } from 'src/app/shared/games.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})
export class FixturesComponent implements OnInit, OnDestroy {

  games: any = [];

  matchDetailsJson = {
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

  currentGamesSubscription!: Subscription;

  constructor(private gamesService: GamesService) { }

  /**
   * Initialises to listen to changes to the current game
   */
  ngOnInit(): void {
    this.currentGamesSubscription = this.gamesService.currentGames.subscribe((games) => {
      this.games = games;
    });
  }

  /**
   * Sets the match details to the specific game's details
   *
   * @param index - The gameday index of the game
   */
  showMatchDetails(index: number) {
    this.matchDetailsJson.i = index;
    this.matchDetailsJson.date = this.games[index].date;
    this.matchDetailsJson.home = this.games[index].home;
    this.matchDetailsJson.homeGoals = this.games[index].fulltimeHome;
    this.matchDetailsJson.away = this.games[index].away;
    this.matchDetailsJson.awayGoals = this.games[index].fulltimeAway;
    this.matchDetailsJson.homeLogo = this.games[index].logoHome;
    this.matchDetailsJson.awayLogo = this.games[index].logoAway;
    this.matchDetailsJson.homeHalftimeGoals = this.games[index].halftimeHome;
    this.matchDetailsJson.awayHalftimeGoals = this.games[index].halftimeAway;
    this.matchDetailsJson.possessionHome = this.games[index].possessionHome;
    this.matchDetailsJson.possessionAway = this.games[index].possessionAway;
    this.matchDetailsJson.shotsHome = this.games[index].shotsHome;
    this.matchDetailsJson.shotsAway = this.games[index].shotsAway;
    this.matchDetailsJson.shotsOnGoalHome = this.games[index].shotsOnGoalHome;
    this.matchDetailsJson.shotsOnGoalAway = this.games[index].shotsOnGoalAway;
    this.matchDetailsJson.cornersHome = this.games[index].cornersHome;
    this.matchDetailsJson.cornersAway = this.games[index].cornersAway;

    this.gamesService.changeMatchDetails(this.matchDetailsJson);
  }

  ngOnDestroy(): void {
    this.currentGamesSubscription.unsubscribe();
  }

}
