const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🍳 Conexión exitosa a MongoDB Atlas (Menú Premium)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// NUEVO ESQUEMA PREMIUM: Ahora incluye descripción e imagen
const PlatilloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" } // Imagen por defecto si no ponen una
});

const Platillo = mongoose.model('Platillo', PlatilloSchema);

// RUTAS DE LA API
// 1. GET: Obtener el menú completo
app.get('/platillos', async (req, res) => {
  try {
    const platillos = await Platillo.find();
    res.json(platillos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los platillos" });
  }
});

// 2. POST: Guardar un platillo con todos sus nuevos datos
app.post('/platillos', async (req, res) => {
  try {
    const nuevoPlatillo = new Platillo(req.body);
    await nuevoPlatillo.save();
    res.status(201).json({ mensaje: "¡Platillo premium agregado!", nuevoPlatillo });
  } catch (err) {
    res.status(400).json({ error: "Error al guardar el platillo, verifica los datos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Premium corriendo en puerto ${PORT}`));