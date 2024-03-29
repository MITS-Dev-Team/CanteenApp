import React, { useState,useEffect,useContext} from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";
import "./menu.css";
import chickenBiriyaniImage from "../../static/food_images/biriyani.png";
import { GrRadialSelected } from "react-icons/gr";
import {SessionContext} from "../../components/SessionContext"
import { addToCart,removeFromCart,getItems } from "../../redux/cartSlice";
import { useDispatch,useSelector} from 'react-redux';


async function fetchDishes(setMenu,setSearchMenu) {
  const { data: dishes, error } = await supabase
    .from("menu")
    .select("*")
  if (error) {
    console.error(error);
  } else {
    setMenu(dishes);
    setSearchMenu(dishes);
    console.log(dishes);
  }
}


const ProfilePhoto = (avatarUrl) => {
  return (
    <>
      <img
        src={avatarUrl.avatarUrl}
        alt="profile"
        className="profile-pic"
      />
    </>
  );
};

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

  useEffect(() => {
    fetchDishes(setMenu,setSearchMenu);
  }
  , [selectedCategory]);

  function setSearchValue(search) {
    setSearch(search);
    if(search.lenght < 1)
    {
      setSearchMenu(menu);
      return;
    }
    const filteredMenu = menu.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
    setSearchMenu(filteredMenu);

  }
  return (
    <>
      <div className="input-icon">
        <input
          type="text"
          placeholder="Search for Dishes"
          className="search-dish productsans-regular"
          value={search}
          onChange={(e) => setSearchValue(e.target.value)}

        />
        <CiSearch className="search-icon" color="white" size={30} />
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

      <div className="dish-list min-h-fit h-[50vh]">
        {searchMenu.map((dish) => {
          if (
            selectedCategory === "All" ||
            selectedCategory.toLowerCase() === dish.category
          ) {
            return (
              <Dish
                id={dish.id}
                name={dish.name}
                cost={dish.cost}
                image={dish.image}
                type={dish.food_type}
              />
            );
          }
          return null;
        }

        )}

      </div>
    </>
  );
};
const Dish = ({id,name,cost,image,type}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const getCartItems = useSelector(getItems).payload.cart.items;

  useEffect(() => {
    console.log(getCartItems[name]);
  }, [getCartItems]);

  const handleAddClick = () => {
    setCount(count + 1);
    setIsAdded(true);
    dispatch(addToCart({ name, cost, image, type }));
  };

  const handleIncrement = () => {
    setIsAdded(true);
    setCount(count + 1);
    dispatch(addToCart({id,name, cost, image, type,count:count }));

  };

  const handleDecrement = () => {
    setCount(count - 1);
    if (count === 1) {
      setIsAdded(false);
    }
    dispatch(removeFromCart({id,name, cost, image, type}));
  };

  return (
    <div className="dish-card">
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
        <span className="dish-price">₹{cost}</span>
      </div>
      <img
        className="dish-image"
        src={image}
        alt={name}
      />
      {
        isAdded && count >= 1 ? (
          <div className="absolute right-12 w-1/4 h-1/4  -bottom-3 flex justify-center items-center text-center rounded-md">
              <span
                  onClick={handleDecrement}
                  className="productsans-regular w-1/3 h-full bg-[#2B2B2B] rounded-l-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
              >
                  -
              </span>
              <span className="productsans-regular px-2 w-1/3 text-black bg-slate-50 h-full flex items-center justify-center transition duration-500 ease-in-out">{count}</span>
              <span
                  onClick={handleIncrement}
                  className="productsans-regular h-full text-white w-1/3 bg-[#2B2B2B] min-h-full rounded-r-md flex items-center justify-center transition duration-500 ease-in-out cursor-pointer"
              >
                  +
              </span>
          </div>
        ) : (
          <div
            onClick={handleIncrement}
            className="absolute  right-12 w-1/4 h-1/4 bg-slate-50 -bottom-3 flex justify-center items-center text-center rounded-md text-black font-bold transition duration-500 ease-in-out cursor-pointer"
          >
            ADD
          </div>
        )
      }
    </div>
  );
};

function Menu() {

  const {session} = useContext(SessionContext);
  console.log(session);
  const avatarUrl = session?.user.user_metadata.avatar_url;

  return (
    <div className="menu-screen">
      <ProfilePhoto avatarUrl={avatarUrl}/>
      <div className="menu-screen-title">
        <span style={{ color: "#ffff" }} className="grifter-regular">
          CANTEEN HUB
        </span>
        <br />
        <span
          style={{ color: "#AEADAD", fontWeight: 100 }}
          className="poppins-regular"
        >
          Dining Redefined
        </span>
      </div>
      <SearchDish />
      <div 
        className="cart-icon bg-black
                    absolute bottom-5 right-10 rounded-full flex justify-center items-center cursor-pointer
                    w-20 h-20 shadow-2xl
                    ">
        <MdShoppingCart color="white" size={40} />
        
      </div>
    </div>
  );
}

export default Menu;
