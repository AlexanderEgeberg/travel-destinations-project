import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { DateTime } from "luxon";
import { useNavigate } from "react-router";
import type { TravelDestination } from "../api";

const formatTime = (sql: string) =>
  DateTime.fromSQL(sql).toFormat("dd/MM/yyyy");

const TravelCard = (props: TravelDestination) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      style={{ width: 320 }}
      cover={<img draggable={false} alt="example" src={props.imgSrc} />}
      actions={[
        <EditOutlined
          key="edit"
          onClick={() => navigate("/travel/" + props.id)}
        />,
        <DeleteOutlined key="delete" />,
      ]}
    >
      <Card.Meta
        title={
          <>
            {props.title} - {props.location}, {props.country}
          </>
        }
        description={
          <>
            <p>{props.description}</p>
            <p>
              {formatTime(props.dateFrom)} - {formatTime(props.dateTo)}
            </p>
          </>
        }
      />
    </Card>
  );
};

export default TravelCard;
