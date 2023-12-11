import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AdminSideBar from '../components/common/AdminSideBar';

export default function AdminAnalytics() {

    const theme = createTheme();
    const embeddedUrlForGamePlayAnalytics =
        'https://lookerstudio.google.com/embed/reporting/b7bae578-7842-4280-bea0-bd85a6185f4a/page/p_dr5wv14i8c';

    const embeddedUrlForQuestionAndGameAnalytics =
        'https://lookerstudio.google.com/embed/reporting/1da5d900-3481-45e6-9d77-17a959bc6186/page/tEnnC';

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AdminSideBar />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, p: 3, mt: 2, mb: 4 }}>
                            <Paper sx={{ mt: { xs: 6, md: 6 }, p: { xs: 2, md: 3 } }}>
                                <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
                                    Gameplay Analytics
                                </Typography>
                                <iframe
                                    src={embeddedUrlForGamePlayAnalytics}
                                    title="Admin Analytics"
                                    style={{ width: '100%', height: '500px', border: 'none' }}
                                />
                            </Paper>
                        </Container>
                    </Grid>
                    <Grid item xs={12}>
                        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, p: 3, mb: 4 }}>
                            <Paper sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography component="h1" variant="h4" align="center" sx={{ mb: 2 }}>
                                    Question and Game Analytics
                                </Typography>
                                <iframe
                                    src={embeddedUrlForQuestionAndGameAnalytics}
                                    title="Admin Analytics"
                                    style={{ width: '100%', height: '500px', border: 'none' }}
                                />
                            </Paper>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
