class MatchingService {
  constructor () {
    this.Queues = {
      Easy: [],
      Medium: [],
      Hard: []
    }
  }

  checkNewLocation (checkUserid) {
    // Loop through all the queues
    for (const queueName in this.Queues) {
      const queue = this.Queues[queueName]
      for (let i = 0; i < queue.length; i++) {
        const user = queue[i]
        if (user.userid === checkUserid) {
          return true
        }
      }
    }
    return false
  }

  leaveQueue (checkSocketid) {
    for (const difficulty in this.Queues) {
      for (let i = this.Queues[difficulty].length - 1; i >= 0; i--) {
        if (this.Queues[difficulty][i].socketid === checkSocketid) {
          this.Queues[difficulty].splice(i, 1)
        }
      }
    }
  }

  findMatchingLanguages (user1Languages, user2Languages) {
    return user2Languages.filter((language) => user1Languages.includes(language))
  }

  hasMatchingLanguages (user1Languages, user2Languages) {
    return this.findMatchingLanguages(user1Languages, user2Languages).length > 0
  }

  isEmpty (difficulty, languages) {
    return this.Queues[difficulty].every((user) => !this.hasMatchingLanguages(languages, user.languages))
  }

  joinQueue (difficulty, languages, userid, socketid) {
    const newUser = { userid, socketid, languages }
    this.Queues[difficulty].push(newUser)
  }

  isMatchFound (user1Languages, user2Languages) {
    return this.findMatchingLanguages(user1Languages, user2Languages).length > 0
  }

  popQueue (difficulty, languages) {
    const queue = this.Queues[difficulty]
    for (let i = 0; i < queue.length; i++) {
      const user = queue[i]
      if (this.isMatchFound(languages, user.languages)) {
        const matchedUser = queue.splice(i, 1)[0]
        return matchedUser
      }
    }
    return null
  }
}

module.exports = MatchingService
