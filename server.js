const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión limpia a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 [BACKEND PREMIUM] Conectado exitosamente a MongoDB Atlas"))
  .catch(err => console.error("❌ Error en la conexión NoSQL:", err));

// Estructura de Datos (Esquema) Mejorada
const PlatilloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, default: "" }
});

const Platillo = mongoose.model('Platillo', PlatilloSchema);

// === CONTROLADORES DE LA API (CRUD COMPLETO) ===

// 1. OBTENER TODO (GET)
app.get('/platillos', async (req, res) => {
  try {
    const platillos = await Platillo.find();
    res.json(platillos);
  } catch (err) {
    res.status(500).json({ error: "No se pudieron obtener los datos." });
  }
});

// 2. CREAR NUEVO (POST)
app.post('/platillos', async (req, res) => {
  try {
    const nuevoPlatillo = new Platillo(req.body);
    await nuevoPlatillo.save();
    res.status(201).json({ mensaje: "¡Platillo creado!", nuevoPlatillo });
  } catch (err) {
    res.status(400).json({ error: "Error en los datos enviados." });
  }
});

// 3. EDITAR EXISTENTE (PUT)
app.put('/platillos/:id', async (req, res) => {
  try {
    const actualizado = await Platillo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "¡Platillo actualizado!", actualizado });
  } catch (err) {
    res.status(400).json({ error: "No se pudo actualizar." });
  }
});

// 4. ELIMINAR (DELETE)
app.delete('/platillos/:id', async (req, res) => {
  try {
    await Platillo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "¡Platillo eliminado correctamente!" });
  } catch (err) {
    res.status(500).json({ error: "No se pudo eliminar." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor de Alta Gama corriendo en puerto ${PORT}`));