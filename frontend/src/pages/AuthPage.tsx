import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login } = useAuth()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { email, password })
                login(res.data.token)
                navigate('/')
            } else {
                await api.post('/auth/register', { name, email, password })
                setIsLogin(true)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Algo deu errado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-[#070714] flex items-center justify-center px-4'>
            <div className='w-full max-w-md'>
                {/* Logo */}
                <div className='text-center mb-8'>
                    <div className='flex items-center justify-center gap-2 mb-4'>
                        <div className='w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                            <span className='text-white font-bold'>D</span>
                        </div>
                        <span className='text-white font-bold text-2xl'>
                            Dev<span className='text-purple-400'>Flow</span>
                        </span>
                    </div>
                    <h2 className='text-2xl font-bold text-white'>
                        {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                    </h2>
                    <p className='text-gray-500 text-sm mt-1'>
                        {isLogin ? 'Insira suas credenciais para continuar' : 'Preencha os dados abaixo'}
                    </p>
                </div>

                {/* Card */}
                <div className='bg-[#0d0d2b] border border-[#1a1a3e] rounded-2xl p-8'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {!isLogin && (
                            <div>
                                <label className='block text-sm text-gray-400 mb-1.5'>Nome</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    type='text'
                                    placeholder='Seu nome completo'
                                    className='w-full bg-[#070714] border border-[#1a1a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors'
                                />
                            </div>
                        )}

                        <div>
                            <label className='block text-sm text-gray-400 mb-1.5'>Email</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type='email'
                                placeholder='seu@email.com'
                                className='w-full bg-[#070714] border border-[#1a1a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors'
                            />
                        </div>

                        <div>
                            <div className='flex items-center justify-between mb-1.5'>
                                <label className='text-sm text-gray-400'>Senha</label>
                                {isLogin && (
                                    <span className='text-xs text-orange-400 hover:text-orange-300 cursor-pointer transition-colors'>
                                        Esqueceu a senha?
                                    </span>
                                )}
                            </div>
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type='password'
                                placeholder='••••••••'
                                className='w-full bg-[#070714] border border-[#1a1a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors'
                            />
                        </div>

                        {error && (
                            <p className='text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2'>
                                {error}
                            </p>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2'
                        >
                            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar conta'}
                        </button>
                    </form>

                    <p className='text-center text-gray-500 text-sm mt-6'>
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError('') }}
                            className='text-orange-400 hover:text-orange-300 ml-1 transition-colors font-medium'
                        >
                            {isLogin ? 'Cadastre-se' : 'Entrar'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
