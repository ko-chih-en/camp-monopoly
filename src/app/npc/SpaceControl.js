import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { selectSpaceByNum } from "../../features/spaces/spaceSlice";
import {
  selectSessionName,
  selectSessionSpaces,
} from "../../features/session/sessionSlice";
import NoPermission from "../NoPermission";

import MoneyControl from "../control/MoneyControl";
import UpdateHighestScore from "../control/UpdateHighestScore";
import ChangeOwner from "../control/ChangeOwner";
import RobCard from "../control/RobCard";
import GiveGoMoney from "../control/GiveGoMoney";
import BuySpace from "../control/BuySpace";
import UpgradeSpace from "../control/UpgradeSpace";
import TaxSomeone from "../control/TaxSomeone";
import TriggerEvent from "../control/TriggerEvent";
import DestroySpace from "../control/DestroySpace";

// ========================================

const useStyles = makeStyles({
  section: {
    margin: 15,
  },
});

// ========================================

const WrappedTypography = ({ text }) => (
  <div style={{ marginTop: "20px" }}>
    <Typography variant="h5" component="h2" gutterBottom>
      {text}
    </Typography>
  </div>
);

const Information = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <b>{key}: </b>
          {value}
        </div>
      ))}
    </div>
  );
};

// ========================================

export default function SpaceControl() {
  const classes = useStyles();

  const userName = useSelector(selectSessionName);

  const spaceId = Number(useParams().spaceId);
  const spaces = useSelector(selectSessionSpaces);

  const space = useSelector((state) => selectSpaceByNum(state, spaceId));

  if (!space) {
    return <WrappedTypography text="No Such Space" />;
  }
  if (userName !== "admin" && !spaces.includes(spaceId)) {
    return <NoPermission />;
  }

  // ========================================

  let component, information;
  const {
    type,
    name,
    num,
    ownedBy,
    costs,
    taxes,
    level,
    suite,
    highestScore,
    multiple,
    shouldDouble,
  } = space;

  switch (type) {
    case "building":
      // TODO
      information = {
        ??????: "?????????",
        ??????: suite,
        ????????????: level,
        ?????????: ownedBy || "N/A",
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
      component = (
        <>
          <Information data={information} />
          <Divider />
          <BuySpace spaceNum={num} disabled={Boolean(ownedBy)} />
          <Divider />
          <UpgradeSpace spaceNum={num} disabled={!Boolean(ownedBy)} />
          <Divider />
          <TaxSomeone spaceNum={num} disabled={!Boolean(ownedBy)} />
          <Divider />
          {/*
          <ChangeOwner spaceNum={num} disabled={true} />
          <Divider />
          */}
          <RobCard spaceNum={num} disabled={!Boolean(ownedBy)} />
          <Divider />
          <DestroySpace spaceNum={num} disabled={!Boolean(ownedBy)} />
        </>
      );
      break;
    case "special-building":
      // TODO
      information = {
        ??????: "???????????????",
        ?????????: ownedBy || "N/A",
        ????????????: costs[0],
        ????????????: multiple * taxes[0],
        ????????????: multiple,
        ????????????: taxes[0],
        ????????????: "(????????????) x (????????????)",
      };
      component = (
        <>
          <Information data={information} />
          <Divider />
          <BuySpace spaceNum={num} disabled={Boolean(ownedBy)} />
          <Divider />
          <TaxSomeone spaceNum={num} disabled={!Boolean(ownedBy)} />
          <Divider />
          {/*
          <ChangeOwner spaceNum={num} disabled={true} />
          <Divider />
          */}
          <RobCard spaceNum={num} disabled={!Boolean(ownedBy)} />
          <Divider />
          <DestroySpace spaceNum={num} disabled={!Boolean(ownedBy)} />
        </>
      );
      break;
    case "game":
      information = {
        ??????: "?????????",
        ?????????: ownedBy || "N/A",
        ??????: costs[0],
        ???????????????: highestScore,
      };
      component = (
        <>
          <Information data={information} />
          <Divider />
          <UpdateHighestScore spaceNum={num} />
          <Divider />
          <ChangeOwner spaceNum={num} />
          <Divider />
          <MoneyControl />
        </>
      );
      break;
    case "Go":
      information = {
        ??????: "Go???",
        ????????????????????????: costs[level],
      };
      component = (
        <>
          <Information data={information} />
          <Divider />
          <GiveGoMoney />
        </>
      );
      break;
    case "chance":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>??????
          </div>
          <Divider />
          <MoneyControl />
        </>
      );
      break;
    case "fate":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>??????
          </div>
          <Divider />
          <MoneyControl />
          <Divider />
          <TriggerEvent />
        </>
      );
      break;
    case "see-prison":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>??????
          </div>
          <Divider />
          <GiveGoMoney />
        </>
      );
      break;
    case "go-prison":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>??????
          </div>
        </>
      );
      break;
    case "event":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>?????????
            <Divider />
            <TriggerEvent />
          </div>
        </>
      );
      break;
    case "store":
      component = (
        <>
          <div className={classes.section}>
            <b>??????: </b>??????
          </div>
          <Divider />
          <MoneyControl />
        </>
      );
      break;
    default:
      console.error(`Invalid space type: ${type}`);
      break;
  }

  // ========================================

  return (
    <div>
      <WrappedTypography text={name} />
      <Divider />
      {component}
    </div>
  );
}
