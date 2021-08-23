import React from "react";
import renderer from "react-test-renderer";
import Filter from "../components/Filter";
import {useFilter} from "../utils/useFilter";

describe("Test Filter component", () => {
  test("Filter drawer is shown", () => {
    const data = useFilter();
    const component = renderer.create(<Filter showFilters={true} {...data} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Filter drawer is hidden", () => {
    const data = useFilter();
    const component = renderer.create(
      <Filter
        showFilters={false}
        {...data}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
