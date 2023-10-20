class MatchingService {
  constructor () {
    this.EasyQueue = []
    this.MediumQueue = []
    this.HardQueue = []
  }

  checkNewLocation (checkUserid) {
    // need to check whether its a requeue
    let user
    for (let i = 0; i < this.EasyQueue.length; i++) {
      user = this.EasyQueue[i]
      if (user.userid === checkUserid) {
        return true
      }
    }
    for (let i = 0; i < this.MediumQueue.length; i++) {
      user = this.MediumQueue[i]
      if (user.userid === checkUserid) {
        return true
      }
    }
    for (let i = 0; i < this.HardQueue.length; i++) {
      user = this.HardQueue[i]
      if (user.userid === checkUserid) {
        return true
      }
    }
    return false
  }

  leaveQueue (checkSocketid) {
    // need to check whether its a requeue
    let user
    for (let i = 0; i < this.EasyQueue.length; i++) {
      user = this.EasyQueue[i]
      if (user.socketid === checkSocketid) {
        this.EasyQueue.splice(i, 1)
      }
    }
    for (let i = 0; i < this.MediumQueue.length; i++) {
      user = this.MediumQueue[i]
      if (user.socketid === checkSocketid) {
        this.MediumQueue.splice(i, 1)
      }
    }
    for (let i = 0; i < this.HardQueue.length; i++) {
      user = this.HardQueue[i]
      if (user.socketid === checkSocketid) {
        this.HardQueue.splice(i, 1)
      }
    }
  }

  findMatchingLanguages (user1Languages, user2Languages) {
    const matchingLanguages = []
    for (const language of user2Languages) {
      if (user1Languages.includes(language)) {
        matchingLanguages.push(language)
      }
    }
    return matchingLanguages
  }

  hasMatchingLanguages (user1Languages, user2Languages) {
    if (user1Languages.length === 0 && user2Languages.length === 0) {
      return true
    }
    const matchingLanguages = this.findMatchingLanguages(user1Languages, user2Languages)
    if (matchingLanguages.length > 0) {
      return true
    }
  }

  isEmpty (difficulty, languages) {
    if (difficulty === 'Easy') {
      for (const user of this.EasyQueue) {
        if (this.hasMatchingLanguages(languages, user.languages)) {
          return false
        }
      }
      return true
    } else if (difficulty === 'Normal') {
      for (const user of this.MediumQueue) {
        if (this.hasMatchingLanguages(languages, user.languages)) {
          return false
        }
      }
      return true
    } else {
      for (const user of this.HardQueue) {
        if (this.hasMatchingLanguages(languages, user.languages)) {
          return false
        }
      }
      return true
    }
  }

  joinQueue (difficulty, languages, userid, socketid) {
    const newUser = { userid, socketid, languages }
    if (difficulty === 'Easy') {
      this.EasyQueue.push(newUser)
      console.log(this.EasyQueue)
    } else if (difficulty === 'Normal') {
      this.MediumQueue.push(newUser)
    } else if (difficulty === 'Hard') {
      this.HardQueue.push(newUser)
    }
  }

  isMatchFound (user1Languages, user2Languages) {
    if (user1Languages.length === 0 && user2Languages.length === 0) {
      return true
    }
    const matchingLanguages = this.findMatchingLanguages(user1Languages, user2Languages)
    return matchingLanguages.length > 0
  }

  popQueue (difficulty, languages) {
    if (difficulty === 'Easy') {
      for (let i = 0; i < this.EasyQueue.length; i++) {
        const user = this.EasyQueue[i]
        if (this.isMatchFound(languages, user.languages)) {
          const matchedUser = this.EasyQueue.splice(i, 1)[0]
          return matchedUser
        }
      }
      return null
    } else if (difficulty === 'Normal') {
      for (let i = 0; i < this.MediumQueue.length; i++) {
        const user = this.MediumQueue[i]
        if (this.isMatchFound(languages, user.languages)) {
          const matchedUser = this.MediumQueue.splice(i, 1)[0]
          return matchedUser
        }
      }
      return null
    } else if (difficulty === 'Hard') {
      for (let i = 0; i < this.HardQueue.length; i++) {
        const user = this.HardQueue[i]
        if (this.isMatchFound(languages, user.languages)) {
          const matchedUser = this.HardQueue.splice(i, 1)[0]
          return matchedUser
        }
      }
      return null
    }
  }
}

module.exports = MatchingService
