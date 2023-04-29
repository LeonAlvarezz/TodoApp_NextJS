import React, { useState, ChangeEvent, FormEvent} from "react";

import styles from '@/styles/Home.module.css'


export default function Input({handleUpdateQuery, updateQuery, editTodo, handleChange, handleSubmit, newItem, handleUpdate}) {

  return (
    <> 
      <div className={styles.input_tasks_container}>
          <form onSubmit = {Object.keys(editTodo).length === 0 ? handleSubmit : handleUpdate}>
              <div className={styles.input_tasks}>
                <input value={Object.keys(editTodo).length === 0 ? newItem ?? '' : updateQuery ?? ''} onChange={Object.keys(editTodo).length === 0 ?handleChange :  handleUpdateQuery} 
                type="text" placeholder="Enter Tasks..."  />
                <button className={styles.btn}>{Object.keys(editTodo).length === 0 ? 'Add' : 'Update' }</button>
              </div>    
          </form>
       </div>
    </>
  )
}
