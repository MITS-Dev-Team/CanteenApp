import React from "react";
import supabase from "../../supabase";
import { CiSearch } from "react-icons/ci";
import "./menu.css";
import chickenBiriyaniImage from "../../static/food_images/biriyani.png";

const ProfilePhoto = () => {
  return (
    <>
      <img
        src="https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Athul Prakash"
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
        <Dish />
        <Dish />
        <Dish />
        <Dish />
        <Dish />
        <Dish />
        <Dish />
        <Dish />
        <Dish />
      </div>
    </>
  );
};

const Dish = ({}) => {
  return (
    <div className="dish-card">
      <div className="dish-left">
        <span className="productsans-regular dish-name">Chicken Biriyani</span>
        <span className="dish-price">₹100</span>
      </div>

      <div className="dish-right">
        <img className="dish-image" src={chickenBiriyaniImage} />
        <span className="dish-add">Add</span>
      </div>
    </div>
  );
};

function Menu() {
  return (
    <div className="menu-screen">
      <ProfilePhoto />
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
