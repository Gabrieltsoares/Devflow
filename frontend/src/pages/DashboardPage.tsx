import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'


interface Project {
    id: string
    title: string
    description: string | null
    createdAt: string
}

export default function DashboardPage() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        try{
            const res = await api.get('/projects')
            setProjects(res.data)
        }catch {
            setError("Erro ao carregar projetos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-950 text-white'>
            <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
                <h1 className='text-xl font-bold text-white'>
                    Dev<span className='text-purple-500'>Flow</span>
                </h1>
                <div className='flex items-center gap-4'>
                    <span className='text-gray-400 text-sm'>
                        Olá, {user?.name}
                    </span>
                    <button onClick={logout} className='text-sm text-gray-400 hover:text-red-400 transition-colors'>
                        Sair
                    </button>
                </div>
            </nav>
            <main className='max-w-6xl mx-auto px-6 py-7'>
                <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-2xl font-bold text-white'>Seus Projetos</h2>
                    <button className='bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors'>
                        + Novo Projeto
                    </button>
                </div>
            </main>
        </div>
    )
}