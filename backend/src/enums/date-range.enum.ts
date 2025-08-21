export enum DateRangeEnum {
  ALL_TIME = "ALL_TIME",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_MONTH = "LAST_MONTH",
  LAST_3_MONTHS = "LAST_3_MONTHS",
  LAST_YEAR = "LAST_YEAR",
  THIS_MONTH = "THIS_MONTH",
  THIS_YEAR = "THIS_YEAR",
  CUSTOM = "CUSTOM",
}

export type DateRangePreset =
  | DateRangeEnum.ALL_TIME
  | DateRangeEnum.LAST_30_DAYS
  | DateRangeEnum.LAST_MONTH
  | DateRangeEnum.LAST_3_MONTHS
  | DateRangeEnum.LAST_YEAR
  | DateRangeEnum.THIS_MONTH
  | DateRangeEnum.THIS_YEAR;