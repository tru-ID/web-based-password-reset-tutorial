const { Vonage } = require('@vonage/server-sdk')

async function createVerification(phoneNumber) {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  })

  const resp = await vonage.verify.start({
    number: phoneNumber,
    brand: process.env.BRAND_NAME,
    workflow_id: process.env.WORKFLOW_ID
  })  

  if (resp.status === '0') {
    // Success
    return resp.request_id
  }

  return null
}

async function verify(request_id, code) {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  })

  console.log(request_id, code)
  const verify = await vonage.verify.check(request_id, code)

  if (verify.status === "0") {
    // Success
    return verify.request_id

  }

  return null
}

module.exports = {
  createVerification,
  verify
}