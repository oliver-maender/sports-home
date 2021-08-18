import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { BasketballComponent } from './sports/basketball/basketball.component';
import { LeagueComponent } from './sports/soccer/league/league.component';
import { SoccerComponent } from './sports/soccer/soccer.component';
import { SportsComponent } from './sports/sports.component';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  { path: 'sports/soccer/league/:name', component: LeagueComponent },
  { path: 'sports/basketball', component: BasketballComponent },
  { path: 'sports/soccer', component: SoccerComponent },
  { path: 'sports', component: SportsComponent },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'data-privacy', component: DataPrivacyComponent },
  { path: '', component: StartPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
