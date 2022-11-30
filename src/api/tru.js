const moment = require("moment");
const fetch = require("node-fetch");
const httpSignature = require("http-signature");
const jwksClient = require("jwks-rsa");

const tru_api_base_url = 'https://eu.api.tru.id';
const keyClient = jwksClient({
  jwksUri: `${tru_api_base_url}/.well-known/jwks.json`,
});

// token cache in memory
const TOKEN = {
  accessToken: undefined,
  expiresAt: undefined,
};

async function getAccessToken() {
  // check if existing valid token
  if (TOKEN.accessToken !== undefined && TOKEN.expiresAt !== undefined) {
    // we already have an access token let's check if it's not expired
    // by removing 1 minute because access token is about to expire so it's better refresh anyway
    if (
      moment()
        .add(1, "minute")
        .isBefore(moment(new Date(TOKEN.expiresAt)))
    ) {
      // token not expired
      return TOKEN.accessToken;
    }
  }

  const url = `${tru_api_base_url}/oauth2/v1/token`;

  const toEncode = `${process.env.TRU_ID_CLIENT_ID}:${process.env.TRU_ID_CLIENT_SECRET}`;
  const auth = Buffer.from(toEncode).toString('base64');

  const requestHeaders = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(url, {
    method: "post",
    headers: requestHeaders,
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "phone_check coverage subscriber_check",
    }),
  });

  if (!res.ok) {
    return false
  }

  const json = await res.json();

  // update token cache in memory
  TOKEN.accessToken = json.access_token;
  TOKEN.expiresAt = moment().add(json.expires_in, "seconds").toString();

  return json.access_token;
}

async function checkCoverage(req, res) {
  const accessToken = await getAccessToken()
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const deviceCoverageResponse = await fetch(
    `${tru_api_base_url}/coverage/v0.1/device_ips/${ip}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (deviceCoverageResponse.status === 200) {
    // Loop through products to double check we cover SubscriberCheck for this MNO
    const data = await deviceCoverageResponse.json()

    for (var counter = 0, length = data.products.length; counter < length; counter++) {
      if (data.products[counter] !== null) {
        if (data.products[counter].product_id === 'SUK') {
          return true
        }
      }
    }
  } else if (deviceCoverageResponse.status === 400) {
    // tru.ID has no coverage for this mobile network operator default to SMS
    console.log('tru.ID has no coverage for this mobile network operator. Sending an SMS OTP')
    return false
  } else if (deviceCoverageResponse.status === 412) {
    // Default to SMS
    console.log('IP address is not a mobile IP Address, here, you could suggest the user disabled WiFi. Sending an SMS OTP')
    return false
  } else {
    // Unexpected result from device coverage check. Default to SMS
    console.log('Unexpected result from coverage check. Sending an SMS OTP')
    return false
  }
}

async function createSubscriberCheck(phone) {
  // Create SubscriberCheck resource
  const token = await getAccessToken()

  const subscriberCheckCreateResult = await fetch(`${tru_api_base_url}/subscriber_check/v0.2/checks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phone,
      redirect_url: `${process.env.EXTERNAL_URL}/api/sck-password-reset-code`,
    }),
  });

  if (subscriberCheckCreateResult.status === 201) {
    const data = await subscriberCheckCreateResult.json()

    return data
  }

  return false
}

async function patchSubscriberCheck(check_id, code) {
  const url = `${tru_api_base_url}/subscriber_check/v0.2/checks/${check_id}`
  const body = [{ op: 'add', path: '/code', value: code }]

  const token = await getAccessToken()
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json-patch+json',
  }

  const subscriberCheckPatchResult = await fetch(url, {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify(body),
  });

  if (subscriberCheckPatchResult.status === 200) {
    const data = await subscriberCheckPatchResult.json()

    return data
  }

  return {}
}

async function getSubscriberCheckStatus(checkId) {
  const url = `${tru_api_base_url}/subscriber_check/v0.2/checks/${checkId}`

  const token = await getAccessToken()
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const subscriberCheckResult = await fetch(url, {
    method: 'GET',
    headers: requestHeaders,
  });

  if (subscriberCheckResult.status === 200) {
    const data = await subscriberCheckResult.json()

    return data
  }

  return {}

}

module.exports = {
  getAccessToken,
  checkCoverage,
  createSubscriberCheck,
  patchSubscriberCheck,
  getSubscriberCheckStatus
}