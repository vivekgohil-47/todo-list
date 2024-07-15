import { useRecoilValue } from "recoil";
import SideBar from "../components/SideBar";
import { isOpenState } from "../atoms/todoAtom";
import TodoBlock from "../components/TodoBlock";
import GoalBlock from "../components/GoalBlock";
import { useState } from "react";

const HomePage = () => {
  const isOpen = useRecoilValue(isOpenState);
  const [isDark, setIsDark] = useState(false);
  console.log("home render");

  return (
    <div className={isDark ? `dark` : ``}>
      <div className=" flex dark:bg-blue-950">
        <SideBar dark={isDark} />
        {isOpen === "TodoBlock" && <TodoBlock />}
        {isOpen === "GoalBlock" && <GoalBlock />}
      </div>
    </div>
  );
};
export default HomePage;
