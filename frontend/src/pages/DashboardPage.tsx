import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import { FolderKanban, Plus, Search, Bell, LogOut } from 'lucide-react'

interface Project {
    id: string
    title: string
    description: string | null
    createdAt: string
}

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [creating, setCreating] = useState (false)

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        try {
            const res = await api.get('/projects')
            setProjects(res.data)
        } catch {
            setError('Erro ao carregar projetos')
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateProjects() {
        if(!newTitle.trim()) return
        setCreating(true)
        try {
            const res = await api.post('/projects', {title: newTitle, description: newDescription})
            setProjects(prev => [res.data, ...prev])
            setShowModal(false)
            setNewTitle('')
            setNewDescription('')
        } catch {

        } finally {
            setCreating(false)
        }
    }
    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='flex flex-col h-full'>
            {/* Top bar */}
            <header className='flex items-center gap-4 px-8 py-4 border-b border-[#1a1a3e] bg-[#070714]'>
                {/* Search */}
                <div className='flex-1 relative max-w-md'>
                    <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Buscar projetos...'
                        className='w-full bg-[#0d0d2b] border border-[#1a1a3e] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors'
                    />
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 ml-auto'>
                    <button className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#0d0d2b] border border-[#1a1a3e] text-gray-400 hover:text-white transition-colors relative'>
                        <Bell size={17} />
                        <span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full' />
                    </button>

                    <div className='w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <button
                        onClick={logout}
                        className='w-9 h-9 flex items-center justify-center rounded-lg bg-[#0d0d2b] border border-[#1a1a3e] text-gray-400 hover:text-red-400 transition-colors'
                    >
                        <LogOut size={17} />
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className='flex-1 overflow-auto p-8'>
                {/* Welcome */}
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-white'>
                        Olá, {user?.name}! 👋
                    </h1>
                    <p className='text-gray-500 text-sm mt-1'>Aqui está uma visão geral dos seus projetos.</p>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-5'>
                        <p className='text-gray-500 text-sm'>Total de Projetos</p>
                        <p className='text-3xl font-bold text-white mt-1'>{projects.length}</p>
                    </div>
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-5'>
                        <p className='text-gray-500 text-sm'>Em Andamento</p>
                        <p className='text-3xl font-bold text-orange-400 mt-1'>—</p>
                    </div>
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-5'>
                        <p className='text-gray-500 text-sm'>Concluídos</p>
                        <p className='text-3xl font-bold text-purple-400 mt-1'>—</p>
                    </div>
                </div>

                {/* Projects header */}
                <div className='flex items-center justify-between mb-5'>
                    <h2 className='text-lg font-semibold text-white'>Seus Projetos</h2>
                    <button onClick = {() => setShowModal(true)} className='flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors'>
                        <Plus size={16} />
                        Novo Projeto
                    </button>
                </div>

                {/* Projects grid */}
                {loading ? (
                    <p className='text-gray-500'>Carregando...</p>
                ) : error ? (
                    <p className='text-red-400'>{error}</p>
                ) : filteredProjects.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='w-14 h-14 bg-[#0d0d2b] border border-[#1a1a3e] rounded-2xl flex items-center justify-center mb-4'>
                            <FolderKanban size={24} className='text-gray-600' />
                        </div>
                        <p className='text-gray-400 font-medium'>Nenhum projeto encontrado</p>
                        <p className='text-gray-600 text-sm mt-1'>
                            {search ? 'Tente outro termo de busca' : 'Crie seu primeiro projeto para começar'}
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredProjects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/projects/${project.id}`)}
                                className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-xl p-5 cursor-pointer hover:border-orange-500/50 transition-colors group'
                            >
                                <div className='flex items-start justify-between mb-3'>
                                    <h3 className='text-white font-semibold group-hover:text-orange-400 transition-colors'>
                                        {project.title}
                                    </h3>
                                    <span className='text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-400'>
                                        Ativo
                                    </span>
                                </div>
                                <p className='text-gray-500 text-sm line-clamp-2 mb-4'>
                                    {project.description || 'Sem descrição'}
                                </p>
                                <div className='flex items-center justify-between text-xs text-gray-600'>
                                    <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                                    <span>Ver projeto →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4'>
                    <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-2xl p-6 w-full max-w-md'>
                            <h2 className='text-white font-semibold text-lg mb-4'>Novo Projeto</h2>
                            <div className='space-y-3'>
                                <div>
                                    <label className='text-sm text-gray-400 mb-1 block'>Título</label>
                                    <input
                                        value={newTitle}
                                        onChange = {e => setNewTitle(e.target.value)}
                                        placeholder = 'Nome do projeto'
                                        className='w-full bg-[#070714] border border-[#1a1a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors'
                                        />
                                        </div>
                                        <div>
                                            <label className='text-sm text-gray-400 mb-1 block'>Descrição</label>
                                            <textarea
                                                value={newDescription}
                                                onChange={e => setNewDescription(e.target.value)}
                                                placeholder='Descrição opcional'
                                                rows={3}
                                                className='w-full bg-[#070714] border border-[#1a1a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none'
                                         />
                                    </div>       
                                </div>
                                <div className='flex gap-3 mt-6'>
                                    <button
                                    onClick={() => setShowModal(false)}
                                    className='flex-1 py-2.5 rounded-lg border border[#1a1a3e] text-gray-400 hover:text-white transition-colors text-sm'
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleCreateProjects}
                                        disabled={creating}
                                        className='flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold text-sm transition-colors'
                                        >
                                            {creating ? 'Criando...' : 'Criar Projeto'}
                                        </button>
                            </div>
                    </div>
                </div>
            )}
        </div>
    )
}
