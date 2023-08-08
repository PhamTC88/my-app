import React, {useRef, useEffect, useState} from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import {nanoid} from "nanoid";
import Login from "./components/Login/Login";
import useToken from "./useToken";
const baseUrl = 'http://localhost:3000';
const url = `${baseUrl}/api/v1/ToDoList`;


function usePrevious(value){
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

// function setToken(userToken) {
//   sessionStorage.setItem('token', JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem('token');
//   // const userToken = JSON.parse(tokenString);
//   // return userToken?.token;
//   return tokenString;
// }

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`${url}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          setTasks(data);
        })
  }, []);

  function addTask(name) {
    // alert(name);
    const newTask = {id: `todo-${nanoid()}`, name, completed: false};    
    fetch(`${url}/insert`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    });
    setTasks([...tasks, newTask]);
  }

  // const taskList = props.tasks?.map((task) => task.name);
  const taskList = tasks.filter(FILTER_MAP[filter]).map((task) => (
    <Todo 
      name={task.name} 
      completed={task.completed} 
      id={task.id}
      key={task.id} 
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      key={name} 
      name={name} 
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function toggleTaskCompleted(id) {
    // console.log(tasks[0]);
    const updatedTasks = tasks.map((task) => {
      //if this task has the same ID as the edited task
      if(id === task.id) {
        //use object spread to make a new object
        //whose `completed` prop has been inverted
        fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id:task.id, name: task.name, completed: !task.completed})
        });
        return {...task, completed: !task.completed};
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    // console.log(id);
    // const remainingTasks = tasks.filter((task) => id !== task.id);
    // setTasks(remainingTasks);
    fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      const remainingTasks = tasks.filter((task) => id !== task.id);
      setTasks(remainingTasks);
    });
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      //if this task has the same ID as the edited task
      if(id === task.id) {
        //
        fetch(`${url}/${id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id:task.id, name: newName, completed: task.completed})
        });
        return {...task, name: newName};
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if(tasks.length - prevTaskLength === -1){
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  // const [token, setToken] = useState();
  // const token = getToken();
  const { token, setToken } = useToken();
  if(!token) {
    return <Login setToken={setToken} />
  }

  function handleLogout(){
    setToken();
    sessionStorage.clear();
  }

  return (    
    <div className="todoapp stack-large">
      <h1>Todo List</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
      <button className="btn btn__primary" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
