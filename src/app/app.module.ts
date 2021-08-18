import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { HeaderComponent } from './header/header.component';
import { SportsComponent } from './sports/sports.component';
import { SoccerComponent } from './sports/soccer/soccer.component';
import { BasketballComponent } from './sports/basketball/basketball.component';
import { LeagueComponent } from './sports/soccer/league/league.component';
import { MatchDetailsComponent } from './sports/soccer/league/match-details/match-details.component';
import { FixturesComponent } from './sports/soccer/league/fixtures/fixtures.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    HeaderComponent,
    SportsComponent,
    SoccerComponent,
    BasketballComponent,
    LeagueComponent,
    MatchDetailsComponent,
    FixturesComponent,
    FooterComponent,
    LegalNoticeComponent,
    DataPrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
