import { db } from '../../util/config';
import { v4 as uuid } from 'uuid';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

type Todo = {
    id: string;
    title: string;
    completed?: boolean;
  };
const addTodoInDB = async (newTodo:Todo) => {
  try {
    await addDoc(collection(db, "todos"), {
      id: newTodo.id,
      title: newTodo.title,
      completed: newTodo.completed
    });
  } catch (err) {}
};

const deleteTodoInDB = async (id:string) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
    } catch (err) {
      console.log(err);
    }
  };


const updateTodoInDB = async (id:string, newTitle:string) => {
    try {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {
            title: newTitle,
        })
    } catch (err) {
        console.log(err);
    }
}

const updateCheckBoxInDB = async (id:string, completed:boolean)=>
{
    try {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {
          completed: completed,
        });
    } catch(err)
    {
        console.log(err)
    }
}

export {addTodoInDB, updateTodoInDB, deleteTodoInDB, updateCheckBoxInDB}