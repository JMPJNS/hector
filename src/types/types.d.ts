/* eslint-disable @typescript-eslint/ban-types */
export type Language = "de" | "en"

export type Locale = {
	[key in Language]: {
		name: string
		flag: string
	}
}

export type DeepPartial<T> = {
    [P in keyof T]?:
        | null
        | (T[P] extends Array<infer U>
              ? Array<DeepPartial<U>>
              : T[P] extends ReadonlyArray<infer U>
              ? ReadonlyArray<DeepPartial<U>>
              : DeepPartial<T[P]>)
}

export type DeepRequired<T, U extends object | undefined = undefined> = T extends object
    ? {
          [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<U | Function | Type<any>>
              ? NonNullable<T[P]>
              : DeepRequired<NonNullable<T[P]>, U>
      }
    : T

export interface Type<T> extends Function {
    new (...args: any[]): T
}

export {}