const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';
const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'erimuventures@gmail.com').toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD || '@Erimu2030';
const authCookieName = 'erimu_access_token';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseSetCookie(response) {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }

  const setCookie = response.headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

function extractAuthCookie(response) {
  const cookies = parseSetCookie(response);

  for (const cookie of cookies) {
    const [nameValue] = cookie.split(';');
    if (nameValue.startsWith(`${authCookieName}=`)) {
      return nameValue;
    }
  }

  return undefined;
}

async function request(path, options = {}, cookie) {
  const headers = {
    ...(options.headers || {}),
  };

  if (cookie) {
    headers.cookie = cookie;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  return response;
}

async function run() {
  let cookie;

  console.log(`Auth smoke test against ${apiBaseUrl}`);

  const loginResponse = await request(
    '/auth/login',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    },
  );

  assert([200, 201].includes(loginResponse.status), `Login failed with status ${loginResponse.status}`);

  cookie = extractAuthCookie(loginResponse);
  assert(cookie, 'Login did not return auth cookie');

  const loginBody = await loginResponse.json();
  assert(loginBody?.user?.role, 'Login response is missing user role');
  console.log(`Login passed for role ${loginBody.user.role}`);

  const meResponse = await request('/auth/me', { method: 'GET' }, cookie);
  assert(meResponse.status === 200, `Me endpoint failed with status ${meResponse.status}`);
  console.log('Me endpoint passed');

  const protectedResponse = await request(
    '/properties',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Auth Smoke Property' }),
    },
    cookie,
  );
  assert(
    [200, 201].includes(protectedResponse.status),
    `Protected route failed with status ${protectedResponse.status}`,
  );
  console.log('Protected route passed');

  const logoutResponse = await request('/auth/logout', { method: 'POST' }, cookie);
  assert([200, 201].includes(logoutResponse.status), `Logout failed with status ${logoutResponse.status}`);

  const logoutCookie = extractAuthCookie(logoutResponse);
  if (logoutCookie) {
    cookie = logoutCookie;
  }
  console.log('Logout passed');

  const meAfterLogoutResponse = await request('/auth/me', { method: 'GET' }, cookie);
  assert(
    meAfterLogoutResponse.status === 401,
    `Expected 401 after logout, got ${meAfterLogoutResponse.status}`,
  );
  console.log('Post-logout protection passed');

  console.log('Auth smoke test passed');
}

run().catch((error) => {
  console.error('Auth smoke test failed:', error.message);
  process.exit(1);
});
