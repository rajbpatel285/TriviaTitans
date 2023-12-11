import React, { useState, useEffect } from 'react';
import { FormControlLabel, Checkbox, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AdminSideBar from '../../components/common/AdminSideBar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditTriviaGame() {
    const { state: { gameData } } = useLocation();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate();

    const theme = createTheme();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [difficulties, setDifficulties] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStartTime, setSelectedStartTime] = useState(null);

    useEffect(() => {
        setSelectedQuestions(Object.keys(gameData['selected_questions'][0]));
        setSelectedStartTime(getFormattedCurrentDateTime());
    }, [gameData]);

    useEffect(() => {
        const fetchQuestions = async () => {

            axios.get(process.env.REACT_APP_QUESTIONS_URL)
                .then(response => {
                    setQuestions(response.data);
                    setIsLoading(false);
                    const uniqueCategories = [...new Set(response.data.map((question) => question.category))];
                    setCategories(uniqueCategories);
                    setCategory(gameData.category);
                    const uniqueDifficulties = [...new Set(response.data.map((question) => question.difficulty))];
                    const sortedDifficulties = uniqueDifficulties.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
                    setDifficulties(sortedDifficulties);
                    setDifficulty(gameData.difficulty);
                })
                .catch(error => {
                    console.error('Error fetching questions:', error);
                });
        };

        fetchQuestions();
    }, [gameData.category, gameData.difficulty]);

    useEffect(() => {
        const formattedSelectedQuestions = selectedQuestions.reduce((acc, questionId) => {
            const question = questions.find((q) => q.id === questionId);
            acc[questionId] = question;
            return acc;
        }, {});

        const filteredQuestions = questions.filter((question) => {
            return (
                (category === '' || question.category === category) &&
                (difficulty === '' || question.difficulty === difficulty)
            );
        });

        setAvailableQuestions(filteredQuestions);
    }, [selectedQuestions, questions, category, difficulty]);

    const handleQuestionToggle = (questionId) => {
        const questionIndex = selectedQuestions.indexOf(questionId);

        if (questionIndex > -1) {
            setSelectedQuestions((prevSelected) => prevSelected.filter((id) => id !== questionId));
            setAvailableQuestions((prevAvailable) => [...prevAvailable, questionId]);
        } else {
            setSelectedQuestions((prevSelected) => [...prevSelected, questionId]);
            setAvailableQuestions((prevAvailable) => prevAvailable.filter((id) => id !== questionId));
        }

        if (selectedQuestions.length >= 4 && selectedQuestions.length <= 14) {
            setErrorMessage('');
        }
    };

    const handleStartTimeChange = (event) => {
        setSelectedStartTime(event.target.value);
    };

    const getFormattedCurrentDateTime = () => {
        const currentDate = new Date(gameData.date);
        return currentDate.toISOString().slice(0, 16);
    };

    const onSubmit = (data) => {

        if (selectedQuestions.length < 5 || selectedQuestions.length > 15) {
            setErrorMessage('Select a minimum of 5 Questions and a maximum of 15 Questions');
            return;
        }

        setErrorMessage('');

        const formattedSelectedQuestions = selectedQuestions.reduce((acc, questionId) => {
            const question = questions.find((q) => q.id === questionId);
            const { id, ...formattedQuestion } = question;
            acc[questionId] = formattedQuestion;
            return acc;
        }, {});

        const updatedGameData = {
            "gameId": gameData.id,
            "title": data.title,
            "description": data.description,
            "category": category,
            "difficulty": difficulty,
            "selected questions": [formattedSelectedQuestions],
            "date": selectedStartTime
        }

        axios.put(process.env.REACT_APP_UPDATE_GAME_URL, updatedGameData)
            .then(response => {
                console.log('Game updated successfully:', response.data);
                navigate('/triviagamemanagement');
            })
            .catch(error => {
                console.error('Error updating game:', error);
            });

    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AdminSideBar sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, p: 3, mt: 2 }}>
                    <Paper sx={{ mt: { xs: 6, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            Edit Game
                        </Typography>
                        <br />
                        <hr />
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                                <React.Fragment>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Title"
                                                inputProps={{
                                                    style: {
                                                        height: "30px",
                                                    },
                                                }}
                                                name="title"
                                                id="title"
                                                defaultValue={gameData.title}
                                                {...register("title", {
                                                    required: "Title is Required",
                                                })}
                                                error={Boolean(errors.title)}
                                                helperText={errors.title?.message}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField // Add the description field
                                                fullWidth
                                                label="Description"
                                                inputProps={{
                                                    style: {
                                                        height: "30px",
                                                    },
                                                }}
                                                name="description"
                                                id="description"
                                                defaultValue={gameData.description}
                                                {...register("description", {
                                                    required: "Description is Required",
                                                })}
                                                error={Boolean(errors.description)}
                                                helperText={errors.description?.message}
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
                                                id="category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                disabled={true}
                                            >
                                                {categories.map((cat) => (
                                                    <MenuItem key={cat} value={cat}>
                                                        {cat}
                                                    </MenuItem>
                                                ))}
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
                                                labelId="difficulty"
                                                id="difficulty"
                                                value={difficulty}
                                                onChange={(e) => setDifficulty(e.target.value)}
                                                disabled={true}
                                            >
                                                {difficulties.map((diff) => (
                                                    <MenuItem key={diff} value={diff}>
                                                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <label htmlFor="datetime">Select Date and Time:</label>
                                            <input
                                                type="datetime-local"
                                                id="datetime"
                                                name="datetime"
                                                value={selectedStartTime}
                                                onChange={handleStartTimeChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography component="h1" variant="h6" align="left">
                                                Selected Questions:
                                            </Typography>
                                            {selectedQuestions.map((questionId) => {
                                                const question = questions.find((q) => q.id === questionId);
                                                return (
                                                    <>
                                                        <FormControlLabel
                                                            key={question.id}
                                                            control={<Checkbox checked />}
                                                            label={question.question}
                                                        />
                                                        <hr />
                                                    </>

                                                );
                                            })}
                                        </Grid>
                                        {errorMessage && (
                                            <Grid item xs={12}>
                                                <Box sx={{ mt: 2, p: 2, backgroundColor: '#ffebee', color: 'red' }}>
                                                    <Typography>{errorMessage}</Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <Typography component="h1" variant="h6" align="left">
                                                Available Questions:
                                            </Typography>
                                            {availableQuestions.map((question) => (
                                                <>
                                                    <FormControlLabel
                                                        key={question.id}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedQuestions.includes(question.id)}
                                                                onChange={() => handleQuestionToggle(question.id)}
                                                            />
                                                        }
                                                        label={question.question}
                                                    />
                                                    <hr />
                                                </>
                                            ))}
                                        </Grid>

                                    </Grid>
                                    <br />
                                    <Grid item xs={12}>
                                        <Button variant="contained" type="submit">
                                            Update Game
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
