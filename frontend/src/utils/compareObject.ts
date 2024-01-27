interface Props {
  intialObj: any;
  changedObj: any;
}

interface obj {
  [key: string]: any;
}

export const compareChangedDiffObjectValues = ({
  intialObj,
  changedObj,
}: Props) => {
  let isDifferent = false;
  const temp: obj = {};
  for (let key in intialObj) {
    const value1 = intialObj[key];
    const value2 = changedObj[key];
    if (value1 && value2) {
      if (value1 !== value2) {
        temp[key] = value2;
        isDifferent = true;
      }
    }
  }
  return isDifferent ? temp : undefined;
};
