db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  cpf: "111.111.111-11",
  password: "$2b$10$Wa6SRps1FtQiqdPH0bdED.jtLanS88oLvR1O4fblxkoDBAXXhaOS", // Hashed 'password123'
  role: "admin",
  status: "active",
  emailVerifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})