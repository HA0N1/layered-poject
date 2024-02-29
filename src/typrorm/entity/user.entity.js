import typeorm from 'typeorm';

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: 'Users',
  tableName: 'users',
  columns: {
    userId: {
      primary: true,
      type: 'int',
      generated: true,
    },
    clientId: { type: 'varchar' },
    email: { type: 'varchar' },
    password: { type: 'varchar' },
    grade: { type: 'varchar' },
    name: { type: 'varchar' },
    createdAt: { type: 'datetime' },
  },
});
