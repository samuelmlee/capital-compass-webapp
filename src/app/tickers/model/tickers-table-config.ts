export enum COLUMN_TYPE {
  ACTION = 'ACTION',
  LINK = 'LINK',
  TEXT = 'TEXT'
}

export type BaseColumnDef = {
  key: string
  title: string
  headerCellclass: string[]
  type: COLUMN_TYPE
  cellClass?: string[]
}

export type ActionColumnDef = BaseColumnDef & {
  type: COLUMN_TYPE.ACTION
  actionCallback: (element: unknown) => void
  actionLabel: string
}

export type LinkColumnDef = BaseColumnDef & {
  type: COLUMN_TYPE.LINK
  routeParam: string
  routePath: string
}

export type TickersTableConfig = {
  pageSize: number
  columnDefs: Array<BaseColumnDef | ActionColumnDef | LinkColumnDef>
}
