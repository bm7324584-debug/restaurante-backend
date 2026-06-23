const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🍳 Conexión exitosa a MongoDB Atlas (Restaurante)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema NoSQL de Mongoose adaptado a Platillos
const PlatilloSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  categoria: String // Ejemplo: Entrada, Plato Fuerte, Bebida, Postre
});

const Platillo = mongoose.model('Platillo', PlatilloSchema);

// RUTAS DE LA API
// 1. GET: Obtener todos los platillos del menú
app.get('/platillos', async (req, res) => {
  const platillos = await Platillo.find();
  res.json(platillos);
});

// 2. POST: Registrar un nuevo platillo
app.post('/platillos', async (req, res) => {
  const nuevoPlatillo = new Platillo(req.body);
  await nuevoPlatillo.save();
  res.json({ mensaje: "¡Platillo agregado al menú!", nuevoPlatillo });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));