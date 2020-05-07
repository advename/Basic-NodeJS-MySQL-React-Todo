import React, { useState, useEffect } from "react";
import styles from "./Todo.module.css";
import { useHistory } from "react-router-dom";
import TodoItem from "./TodoItem.js";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  function fetchTodos() {
    // Where we're fetching data from
    fetch(`http://localhost:8080/api/todos/`, { credentials: "include" })
      // We get the API response and receive data in JSON format...
      .then(res => res.json())
      // ...then we update the users state
      .then(data => {
        if (!Array.isArray(data)) {
          history.push("/login");
        } else {
          setTodos(data);
          setIsLoading(false);
        }
      })
      // Catch any errors we hit and update the app
      .catch(error => {
        setIsLoading(false);
        setErrors(error);
      });
  }

  function createTodo() {
    fetch(`http://localhost:8080/api/todos/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ task: newTodo }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        data.done = 0;
        let newTodos = [...todos];
        newTodos.unshift(data);
        setTodos(newTodos);
      })
      .catch(err => {
        setErrors(err);
      });
  }

  function removeTodo(id) {
    console.log(id);
    const index = todos.findIndex(x => x.id === id);
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);

    fetch(`http://localhost:8080/api/todos/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        setErrors(err);
      });
  }

  function updateDoneStatus(id) {
    console.log(id);
    const index = todos.findIndex(x => x.id === id);
    const newTodos = [...todos];
    newTodos[index].done = newTodos[index].done ? 0 : 1;
    setTodos(newTodos);

    // Update done status
    fetch(`http://localhost:8080/api/todos/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({ id: id, done: newTodos[index].done }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        setErrors(err);
      });
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <div className="container">
        <div id={styles.card}>
          {!isLoading ? (
            <React.Fragment>
              <div className={styles.createTodo}>
                <input
                  type="text"
                  placeholder="Create a task"
                  onChange={e => setNewTodo(e.target.value)}
                />
                <button onClick={createTodo}>Add</button>
              </div>

              <div className={styles.todoList}>
                <ul>
                  {todos.map(item => (
                    <TodoItem
                      key={item.id}
                      item={item}
                      removeTodo={removeTodo}
                      updateDoneStatus={updateDoneStatus}
                    />
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ) : (
            <p>Loading todos...</p>
          )}
        </div>
      </div>
    </div>
  );
}
