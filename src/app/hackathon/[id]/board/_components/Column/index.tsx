/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../Task";
import AddNewTaskInput from "../AddNewTaskInput";
import useEditField from "../hooks/useEditField";
import {
  TasksByStatus,
  Status,
  Task as ITask,
  TaskWithStatus,
} from "../../models/tasks";

interface Props {
  column?: TasksByStatus;
  createStatus: (status: Partial<Status>) => void;
  editStatus: (status: Partial<Status>) => void;
  createTask: (task: Partial<TaskWithStatus>) => void;
  deleteTask: ({ id }: { id: string }) => void;
  editTask: (task: Partial<ITask>) => void;
}

const Column: React.FC<Props> = ({
  column,
  createStatus,
  editStatus,
  createTask,
  deleteTask,
  editTask,
}) => {
  const tasks = column?.tasks;
  const {
    field: statusTitle,
    isEditing: isEditingGroup,
    setIsEditing: setIsEditingGroup,
    setField: setStatusTitle,
    inputRef,
    handleBlur,
    handleChange,
    onKeyPressed,
  } = useEditField({
    fieldId: column?.id,
    onCreate: (field: any) => createStatus({ title: field }),
    onEdit: (id: any, field: any) => editStatus({ id: id, title: field }),
  });

  const [isAddingNewTask, setIsAddingNewTask] = useState(false);

  const renderMenu = () => {
    return (
      <div className="relative">
        <button className="p-1 rounded hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                setIsEditingGroup(true);
                setStatusTitle(column?.title || "");
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Status Name
            </button>
            <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Remove Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEdittingInput = () => {
    return (
      <input
        onBlur={handleBlur}
        ref={inputRef}
        value={statusTitle}
        onKeyPress={onKeyPressed}
        onChange={handleChange}
        className="w-full p-2 border-none focus:outline-none"
        placeholder="Status name"
      />
    );
  };

  const renderEmptyColumnHeader = () => {
    return (
      <div className="flex mb-4 px-2 justify-between items-center">
        {isEditingGroup ? (
          renderEdittingInput()
        ) : (
          <button
            onClick={() => setIsEditingGroup(true)}
            className="flex items-center p-2 text-sm bg-transparent hover:bg-gray-200 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add a group
          </button>
        )}
      </div>
    );
  };

  const renderHeader = (columnObj: TasksByStatus) => {
    return (
      <div className="flex mb-4 px-2 justify-between items-center">
        {isEditingGroup ? (
          renderEdittingInput()
        ) : (
          <div className="text-md font-bold">{columnObj.title}</div>
        )}

        {renderMenu()}
      </div>
    );
  };

  const renderTaskList = (columnObj: TasksByStatus) => {
    return (
      <Droppable droppableId={columnObj.id}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div className="min-h-[200px]" ref={innerRef} {...droppableProps}>
            {column &&
              tasks &&
              tasks.map((task: unknown, index: number) => (
                <Task
                  statusId={column.id}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  key={task?.id}
                  task={task}
                  index={index}
                />
              ))}
            {column && isAddingNewTask && (
              <Task
                statusId={column.id}
                createTask={(args) => {
                  createTask(args);
                  setIsAddingNewTask(false);
                }}
                deleteTask={deleteTask}
                editTask={editTask}
                draggable={false}
                autoFocus
                key={`${column.id}/taks-${tasks?.length || 0}`}
                index={tasks?.length || 0}
              />
            )}
            {placeholder}

            {column && !isAddingNewTask && (
              <AddNewTaskInput
                key={`${column.id}`}
                onClick={() => setIsAddingNewTask(true)}
              />
            )}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="min-h-[60vh] min-w-[200px] w-full sm:w-1/2 md:w-[300px] p-3">
      {column ? renderHeader(column) : renderEmptyColumnHeader()}
      {column && tasks && renderTaskList(column)}
    </div>
  );
};

export default Column;