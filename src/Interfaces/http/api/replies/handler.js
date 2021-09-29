const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
// const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    // this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id } = request.auth.credentials;
    var payload = request.payload;
    
    payload['owner'] = id;
    payload['thread'] = threadId;
    payload['comment'] = commentId;

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  // async deleteCommentHandler(request, h) {
  //   const { threadId, commentId } = request.params;
  //   const { id } = request.auth.credentials;

  //   const payload = {
  //     thread: threadId,
  //     comment: commentId,
  //     owner: id,
  //   }

  //   const deleteCommentUseCase = this._container.getInstance(DeleteReplyUseCase.name);
  //   await deleteCommentUseCase.execute(payload);

  //   const response = h.response({
  //     status: 'success'
  //   });
  //   response.code(200);
  //   return response;
  // }
}

module.exports = RepliesHandler;