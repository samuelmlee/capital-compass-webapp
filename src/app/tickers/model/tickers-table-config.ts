export enum COLUMN_TYPE {
  ACTION = 'ACTION',
  LINK = 'LINK',
  TEXT = 'TEXT'
}

export type BaseColumnDef = {
  key: string
  title: string
  class: string[]
  type: COLUMN_TYPE
}

export type ActionColumnDef = BaseColumnDef & {
  type: COLUMN_TYPE.ACTION
  actionCallback: (element: unknown) => void
  actionLabel: string
}

export type LinkColumnDef = BaseColumnDef & {
  type: COLUMN_TYPE.LINK
  fragmentProperty: string
}

export type TickersTableConfig = {
  pageSize: number
  columnDefs: Array<BaseColumnDef | ActionColumnDef | LinkColumnDef>
}
