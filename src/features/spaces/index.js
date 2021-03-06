import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  makeStyles,
  withStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Rating from "@material-ui/lab/Rating";
import StarsIcon from "@material-ui/icons/Stars";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";

import { selectSpaceNums, selectSpaceByNum } from "./spaceSlice";

// ========================================

const theme = createMuiTheme({
  spacing: 4,
});

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    padding: 15,
    backgroundColor: "#e0e0e0",
  },
  container: {
    maxHeight: "calc(100%)",
    overflow: "scroll",
  },
  tablehead: {
    backgroundColor: "rgb(50, 50, 50)",
    "& > *": {
      color: "white",
    },
  },
  numcell: {
    color: "white",
    padding: "7px 0 7px 3px",
  },
  num: {
    backgroundColor: "#ab1010",
    color: "white",
  },
  dialogTitle: {
    padding: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    padding: theme.spacing(3),
    right: 0,
    top: 0,
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
});

const avatarColors = {
  Go: "#3d3d3d",
  chance: "#3d3d3d",
  fate: "#3d3d3d",
  "see-prison": "#3d3d3d",
  "go-prison": "#3d3d3d",
  event: "#3d3d3d",
  store: "#3d3d3d",
  game: "rgb(249, 179, 40)",
  building: {
    1: "rgb(225, 126, 34)",
    2: "rgb(104, 127, 73)",
    3: "rgb(0, 127, 141)",
    4: "rgb(0, 68, 89)",
    5: "rgb(98, 167, 196)",
    6: "rgb(192, 91, 0)",
  },
  "special-building": "rgb(150, 187, 117)",
};

const GameRating = withStyles({
  iconFilled: {
    color: "#5fd808",
  },
})(Rating);

// ========================================

const spaceDetail = (space) => {
  const {
    type,
    ownedBy,
    level,
    suite,
    shouldDouble,
    costs,
    taxes,
    multiple,
    highestScore,
  } = space;

  let levelComponent;
  let owner;
  let avatarColor = avatarColors[type];
  let rowColor = "#ccc";
  let dialogContent = {};
  let badgeContent = null;

  switch (type) {
    case "building":
      levelComponent = <Rating max={3} value={level} readOnly />;
      owner = ownedBy || "N/A";
      avatarColor = avatarColors["building"][suite];
      rowColor = "#fff";
      dialogContent = {
        ??????: "?????????",
        ??????: suite,
        ????????????: level,
        ?????????: owner,
        ????????????:
          level && (shouldDouble ? 2 * taxes[level - 1] : taxes[level - 1]),
        ????????????: String(shouldDouble),
        ????????????: costs[0],
        "1??????2?????????": costs[1],
        "2??????3?????????": costs[2],
        "1?????????": taxes[0],
        "2?????????": taxes[1],
        "3?????????": taxes[2],
      };
      if (shouldDouble) {
        badgeContent = "x2";
      }
      break;
    case "special-building":
      levelComponent = (
        <Rating
          size="large"
          max={1}
          value={ownedBy ? 1 : 0}
          icon={<StarsIcon fontSize="inherit" />}
          readOnly
        />
      );
      owner = ownedBy || "N/A";
      rowColor = "#fff";
      dialogContent = {
        ??????: "???????????????",
        ?????????: owner,
        ????????????: costs[0],
        ????????????: multiple * taxes[0],
        ????????????: multiple,
        ????????????: taxes[0],
        ????????????: "(????????????) x (????????????)",
      };
      badgeContent = String(multiple);
      break;
    case "game":
      levelComponent = (
        <GameRating
          size="large"
          max={1}
          value={ownedBy ? 1 : 0}
          icon={<SportsEsportsIcon fontSize="inherit" />}
          readOnly
        />
      );
      owner = ownedBy || "N/A";
      rowColor = "#fff";
      dialogContent = {
        ??????: "?????????",
        ?????????: owner,
        ??????: costs[0],
        ???????????????: highestScore,
      };
      break;
    case "Go":
      dialogContent = {
        ??????: "Go???",
        ????????????????????????: costs[level],
      };
      break;
    case "chance":
      dialogContent = {
        ??????: "??????",
      };
      break;
    case "fate":
      dialogContent = {
        ??????: "??????",
      };
      break;
    case "see-prison":
      dialogContent = {
        ??????: "??????",
      };
      break;
    case "go-prison":
      dialogContent = {
        ??????: "??????",
      };
      break;
    case "event":
      dialogContent = {
        ??????: "?????????",
      };
      break;
    case "store":
      dialogContent = {
        ??????: "??????",
      };
      break;
    default:
      console.error(`Invalid space type: ${type}`);
      break;
  }

  return {
    levelComponent,
    owner,
    avatarColor,
    rowColor,
    dialogContent,
    badgeContent,
  };
};

function Row({ num }) {
  const classes = useStyles();

  // Dialog control
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  // Space extra attributes
  const space = useSelector((state) => selectSpaceByNum(state, num));
  const { name } = space;
  const {
    levelComponent,
    owner,
    avatarColor,
    rowColor,
    dialogContent,
    badgeContent,
  } = spaceDetail(space);

  return (
    <>
      <TableRow style={{ backgroundColor: rowColor }} onClick={handleClickOpen}>
        <TableCell align="center" padding="none" className={classes.numcell}>
          <Badge badgeContent={badgeContent} color="error">
            <Avatar
              style={{ backgroundColor: avatarColor }}
              className={classes.num}
            >
              {num}
            </Avatar>
          </Badge>
        </TableCell>
        <TableCell align="center" padding="none">
          <b>{name}</b>
        </TableCell>
        <TableCell align="center" padding="none">
          {owner}
        </TableCell>
        <TableCell align="center" padding="none">
          {levelComponent}
        </TableCell>
      </TableRow>
      <Dialog
        aria-label="dialog"
        open={isOpen}
        fullWidth
        maxWidth="xs"
        onClose={handleClose}
      >
        <DialogTitle className={classes.dialogTitle}>
          <b>{name}</b>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          {Object.entries(dialogContent).map(([key, value]) => (
            <div key={key}>
              <b>{key}: </b>
              {value}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function SpacesList() {
  const classes = useStyles();
  const spaceNums = useSelector(selectSpaceNums);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table size="small" aria-label="table">
          <TableHead>
            <TableRow className={classes.tablehead}>
              <TableCell align="center" padding="none"></TableCell>
              <TableCell align="center" padding="none">
                Name
              </TableCell>
              <TableCell align="center" padding="none">
                Owner
              </TableCell>
              <TableCell align="center" padding="none">
                Level
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spaceNums.map((num) => (
              <Row key={num} num={num} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
