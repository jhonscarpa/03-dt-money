import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface IPropsTransactions {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

interface IPropsCreateTransaction {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface IPropsTransactionsContext {
  transactions: IPropsTransactions[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: IPropsCreateTransaction) => Promise<void>
}

export const TransactionsContext = createContext<IPropsTransactionsContext>(
  {} as IPropsTransactionsContext,
)

interface IPropsTransactionsProvider {
  children: ReactNode
}

export function TransactionsProvider({ children }: IPropsTransactionsProvider) {
  const [transactions, setTransactions] = useState<IPropsTransactions[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: IPropsCreateTransaction) => {
      const { category, type, description, price } = data
      const response = await api.post('/transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date(),
      })
      setTransactions((state) => {
        return [response.data, ...state]
      })
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
