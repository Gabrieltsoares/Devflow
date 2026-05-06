import {useState, useEffect} from 'react' 
import {useParams, useNavigate} from 'react-router-dom'
import api from '../api/axios'
import {ArrowLeft, Plus, Trash2} from 'lucide-react'

interface Task {
    id: string
    title: string
    completed: boolean
    createdAt: string
}

interface Project {
    id: string
    title: string
    description: string | null
}

export default function ProjectPage (){
    const {id} = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState<Project | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [addingTask, setAddingTask] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchData() }, [])

    async function fetchData() {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(`/tasks/${id}`)
             ])
                setProject(projectRes.data)
                setTasks(tasksRes.data)
            } catch (err) {
                console.error('Erro ao carregar projeto', err)
            } finally {
                setLoading(false)
            }
        }

        async function handleCreateTask() {
            if (!newTaskTitle.trim()) return
            setAddingTask(true)
            try {
                const res = await api.post('/tasks', {title: newTaskTitle, projectId: id})
                setTasks(prev => [...prev, res.data])
                setNewTaskTitle('')

            } catch (err) {
                console.error('Erro ao criar tarefa', err)
            } finally {
                setAddingTask(false)
            }
        }
        
        async function handleToggleTask(taskId: string, completed: boolean){
            try {
                await api.patch(`/tasks/${taskId}` , {completed: !completed})
                setTasks(prev => prev.map(t => t.id === taskId ? {...t, completed: !t.completed} : t))       
            } catch (err) {
                console.error('Erro ao atualizar tarefa', err)
            }
        }

        async function handleDeleteTask( taskId: string){
            try {
                await api.delete(`/tasks/${taskId}`)
                setTasks(prev => prev.filter(t => t.id !== taskId))
            } catch (err){
                console.error('Erro ao deletar tarefa', err)
            }
        }
    return (
        <div className='p-8'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8'>
                <button
                    onClick={() => navigate('/')}
                    className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#0d0d2b] border border-[#1a1a3e] text-gray-400 hover:text-white transition-colors'
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className='text-2xl font-bold text-white'>{project?.title}</h1>
                    <p className='text-gray-500 text-sm mt-0.5'>{project?.description}</p>
                </div>
            </div>

            {/* Kanban */}
            {loading ? (
                <p className='text-gray-500'>Carregando...</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* TODO */}
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-4'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-white font-semibold text-sm'>TODO</h2>
                            <span className='text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full'>
                                {tasks.filter(t => !t.completed).length}
                            </span>
                        </div>
                        <div className='space-y-2'>
                            {tasks.filter(t => !t.completed).map(task => (
                                <div key={task.id}
                                onClick={() => handleToggleTask(task.id, task.completed)}
                                 className='bg-[#070714] border border-[#1a1a3e] rounded-lg p-3 cursor-pointer hover:border-green-500/50 transition-colors group flex items-center justify-between'>
                                    <p onClick={() => handleToggleTask(task.id, task.completed)} className='text-white text-sm flex-1'>{task.title}</p>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className='text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-2'>
                                            <Trash2 size={14}/>
                                        </button>
                                </div>
                            ))}
                        </div>
                        {newTaskTitle === '' ? (
                        <button 
                        onClick={() => setNewTaskTitle(' ')}
                        className='mt-3 w-full flex items-center justify-center gap-1 text-gray-600 hover:text-gray-400 text-sm py-2 rounded-lg hover:bg-white/5 transition-colors'>
                            <Plus size={14}/> Nova tarefa
                        </button>
                        ) : ( 
                            <div className='mt-3 space-y-2'>
                                <input
                                    autoFocus
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreateTask()}
                                    placeholder='Nome da tarefa'
                                    className='w-full bg-[#070714] border border-orange-500/50 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none'
                                    />
                                <div className=' flex gap-2'>
                                    <button
                                        onClick={handleCreateTask}
                                        disabled={addingTask}
                                        className='flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors'
                                        >
                                            {addingTask ? 'Adicionando....' : 'Adicionar'}
                                        </button>
                                        <button
                                            onClick={() => setNewTaskTitle('')}
                                            className='flex-1 border border-[#1a1a3e] text-gray-400 hover:text-white text-xs py-1.5 rounded-lg transition-colors'
                                            >
                                                Cancelar
                                                </button>
                                    </div>
                                </div>                    
                        )}   
                    </div>

                    {/* IN PROGRESS */}
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-4'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-orange-400 font-semibold text-sm'>IN PROGRESS</h2>
                            <span className='text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full'>0</span>
                        </div>
                        <p className='text-gray-600 text-sm'>Em breve...</p>
                    </div>

                    {/* DONE */}
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-4'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-green-400 font-semibold text-sm'>DONE</h2>
                            <span className='text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full'>
                                {tasks.filter(t => t.completed).length}
                            </span>
                        </div>
                        <div className='space-y-2'>
                            {tasks.filter(t => t.completed).map(task => (
                                <div
                                    key={task.id}
                                    className='bg-[#070714] border border-[#1a1a3e] rounded-lg p-3 opacity-60 hover:opacity-100 cursor-pointer hover:border-orange-500/50 transition-colors group flex items-center justify-between'
                                >
                                    <p onClick={() => handleToggleTask(task.id, task.completed)} className='text-white text-sm line-through flex-1'>{task.title}</p>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className='text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-2'
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}