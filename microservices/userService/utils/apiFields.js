const ApiFields = {
  name: 'name',
  username: 'username',
  email: 'email',
  password: 'password',
  uid: 'uid',
  languages: 'languages',
  idToken: 'idToken'
}

function validateFields (reqBody, requiredFields) {
  console.log('[DEBUG]', requiredFields)
  const missingFields = []
  for (const field of requiredFields) {
    if (!(field in reqBody)) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(', ')}`)
  }
};

module.exports = {
  ApiFields,
  validateFields
}
