export const environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: { url: process.env.DB_URL || "mongodb+srv://futirstanjo:<SemSenha>@cluster0.lajjj.gcp.mongodb.net/meat-api" },
  security: { saltRounds: process.env.SALT_ROUNDS || 10 }
}