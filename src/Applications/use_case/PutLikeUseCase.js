const CreateLike = require('../../Domains/likes/entities/CreateLike');

class PutLikeUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const createLike = new CreateLike(useCasePayload);
    const {thread, comment} = createLike
    await this._commentRepository.checkCommentThreadRelation(thread, comment);
    await this.addOrChange(createLike);
  }

  async addOrChange(createLike) {
    const {comment, user} = createLike
    var likeId = await this._likeRepository.isLikeExist(comment, user);
    if (likeId === null) {
      await this._likeRepository.addLike(createLike);
    } else {
      await this._likeRepository.changeLike(likeId);
    }
  }
}

module.exports = PutLikeUseCase;