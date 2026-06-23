const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🍳 Conexión exitosa a MongoDB Atlas (CRUD Completo)"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema NoSQL
const PlatilloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String, default: "" }
});

const Platillo = mongoose.model('Platillo', PlatilloSchema);

// 1. GET: Obtener todos los platillos
app.get('/platillos', async (req, res) => {
  try {
    const platillos = await Platillo.find();
    res.json(platillos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los platillos" });
  }
});

// 2. POST: Guardar un nuevo platillo
app.post('/platillos', async (req, res) => {
  try {
    const nuevoPlatillo = new Platillo(req.body);
    await nuevoPlatillo.save();
    res.status(201).json({ mensaje: "¡Platillo agregado!", nuevoPlatillo });
  } catch (err) {
    res.status(400).json({ error: "Error al guardar el platillo" });
  }
});

// 3. DELETE: Eliminar un platillo por su ID único de MongoDB
app.delete('/platillos/:id', async (req, res) => {
  try {
    await Platillo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "¡Platillo eliminado con éxito!" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el platillo" });
  }
});

// 4. PUT: Actualizar/Editar un platillo existente por su ID
app.put('/platillos/:id', async (req, res) => {
  try {
    const platilloActualizado = await Platillo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "¡Platillo actualizado con éxito!", platilloActualizado });
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el platillo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor CRUD activo en puerto ${PORT}`));