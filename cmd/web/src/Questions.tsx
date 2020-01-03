import React, { useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './store/store';
import { fetchMessages, getMessagesWithUser } from './store/messages';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    }
  })
);

export default function AlignItemsList() {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(getMessagesWithUser);
  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  return (
    <List className={classes.root}>
      {messages && messages.length > 0
        ? messages.map(item => (
            <ListItem alignItems="flex-start" key={item.message.id}>
              <ListItemAvatar>
                <Avatar alt={item.author.name} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={item.message.text}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" className={classes.inline} color="textPrimary"></Typography>
                    {' — by ' + item.author.name}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))
        : null}
    </List>
  );
}
