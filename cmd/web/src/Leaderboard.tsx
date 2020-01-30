import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { getAuthors, getAuthorsWithScore } from './store/authors';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

export const Leaderboard: FC = () => {
  const authorsWithScore = useSelector(getAuthorsWithScore);
  return (
    <TableContainer>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authorsWithScore.map(({ author, score }, index) => (
            <TableRow hover key={author.id}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{author.id}</TableCell>
              <TableCell>{score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
