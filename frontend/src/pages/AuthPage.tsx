import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios"

export default function AuthPage () {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const {login} = useAuth()

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', {email, password})
                login(res.data.token)
                navigate('/')
            }else{
                await api.post('/auth/register', {name, email, password})
                setIsLogin(true)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Algo deu errado')
        } finally{
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Dev<span className="text-purple-500">Flow</span></h1>
                    <p className="text-gray-400 mt-2">
                        {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nome</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                type="text"
                                placeholder="Seu nome"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            value = {email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="seu@email.com"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Senha</label>
                        <input
                            value = {password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Exibe o erro retornado pela API */}
                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    {/* Botão de submit: desabilitado durante o loading */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
                    >
                        {/* Texto muda conforme loading e modo atual */}
                        {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar conta'}
                    </button>
                </form>

                {/* Botão de alternância — não submete o form, só troca o modo */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-400 hover:text-purple-300 ml-1 transition-colors"
                    >
                        {isLogin ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </p>
            </div>
        </div>
    )
}