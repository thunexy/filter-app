import {useEffect, useRef, useState} from "react";
import data from "../utils/data.json";

const colours = [
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Natural",
  "Orange",
  "Purple",
  "Red",
  "White",
  "Yellow",
];
const categories = [
  "Ankle Boots",
  "Bags",
  "Boots",
  "Court Shoes",
  "Flats",
  "Mid-Heels",
  "Mules",
  "New Arrivals",
  "Outlet",
  "Sandals",
  "Tall Boots",
];
export function useFilter() {
  const _isMounted = useRef(null);
  const initialPayload = data?.data?.allContentfulProductPage?.edges;
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(initialPayload);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({min: null, max: null});

  const getCurentList = (list = payload) => {
    //handle current page list based on pageNo and pageSize
    setLoading(true);
    _isMounted.current &&
      setItems(() => {
        setLoading(false);
        return list
          .slice((pageNo - 1) * pageSize, pageNo * pageSize)
          .map((item) => ({
            name: item?.node?.name,
            price:
              item?.node?.shopifyProductEu?.variants?.edges?.[0]?.node?.price,
            imageUrl: `https:${item?.node?.thumbnailImage?.file?.url}`,
          }));
      });
  };

  const filterByColor = (data) => {
    return data.filter((item) =>
      selectedColours.includes(item.node?.colorFamily?.[0]?.name)
    );
  };
  const filterByCategory = (arr) => {
    let data = [];
    arr.forEach((item) => {
      selectedCategories.forEach((selectedCategory) => {
        item?.node?.categoryTags?.forEach((categories, i) => {
          if (categories.includes(selectedCategory)) {
            data.push(item);
          }
        });
      });
    });
    return data;
  };

  const filterByPrice = (arr) => {
    return arr.filter((item) => {
      const itemPrice =
        +item?.node?.shopifyProductEu?.variants?.edges?.[0]?.node?.price;
      return priceRange.min && !priceRange.max
        ? itemPrice >= priceRange.min
        : !priceRange.min && priceRange.max
        ? itemPrice <= priceRange.max
        : itemPrice >= priceRange.min && itemPrice <= priceRange.max;
    });
  };

  const _handleFilters = () => {
    let filteredData = [];
    const rawData = [...initialPayload];
    if (selectedColours.length && !selectedCategories.length) {
      filteredData = filterByColor(rawData);
    } else if (selectedCategories.length && !selectedColours.length) {
      filteredData = filterByCategory(rawData);
    } else if (selectedCategories.length && selectedColours.length) {
      filteredData = filterByCategory(filterByColor(rawData));
    } else {
      filteredData = [...initialPayload];
    }
    if (priceRange.min || priceRange.max) {
      filteredData = filterByPrice(filteredData);
    }
    _isMounted.current && setPayload(filteredData);
    return getCurentList(filteredData);
  };

  const handlePageSize = (_, size) => {
    //set custom page size
    _isMounted.current && setPageSize(size);
  };

  const displayFilters = () => {
    //show filters
    _isMounted.current && setShowFilters(true);
  };

  const hideFilters = () => {
    //hide filters
    _isMounted.current && setShowFilters(false);
  };

  const toggleColourFilters = (colour) => {
    let arr = [];
    //check if colour is not selected
    //if so, add. Else remove on re-click
    if (selectedColours.includes(colour)) {
      arr = [...selectedColours].filter((item) => item !== colour);
    } else {
      arr = [...selectedColours, colour];
    }
    _isMounted.current && setSelectedColours(arr);
  };

  const toggleCategoryFilters = (category) => {
    let arr = [];
    //check if category is not selected. If so add
    //Else remove
    if (selectedCategories.includes(category)) {
      arr = [...selectedCategories].filter((item) => item !== category);
    } else {
      arr = [...selectedCategories, category];
    }
    _isMounted.current && setSelectedCategories(arr);
  };

  const filterPrice = _handleFilters;

  const handlePriceFilters = (min, max) => {
    //save price range
    _isMounted.current &&
      setPriceRange((price) => ({
        min: min ?? price.min,
        max: max ?? price.max,
      }));
  };

  useEffect(() => {
    //filter when price and /or category changes
    _handleFilters();
  }, [selectedCategories, selectedColours]);

  useEffect(() => {
    //get current list when pageNo or page size changes
    getCurentList();
  }, [pageNo, pageSize]);

  useEffect(() => {
    _isMounted.current = true;
    //get list on page load
    getCurentList();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  return {
    items,
    handlePageSize,
    pageSize,
    total: payload.length,
    setPageNo,
    showFilters,
    hideFilters,
    displayFilters,
    colours,
    selectedColours,
    categories,
    selectedCategories,
    toggleColourFilters,
    toggleCategoryFilters,
    handlePriceFilters,
    priceRange,
    filterPrice,
    loading,
  };
}
