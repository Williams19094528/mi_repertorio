const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const repertorioPath = path.join(__dirname, "repertorio.json");
const clientPath = path.join(__dirname, "index.html");

// Ruta para servir el archivo HTML
app.get("/", (req, res) => {
  res.sendFile(clientPath);
});

// Ruta para agregar una canción
app.post("/canciones", (req, res) => {
  const nuevaCancion = req.body;

  fs.readFile(repertorioPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo.");

    const repertorio = JSON.parse(data);
    repertorio.push(nuevaCancion);

    fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar la canción.");
      res.status(201).send("Canción agregada exitosamente.");
    });
  });
});

// Ruta para obtener todas las canciones
app.get("/canciones", (req, res) => {
  fs.readFile(repertorioPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo.");
    res.json(JSON.parse(data));
  });
});

// Ruta para modificar una canción por ID
app.put("/canciones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cancionActualizada = req.body;

  fs.readFile(repertorioPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo.");

    let repertorio = JSON.parse(data);
    const index = repertorio.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).send("Canción no encontrada.");
    }

    repertorio[index] = { ...repertorio[index], ...cancionActualizada };

    fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar la canción.");
      res.send("Canción actualizada exitosamente.");
    });
  });
});

// Ruta para eliminar una canción por ID
app.delete("/canciones/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(repertorioPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo.");

    let repertorio = JSON.parse(data);
    repertorio = repertorio.filter((c) => c.id !== id);

    fs.writeFile(repertorioPath, JSON.stringify(repertorio, null, 2), (err) => {
      if (err) return res.status(500).send("Error al eliminar la canción.");
      res.send("Canción eliminada exitosamente.");
    });
  });
});

// Levantar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
