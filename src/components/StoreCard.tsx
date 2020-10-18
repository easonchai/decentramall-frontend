import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '300px',
      margin: '2rem 2rem'
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
      textAlign: 'center'
    },
    cover: {
      minWidth: '256px',
      minHeight: '144px',
      maxWidth: '1280px',
      maxHeight: '720px',
    },
    storeName: {
      fontSize: '1.6rem',
      fontWeight: 'bold'
    },
    category: {
      fontSize: '1.2rem',
    }
  }),
);

export default function StoreCard() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cover}
        image="https://source.unsplash.com/random/600x600"
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h3" className={classes.storeName}>
            Adidas
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" className={classes.category}>
            Clothing
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}