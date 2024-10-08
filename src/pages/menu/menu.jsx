import React, { useContext, useEffect, useState, useRef    } from "react";
import { CiSearch } from "react-icons/ci";
import { GrRadialSelected } from "react-icons/gr";
import { MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderWaits from "../../components/OrderWaits";
import ProfilePhoto from "../../components/ProfilePhoto";
import { SessionContext } from "../../components/SessionContext";
import { addToCart, getItems, removeFromCart } from "../../redux/cartSlice";
import EggLoading from "../../static/eggloading";
import incrementSound from "../../static/increment.wav";
import PopSound from "../../static/pop.mp3";
import supabase from "../../supabase";
import "./menu.css";

const incrementSoundEffect = new Audio(incrementSound);
const PopSoundEffect = new Audio(PopSound);

async function fetchDishes() {
  const { data: dishes, error } = await supabase
    .from("menu")
    .select("*")
    .order("stock", { ascending: false });
  if (error) {
    console.error(error);
    return false;
  } else {
    
    console.log(dishes);
    return dishes;
  }
}

async function checkPendingOrders(user_id) {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid")
    .eq("served", false)
    .eq("user_id", user_id);
  if (error) {
    console.error(error);
    return false;
  } else {
    console.log("pending food", orders);
    return orders.length > 0;
  }
}

const Category = ({ category, selectedCategory, setSelectedCategory }) => {
  return (
    <span
      onClick={() => setSelectedCategory(category)}
      className={`${
        selectedCategory === category ? "category-selected" : ""
      } productsans-regular food-category`}
    >
      {category}
    </span>
  );
};

const SearchDish = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [searchMenu, setSearchMenu] = useState(menu);
  const [loading, setLoading] = useState(true);
  const [doneonce, setDoneOnce] = useState(false);
  const timeIdRef = useRef(null);

  useEffect(() => {
    fetchDishes().then((dishes) => {
      setMenu(dishes);
      setSearchMenu(dishes);
      setDoneOnce(true);
      setLoading(false);
    });

    const startPolling = async () => {
      timeIdRef.current = setInterval(async () => {
        console.log("polling");
        await fetchDishes().then((dishes) => {
          //check if the menu has changed
          if (JSON.stringify(menu) !== JSON.stringify(dishes)) {
            console.log("menu changed");

            //show a toast and set loading
            setLoading(true);
            setMenu(dishes);
            setSearchMenu(dishes);
            setLoading(false);
          }

        });
      }, 10000);
    }

    startPolling();
 
  }, []);


  function setSearchValue(search) {
    setSearch(search);
    if (search.lenght < 1) {
      setSearchMenu(menu);
      return;
    }
    const filteredMenu = menu.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    setSearchMenu(filteredMenu);
  }

  const resultScreen = (
    <div>
      <div className="input-icon">
        <input
          type="text"
          placeholder="Search for Dishes"
          className="search-dish productsans-regular"
          value={search}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <CiSearch className="search-icon" color="white" size={25} />
      </div>

      <div className="menu-categories">
        {["All", "Food", "Curry", "Drinks"].map((category) => (
          <Category
            key={category}
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>

      <div className="dish-list min-h-fit   ">
        {searchMenu.map((dish) => {
          if (
            selectedCategory === "All" ||
            selectedCategory.toLowerCase() === dish.category
          ) {
            console.log(dish);
            return (
              <Dish
                id={dish.id}
                name={dish.name}
                cost={dish.cost}
                image={dish.image}
                type={dish.food_type}
                stock={dish.stock}
                limit={dish.order_limit}
                stock_limit={dish.stock_limit}
              />
            );
          }
          return null;
        })}
        <span
          style={{
            color: "rgba(255, 255, 255, 0.3)",
            fontWeight: 100,
            paddingTop: "0px",
            paddingLeft: "15px",
          }}
          className="poppins-regular text-left"
        >
          Thats all for now ...
        </span>
      </div>
    </div>
  );

  return (
    <div className="search-dish-screen">
      {loading ? <EggLoading /> : resultScreen}
    </div>
  );
};
const Dish = ({ id, name, cost, image, type, stock, limit, stock_limit }) => {
  const getCartItems = useSelector(getItems).payload.cart.items;
  const initCount = getCartItems[name]?.count;
  console.log("count of ", name, initCount);
  const [isAdded, setIsAdded] = useState(true);
  const [count, setCount] = useState(initCount);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("loaded :", name, getCartItems[name]);
  }, []);

  const handleIncrement = () => {
    setIsAdded(true);
    //set 20% limit on stock

    if (initCount >= limit || count >= limit || initCount >= stock) {
      return;
    }
    setCount(count + 1);
    dispatch(
      addToCart({
        id,
        name,
        cost,
        image,
        type,
        count: count,
        stock: stock,
        order_limit: limit,
      })
    );
    incrementSoundEffect.play();
  };

  const handleDecrement = () => {
    setCount(count - 1);
    if (count === 1) {
      setIsAdded(false);
    }
    dispatch(removeFromCart({ id, name, cost, image, type }));
    if (count <= 1) {
      PopSoundEffect.play();
    } else {
      incrementSoundEffect.play();
    }
  };

  return (
    <div
      className={`dish-card ${
        stock <= stock_limit ? " grayscale-[100%]" : "grayscale-0"
      }`}
    >
      <div className="dish-left">
        <span>
          <GrRadialSelected
            color={type ? "#27DB97" : "#F42C39"}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "10px",
            }}
          />
          <span
            className="productsans-regular dish-name"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            {name}
          </span>
        </span>
        <span className="productsans-regular dish-price ">₹{cost}</span>
        {stock >= stock_limit && (
          <div className="flex flex-col mt-2">
            <span className="productsans-regular text-sm text-white/[.8]">
              Stock: {stock}
            </span>
            <span className="productsans-regular text-sm text-white/[.5]">
              Orders limited to {limit}
            </span>
          </div>
        )}
      </div>
      <img className="dish-image" src={image} alt={name} />
      {stock > stock_limit ? (
        isAdded && initCount >= 1 ? (
          <div className="absolute right-3 min-w-[30%]  h-1/4 -bottom-3 flex justify-center items-center text-center rounded-md text-xl drop-shadow-xl">
            <span
              onClick={handleDecrement}
              className="productsans-regular w-1/3 h-full bg-slate-600 rounded-l-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
            >
              -
            </span>
            <span className="productsans-regular px-2 w-1/3 text-black bg-slate-100 h-full flex items-center justify-center transition duration-500 ease-in-out">
              {initCount}
            </span>
            <span
              onClick={handleIncrement}
              className="productsans-regular h-full text-white w-1/3 bg-slate-600 min-h-full rounded-r-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
            >
              +
            </span>
          </div>
        ) : (
          <div
            onClick={handleIncrement}
            className="shadow-2xl absolute  right-3 min-w-[30%]  h-1/4 bg-slate-200 -bottom-3 flex justify-center items-center text-center rounded-md text-black font-bold transition duration-500 ease-in-out cursor-pointer"
          >
            ADD
          </div>
        )
      ) : (
        <div className="absolute text-sm  right-3 min-w-[30%]  h-1/3 bg-red-500 -bottom-3 shadow-lx flex justify-center items-center text-center rounded-md text-black font-bold transition duration-500 ease-in-out">
          SOLD OUT
        </div>
      )}
    </div>
  );
};

