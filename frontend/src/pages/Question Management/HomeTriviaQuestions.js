import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSideBar from "../../components/common/AdminSideBar";
import { InputAdornment } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CustomPagination from "../../components/common/CustomPagination";
import AddIcon from "@mui/icons-material/Add";

export default function HomeTriviaQuestion() {
  const theme = createTheme();
  const navigate = useNavigate();

  const [trviaQuestions, setTrviaQuestions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  useEffect(() => {
    getQuestions();
  }, []);

  const style = {
    paperStyle: {
      boxShadow:
        "0px 1px 1px -2px #d6d2d2, 0px 1px 1px 0px #d6d2d2, 0px 1px 1px 1px #d6d2d2",
    },
    addButton: {
      backgroundColor: "black",
      color: "white",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "background-color 0.2s ease-in-out",
      "&:focus, &:active": {
        outline: "none",
      },
    },
    editButton: {
      backgroundColor: "white",
      color: "black",
      cursor: "pointer",
      border: "1px solid black",
      borderRadius: "4px",
      transition: "background-color 0.2s ease-in-out",
      "&:focus, &:active": {
        outline: "none",
      },
    },
    deleteButton: {
      backgroundColor: "black",
      color: "white",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "background-color 0.2s ease-in-out",
      "&:focus, &:active": {
        outline: "none",
      },
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    },
    pageNumberButton: {
      padding: "8px 16px",
      border: "1px solid black",
      color: "black",
      textDecoration: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
      margin: "0 2px",
      borderRadius: "4px",
    },
    activePageNumberButton: {
      padding: "8px 16px",
      border: "1px solid black",
      backgroundColor: "black",
      color: "white",
      textDecoration: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
      margin: "0 2px",
      borderRadius: "4px",
    },
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const filteredQuestionRecord = trviaQuestions.filter((record) => {
    const categoryFilter =
      selectedCategory === "" ||
      record.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const difficultyFilter =
      selectedDifficulty === "" ||
      record.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const searchFilter =
      searchInput.length === 0 ||
      record.question.toLowerCase().includes(searchInput.toLowerCase()) ||
      record.category.toLowerCase().includes(searchInput.toLowerCase());

    return categoryFilter && difficultyFilter && searchFilter;
  });

  const handleUpdateClick = (element) => {
    const question = element.record;
    navigate("/triviaquestionmanagement/edittriviaquestion", {
      state: { questionData: question },
    });
  };

  const handleDeleteClick = (element) => {
    const question = element.record;
    const questionId = question.id;

    axios
      .delete(
        process.env.REACT_APP_DELETE_QUESTION_URL,
        {
          data: { questionId: questionId },
        }
      )
      .then(() => {
        setTrviaQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId)
        );
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const getQuestions = () => {
    axios
      .get(
        process.env.REACT_APP_QUESTIONS_URL
      )
      .then((response) => {
        setTrviaQuestions(response.data);

        const uniqueCategories = Array.from(
          new Set(response.data.map((q) => q.category))
        );
        setCategories(uniqueCategories);

        const uniqueDifficulties = Array.from(
          new Set(response.data.map((q) => q.difficulty))
        );
        setDifficulties(uniqueDifficulties);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const itemsPerPage = 10;

  const handlePageChange = ({ selected }) => {
    setCurrentPageNumber(selected);
  };

  const split = currentPageNumber * itemsPerPage;
  const paginatedQuestions = filteredQuestionRecord.slice(
    split,
    split + itemsPerPage
  );

  useEffect(() => { }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AdminSideBar />
        <Container
          component="main"
          maxWidth="lg"
          sx={{ flexGrow: 1, p: 3, mt: 2, mb: 4 }}
        >
          <Paper sx={{ mt: { xs: 6, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Grid container spacing={3}>
              <Grid container spacing={3} sx={{ margin: "auto" }}>
                <Grid item xs={12}>
                  <Typography component="h1" variant="h4" align="center">
                    Trivia Questions
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ margin: "auto" }}>
                <Grid item xs={12} sm={12} lg={5}>
                  <TextField
                    type="text"
                    placeholder="Sports"
                    autoFocus
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                    }}
                    onChange={handleSearchChange}
                    value={searchInput}
                    label="Search Category or Name"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} lg={3}>
                  <TextField
                    select
                    label="Category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category.toLowerCase()}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={5} lg={3}>
                  <TextField
                    select
                    label="Difficulty"
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {difficulties.map((difficulty) => (
                      <MenuItem
                        key={difficulty}
                        value={difficulty.toLowerCase()}
                      >
                        {difficulty}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2} lg={1}>
                  <Button
                    onClick={() => {
                      navigate("/triviaquestionmanagement/addtriviaquestion");
                    }}
                    size="large"
                    variant="outlined"
                    sx={{
                      height: {
                        xs: "100%",
                        sm: "100%",
                        md: "100%",
                        lg: "100%",
                      },
                      width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                    }}
                    style={style.addButton}
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <br />
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <React.Fragment>
                  <Stack container spacing={2}>
                    {paginatedQuestions.map(function (record, index) {
                      return (
                        <Stack
                          item
                          xs={12}
                          sm={12}
                          sx={{ borderRadius: "10px" }}
                        >
                          <Paper style={style.paperStyle}>
                            <Grid container spacing={3} key={index}>
                              <Grid item xs={12} sm={5}>
                                <Item>{record.question}</Item>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Item>{record.category}</Item>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Item>{record.difficulty}</Item>
                              </Grid>
                              <Grid item xs={12} sm={3} sx={{ margin: "auto" }}>
                                <Box textAlign="center">
                                  <Button
                                    onClick={() =>
                                      handleUpdateClick({ record })
                                    }
                                    style={style.editButton}
                                    size="medium"
                                    sx={{ mt: 1, mb: 1, mr: 1, ml: 1 }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleDeleteClick({ record })
                                    }
                                    style={style.deleteButton}
                                    size="medium"
                                    sx={{ mt: 1, mb: 1, mr: 1, ml: 1 }}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Stack>
                      );
                    })}
                  </Stack>
                </React.Fragment>
                <Grid container spacing={3} sx={{ margin: "auto" }}>
                  <Grid item xs={12}>
                    <CustomPagination
                      pageCount={Math.ceil(
                        filteredQuestionRecord.length / itemsPerPage
                      )}
                      onPageChange={handlePageChange}
                      currentPageNumber={currentPageNumber}
                      style={style}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
