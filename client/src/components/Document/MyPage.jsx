import ExportTasksPreview from "./components/Document/ExportTasksPreview";

const MyPage = () => {
  const tasks = [
    {
      assign: { firstName: "John", lastName: "Doe", role: "Teacher" },
      title: "Prepare ballots",
      status: "In Progress",
    },
    {
      assign: { firstName: "Jane", lastName: "Smith", role: "Student Leader" },
      title: "Verify voter list",
      status: "Pending",
    },
  ];

  return (
    <div className="p-5">
      <ExportTasksPreview tasks={tasks} />
    </div>
  );
};

export default MyPage;
