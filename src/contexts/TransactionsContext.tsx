import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface IPropsTransactions {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

interface IPropsTransactionsContext {
  transactions: IPropsTransactions[]
  fetchTransactions: (query?: string) => Promise<void>
}

export const TransactionsContext = createContext<IPropsTransactionsContext>(
  {} as IPropsTransactionsContext,
)

interface IPropsTransactionsProvider {
  children: ReactNode
}

export function TransactionsProvider({ children }: IPropsTransactionsProvider) {
  const [transactions, setTransactions] = useState<IPropsTransactions[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', { params: { q: query } })

    setTransactions(response.data)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
