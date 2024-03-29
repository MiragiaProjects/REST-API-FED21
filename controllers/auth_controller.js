const bcrypt = require('bcrypt');
const debug = require('debug')('albums:auth_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

 /**
  * Register a new user
  *
  * POST /register
  */
  const register = async (req, res) => {

    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    console.log("The validated data:", validData);

    // generate a hash of `validData.password`
    // and overwrite `validData.password` with the generated hash
    try {
        validData.password = await bcrypt.hash(validData.password, 10);

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
        throw error;
    }

    try {
        const user = await new models.User(validData).save();
        debug("Created new user successfully: %O", user);

        res.status(200).send({
            status: 'success',
            data: {
                email: validData.email,
            } 
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user.',
        });
        throw error;
    }
}

module.exports = {
    register,
}