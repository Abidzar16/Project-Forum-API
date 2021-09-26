const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const GetCommentUseCase = require('../../../../Applications/use_case/GetCommentUseCase');
const GetUsernameUseCase = require('../../../../Applications/use_case/GetUsernameUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;
    var payload = request.payload;
    
    payload['owner'] = id;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;
    
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const getCommentUseCase = this._container.getInstance(GetCommentUseCase.name);
    const getUsernameUseCase = this._container.getInstance(GetUsernameUseCase.name);

    const payload = {'thread': threadId,};

    var detailedThread = await getThreadUseCase.execute(payload);
    detailedThread['username'] = await getUsernameUseCase.execute({'id': detailedThread['owner']});
    delete detailedThread['owner'];

    var rawComments = await getCommentUseCase.execute(payload);
    
    const detailedComments = await Promise.all(rawComments.map(async (comment) => {
      comment['username'] = await getUsernameUseCase.execute({'id': comment['owner']});
      delete comment['owner'];
      return comment;
    }));

    detailedThread['comments'] = detailedComments;

    const response = h.response({
      status: 'success',
      data: {
        thread: detailedThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
