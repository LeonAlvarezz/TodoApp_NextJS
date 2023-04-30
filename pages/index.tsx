import Head from 'next/head'
import Image from 'next/image'
import { Nunito_Sans } from 'next/font/google'
import React, { useState, ChangeEvent, FormEvent, useEffect} from "react";
import styles from '@/styles/Home.module.css'
import Tasks from '../component/tasks.tsx'
import Input from '../component/input.tsx'

const nunitoSans = Nunito_Sans({
  weight: '400',
  subsets: ['latin'],
})

type EditTodo = {
  id?: string;
  title?: string;
}

type Todo = {
  id: string;
  title: string;
  completed?: boolean;
}

export default function Home() {
  const [newItem, setNewItem] = useState<string>("");  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<EditTodo>({});
  const [filterTodo, setFilterTodo] = useState<Todo[]>([]);
  const [updateQuery, setUpdateQuery] = useState<string>("");

  
  //Update the searchQuery everytime EditTodo got updated
  useEffect(() => {
    setUpdateQuery(editTodo.title || '');
  }, [editTodo]);


  //Update FilterTodo everytime newItem got updated and filter out all irrelevant word
  useEffect(() => {
    setFilterTodo(currentFilter =>
    {
      return todos.filter(todo => todo.title.toLowerCase().includes(newItem.toLowerCase()))
    })
}, [newItem]);


  //When first load the page pull the data from api
  useEffect(() => {
    const fetchTodos = async () => {
      const res: Response = await fetch("/api/todo");
      const data: Todo[] = await res.json();
      console.log(data);
      setTodos(data); 
    };
    fetchTodos();
    }, []) 


  //When User Submit their Todo Task
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => 
  {
      event.preventDefault();
      if (!newItem.trim()) {
        alert("Tasks Cannot Be Empty");
        return;
      }

      if (todos.some(todo => todo.title === newItem)) {
        alert("Task Cannot Be Duplicate");
        return;
      }
      const data = { title: newItem };
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setNewItem('');
      } else {
        console.error('Failed to create todo:', res.status, await res.text());
      }  
  };

  //When user update thier TodoList
  const updateTodo = async (id:string) =>
  {
    const data = { title: updateQuery };
    const res = await fetch(`/api/todo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setTodos(currentTodos =>
        {
          return currentTodos.map(todo => {
            if(todo.id === editTodo.id){
              return {...todo, title: updateQuery }
            } 
            return todo
          })
        })
      setNewItem('');
      setEditTodo({});
    } else {
      console.error('Failed to update todo:', res.status, await res.text());
    }
  }

  //When clicked prevent the default refresh page and update the data 
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!updateQuery.trim()) {
        alert("Tasks Cannot Be Empty");
        return;
      }

      if (todos.some(todo => todo.title === updateQuery)) {
        alert("Task Cannot Be Duplicate");
        return;
      }
      if (editTodo && editTodo.id){
        updateTodo(editTodo.id)
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
const handleCheckBox = async (id:string, completed:boolean) => {
      const data = { completed: completed };
      const res = await fetch(`/api/todo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
      });
      if (res.ok) {
      setTodos(currentTodos =>
        {
          return currentTodos.map(todo => {
            if(todo.id === id){
              return {...todo, completed: completed }
            } 
            return todo
          })
      })
    } else {
      console.error('Failed to update todo:', res.status, await res.text());
    }
    }
      
  //Delete Todo and Update api
  const deleteTodo = async (id:string) =>
  {
    const res = await fetch(`/api/todo?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
        setTodos(currentTodos => {
        const newTodos = currentTodos.filter(todo => todo.id !== id);
        return newTodos;
      });
    } else {  
      console.error('Failed to create todo:', res.status, await res.text());
    }
  }
    function StoreTodoIntoInput(id:string)
    {
        const editTodo = todos.find(todo => todo.id === id);

        setEditTodo(currentEdit => editTodo ? { ...currentEdit, ...editTodo } : currentEdit);
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
       <main className={`${styles.main_container} ${nunitoSans.className}`} >
        <div className={styles.container}>
            <h1>To do list</h1>
         <Tasks newItem = {newItem} todos={todos} 
         deleteTodo={deleteTodo} handleCheckBox = {handleCheckBox} 
         StoreTodoIntoInput = {StoreTodoIntoInput} filterTodo = {filterTodo} />
        <div className = {styles.emptyFilter}>
            {filterTodo.length === 0 && newItem.length > 0 ? (<h4>No result. Create a new one instead!</h4>) : null}
        </div>  
        <Input editTodo ={editTodo} handleChange = {handleChange} 
              handleSubmit = {handleSubmit} newItem = {newItem} 
              handleUpdate = {handleUpdate} updateQuery = {updateQuery}
              handleUpdateQuery = {handleUpdateQuery}
        />
      </div>
      </main>
    </>
  )
}