import { createContext, ReactNode, useEffect, useState } from 'react'

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
}

export const TransactionsContext = createContext<IPropsTransactionsContext>(
  {} as IPropsTransactionsContext,
)

interface IPropsTransactionsProvider {
  children: ReactNode
}

export function TransactionsProvider({ children }: IPropsTransactionsProvider) {
  const [transactions, setTransactions] = useState<IPropsTransactions[]>([])

  async function loadTransactions() {
    const response = await fetch('http://localhost:3000/transactions')
    const data = await response.json()
    setTransactions(data)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{ transactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
