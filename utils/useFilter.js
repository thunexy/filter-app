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
  const initialPayload = data?.data?.allContentfulProductPage?.edges;
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(initialPayload);
  const _isMounted = useRef(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({min: null, max: null});

  const getCurentList = (list = payload) => {
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

  const _handleFilters = () => {
    let filteredData = [];
    const data = [...initialPayload];
    const filterColor = (arr) =>
      arr.filter((item) =>
        selectedColours.includes(item.node?.colorFamily?.[0]?.name)
      );
    const filterCategory = (arr) => {
      arr.forEach((item) => {
        for (let i = 0; i < selectedCategories.length; i++) {
          for (let j = 0; j < item?.node?.categoryTags?.length; j++) {
            if (item?.node?.categoryTags?.[j].includes(selectedCategories[i])) {
              filteredData.push(item);
            }
          }
        }
      });
    };
    const filterByColorAndCategory = (arr) => {
      filteredData = filterColor(arr);
      let tempData = [];
      filteredData.forEach((item) => {
        for (let i = 0; i < selectedCategories.length; i++) {
          for (let j = 0; j < item?.node?.categoryTags?.length; j++) {
            if (item?.node?.categoryTags?.[j].includes(selectedCategories[i])) {
              tempData.push(item);
            }
          }
        }
      });
      filteredData = tempData;
    };
    const filterByPrice = () => {
      return filteredData.filter((item) => {
        const itemPrice =
          +item?.node?.shopifyProductEu?.variants?.edges?.[0]?.node?.price;
        return priceRange.min && !priceRange.max
          ? itemPrice >= priceRange.min
          : !priceRange.min && priceRange.max
          ? itemPrice <= priceRange.max
          : itemPrice >= priceRange.min && itemPrice <= priceRange.max;
      });
    };
    if (selectedColours.length && !selectedCategories.length) {
      filteredData = filterColor(data);
    } else if (selectedCategories.length && !selectedColours.length) {
      filterCategory(data);
    } else if (selectedCategories.length && selectedColours.length) {
      filterByColorAndCategory(data);
    } else {
      filteredData = [...initialPayload];
    }
    if (priceRange.min || priceRange.max) {
      const data = filterByPrice(filteredData);
      filteredData = data;
    }
    setPayload(filteredData);
    return getCurentList(filteredData);
  };

  const handlePageSize = (_, size) => {
    _isMounted.current && setPageSize(size);
  };

  const displayFilters = () => {
    _isMounted.current && setShowFilters(true);
  };

  const hideFilters = () => {
    _isMounted.current && setShowFilters(false);
  };

  const toggleColourFilters = (colour) => {
    let arr = [];
    if (selectedColours.includes(colour)) {
      arr = [...selectedColours].filter((item) => item !== colour);
    } else {
      arr = [...selectedColours, colour];
    }
    _isMounted.current && setSelectedColours(arr);
  };

  const toggleCategoryFilters = (category) => {
    let arr = [];
    if (selectedCategories.includes(category)) {
      arr = [...selectedCategories].filter((item) => item !== category);
    } else {
      arr = [...selectedCategories, category];
    }
    _isMounted.current && setSelectedCategories(arr);
  };

  const filterByPrice = () => {
    _handleFilters();
  };

  const handlePriceFilters = (min, max) => {
    _isMounted.current &&
      setPriceRange((price) => ({
        min: min ?? price.min,
        max: max ?? price.max,
      }));
  };

  useEffect(() => {
    _handleFilters();
  }, [selectedCategories, selectedColours]);

  useEffect(() => {
    getCurentList();
  }, [pageNo, pageSize]);

  useEffect(() => {
    _isMounted.current = true;
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
    filterByPrice,
    loading,
  };
}
