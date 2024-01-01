chrome.runtime.onMessage.addListener((request: {
  url: string;
  sfHost?: string; message: any}, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
) => {
    // Perform cookie operations in the background page, because not all foreground pages have access to the cookie API.
  // Firefox does not support incognito split mode, so we use sender.tab.cookieStoreId to select the right cookie store.
  // Chrome does not support sender.tab.cookieStoreId, which means it is undefined, and we end up using the default cookie store according to incognito split mode.
  if (request.message === "getSfHost" && sender.tab != null) {
    // When on a *.visual.force.com page, the session in the cookie does not have API access,
    // so we read the corresponding session from *.salesforce.com page.
    // The first part of the session cookie is the OrgID,
    // which we use as key to support being logged in to multiple orgs at once.
    // http://salesforce.stackexchange.com/questions/23277/different-session-ids-in-different-contexts
    // There is no straight forward way to unambiguously understand if the user authenticated against salesforce.com or cloudforce.com
    // (and thereby the domain of the relevant cookie) cookie domains are therefore tried in sequence.
    //TODO handle parameter storeId: sender.tab.cookieStoreId 
    //but chrome typescript import do not work 
    const cookieOptions: chrome.cookies.Details = { url: request.url, name: "sid"};
    chrome.cookies.get(cookieOptions, (cookie: chrome.cookies.Cookie | null) => {
      const currentDomain = new URL(request.url).hostname;
      if (!cookie) {
        sendResponse(currentDomain);
        return;
      }
      let [orgId] = cookie.value.split("!");
      const salesforceCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "salesforce.com", secure: true };
      chrome.cookies.getAll(salesforceCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
        let sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
        if (sessionCookie) {
          sendResponse(sessionCookie.domain);
        } else {
          const cloudforceCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "cloudforce.com", secure: true };
          chrome.cookies.getAll(cloudforceCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
            sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
            if (sessionCookie) {
              sendResponse(sessionCookie.domain);
            } else {
              const salesforceMilCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "salesforce.mil", secure: true};
              chrome.cookies.getAll(salesforceMilCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
                sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
                if (sessionCookie) {
                  sendResponse(sessionCookie.domain);
                } else {
                  const cloudforceMilCookieOptions: chrome.cookies.GetAllDetails = { name: "sid", domain: "cloudforce.mil", secure: true};
                  chrome.cookies.getAll(cloudforceMilCookieOptions, (cookies: chrome.cookies.Cookie[]) => {
                    sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
                    if (sessionCookie) {
                      sendResponse(sessionCookie.domain);
                    } else {
                      sendResponse(currentDomain);
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
        sendResponse(null);
        return;
      }
      let session = { key: sessionCookie.value, hostname: sessionCookie.domain };
      sendResponse(session);
    });
    return true;
  }
  return false;
});
export {}