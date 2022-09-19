export type Language = "de" | "en"

export type Locale = {
	[key in Language]: {
		name: string
		flag: string
	}
}

export {}