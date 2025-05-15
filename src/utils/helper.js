export async function handleFetch(url, options = {}) {
  
    const token = getCookieValue('userToken');
    let authToken = {};
    const isCoreApiHost = process.env.NEXT_API_URL;

    if (token) {
      authToken =  {
          Authorization: `Bearer ${token}`,
        }
    }
    try {
      const response = await fetch(url, {
        // credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...authToken,
          ...options?.headers,
        },
      });
      const data = await response.json();
      //  console.log("jdhfjdfhjdgfh", data);
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401');
        } else {
          throw new Error(data?.message || data?.error?.message || 'An error occurred while fetching data.');
        }
      }
  
      return data;
    } catch (error) {
      console.error('Fetch Error:', error.message);
      console.log(error.message || 'Failed to fetch data.');
      throw error;
      // return false;
    }
  }


export const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration time
    expires = `; expires=${date.toUTCString()}`; // Format the expiration date
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`; // Set the cookie
};
// Usage
// setCookie("username", "JohnDoe", 7); // Sets a cookie named "username" with value "JohnDoe" that expires in 7 days

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999;`; // Set a negative Max-Age to delete the cookie
};
// export const createAuthData = (authData) => {
//   // console.log('authd data', authData, 'tups ', type, 'orgname ', orgName);
//   window.localStorage.setItem('authData', JSON.stringify(authData));
//   setCookie('token', authData.token, 7);
// };
