const CustomAPIError = require('../errors/custom-error')
const {StatusCodes} = require('http-status-codes')
const pool = require('../db/dbconfig')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createJWT = function (admin, _id, name){
  return jwt.sign({admin:admin ,customerId:_id, name:name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}


const encryptPass = async function(pass){
  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(pass, salt)
  return password
}

const comparePassword = async function (sentPass, originalPass){
  const res = await bcrypt.compare(sentPass, originalPass)
  return res
}

const register = async (req,res)=>{
  const {password, name, email, dob, country, city, street, state, zip, phoneNumbers} = req.body
  pass = await encryptPass(password)

  await pool.query(
    `INSERT INTO "Customer" (
      "Password", 
      "Name", 
      "Email", 
      "DateOfBirth", 
      "Country", 
      "City", 
      "Street", 
      "State", 
      "ZIP"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [pass, name, email, dob, country, city, street, state, zip]
  );

  const user = await pool.query(
    `SELECT * FROM "Customer" WHERE "Email" = $1`,
    [email]
  );
  
  for (const phoneNumber of phoneNumbers) {
    await pool.query(
      `INSERT INTO "CPhone" VALUES ($1, $2)`,
      [user.rows[0].CustomerId, phoneNumber]
    );
  }

  await pool.query(
    `INSERT INTO "Cart" ("CustomerId") VALUES ($1)`,
    [user.rows[0].CustomerId]
  );

  user.rows[0] = {...user.rows[0], phoneNumbers}
  const token = createJWT(user.rows[0].AdminState, user.rows[0].CustomerId, user.rows[0].Name)
  res.status(StatusCodes.CREATED).json({user:user.rows[0], token})
}

const login = async (req,res)=>{
  const {email ,password} = req.body
  const user = await pool.query(
    `SELECT 
      c."CustomerId",
      c."Name",
      c."Email",
      c."Password",
      c."Country",
      c."City",
      c."Street",
      c."State",
      c."AdminState",
      STRING_AGG(cp."Phone"::TEXT, ',') AS "PhoneNumbers"
    FROM 
      "Customer" c
    INNER JOIN 
      "CPhone" cp ON c."CustomerId" = cp."CustomerId"
    WHERE 
      c."Email" = $1
    GROUP BY 
      c."CustomerId", 
      c."Name", 
      c."Email", 
      c."Password", 
      c."Country", 
      c."City", 
      c."Street", 
      c."State",
      c."AdminState"`,
    [email]
  );

  if(!user.rows[0]){
    throw new CustomAPIError('Email or password wrong', StatusCodes.UNAUTHORIZED)
  }

  user.rows[0].PhoneNumbers = user.rows[0].PhoneNumbers.split(',')

  const passIsMatch = await comparePassword(password, user.rows[0].Password)
  if(!passIsMatch){
    throw new CustomAPIError('Password doesnt match', StatusCodes.UNAUTHORIZED)
  }

  const token = createJWT(user.rows[0].AdminState, user.rows[0].CustomerId, user.rows[0].Name)
  res.status(StatusCodes.OK).json({user:user.rows[0], token})
}


module.exports = {
  register,
  login
}