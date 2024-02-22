import typeorm from 'typeorm';

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: 'Resumes',
  tableName: 'resumes',
  columns: {
    resumeId: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: { type: 'varchar' },
    content: { type: 'varchar' },
    userId: { type: 'int' },
    status: { type: 'varchar' },
    createdAt: { type: 'datetime' },
  },
  relations: {
    users: {
      target: 'Users',
      type: 'many-to-one',
      joinTable: true,
      joinColumn: { name: 'userId' },
      cascade: true,
    },
  },
});
