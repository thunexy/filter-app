import {Col, Image, Row} from "antd";
import {Pagination as AntDPagination} from "antd";
import {func, number} from "prop-types";
export default function Pagination({pageSize, setPageNo, total, handlePageSize}) {
  return (
    <Row justify="center" align="middle">
      <Col span={24} style={{textAlign: "center"}}>
        <AntDPagination
          total={total}
          pageSize={pageSize}
          onChange={setPageNo}
          onShowSizeChange={handlePageSize}
        />
      </Col>
    </Row>
  );
}

Pagination.propTypes = {
  setPageNo: func.isRequired,
  total: number.isRequired,
  pageSize: number.isRequired,
  handlePageSize: func.isRequired,
};
