import React, { useState,useEffect,useContext} from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import "./menu.css";
import chickenBiriyaniImage from "../../static/food_images/biriyani.png";
import { GrRadialSelected } from "react-icons/gr";
import {SessionContext} from "../../components/SessionContext"
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

  async function fetchDishes() {
    const { data: dishes, error } = await supabase
      .from("menu")
      .select("*")
    if (error) {
      console.error(error);
    } else {
      setMenu(dishes);
      console.log(menu);
    }
  }
  useEffect(() => {
    fetchDishes();
  }
  , []);

  return (
    <>
      <div className="input-icon">
        <input
          type="text"
          placeholder="Search for Dishes"
          className="search-dish productsans-regular"
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

      <div className="dish-list">
        {menu.map((dish) => {
          if (
            selectedCategory === "All" ||
            selectedCategory.toLocaleLowerCase === dish.category
          ) {
            return (
              <Dish
                key={dish.id}
                name={dish.name}
                cost={dish.cost}
                image={chickenBiriyaniImage}
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
const Dish = ({name,cost,image}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [count, setCount] = useState(0);
  const handleAddClick = () => {
    setIsAdded(!isAdded);
    setCount(count+1)

  };

  return (
    <div className="dish-card">
      <div className="dish-left">
        <span>
          <GrRadialSelected
            color={isAdded ? "#27DB97" : "#F42C39"}
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
        alt="Chicken Biriyani"
      />
      {
        isAdded && count >= 1 ? (
          <div className="dish-counter">
            <span
              onClick={() => {
                setCount(count - 1);
                if (count === 1) {
                  setIsAdded(!isAdded);
                }
              }
              }
              className="dish-counter-btn productsans-regular left-0 border-r-2 border-black"
            >
              -
            </span>
            <span className="dish-counter-text  productsans-regular self-center px-2">{count}</span>
            <span
              onClick={() => setCount(count + 1)}
              className="dish-counter-btn productsans-regular right-0 border-l-2 border-black"
            >
              +
            </span>
          </div>
        ) : (
          <span
            onClick={handleAddClick}
            className="dish-add productsans-regular"
          >
            Add
          </span>
        )
      }
    </div>
  );
};

function Menu() {

  const {session} = useContext(SessionContext);
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
    </div>
  );
}

export default Menu;
