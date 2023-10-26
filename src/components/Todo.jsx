import React, { useEffect, useRef, useState } from 'react'

import { FiMinus } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { GoCheck } from "react-icons/go"

import { v4 } from 'uuid';

// 42 max символ or 40

export const Todo = () => {
    const [todo, setTodo] = useState(JSON.parse(localStorage.getItem('Todo')) || []);
    const [todoAdd, setTodoAdd] = useState('');
    const [todoEdit, setTodoEdit] = useState(true);
    const [isMaxChars, setIsMaxChars] = useState(false);
    const [isEditItem, setIsEditItem] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const json = JSON.stringify(todo)
        localStorage.setItem('Todo', json)
    }, [todo]);

    const todoInput = (e) => {
        setTodoAdd(e.target.value);
        if (todoAdd.length >= 30) {
            setIsMaxChars(true);
        } else {
            setIsMaxChars(false);
        };
    };

    const inputStyle = {
        border: todoAdd.length > 30 ? '1px solid #ff0000' : '1px solid #ccc',
    };

    const buttonTodoAdd = (e) => {
        e.preventDefault();
        setTodoEdit(true);

        if (todoAdd) {
            const newTodo = {
                id: v4(),
                text: todoAdd,
                completed: false,
                // time: new Date(),
            };
            setTodo([...todo, newTodo]);
            setTodoAdd('');
        };
    };

    const editTask = (todo) => {
        setIsEditItem(todo.id);
        setTodoAdd(todo.text);
        setTodoEdit(false);
    };

    const buttonTodoEdit = (e) => {
        setTodo((obj) => 
            obj.map((task) => 
                task.id === isEditItem ? {...task, text: todoAdd } : task
            )
        );
        setIsEditItem(null);
        setTodoEdit(true);
        setTodoAdd('');
    };

    const deleteTask = (id) => {
        setTodo(todo.filter(todo => todo.id !== id));
        
        setTodoAdd('');
        setTodoEdit(true);
    };

    const checkbox = (id) => {
        setTodo((completeTodo) => 
            completeTodo.map((task) => 
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className='task_block container'>
            <div className='task_block-inner'>
                <div className='task-input'>
                    <input ref={inputRef} className='input_task-add' type='text' value={todoAdd} onChange={todoInput} style={inputStyle} placeholder='Добавить заметку'/>
                    {todoEdit ? 
                        <button className='input-svg' disabled={todoAdd.length > 30} onClick={buttonTodoAdd}><svg className='input--svg__add' id="Layer_1" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28,14H18V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v10H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h10v10c0,1.104,0.896,2,2,2  s2-0.896,2-2V18h10c1.104,0,2-0.896,2-2S29.104,14,28,14z"/></svg></button>
                        :
                        <button className='input-svg' disabled={todoAdd.length > 30} onClick={buttonTodoEdit}><svg className='input--svg__add edit' viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg></button>
                    }
                    <span>символов {todoAdd.length} / 30</span>
                </div>
                {todo.length === 0 ? <div className='todo-empty'><h2>В ваши заметках пока пусто</h2><p style={{cursor: 'pointer'}} onClick={() => inputRef.current.focus()}>Создать заметку</p></div> : (
                <div className='main_todo'>
                    <div className='todo_inner'>
                    <div className='todo_header'>
                        <div className='todo_header-inner'>
                            <ul className='header_list'>
                                <li className='header_list-item'>Done</li>
                                <li className='header_list-item'>The note</li>
                                <li className='header_list-item'>Manage notes</li>
                            </ul>
                        </div>
                    </div>
                        <ul className='todo_list'>
                        {
                            todo.map((todo) => (
                            <li className='todo_list-item' key={todo.id}>
                                <div className='todo_list-inner'>
                                    <div className='todo-done'>
                                        <button  className='button_todo-done' onClick={() => checkbox(todo.id)}><GoCheck /></button>
                                    </div>
                                    <p style={todo.completed === true ? {textDecoration: 'line-through'} : {textDecoration: 'none'}}>{todo.text}</p>
                                    <div className='todo__option'>
                                        <span>
                                            <button className='button_edit-todo' onClick={() => editTask(todo)}>
                                                <BiEdit />
                                            </button>
                                        </span>
                                        <span>
                                            <button className='button_delete-todo' onClick={() => deleteTask(todo.id)} >
                                                <FiMinus/>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}
