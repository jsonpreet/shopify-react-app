import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShopContext = React.createContext();

const ShopProvider = ({ children }) => {
  const [productsList, setProductsList] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [editAddressData, setEditAddressData] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const navigate = useNavigate();
  //const [checkoutId, setCheckoutId] = useState("");
  //const [checkout, setCheckout] = useState("");
  const [cart, setCart] = useState(false);
  const [cartId, setCartId] = useState(false);
  const [isUserProfile, setIsUserProfile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isProductById, setIsProductById] = useState(false);
  const [accessToken, setAccessToken] = useState(false);
  const domain = process.env.REACT_APP_DEPLOY_DOMAIN;
  useEffect(() => {
    if (localStorage.ATG_AccessToken) {
      const today = new Date(Date.now());
      const myDate = new Date(
        JSON.parse(localStorage.ATG_AccessToken).expiresAt
      );
      const result = myDate.getTime();
      if (result - today > 120000) {
        tokenRenew(JSON.parse(localStorage.ATG_AccessToken));
      } else {
        localStorage.removeItem("ATG_AccessToken");
        localStorage.removeItem("ATG_CartId");
      }
    }
    if (localStorage.ATG_CartId) {
      fetchCart();
    } else {
      createCart();
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
        //navigate(`/${response.data.accessToken}/homepage`);
        localStorage.setItem("ATG_AccessToken", JSON.stringify(response.data));
        fetchUserCartId();
        //createUserCart();
      })
      .catch((error) => {
        //console.log(error.response.data.message);
        alert(error);
      });
  };
  const signUp = async (userVariables) => {
    userVariables = { ...userVariables, cartId: cartId };
    var config = {
      method: "post",
      url: `${domain}:4000/signup`,
      data: userVariables,
    };
    await axios(config)
      .then((response) => {
        setAccessToken(response.data);
        localStorage.setItem("ATG_AccessToken", JSON.stringify(response.data));
        localStorage.setItem("ATG_CartId", JSON.stringify(cartId));
        fetchUserCartId();
        //createUserCart();
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
      })
      .catch((error) => {
        navigate(`/`);
        localStorage.removeItem("ATG_AccessToken");
        localStorage.removeItem("ATG_CartId");
        //console.log(error.response.data.message);
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
        setCart(false);
        setCartId(false);
        navigate("/");
        localStorage.removeItem("ATG_AccessToken");
        localStorage.removeItem("ATG_CartId");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  const userProfile = async () => {
    var config = {
      method: "post",
      url: `${domain}:4000/profile`,
      data: JSON.parse(localStorage.getItem("ATG_AccessToken")),
    };
    await axios(config)
      .then((response) => {
        setIsUserProfile(response.data);
      })
      .catch((error) => {
        navigate(`/`);
        //console.log(error.response.data.message);
      });
  };
  const updateProfile = async (data) => {
    var config = {
      method: "post",
      url: `${domain}:4000/update-profile`,
      data,
    };
    await axios(config)
      .then((response) => {
        setEditShow(false);
        console.log(response.data);
        setIsUserProfile(response.data);
      })
      .catch((error) => {
        alert(error.response.data[0].message);
      });
  };
  const createAddress = async (data) => {
    data = { ...data, accessToken: accessToken.accessToken };
    var config = {
      method: "post",
      url: `${domain}:4000/add-address`,
      data,
    };
    await axios(config)
      .then((response) => {
        userProfile();
        setShowAddress(false);
      })
      .catch((error) => {
        alert(error.response.data[0].message);
      });
  };
  const editAddress = async (data) => {
    data = { ...data, accessToken: accessToken.accessToken };
    var config = {
      method: "post",
      url: `${domain}:4000/edit-address`,
      data,
    };
    await axios(config)
      .then((response) => {
        userProfile();
        setEditAddressData(false);
      })
      .catch((error) => {
        alert(error.response.data[0].message);
      });
  };
  const deleteAddress = async (id) => {
    setIsLoading(true);
    var config = {
      method: "post",
      url: `${domain}:4000/delete-address`,
      data: { addressId: id, accessToken: accessToken.accessToken },
    };
    await axios(config)
      .then((response) => {
        userProfile();
        setIsLoading(false);
      })
      .catch((error) => {
        alert(error.response.data[0].message);
      });
  };
  //-----------------------------Proctucts fetch Functions-----------------------
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
    setIsLoading(true);
    var config = {
      method: "post",
      url: `${domain}:4000/product`,
      data: { id },
    };
    axios(config).then((response) => {
      setIsProductById(response.data);
      setIsLoading(false);
    });
  };
  //----------------------------------------Cart functions-------------------
  const createCart = async () => {
    var config = {
      method: "post",
      url: `${domain}:4000/createcart`,
    };
    await axios(config)
      .then((response) => {
        setCartId(response.data.id);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const fetchUserCartId = async () => {
    var config = {
      method: "post",
      url: `${domain}:4000/fetchUserCartId`,
      data: {
        accessToken: JSON.parse(localStorage.getItem("ATG_AccessToken")),
      },
    };
    await axios(config)
      .then((response) => {
        localStorage.setItem("ATG_CartId", JSON.stringify(response.data.value));
        setCartId(response.data.value);
        fetchCart();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const fetchCart = async () => {
    var config = {
      method: "post",
      url: `${domain}:4000/fetchcart`,
      data: { id: JSON.parse(localStorage.getItem("ATG_CartId")) },
    };
    await axios(config)
      .then((response) => {
        setCartId(response.data.id);
        setCart(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const addItemToCart = async (variantId, quantity) => {
    setIsAdding(variantId);
    setIsLoading(true);
    const data = {
      cartId,
      variantId,
      quantity: parseInt(quantity, 10),
    };
    var config = {
      method: "post",
      url: `${domain}:4000/addtocart`,
      data: data,
    };
    await axios(config)
      .then((response) => {
        setCart(response.data);
        setIsLoading(false);
        setIsAdding(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const removeItemFromCart = async (merchandiseId) => {
    setIsLoading(true);
    const data = {
      cartId,
      merchandiseId,
    };
    var config = {
      method: "post",
      url: `${domain}:4000/removefromcart`,
      data: data,
    };
    await axios(config)
      .then((response) => {
        setCart(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const updateItemToCart = async (id, quantity) => {
    setIsLoading(true);
    const data = {
      cartId,
      id,
      quantity,
    };
    var config = {
      method: "post",
      url: `${domain}:4000/updatecart`,
      data: data,
    };
    await axios(config)
      .then((response) => {
        setCart(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  //const addItemToCheckout = async (variantId, quantity) => {
  //  setIsAdding(variantId);
  //  setIsLoading(true);
  //  //await client.checkout
  //  //  .addLineItems(localStorage.checkoutId, lineItemsToAdd)
  //  //  .then((checkOut) => {
  //  //    setCheckout(checkOut);
  //  //    setIsLoading(false);
  //  //    setIsAdding(false);
  //  //  });
  //  const data = {
  //    checkoutId,
  //    variantId,
  //    quantity: parseInt(quantity, 10),
  //  };
  //  var config = {
  //    method: "post",
  //    url: `${domain}:4000/additemtocheckout`,
  //    data: data,
  //  };
  //  await axios(config)
  //    .then((response) => {
  //      //setCheckoutId(response.data.id);
  //      setCheckout(response.data);
  //      setIsLoading(false);
  //      setIsAdding(false);
  //      //localStorage.setItem("checkoutId", response.data);
  //    })
  //    .catch((error) => {
  //      console.log(error.response);
  //      //alert(error);
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
        cart,
        isLoading,
        isAdding,
        isProductById,
        accessToken,
        isUserProfile,
        editShow,
        editAddressData,
        showAddress,
        setShowAddress,
        createAddress,
        editAddress,
        deleteAddress,
        updateProfile,
        setEditAddressData,
        setEditShow,
        userProfile,
        fetchById,
        cartOpen,
        fetchAll,
        addItemToCart,
        removeItemFromCart,
        updateItemToCart,
        //addItemToCheckout,
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
