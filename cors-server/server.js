const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var customerId;
var getAccountActivationUrl = (thePath) =>
  thePath.substring(thePath.lastIndexOf("/") + 1);

// routes

app.post("/signin", (req, res) => {
  var data = JSON.stringify({
    query: `mutation customerAccessTokenCreate(
          $input: CustomerAccessTokenCreateInput!
        ) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              message
            }
          }
        }`,
    variables: {
      input: { email: req.body.email, password: req.body.password },
    },
  });

  var config = {
    method: "post",
    url: "https://jashan-dev-3.myshopify.com/api/2022-04/graphql.json",
    headers: {
      "X-Shopify-Storefront-Access-Token": "d179890dc5a100e660bd74bd255488b6",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      if (
        response.data.data.customerAccessTokenCreate.customerUserErrors.length
      ) {
        res.send("username and password is not valid");
      } else {
        res.send(
          response.data.data.customerAccessTokenCreate.customerAccessToken
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

//app.post("/sign-up", (req, res) => {
//  let password = req.body[1];
//  if (req.body) {
//    var config = {
//      method: "post",
//      url: "https://jashan-dev-3.myshopify.com/admin/api/2022-04/customers.json",
//      headers: {
//        "X-Shopify-Access-Token": "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",
//        "Content-Type": "application/json",
//      },
//      data: req.body[0],
//    };
//    //-----------------------------------------------------------------------------------------------

//    axios(config)
//      .then((response) => {
//        customerId = response.data.customer.id;
//        //console.log(response.data.customer.id);
//        var config1 = {
//          method: "post",
//          url: `https://jashan-dev-3.myshopify.com/admin/api/2022-04/customers/${customerId}/account_activation_url.json`,
//          headers: {
//            "X-Shopify-Access-Token": "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",
//            "Content-Type": "application/json",
//          },
//        };
//        //-----------------------------------------------------------------------------------------------

//        axios(config1).then((response) => {
//          console.log(response.data.account_activation_url);
//          const account_activation_urlToken = getAccountActivationUrl(
//            response.data.account_activation_url
//          );
//          //console.log(account_activation_urlToken);

//          //-----------------------------------------------------------------------------------------------
//          let formBody = new FormData();
//          formBody.append("form_type", "activate_customer_password");
//          formBody.append("utf8", "✓");
//          formBody.append("customer[password]", password);
//          formBody.append("customer[password_confirmation]", password);
//          formBody.append("token", account_activation_urlToken);
//          formBody.append("id", customerId);
//          var config = {
//            method: "post",
//            url: `https://jashan-dev-3.myshopify.com/admin/api/2022-04/customers/${customerId}/activate_account.json`,
//            data: formBody,
//          };
//          axios(config)
//            .then((response) => {
//              //console.log(response.data);
//              res.send("Successfully Signed-Up");
//            })
//            .catch((error) => {
//              //console.log(error);
//            });
//        });
//      })
//      .catch((error) => {
//        res.status(400).send({
//          message: error.response.data.errors,
//        });
//        //console.log(error.response.data.errors);
//      });
//  }
//});
//app.post("/activateUrl", (req, res) => {
//  console.log(customerId);
//  var config = {
//    method: "post",
//    url: `https://jashan-dev-3.myshopify.com/admin/api/2022-04/customers/${customerId}/account_activation_url.json`,
//    headers: {
//      "X-Shopify-Access-Token": "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",
//      "Content-Type": "application/json",
//    },
//  };
//  axios(config)
//    .then((response) => {
//      console.log(response);
//      //accountActivateUrl = response
//    })
//    .catch((error) => {
//      //res.status(400).send({
//      //  message: error,
//      //});
//      //console.log(error.response.data.errors);
//    });
//  //res.redirect("/account-activate");
//});
//app.post("/account-activate", (req, res) => {
//  let formBody = FormData();
//  formBody.append(form_type, "activate_customer_password");
//  formBody.append(utf8, '✓');
//  formBody.append(customer[password], password);
//  formBody.append(customer[password_confirmation], password);
//  formBody.append(token, token);
//  formBody.append(id, customerId);
//  if (req.body) {
//    var config = {
//      method: "post",
//      url: `https://jashan-dev-3.myshopify.com/account/activate`,
//      headers: {
//        "X-Shopify-Access-Token": "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",
//        "Content-Type": "application/json",
//      },
//      data: formBody,
//    };
//    axios(config)
//      .then((response) => {
//        console.log(response.data);
//        //res.send("Successfully Signed-Up");
//        res.redirect("/account-activate");
//      })
//      .catch((error) => {
//        res.status(400).send({
//          message: error.response.data.errors,
//        });
//        //console.log(error.response.data.errors);
//      });
//  }
//});

//app.post("/sign-in", (req, res) => {
//  console.log(req.body);
//  if (req.body) {
//    var config = {
//      method: "get",
//      url: `https://jashan-dev-3.myshopify.com/account/login`,
//      headers: {
//        "X-Shopify-Access-Token": "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",
//      },
//      data: req.body,
//    };
//    axios(config)
//      .then((response) => {
//        console.log(response.data);
//        res.send("Successfully Signed-Up");
//      })
//      .catch((error) => {
//        res.status(400).send({
//          message: error.response.data.errors,
//        });
//        console.log(error.response.data.errors);
//      });
//  }
//});
//app.post("/create-customer1", async (req, res) => {
//  console.log("start");
//  var config = {
//    method: "post",
//    url: "https://jashan-dev-3.myshopify.com/admin/api/2022-04/customers.json",
//    headers: {
//      "X-Shopify-Access-Token": "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",
//      "Content-Type": "application/json",
//    },
//    data: customer,
//  };
//  axios(config)
//    .then(function (response) {
//      console.log(JSON.stringify(response.data));
//      console.log("data");
//    })
//    .catch(function (error) {
//      console.log(error.response);
//      console.log("error");
//    });
//});

// listening

app.listen(4000, (err) => {
  if (err) console.log(err);
  console.log(`server is running at 8080`);
});