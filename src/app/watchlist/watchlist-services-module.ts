import { NgModule } from '@angular/core'
import { CreateWatchlistService } from './service/create-watchlist.service'
import { EditWatchlistService } from './service/edit-watchlist.service'

@NgModule({
  providers: [EditWatchlistService, CreateWatchlistService]
})
export class WatchlistServicesModule {}
