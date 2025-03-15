import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
// import { Badge } from "./styles";
import useEditField from "../hooks/useEditField";
import { Task as ITask, TaskWithStatus } from "../../models/tasks";

interface Props {
  statusId: string;
  task?: ITask;
  index: number;
  autoFocus?: boolean;
  draggable?: boolean;
  showAddTask?: boolean;
  editTask: (task: Partial<ITask>) => void;
  createTask: (task: Partial<TaskWithStatus>) => void;
  deleteTask: ({ id }: { id: string }) => void;
}

const Task: React.FC<Props> = ({
  statusId,
  task,
  index,
  draggable = true,
  autoFocus = false,
  showAddTask = false,
  createTask,
  deleteTask,
  editTask,
}) => {
  const {
    field,
    isEditing,
    setIsEditing,
    setField,
    inputRef,
    handleBlur,
    handleChange,
    onKeyPressed,
  } = useEditField({
    autoFocus,
    fieldId: task?.id,
    onCreate: (field) =>
      createTask({
        statusId,
        content: field,
      }),
    onEdit: (id, field) =>
      editTask({
        id: id,
        content: field,
      }),
  });

  useEffect(() => {
    if (autoFocus && inputRef?.current) inputRef?.current?.focus();
  }, [autoFocus, inputRef]);

  const renderEdittingInput = () => {
    return (
      <input
        onBlur={handleBlur}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        ref={inputRef}
        value={field}
        onKeyPress={onKeyPressed}
        onChange={handleChange}
        className="w-full p-2 border rounded focus:outline-none"
        placeholder="Task Name"
      />
    );
  };

  const renderTaskContent = ({
    dragHandleProps = {},
  }: {
    dragHandleProps?: any;
    draggableProps?: any;
  }) => {
    return (
      <div className="flex justify-between">
        <div
          className="p-2 flex-1 flex justify-between flex-col"
          {...dragHandleProps}
        >
          {isEditing || autoFocus ? (
            renderEdittingInput()
          ) : (
            <span className="text-sm select-none">{task?.content}</span>
          )}
          {task?.priority && task?.priority !== "none" && (
            <div className="pt-2">
              {/* <Badge className="select-none" priority={task.priority}> */}
              {task.priority}
              {/* </Badge> */}
            </div>
          )}
        </div>
        <div className="p-2 flex justify-start">
          {renderMenu()}
        </div>
      </div>
    );
  };

  const renderMenu = () => {
    return (
      <div className="relative">
        <button
          className="p-1 rounded hover:bg-gray-200"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={(e: any) => {
                e.stopPropagation();
                setIsEditing(true);
                setField(task?.content || "");
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Rename
            </button>
            {task?.id && (
              <button
                onClick={() => deleteTask({ id: task.id })}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Draggable
      draggableId={task?.id || "test"}
      index={index}
      isDragDisabled={!draggable}
    >
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <div
          className="flex flex-col mb-2 shadow-md rounded-md bg-white dark:bg-gray-800"
          onClick={() => console.log("Open Modal")}
          {...draggableProps}
          ref={innerRef}
        >
          {renderTaskContent({
            dragHandleProps,
          })}
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(Task);