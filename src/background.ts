chrome.runtime.onMessage.addListener((request: {
  url: string;
  sfHost?: string; message: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
}) => {
  if (request.message === "getSfHost") {
    const cookieOptions: chrome.cookies.Details = { url: request.url, name: "sid" };
    chrome.cookies.get(cookieOptions, (cookie: chrome.cookies.Cookie | null) => {
      const currentDomain = new URL(request.url).hostname;
      if (!cookie) {
        request.sendResponse(currentDomain);
        return;
      }
      let [orgId] = cookie.value.split("!");
      const salesforceCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "salesforce.com", secure: true };
      chrome.cookies.getAll(salesforceCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
        let sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
        if (sessionCookie) {
          request.sendResponse(sessionCookie.domain);
        } else {
          const cloudforceCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "cloudforce.com", secure: true };
          chrome.cookies.getAll(cloudforceCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
            sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
            if (sessionCookie) {
              request.sendResponse(sessionCookie.domain);
            } else {
              const salesforceMilCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "salesforce.mil", secure: true};
              chrome.cookies.getAll(salesforceMilCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
                sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
                if (sessionCookie) {
                  request.sendResponse(sessionCookie.domain);
                } else {
                  const cloudforceMilCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "cloudforce.mil", secure: true};
                  chrome.cookies.getAll(cloudforceMilCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
                    sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
                    if (sessionCookie) {
                      request.sendResponse(sessionCookie.domain);
                    } else {
                      request.sendResponse(currentDomain);
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
    return true;
  }
  if (request.message === "getSession") {
    const sessionCookieOptions: chrome.cookies.Details = { url: "https://" + request.sfHost, name: "sid" };
    chrome.cookies.get(sessionCookieOptions, (sessionCookie: chrome.cookies.Cookie | null) => {
      if (!sessionCookie) {
        request.sendResponse(null);
        return;
      }
      let session = { key: sessionCookie.value, hostname: sessionCookie.domain };
      request.sendResponse(session);
    });
    return true;
  }
  return false;
});
export {}