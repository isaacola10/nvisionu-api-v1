const ADMINISTRATOR = require("../models/administrator.model")
const bcrypt = require('bcryptjs')

async function CreateAdministrator(name, email, password, session=null) {
  return await new ADMINISTRATOR({
    name, email, password
  }).save({session})
}

async function FindAdministrator(email) {
  return await ADMINISTRATOR.findOne({email})
}



async function IsPasswordMatch(user, user_inputted_password) {
  return await bcrypt.compareSync(user_inputted_password, user.password);
}

module.exports = {CreateAdministrator, FindAdministrator, IsPasswordMatch}