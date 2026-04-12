import {useState, useEffect} from 'react' 
import {useParams, useNavigate} from 'react-router-dom'
import api from '../api/axios'
import {ArrowLeft} from 'lucide-react'

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

    useEffect(() => {
        fetchData()

    },[])

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
                        <p className='text-gray-600 text-sm'>Em breve...</p>
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
                        <p className='text-gray-600 text-sm'>Em breve...</p>
                    </div>
                </div>
            )}
        </div>
    )
}