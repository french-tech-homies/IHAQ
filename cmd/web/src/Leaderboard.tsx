import React, { FC, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getAuthorsWithScore } from './store/authors';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  withStyles,
  Theme,
  createStyles,
  Paper,
  makeStyles,
  Avatar,
  Badge
} from '@material-ui/core';
import MedalIcon from 'mdi-react/MedalIcon';
import { deepOrange, deepPurple, lightGreen, yellow } from '@material-ui/core/colors';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
)(TableCell);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 500
    },
    rankCell: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    green: {
      color: theme.palette.getContrastText('#000000'),
      backgroundColor: '#000000'
    }
  })
);

export const Leaderboard: FC = () => {
  const classes = useStyles();
  const authorsWithScore = useSelector(getAuthorsWithScore);
  const sortedAuthorsWithScore = useMemo(
    () =>
      authorsWithScore.sort((a, b) => {
        return b.score - a.score;
      }),
    [authorsWithScore]
  );

  function getMedalColor(index: number) {
    switch (index) {
      case 1: {
        return '#ffdf00';
      }
      case 2: {
        return '#aaa9ad';
      }
      case 3: {
        return '#cd7f32';
      }
      default:
        break;
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Rank</StyledTableCell>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAuthorsWithScore.map(({ author, score }, index) => (
            <TableRow hover key={author.id}>
              <TableCell component="th" className={classes.rankCell}>
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent={index <= 2 ? <MedalIcon color={getMedalColor(index + 1)} /> : null}
                >
                  <Avatar className={classes.green}>{index + 1}</Avatar>
                </Badge>
              </TableCell>
              <TableCell>
                <Typography>{author.id}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="secondary">
                  <strong>{score}</strong>
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
