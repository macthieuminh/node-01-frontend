import { useEffect, useState } from "react"
import "./App.css"
import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { FaRegCircle, FaCheckCircle } from "react-icons/fa"

function App() {
    const [tasks, setTasks] = useState([])
    const [text, setText] = useState("")
    const [isUpdate, setIsUpdate] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const BASE_API = import.meta.env.VITE_BASE_API

    const getAllTask = () => {
        fetch(`${BASE_API}/api/tasks`)
            .then((res) => {
                if (!res.ok) throw new Error("Network error!")
                return res.json()
            })
            .then((data) => {
                setTasks(Array.isArray(data.data) ? data.data : [data.data])
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        getAllTask()
        bypassCORS()
    }, [])

    const addTask = (e) => {
        e.preventDefault()
        fetch(`${BASE_API}/api/tasks`, {
            method: "POST",
            body: JSON.stringify({ title: text, isCompleted: false }),
        })
            .then((res) => res.json())
            .then(() => {
                setText("")
                setIsUpdate(false)
                setUpdateId("")
                getAllTask()
            })
            .catch((err) => console.log(err))
    }

    const deleteTask = (id) => {
        fetch(`${BASE_API}/api/tasks/${id}`, {
            method: "DELETE",
        })
            .then(() => getAllTask())
            .catch((err) => console.log(err))
    }
    const toggleCompleted = (id, isCompleted) => {
        fetch(`${BASE_API}/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isCompleted: !isCompleted }),
        })
            .then(() => {
                getAllTask()
            })
            .catch((err) => console.log(err))
    }
    const updateTask = () => {
        fetch(`${BASE_API}/api/tasks/${updateId}`, {
            method: "PUT",
            body: JSON.stringify({ title: text }),
        })
            .then(() => {
                setText("")
                setIsUpdate(false)
                setUpdateId("")
                getAllTask()
            })
            .catch((err) => console.log(err))
    }

    const updateMode = (id, text) => {
        setIsUpdate(true)
        setText(text)
        setUpdateId(id)
    }

    const bypassCORS = () => {
        fetch(
            `${BASE_API}//bypass-cors?url=https://api-gateway.fullstack.edu.vn/api/analytics`
        )
            .then((res) => {
                if (!res.ok) throw new Error("Network error!")
                return res.json()
            })
            .then((data) => {
                console.log(data)
                console.log(`Bypass CORS thành công: ${data.data}`)
            })
            .catch((error) => console.log(error))
    }
    return (
        <div className="App">
            <div className="container">
                <h1>Todo App</h1>
                <div className="top">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="add" onClick={isUpdate ? updateTask : addTask}>
                        {isUpdate ? "Update" : "Add"}
                    </div>
                </div>
                <div className="list">
                    {tasks.map((task) => (
                        <div key={task.id} className="task">
                            <div
                                className="icons"
                                onClick={() =>
                                    toggleCompleted(task.id, task.isCompleted)
                                }>
                                {task.isCompleted ? (
                                    <FaCheckCircle className="icon" />
                                ) : (
                                    <FaRegCircle className="icon" />
                                )}
                            </div>
                            <div className={task.isCompleted ? "text completed" : "text"}>
                                {task.title}
                            </div>
                            <div className="icons">
                                <BiEdit
                                    className="icon"
                                    onClick={() => updateMode(task.id, task.title)}
                                />
                                <AiFillDelete
                                    className="icon"
                                    onClick={() => deleteTask(task.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default App
