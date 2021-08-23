import {Drawer} from "antd";
import Title from "antd/lib/typography/Title";
import {array, bool, func, object} from "prop-types";
import style from "../styles/Filter.module.css";
export default function Filter({
  hideFilters,
  showFilters,
  colours,
  selectedColours,
  categories,
  selectedCategories,
  toggleColourFilters,
  toggleCategoryFilters,
  handlePriceFilters,
  filterByPrice,
  priceRange,
}) {
  return (
    <Drawer
      title="Filters"
      placement="right"
      closable={false}
      onClose={hideFilters}
      visible={showFilters}
      getContainer={false}
      style={{position: "absolute"}}
      width={300}
    >
      <div>
        <div className={style.filter_wrapper}>
          <Title level={2}>Colours</Title>
          <div className={style.color_filter_container}>
            {colours.map((colour, i) => {
              return (
                <div
                  key={i}
                  className={`${style.color_btn} ${
                    selectedColours.includes(colour) && style.selected
                  }`}
                  onClick={() => toggleColourFilters(colour)}
                >
                  <span
                    style={{backgroundColor: colour}}
                    className={style.color_indicator}
                  ></span>
                  {colour}
                </div>
              );
            })}
          </div>
        </div>
        <div className={style.filter_wrapper}>
          <Title level={2}>Category</Title>
          <div className={style.color_filter_container}>
            {categories.map((category, i) => {
              return (
                <div
                  key={i}
                  className={`${style.category_btn} ${
                    selectedCategories.includes(category) && style.selected
                  }`}
                  onClick={() => toggleCategoryFilters(category)}
                >
                  {category}
                </div>
              );
            })}
          </div>
        </div>
        <div className={style.filter_wrapper}>
          <Title level={2}>Price Range</Title>
          <div className={style.price_filter_container}>
            <input
              placeholder="Min Price"
              type="number"
              min={1}
              className={style.min_input}
              value={priceRange.min}
              onChange={(e) => handlePriceFilters(e.target.value)}
            />{" "}
            to{" "}
            <input
              placeholder="Max Price"
              min={1}
              className={style.max_input}
              value={priceRange.max}
              onChange={(e) => handlePriceFilters(null, e.target.value)}
            />
            <input
              type="button"
              value="Set"
              className={style.button}
              onClick={filterByPrice}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

Filter.propTypes = {
  hideFilters: func.isRequired,
  showFilters: bool.isRequired,
  colours: array.isRequired,
  selectedColours: array.isRequired,
  categories: array.isRequired,
  selectedCategories: array.isRequired,
  toggleCategoryFilters: func.isRequired,
  toggleColourFilters: func.isRequired,
  handlePriceFilters: func.isRequired,
  filterByPrice: func.isRequired,
  print: object.isRequired,
};
