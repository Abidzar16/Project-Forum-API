exports.up = (pgm) => {
  pgm.addConstraint('likes', 'fk_likes.user_users.id', `FOREIGN KEY("user") REFERENCES users(id) ON DELETE CASCADE`);
  pgm.addConstraint('likes', 'fk_likes.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.user_users.id', 'IF EXISTS ON DELETE CASCADE');
  pgm.dropConstraint('likes', 'fk_likes.comment_comments.id', 'IF EXISTS ON DELETE CASCADE');
};
