require('dotenv').config();
const express = require('express');
const { Tarea, sequelize } = require('./models');
const app = express();

app.use(express.json());

// Helper HATEOAS
const generateLinks = (id) => [
    { rel: "todos", method: "GET", href: "/api/v1/tareas" }, 
    { rel: "crear", method: "POST", href: "/api/v1/tareas" }, 
    { rel: "actualizar", method: "PUT", href: `/api/v1/tareas/${id}` },
    { rel: "eliminar", method: "DELETE", href: `/api/v1/tareas/${id}` }
];

// --- RUTAS DE LA API ---

// 2. Obtener Todas las Tareas
app.get('/api/v1/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.findAll();
        const tareasConLinks = tareas.map(t => ({
            ...t.toJSON(),
            links: generateLinks(t.id)
        }));

        res.json({
            count: tareasConLinks.length,
            data: tareasConLinks
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// 3. Obtener una Tarea por su ID
app.get('/api/v1/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tarea = await Tarea.findByPk(id);

        if (!tarea) {
            return res.status(404).json({
                error: "Tarea no encontrada",
                mensaje: `No existe la tarea con el ID ${id}`,
                links: [{ rel: "todos", method: "GET", href: "/api/v1/tareas" }]
            });
        }

        res.json({
            data: tarea,
            links: generateLinks(id)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la tarea' });
    }
});

// 4. Crear una Nueva Tarea
app.post('/api/v1/tareas', async (req, res) => {
    try {
        const nuevaTarea = await Tarea.create(req.body);
        res.status(201).json({
            mensaje: "Tarea creada exitosamente",
            data: nuevaTarea,
            links: generateLinks(nuevaTarea.id)
        });
    } catch (error) {
        res.status(400).json({ error: 'Datos inválidos', detalle: error.message });
    }
});

// 5. Actualizar una Tarea
app.put('/api/v1/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [filasActualizadas] = await Tarea.update(req.body, { where: { id } });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: "No se pudo actualizar, tarea no encontrada" });
        }

        const tareaActualizada = await Tarea.findByPk(id);
        res.json({
            mensaje: "Tarea actualizada",
            data: tareaActualizada,
            links: generateLinks(id)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// 6. Eliminar una Tarea
app.delete('/api/v1/tareas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filasBorradas = await Tarea.destroy({ where: { id } });

        if (filasBorradas === 0) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        res.status(200).json({ 
            mensaje: `Tarea ${id} eliminada correctamente`,
            links: [{ rel: "todos", method: "GET", href: "/api/v1/tareas" }]
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// Inicialización
sequelize.sync()
  .then(() => console.log('✅ Tablas sincronizadas'))
  .catch(err => console.log('❌ Error de conexión:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en: http://localhost:${PORT}/api/v1/tareas`);
});