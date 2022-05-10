import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GamesService } from 'src/app/shared/games.service';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit, OnDestroy {
  @Output() changeStandingsEvent = new EventEmitter<{
    index: number;
    homeGoals: number;
    awayGoals: number;
  }>();

  @Output() changeHalftimeEvent = new EventEmitter<{
    index: number;
    homeHalftimeGoals: number;
    awayHalftimeGoals: number;
  }>();

  @Output() closeMatchDetailsEvent = new EventEmitter<boolean>();

  @Output() changeStats = new EventEmitter<{
    index: number;
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    shotsOnGoalHome: number;
    shotsOnGoalAway: number;
    cornersHome: number;
    cornersAway: number;
  }>();

  i = 0;
  date = 0;
  homeLogo = '';
  home = '';
  homeGoals = 0;
  awayGoals = 0;
  homeHalftimeGoals = 0;
  awayHalftimeGoals = 0;
  away = '';
  awayLogo = '';
  possessionHome = 0;
  possessionAway = 0;
  shots = 0;
  shotsHome = 0;
  shotsAway = 0;
  shotsOnGoal = 0;
  shotsOnGoalHome = 0;
  shotsOnGoalAway = 0;
  corners = 0;
  cornersHome = 0;
  cornersAway = 0;

  dateComponents = {
    inputDate: '1970-01-01',
    inputTime: '00:00',
  };

  currentMatchDetailsSubscription!: Subscription;

  constructor(private gamesService: GamesService) { }

  /**
   * Initialises the current match details, calculates the stats and formats the date to be shown.
   */
  ngOnInit(): void {
    this.currentMatchDetailsSubscription = this.gamesService.currentMatchDetails.subscribe((data) => {
      this.i = data.i;
      this.date = data.date;
      this.homeLogo = data.homeLogo;
      this.home = data.home;
      this.homeGoals = data.homeGoals;
      this.awayGoals = data.awayGoals;
      this.homeHalftimeGoals = data.homeHalftimeGoals;
      this.awayHalftimeGoals = data.awayHalftimeGoals;
      this.away = data.away;
      this.awayLogo = data.awayLogo;
      this.possessionHome = data.possessionHome;
      this.possessionAway = data.possessionAway
      this.shotsHome = data.shotsHome;
      this.shotsAway = data.shotsAway;
      this.shotsOnGoalHome = data.shotsOnGoalHome;
      this.shotsOnGoalAway = data.shotsOnGoalAway;
      this.cornersHome = data.cornersHome;
      this.cornersAway = data.cornersAway;

      this.calculateStats();
      this.formatDate();

      window.scrollTo(0, 600);
    });
  }

  /**
   * Formats the date so that it's converted from ms to a date.
   */
  formatDate() {
    let formattedDate = new Date(this.date);
    let newInputDate =
      formattedDate.getFullYear() +
      '-' +
      ('0' + (formattedDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + formattedDate.getDate()).slice(-2);

    let newInputTime =
      ('0' + formattedDate.getHours()).slice(-2) +
      ':' +
      ('0' + formattedDate.getMinutes()).slice(-2);

    this.dateComponents.inputDate = newInputDate;
    this.dateComponents.inputTime = newInputTime;
  }

  /**
   * Emits an event when the goals in a game are changed
   *
   * @param index - The index of the game
   * @param homeGoals - The home team's amount of goals
   * @param awayGoals - The away team's amount of goals
   */
  changeStandings(index: number, homeGoals: number, awayGoals: number) {
    this.changeStandingsEvent.emit({ index, homeGoals, awayGoals });
  }

  /**
   * Emits an event when the halftiem goals in a game are changed
   *
   * @param index - The index of the game
   * @param homeHalftimeGoals - The home team's amount of halftime goals
   * @param awayHalftimeGoals - The away team's amount of halftime goals
   */
  changeHalftime(
    index: number,
    homeHalftimeGoals: number,
    awayHalftimeGoals: number
  ) {
    if (homeHalftimeGoals != null && awayHalftimeGoals != null) {
      this.changeHalftimeEvent.emit({ index, homeHalftimeGoals, awayHalftimeGoals });
    }
  }

  /**
   * Changes the date when the user changes it.
   *
   * @param index - The index of the game
   */
  changeDate(index: number) {
    let dateInMilliseconds = new Date(`${this.dateComponents.inputDate}T${this.dateComponents.inputTime}`).getTime();

    this.gamesService.changeDate(index, dateInMilliseconds);
  }

  /**
   * Calculates the stats.
   */
  calculateStats() {
    this.shots = this.shotsHome + this.shotsAway;
    this.shotsOnGoal = this.shotsOnGoalHome + this.shotsOnGoalAway;
    this.corners = this.cornersHome + this.cornersAway;
  }

  /**
   * Emits an event when the match details get closed.
   */
  closeMatchDetails() {
    this.closeMatchDetailsEvent.emit(true);
  }

  /**
   * Saves the stats of the game and emits an event when they are saved.
   *
   * @param index - The index of the game
   */
  saveStats(index: number) {
    let possessionHome = this.possessionHome;
    let possessionAway = this.possessionAway;
    let shotsHome = this.shotsHome;
    let shotsAway = this.shotsAway;
    let shotsOnGoalHome = this.shotsOnGoalHome;
    let shotsOnGoalAway = this.shotsOnGoalAway;
    let cornersHome = this.cornersHome;
    let cornersAway = this.cornersAway;

    this.changeStats.emit({ index, possessionHome, possessionAway, shotsHome, shotsAway, shotsOnGoalHome, shotsOnGoalAway, cornersHome, cornersAway });
  }

  ngOnDestroy(): void {
    this.currentMatchDetailsSubscription.unsubscribe();
  }

}
