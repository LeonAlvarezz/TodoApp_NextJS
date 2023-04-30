import React, { useState, ChangeEvent, FormEvent} from "react";

import styles from '@/styles/Home.module.css'


type Todo = {
  id: string;
  title: string;
  completed?: boolean;
}


type Props = {
  todos: Todo[];
  newItem: string;
  handleCheckBox: (id:string, completed:boolean) => void;
  deleteTodo: (id:string) => void;
  StoreTodoIntoInput: (id:string) => void;
  filterTodo: Todo[];
}

export default function Tasks({todos, newItem, handleCheckBox, deleteTodo, StoreTodoIntoInput, filterTodo}: Props) {
  const renderTask = newItem === '' ? todos : filterTodo;
  return (
    <>
        <div className={styles.task_list}>
            {renderTask.map(todo => {
              return (
                <ul key={todo.id}>
                  <div className={styles.task_list_action}>     
                      <div className={styles.task_label}>
                        <label>
                        <input type="checkbox" name="task_completed"
                        checked={todo.completed}
                        onChange = {e => handleCheckBox(todo.id, e.target.checked)}/>
                          <span className={styles.task_name}>{todo.title}</span>
                      </label>
                      </div>         
                      <div className={styles.btn_group}>
                          <button className={styles.btn_delete} onClick = {() => deleteTodo(todo.id)}>Delete</button>
                          <button className={styles.btn_edit} onClick = {() => StoreTodoIntoInput(todo.id)}>Edit</button>
                      </div>
                  </div>
              </ul>
              )
            })}    
        </div>
    </>
  )
}
