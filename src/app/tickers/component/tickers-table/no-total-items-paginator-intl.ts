import { Injectable } from '@angular/core'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { Subject } from 'rxjs'

@Injectable()
export class NoTotalItemsPaginatorIntl implements MatPaginatorIntl {
  public changes = new Subject<void>()

  public firstPageLabel = `First page`
  public itemsPerPageLabel = `Items per page:`
  public lastPageLabel = `Last page`

  public nextPageLabel = 'Next page'
  public previousPageLabel = 'Previous page'

  public getRangeLabel(page: number): string {
    return `Page ${page + 1}`
  }
}
