import React, { useState, ChangeEvent, FormEvent} from "react";

import styles from '@/styles/Home.module.css'


export default function Tasks({newItem, todos, handleCheckBox, deleteTodo, StoreTodoIntoInput, filterTodo}) {
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