function Menu() {
  const { session } = useContext(SessionContext);
  const [checkPending, setCheckPending] = useState(false);
  const user_id = session.user.id;
  console.log(session);
  const avatarInfo = session?.user.user_metadata;
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = Object.values(cartItems).reduce(
    (total, item) => total + item.count,
    0
  );
  const navigate = useNavigate();
  const handleCartClick = () => {
    navigate("/cart");
  };

  useEffect(() => {
    checkPendingOrders(user_id).then((res) => {
      setCheckPending(res);
    });
  }, []);

  return (
    <div className="menu-screen max-w-full">
      <div className="scroll-container h-[98vh] overflow-y-scroll overflow-x-hidden ">
        <div className="menu-screen-title mt-28">
          <span style={{ color: "#ffff" }} className="grifter-regular">
            MITS Canteen
          </span>
          <br />
          <span
            style={{ color: "#AEADAD", fontWeight: 100 }}
            className="poppins-regular"
          >
            Dining Redefined
          </span>
        </div>
        <ProfilePhoto avatarInfo={avatarInfo} />
        {checkPending && <OrderWaits />}
        <SearchDish />

        <div className=" fixed bottom-1 left-0 h-24 w-full flex flex-col justify-center items-center z-50">
          <div
            className={`cart-icon bg-[#1CA672] 
                      fixed bottom-[0vh] rounded-xl flex justify-center 
                      items-center cursor-pointer w-[90%] h-12 mb-5 shadow-2xl gap-2
                      transform transition-transform duration-500
                      ${itemCount > 0 ? "translate-y-0" : "translate-y-20"}
                      `}
            onClick={handleCartClick}
            style={{
              maxWidth: "400px",
              boxShadow: "0 4px 50px rgba(0, 0, 0, 0.8)",
            }}
          >
            <span className="productsans-regular text-l text-white">
              {itemCount} items in cart
            </span>
            <MdShoppingCart color="rgba(255, 255, 255, 0.95)" size={23} />
          </div>
        </div>

        {/*<div      ///OLD CART BUTTON DESIGN///
        className="cart-icon bg-[#1CA672]
                    fixed bottom-[1vh] -right-6 rounded-xl flex justify-center items-center cursor-pointer
                    w-1/3 h-14 shadow-2xl m-10 gap-3"
        onClick={handleCartClick}
        >  

        <MdShoppingCart color="white" size={25} />
        {itemCount > 0 && (
            <span 
              className="cart-button poppins-semibold font-black text-sm text-white
                        absolute -top-2 -right-1.5 bg-inherit rounded-full w-7 h-7 
                        flex justify-center items-center
                        border-white border-[2px]">
              {itemCount}
            </span>
          )}
        <span className="poppins-semibold font-black text-l text-white">CART</span>

        </div>*/}
      </div>
    </div>
  );
}

export default Menu;
