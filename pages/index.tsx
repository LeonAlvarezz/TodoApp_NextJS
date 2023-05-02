import Head from 'next/head';
import Image from 'next/image';
import { Nunito_Sans } from 'next/font/google';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import Tasks from '../component/tasks';
import Input from '../component/input';
import firestore from '../component/input';
import { db } from '../util/config';
import { v4 as uuid } from 'uuid';
import {addTodoInDB, updateTodoInDB, deleteTodoInDB, updateCheckBoxInDB} from "./api/database"

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  QueryDocumentSnapshot,
  DocumentData,
  onSnapshot,
} from 'firebase/firestore';

const nunitoSans = Nunito_Sans({
  weight: '400',
  subsets: ['latin'],
});

type EditTodo = {
  id?: string;
  title?: string;
};

type Todo = {
  id: string;
  title: string;
  completed?: boolean;
};

export default function Home() {
  const [newItem, setNewItem] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<EditTodo>({});
  const [filterTodo, setFilterTodo] = useState<Todo[]>([]);
  const [updateQuery, setUpdateQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTodos = async () => {
    const querySnapshot = await getDocs(collection(db, 'todos'));
    const todos = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
      };
    });
    setTodos(todos);
  };

  //Update the searchQuery everytime EditTodo got updated
  useEffect(() => {
    setUpdateQuery(editTodo.title || '');
  }, [editTodo]);

  //Update FilterTodo everytime newItem got updated and filter out all irrelevant word
  useEffect(() => {
    setFilterTodo((currentFilter) => {
      return todos.filter((todo) =>
        todo.title.toLowerCase().includes(newItem.toLowerCase())
      );
    });
  }, [newItem]);
  

  //When first load the page pull the data from api
  useEffect(() => {
    fetchTodos();
  }, []);

  //When User Submit their Todo Task
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newItem.trim()) {
      alert('Tasks Cannot Be Empty');
      return;
    }
    
    if (
      todos.some((todo) => todo.title.toLowerCase().trim() === newItem.toLowerCase().trim())
      ) {
        alert('Task Cannot Be Duplicate');
        return;
      }
      
    setIsLoading(true)
    try {
      const newTodo:Todo = { id: uuid(), title: newItem.trim(), completed: false };
      addTodoInDB(newTodo);
      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (err) {
      console.log(err);
    } finally
    {
      fetchTodos();
      setIsLoading(false)
      setNewItem('');
    }
    }

  //When clicked prevent the default refresh page and update the data
  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!updateQuery.trim()) {
      alert('Tasks Cannot Be Empty');
      return;
    }

    if (todos.some((todo) => todo.title.trim() === updateQuery.trim())) {
      alert('Task Cannot Be Duplicate');
      return;
    }
    if (editTodo && editTodo.id) {
      setIsLoading(true)
      try {
        updateTodoInDB(editTodo.id, updateQuery);
      } catch (error) {
        console.log(error)
      } finally
      {
        // setTodos((currentTodos) => {
        //   return currentTodos.map((todo) => {
        //     if (todo.id === editTodo.id) {
        //       return { ...todo, title: updateQuery };
        //     }
        //     return todo;
        //   })
        //   });
          fetchTodos();
          setNewItem('');
          setEditTodo({});
          setIsLoading(false);
      }

    }
  };

  //Update the input field everytime the user input text
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItem(event.target.value);
  };

  //Update the input field everytime the user input edit
  const handleUpdateQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdateQuery(event.target.value);
  };
  //Update the checkbox when being checked and update the completed to true
  const handleCheckBox = async (id: string, completed: boolean) => {
    setIsLoading(true)
    try {
      console.log(id)
      updateCheckBoxInDB(id, completed)
    } catch (err) {
      console.log(err);
    } finally
    {
      setTodos(currentTodos => {
        return currentTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: completed };
          }
          return todo;
        })
      });
      setIsLoading(false)
    }
  };

  //Delete Todo and Update api
  const deleteTodo = async (id: string) => {
    setIsLoading(true)
    try {
      deleteTodoInDB(id);
    } catch (err) {
      console.log(err);
    } finally
    {
      setTodos((currentTodos) => {
        const newTodos = currentTodos.filter((todo) => todo.id !== id);
        return newTodos;
      });
      setIsLoading(false)
    }
  };

  function StoreTodoIntoInput(id: string) {
    const editTodo = todos.find((todo) => todo.id === id);

    setEditTodo((currentEdit) =>
      editTodo ? { ...currentEdit, ...editTodo } : currentEdit
    );
    setUpdateQuery(editTodo?.title ?? '');
  }

  return (
    <>
      <Head>
        <title>To do list</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main_container} ${nunitoSans.className}`}>
        <div className={styles.container}>
          <h1>To do list</h1>
          {isLoading && <div>Loading...</div>}
          <Tasks
            newItem={newItem}
            todos={todos}
            deleteTodo={deleteTodo}
            handleCheckBox={handleCheckBox}
            StoreTodoIntoInput={StoreTodoIntoInput}
            filterTodo={filterTodo}
          />
          <div className={styles.emptyFilter}>
            {filterTodo.length === 0 && newItem.length > 0 ? (
              <h4>No result. Create a new one instead!</h4>
            ) : null}
          </div>
          <Input
            editTodo={editTodo}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            newItem={newItem}
            handleUpdate={handleUpdate}
            updateQuery={updateQuery}
            handleUpdateQuery={handleUpdateQuery}
          />
        </div>
      </main>
    </>
  );
}
