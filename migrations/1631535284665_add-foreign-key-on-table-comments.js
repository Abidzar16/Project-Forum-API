exports.up = (pgm) => {
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id', 'IF EXISTS ON DELETE CASCADE');
  pgm.dropConstraint('comments', 'fk_comments.thread_threads.id', 'IF EXISTS ON DELETE CASCADE');
};