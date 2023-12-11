import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  Container,
} from "@mui/material";
import axios from "axios";

const StyledTableContainer = styled(TableContainer)({
  width: "80%",
  maxWidth: 800,
  margin: "0 auto",
  marginTop: (theme) => theme.spacing(2),
});

const StyledTableCellHeader = styled(TableCell)({
  fontWeight: "bold",
});

const Notifications = () => {
  const [data, setData] = useState([]);
  const storedData = localStorage.getItem("sdp18_data");
  const dataObject = JSON.parse(storedData);
  const email = dataObject.email;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const body = {
        email: email,
      };
      const response = await axios.post(
        "https://xx9310hqif.execute-api.us-east-1.amazonaws.com/prod/get-notifications",
        body
      );

      const notifications = JSON.parse(response.data.body);
      notifications.sort((a, b) => {
        const dateA = new Date(a.current_date + " " + a.time);
        const dateB = new Date(b.current_date + " " + b.time);
        return dateA - dateB;
      });
      setData(notifications);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Notifications</h1>
      <Container
        maxWidth="md"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2%",
        }}
      ></Container>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Time</StyledTableCellHeader>
              <StyledTableCellHeader>Subject</StyledTableCellHeader>
              <StyledTableCellHeader>Message</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id} className="incomeRow" component="Income">
                <TableCell>{item.current_date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  );
};

export default Notifications;
