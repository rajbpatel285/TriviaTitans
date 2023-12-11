import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import AdminSideBar from "../../components/common/AdminSideBar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

export default function EditTriviaQuestion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const theme = createTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const questionData = location.state.questionData;
  const [option1, option2, option3, option4] = questionData.options;

  const onSubmit = (data) => {
    const updatedQuestionData = {
      questionId: questionData.id,
      question: data.question,
      options: [data.option1, data.option2, data.option3, data.option4],
      correct_option: data.correct_option,
      difficulty: data.difficulty,
      category: data.category,
    };

    console.log(updatedQuestionData);

    axios
      .put(process.env.REACT_APP_UPDATE_QUESTION_URL, updatedQuestionData)
      .then((response) => {
        navigate("/triviaquestionmanagement");
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AdminSideBar sx={{ display: { xs: "none", sm: "block" } }} />
        <Container
          component="main"
          maxWidth="md"
          sx={{ flexGrow: 1, p: 3, mt: 2 }}
        >
          <Paper sx={{ mt: { xs: 6, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Add Question
            </Typography>
            <br />
            <hr />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <React.Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Select
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      fullWidth
                      label="Category"
                      name="category"
                      id="category"
                      {...register("category", {
                        required: "Category is Required",
                      })}
                      defaultValue={questionData.category}
                      error={Boolean(errors.category)}
                      helperText={errors.category?.message}
                    >
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Computer Science">
                        Computer Science
                      </MenuItem>
                      <MenuItem value="General Knowledge">
                        General Knowledge
                      </MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Question"
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      defaultValue={questionData.question}
                      name="question"
                      id="question"
                      {...register("question", {
                        required: "Question is Required",
                      })}
                      error={Boolean(errors.question)}
                      helperText={errors.question?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Option 1"
                      name="option1"
                      id="option1"
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      defaultValue={option1}
                      {...register("option1", {
                        required: "Option 1 is Required",
                      })}
                      error={Boolean(errors.option1)}
                      helperText={errors.option1?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Option 2"
                      name="option2"
                      id="option2"
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      defaultValue={option2}
                      {...register("option2", {
                        required: "Option 2 is Required",
                      })}
                      error={Boolean(errors.option2)}
                      helperText={errors.option2?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Option 3"
                      name="option3"
                      id="option3"
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      defaultValue={option3}
                      {...register("option3", {
                        required: "Option 3 is Required",
                      })}
                      error={Boolean(errors.option3)}
                      helperText={errors.option3?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Option 4"
                      name="option4"
                      id="option4"
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      defaultValue={option4}
                      {...register("option4", {
                        required: "Option 4 is Required",
                      })}
                      error={Boolean(errors.option4)}
                      helperText={errors.option4?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      fullWidth
                      label="Correct Option"
                      name="correct_option"
                      id="correct_option"
                      {...register("correct_option", {
                        required: "Correct Option is Required",
                      })}
                      defaultValue={questionData.correct_option}
                      error={Boolean(errors.correct_option)}
                      helperText={errors.correct_option?.message}
                    >
                      <MenuItem value={0}>Option 1</MenuItem>
                      <MenuItem value={1}>Option 2</MenuItem>
                      <MenuItem value={2}>Option 3</MenuItem>
                      <MenuItem value={3}>Option 4</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      inputProps={{
                        style: {
                          height: "50px",
                        },
                      }}
                      fullWidth
                      label="Difficulty"
                      name="difficulty"
                      id="difficulty"
                      {...register("difficulty", {
                        required: "Difficulty is Required",
                      })}
                      defaultValue={questionData.difficulty}
                      error={Boolean(errors.difficulty)}
                      helperText={errors.difficulty?.message}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                    >
                      <Button
                        type="submit"
                        color="primary"
                        size="large"
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Update
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </React.Fragment>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
