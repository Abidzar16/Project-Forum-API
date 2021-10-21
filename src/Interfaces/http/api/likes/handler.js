const PutLikeUseCase = require('../../../../Applications/use_case/PutLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;
    
    const payload = {
      user: id,
      comment: commentId,
      thread: threadId
    }

    const putLikeUseCase = this._container.getInstance(PutLikeUseCase.name);
    await putLikeUseCase.execute(payload);
    
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;