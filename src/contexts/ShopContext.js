import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import Client from "shopify-buy";

const ShopContext = React.createContext();
//const client = Client.buildClient({
//  domain: "allthatgrows-in.myshopify.com",
//  storefrontAccessToken: "0c13740ce701b2616bf9f719bb2ec23e",
//});

const ShopProvider = ({ children }) => {
  let navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [checkoutId, setCheckoutId] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  //const [isAdding, setIsAdding] = useState(false);
  const [isProductById, setIsProductById] = useState(false);
  const [accessToken, setAccessToken] = useState(false);
  const domain = process.env.REACT_APP_DEPLOY_DOMAIN;
  useEffect(() => {
    if (localStorage.ATG_AccessToken) {
      //console.log(localStorage.ATG_AccessToken);
      //console.log(accessToken);
      tokenRenew(JSON.parse(localStorage.ATG_AccessToken));
      //navigate(`/homepage`);
      //fetchCheckout(localStorage.checkoutId);
    } else {
      createCheckout();
      console.log("access token not exist");
    }
  }, []);
  const cartOpen = (val) => {
    setIsCartOpen(val);
  };
  //const createCheckout = async () => {
  //  const checkOut = await client.checkout.create();
  //  localStorage.setItem("checkoutId", checkOut.id);
  //  await setCheckout(checkOut);
  //};
  const createCheckout = async () => {
    //const checkOut = await client.checkout.create();
    //localStorage.setItem("checkoutId", checkOut.id);
    //await setCheckout(checkOut);
    var config = {
      method: "post",
      url: `${domain}:4000/checkout`,
    };
    await axios(config)
      .then((response) => {
        setCheckoutId(response.data);
        console.log(response.data);
        localStorage.setItem("checkoutId", response.data);
      })
      .catch((error) => {
        console.log(error.response);
        //alert(error);
      });
  };

  //const fetchCheckout = async (checkoutId) => {
  //  await client.checkout.fetch(checkoutId).then((checkOut) => {
  //    setCheckout(checkOut);
  //  });
  //};

  //-----------------------------User Control Functions starts-----------------------

  const signIn = async (userVariables) => {
    var config = {
      method: "post",
      url: `${domain}:4000/signin`,
      data: userVariables,
    };
    await axios(config)
      .then((response) => {
        setAccessToken(response.data);
        //console.log(response.data);
        navigate(`/homepage`);
        //navigate(`/${response.data.accessToken}/homepage`);
        localStorage.setItem("ATG_AccessToken", JSON.stringify(response.data));
      })
      .catch((error) => {
        //console.log(error.response.data.message);
        alert(error);
      });
  };
  const signUp = async (userVariables) => {
    var config = {
      method: "post",
      url: `${domain}:4000/signup`,
      data: userVariables,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setAccessToken(response.data);
        navigate(`/homepage`);
        localStorage.setItem("ATG_AccessToken", JSON.stringify(response.data));
        //navigate(`/${response.data.accessToken}/homepage`);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  const tokenRenew = async (token) => {
    var config = {
      method: "post",
      url: `${domain}:4000/tokenrenew`,
      data: token,
    };
    await axios(config)
      .then((response) => {
        setAccessToken(response.data);
        localStorage.setItem("ATG_AccessToken", JSON.stringify(response.data));
        navigate("/homepage");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  const signOut = async () => {
    var config = {
      method: "post",
      url: `${domain}:4000/signout`,
      data: accessToken,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        setAccessToken(false);
        navigate("/");
        localStorage.removeItem("ATG_AccessToken");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //-----------------------------User Control Functions ends-----------------------
  //---------------------------------------------------------------------------------------------------------
  //-----------------------------Data Functions (CRUD operations) starts-----------------------

  const fetchAll = () => {
    var config = {
      method: "get",
      url: `${domain}:4000/products`,
    };
    axios(config).then((response) => {
      setProductsList(response.data);
    });
  };
  const fetchById = (id) => {
    var config = {
      method: "post",
      url: `${domain}:4000/product`,
      data: { id },
    };
    axios(config).then((response) => {
      setIsProductById(response.data);
    });
  };

  //-----------------------------Data Functions (CRUD operations) ends-----------------------
  //-----------------------------------completed functions---------------------------
  //const fetchAll = async () => {
  //  await client.product.fetchAll().then((products) => {
  //    setProductsList(products);
  //  });
  //};
  //const fetchById = async (id) => {
  //  await client.product.fetch(id).then((product) => {
  //    setIsProductById(product);
  //  });
  //};
  //----------------------------------------not completed functions-------------------
  const addItemToCheckout = async (variantId, quantity) => {
    //setIsAdding(variantId);
    //setIsLoading(true);
    //const lineItemsToAdd = [
    //  {
    //    variantId,
    //    quantity: parseInt(quantity, 10),
    //  },
    //];
    //await client.checkout
    //  .addLineItems(localStorage.checkoutId, lineItemsToAdd)
    //  .then((checkOut) => {
    //    setCheckout(checkOut);
    //    setIsLoading(false);
    //    setIsAdding(false);
    //  });
    const data = {
      checkoutId,
      variantId,
      quantity,
    };
    var config = {
      method: "post",
      url: `${domain}:4000/additemtocheckout`,
      data: data,
    };
    console.log(data);
    await axios(config)
      .then((response) => {
        //setCheckoutId(response.data.id);
        console.log(response.data);
        //localStorage.setItem("checkoutId", response.data);
      })
      .catch((error) => {
        console.log(error.response);
        //alert(error);
      });
  };
  //const addItemToCheckout = async (variantId, quantity) => {
  //  setIsAdding(variantId);
  //  setIsLoading(true);
  //  const lineItemsToAdd = [
  //    {
  //      variantId,
  //      quantity: parseInt(quantity, 10),
  //    },
  //  ];
  //  await client.checkout
  //    .addLineItems(localStorage.checkoutId, lineItemsToAdd)
  //    .then((checkOut) => {
  //      setCheckout(checkOut);
  //      setIsLoading(false);
  //      setIsAdding(false);
  //    });
  //};
  //const updateItemToCheckout = async (id, quantity) => {
  //  const lineItemsToUpdate = [
  //    {
  //      id: id,
  //      quantity: parseInt(quantity, 10),
  //    },
  //  ];
  //  await client.checkout
  //    .updateLineItems(localStorage.checkoutId, lineItemsToUpdate)
  //    .then((checkOut) => {
  //      setCheckout(checkOut);
  //    });
  //};
  //const removeItemToCheckout = async (id) => {
  //  setIsLoading(true);
  //  const lineItemIdsToRemove = [id];
  //  await client.checkout
  //    .removeLineItems(localStorage.checkoutId, lineItemIdsToRemove)
  //    .then((checkOut) => {
  //      setCheckout(checkOut);
  //      setIsLoading(false);
  //    });
  //};

  return (
    <ShopContext.Provider
      value={{
        isCartOpen,
        productsList,
        //checkout,
        //isLoading,
        //isAdding,
        isProductById,
        accessToken,
        fetchById,
        cartOpen,
        fetchAll,
        addItemToCheckout,
        //removeItemToCheckout,
        //updateItemToCheckout,
        signIn,
        signUp,
        setAccessToken,
        signOut,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

const ShopConsumer = ShopContext.Consumer;
export { ShopConsumer, ShopContext };

export default ShopProvider;