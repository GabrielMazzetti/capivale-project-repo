const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// This is a simplified User schema, matching the one in the application
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cpf: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'merchant', 'admin'], default: 'citizen' },
  status: { type: String, enum: ['active', 'pending_verification', 'inactive'], default: 'pending_verification' },
  emailVerifiedAt: { type: Date, default: null },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

const MONGO_URI = 'mongodb://localhost:27017/capivale_db';

async function insertMerchant() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('Conectado ao MongoDB');

    const merchantData = {
      name: "Comerciante Teste",
      email: "comerciante@teste.com",
      cpf: "123.456.789-00",
      password: "senha123",
      role: 'merchant',
      status: 'active',
      emailVerifiedAt: new Date(),
    };

    const existingUser = await User.findOne({ email: merchantData.email });
    if (existingUser) {
      console.log('Usuário com este email já existe.');
      await mongoose.disconnect();
      return;
    }
    
    const existingUserCPF = await User.findOne({ cpf: merchantData.cpf });
    if (existingUserCPF) {
        console.log('Usuário com este CPF já existe.');
        await mongoose.disconnect();
        return;
    }

    const newUser = new User(merchantData);
    await newUser.save();

    console.log('Usuário comerciante criado com sucesso!');

  } catch (error) {
    console.error('Erro ao inserir usuário comerciante:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

insertMerchant();