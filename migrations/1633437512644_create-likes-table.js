exports.up = pgm => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user: {
      type: 'TEXT',
      notNull: true,
    },
    is_liked: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('likes');
};
