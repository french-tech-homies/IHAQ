import React from 'react';
import Container from '@material-ui/core/Container';

import ProTip from './ProTip';
import Copyright from './Copyright'
import TopBar from './TopBar'
import QuestionBar from './QuestionBar'
import Questions from './Questions'

export default function App() {
  return (
    <Container>
        <TopBar />
        <Questions />
        <QuestionBar />
        <ProTip />
        <Copyright />
    </Container>
  );
}