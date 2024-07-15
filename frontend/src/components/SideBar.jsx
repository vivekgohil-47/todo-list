import todologo from "../assets/todoLogo.svg";
import goallogo from "../assets/goalLogo.svg";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isOpenState } from "../atoms/todoAtom";
import { useState } from "react";

const SideBar = ({ dark }) => {
  const [isOpen, setIsOpen] = useRecoilState(isOpenState);
  const [IsDark, setIsDark] = useState(dark);
  const handleComponentClick = (componentName) => {
    setIsOpen(componentName);
  };

  return (
    <div>
      <div className="container-box flex flex-col items-center w-[250px] border-r h-screen">
        <ul className=" m-5 flex flex-col">
          <li
            onClick={() => handleComponentClick("TodoBlock")}
            className={`font-medium text-lg cursor-pointer m-3 py-2 px-4 rounded-2xl flex hover:bg-blue-100
              ${IsDark ? " text-white" : ""}`}
          >
            <p>Todos </p> <img className=" pl-2" src={todologo} alt="" />
          </li>
          <li
            onClick={() => handleComponentClick("GoalBlock")}
            className="font-medium text-lg cursor-pointer m-3 py-2 px-4 rounded-2xl flex hover:bg-blue-100"
          >
            <p>Set goal</p>
            <img className=" pl-2" src={goallogo} alt="" />
          </li>
        </ul>
      </div>
    </div>
  );
};
export default SideBar;
