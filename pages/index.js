import {Col, Image, Row} from "antd";
import style from "../styles/Index.module.css";
import {useFilter} from "../utils/useFilter";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import Title from "antd/lib/typography/Title";
export default function Index() {
  const {items, loading, ...others} = useFilter();
  return (
    <div>
      <Row justify="center">
        <Col xs={22} md={21} lg={18}>
          <div
            style={{textAlign: "end", cursor: "pointer"}}
            onClick={others.displayFilters}
          >
            <Title level={3} className={style.filter_text}>
              Filters
            </Title>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={22} md={21} lg={18}>
          <Row
            gutter={[
              {xs: 0, sm: 16, md: 48, lg: 64},
              {xs: 20, sm: 16, md: 48, lg: 64},
            ]}
          >
            {loading ? (
              <div
                style={{
                  padding: "80px 0 80px 0",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Title level={4}>Loading...</Title>
              </div>
            ) : items.length ? (
              items?.map((item, i) => {
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={`${i}`}>
                    <Image src={`${item.imageUrl}`} width={"100%"} />
                    <Row>
                      <Col xs={18} className={style.item_name}>
                        {item?.name}
                      </Col>
                      <Col xs={6} className={style.item_price}>
                        {item?.price}
                      </Col>
                    </Row>
                  </Col>
                );
              })
            ) : (
              <div
                style={{
                  padding: "80px 0 80px 0",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Title level={4}>Your search does not match any item</Title>
              </div>
            )}
          </Row>
          <div className={style.pagination_container}>
            <Pagination {...others} />
          </div>
        </Col>
      </Row>

      <Filter items={items} {...others} />
    </div>
  );
}
