const Queue = require('queue-fifo')

class MatchingService {
  constructor() {
    this.userQueue = new Queue()
  }

  joinQueue(userid) {
    this.userQueue.enqueue(userid)
  }

  popQueue() {
    if (this.isEmpty()) {
      // Return null or another appropriate value when the queue is empty
        return null
    }
    return this.userQueue.dequeue()
  }

  isEmpty() {
    return this.userQueue.isEmpty()
  }
}

module.exports = MatchingService
