import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { type ReactNode } from 'react'
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings } from 'lucide-react'

interface Props {
    children: ReactNode
}

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout({ children }: Props) {
    const { user, logout } = useAuth()

    return (
        <div className='min-h-screen bg-[#070714] flex text-white'>
            <aside className='w-64 bg-[#0d0d2b] border-r border-[#1a1a3e] flex flex-col shrink-0'>
                {/* Logo */}
                <div className='px-6 py-5 border-b border-[#1a1a3e]'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                            <span className='text-white font-bold text-sm'>D</span>
                        </div>
                        <span className='text-white font-bold text-lg'>
                            Dev<span className='text-purple-400'>Flow</span>
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className='flex-1 px-3 py-4 space-y-1'>
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-orange-500/20 text-orange-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className='px-4 py-4 border-t border-[#1a1a3e]'>
                    <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0'>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-white text-sm font-medium truncate'>{user?.name}</p>
                            <p className='text-gray-500 text-xs truncate'>{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className='text-gray-500 hover:text-red-400 transition-colors text-xs shrink-0'
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </aside>

            <main className='flex-1 overflow-auto'>
                {children}
            </main>
        </div>
    )
}
