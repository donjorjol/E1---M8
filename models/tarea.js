module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define('Tarea', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.TEXT,
    completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Tareas' // Asegura que coincida con tu DB
  });
  return Tarea;
};