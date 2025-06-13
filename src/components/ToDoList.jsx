import { useState, useEffect, use } from 'react';
import { Plus, Trash2, Check, ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar';

const getLocalTasks = () => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

function ToDoList({ onBack }) {
    const [tasks, setTasks] = useState(getLocalTasks);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    function handleAddTask() {
        if (newTask.trim() === '') return;
        setTasks([...tasks, {id: tasks.length +1, title: newTask, completed: false}]);
        setNewTask('');
    }

    function toggleTaskCompletion(id) {
        setTasks(tasks.map((t) => id === t.id ? {...t, completed: !t.completed} : t))}
    
    function deleteTask(taskId) {
        setTasks(tasks.filter(t => t.id !== taskId));
    }

    const completedCount = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    return(
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
            <button
                onClick={onBack}
                className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
                <ArrowLeft size={20} className="text-gray-700" />
            </button>   
            <div className="max-w-md mx-auto pt-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        To Do List
                    </h1>
                    <p className="text-gray-600">
                        {completedCount} of {totalTasks} completed
                    </p>
                    <ProgressBar completed={completedCount} total={totalTasks} />
                </div>
                <div className="space-y-3">
                {tasks.map((task, index) => (
                <div key={index} 
                className={`bg-white rounded-2xl shadow-lg p-4 backdrop-blur-sm bg-opacity-80 
                            transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-xl cursor-pointer 
                            ${task.completed ? 'opacity-75' : ''}`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                transition-all duration-300 transform hover:scale-110
                                ${task.completed 
                                    ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-400' 
                                    : 'border-gray-300 hover:border-purple-400'
                                }
                            `}
                        >
                            {task.completed && (
                                <Check size={14} className="text-white animate-bounce" />
                            )}
                        </button>
                        <span
                            className={`
                                flex-1 text-lg transition-all duration-300 cursor-pointer
                                ${task.completed 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-800 hover:text-purple-600'
                                }
                            `}
                            onClick={() => toggleTaskCompletion(task.id)}
                        >{task.title}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110 active:scale-95 p-1"
                        ><Trash2 size={18} />
                        </button>
                    </div>
                </div>
                ))}    
            </div>
            {tasks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4 animate-bounce">📝</div>
                        <p className="text-gray-500 text-lg">No tasks yet!</p>
                        <p className="text-gray-400">Add your first task above</p>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 backdrop-blur-sm bg-opacity-8 w-[30%] mt-8 mx-auto">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Add a new task"
                        value = {newTask}   
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {handleAddTask();}}}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 placeholder-gray-400"
                    />
                    <button
                        onClick={handleAddTask}
                        disabled={!newTask.trim()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
            {tasks.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-white rounded-full px-6 py-3 shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-200">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                    Total: <span className="font-bold text-purple-600">{totalTasks}</span>
                                </span>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <span className="text-gray-600">
                                    Done: <span className="font-bold text-green-600">{completedCount}</span>
                                </span>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <span className="text-gray-600">
                                    Left: <span className="font-bold text-blue-600">{totalTasks - completedCount}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

);
}

export default ToDoList;