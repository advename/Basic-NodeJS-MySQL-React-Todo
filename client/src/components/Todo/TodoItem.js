import React from "react";
import styles from "./Todo.module.css";

export default function TodoItem({ item, updateDoneStatus, removeTodo }) {
  return (
    <li key={item.id}>
      {item.done === 0 ? (
        <button
          onClick={() => updateDoneStatus(item.id)}
          className={`${styles.doneStatus}`}
        ></button>
      ) : (
        <button
          onClick={() => updateDoneStatus(item.id)}
          className={`${styles.doneStatus} ${styles.active}`}
        ></button>
      )}

      <div>
        <p className={styles.task}>{item.task}</p>
        <p className={styles.author}>Julianne</p>
      </div>
      <div>
        <button onClick={() => removeTodo(item.id)} className={styles.delete}>
          remove
        </button>
      </div>
    </li>
  );
}
