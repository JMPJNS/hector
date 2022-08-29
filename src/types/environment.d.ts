declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      DB_TYPE: "sqlite" | "postgres"
      DB_HOST?: string
      DB_PORT?: number
      DB_USER?: string
      DB_PASSWORD?: string
      DB_DATABASE: string
    }
  }
}

export {}