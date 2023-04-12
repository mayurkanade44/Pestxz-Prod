import { IoBarChartSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import {
  BsDatabaseAdd,
  BsDatabaseFillAdd,
  BsBuildingAdd,
} from "react-icons/bs";
import { AiFillFileWord } from "react-icons/ai";

export const links = [
  { id: 1, text: "Dashboard", path: "/dashboard", icon: <IoBarChartSharp /> },
  { id: 2, text: "Services", path: "services", icon: <BsDatabaseAdd /> },
  { id: 6, text: "Products", path: "products", icon: <BsDatabaseFillAdd /> },
  { id: 3, text: "Add Client", path: "add-client", icon: <BsBuildingAdd /> },
  { id: 4, text: "Report", path: "report", icon: <AiFillFileWord /> },
  { id: 5, text: "Profile", path: "profile", icon: <ImProfile /> },
];

export const capitalLetter = (phrase) => {
  if (typeof phrase === "string") {
    return phrase
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    const result = phrase.map((word) => {
      const trimmedWord = word.trim();
      return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
    });
    return result;
  }
};
