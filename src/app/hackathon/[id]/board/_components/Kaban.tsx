import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import Navbar from "./Navbar";
import { useStoreState, useStoreActions } from "../models";

function Kaban() {
    const tasksByStatus = useStoreState((state) => state.tasks.tasksByStatus);
    const moveTask = useStoreActions((actions) => actions.tasks.moveTask);
    const createStatus = useStoreActions((actions) => actions.tasks.createStatus);
    const editStatus = useStoreActions((actions) => actions.tasks.editStatus);
    const editTask = useStoreActions((actions) => actions.tasks.editTask);
    const createTask = useStoreActions((actions) => actions.tasks.createTask);
    const deleteTask = useStoreActions((actions) => actions.tasks.deleteTask);

    return (
        <div className="h-full flex flex-col">
            <Navbar />
            <div className="flex-1 mt-4 flex overflow-x-scroll">
                <DragDropContext onDragEnd={moveTask}>
                    {tasksByStatus.map((status) => {
                        const column = status;
                        return (
                            <Column
                                key={column.id}
                                column={column}
                                createStatus={createStatus}
                                editStatus={editStatus}
                                editTask={editTask}
                                createTask={createTask}
                                deleteTask={deleteTask}
                            />
                        );
                    })}
                    <Column
                        key="new-column"
                        createStatus={createStatus}
                        editStatus={editStatus}
                        editTask={editTask}
                        createTask={createTask}
                        deleteTask={deleteTask}
                    />
                </DragDropContext>
            </div>
        </div>
    );
}

export default Kaban;