const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const firebase = require('firebase-admin');


const serviceAccount = require("./serviceAccountKey.json");



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projectcrm-f4e5f-default-rtdb..firebaseio.com",
});





const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || "8080";
const app = express();

app.engine("html", require("ejs").renderFile);
app.use(express.static("static"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/login", function (req, res) {
   const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      console.log("Logged in:", userData.email)
      
      res.render("productslist.html");
    })
    .catch((error) => {
      res.render("login.html");
    });
});


app.get("/signup", function (req, res) {
    const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      console.log("Logged in:", userData.email)
      
      res.redirect("/");
    })
    .catch((error) => {
      res.render("signup.html");
    });
});


app.get("/dashboard", function (req, res) {
   const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      console.log("Logged in:", userData.email)
      res.render("dashboard.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});



app.get("/profile", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      console.log("Logged in:", userData.email)
      res.render("profile.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

// app.get("/", function (req, res) {
//   res.render("index.html");
// });


app.get("/", function (req, res) {
   res.render("index.html");

});


app.get("/userprofile", function (req, res) {
     const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {

      console.log("Logged in:", userData.email)
      res.render("userprofile.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/listofproducts", function (req, res) {
     const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {

      console.log("Logged in:", userData.email)
      res.render("productslist.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/listofusers", function (req, res) {
     const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {

      console.log("Logged in:", userData.email)
      res.render("listofusers.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/registration", function (req, res) {
     const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {

      console.log("Logged in:", userData.email)
      res.render("registration.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});



app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  res.clearCookie("session");
//   firebase.auth().signOut()
//   .then(() => {
//   console.log("sign out success")
// }).catch((error) => {
//   // An error happened.
// });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
