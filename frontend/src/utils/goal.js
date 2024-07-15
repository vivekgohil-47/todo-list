export const calculateProgress = (tasks, doneTasks) => {
  return (doneTasks / tasks) * 100;
};
