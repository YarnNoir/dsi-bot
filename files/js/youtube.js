const YTlogin = document.getElementById("yt-login")

let GoogleAuth
const SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl"
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load("client:auth2", initClient)
}

function initClient() {
  // In practice, your app can retrieve one or more discovery documents.
  const discoveryUrl =
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.

  gapi.client
    .init({
      apiKey: "AIzaSyC_lcaoutMpitTswam5qOYNlWtSMfUakPA",
      clientId:
        "793272871654-vu99c041t4ik1hiio84revfvbk728a2f.apps.googleusercontent.com",
      discoveryDocs: [discoveryUrl],
      scope: SCOPE,
    })
    .then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance()

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus)

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get()
      setSigninStatus()

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.

      // $("#sign-in-or-out-button").click(function () {
      //   handleAuthClick()
      // })
      // $("#revoke-access-button").click(function () {
      //   revokeAccess()
      // })

      YTlogin.onclick = () => {
        handleAuthClick()
      }
    })
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked "Sign out" button.
    GoogleAuth.signOut()
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn()
  }
}

function revokeAccess() {
  GoogleAuth.disconnect()
}

function setSigninStatus() {
  var user = GoogleAuth.currentUser.get()
  var isAuthorized = user.hasGrantedScopes(SCOPE)
  if (isAuthorized) {
    console.log("logined")
  } else {
    console.log("guest")
  }
}

function updateSigninStatus() {
  setSigninStatus()
}
