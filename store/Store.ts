import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAssigments, getTickets, getUserInfo } from '../config/routers'
import { Shift } from '../types/types'
import { Ticket } from '../types/types'

export const clearAllStores = () => {
  useProfileStore.getState().clearStore();
  useShiftsStore.getState().clearShifts();
  useTicketsStore.getState().clearTickets();
};

interface ProfileState {
  account: {
    id: string
    name: string
    lastname: string
    documentType: string
    document: string
    position: string
    departament: string
    email: string
    photo: string
  }
  isLoading: boolean
  fetchUserInfo: () => Promise<void>
  updatePhoto: (photo: string) => void
  clearStore: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      account: {
        id: '',
        name: '',
        lastname: '',
        documentType: '',
        document: '',
        position: '',
        departament: '',
        email: '',
        photo: '',
      },
      isLoading: false,
      fetchUserInfo: async () => {
        const existingAccount =get().account
        if (!existingAccount.name) {
          set({ isLoading: true })
          try {
            const response = await getUserInfo()
            if (response?.success) {
              set({
                account: {
                  id: response.data.id || '',
                  name: response.data.name || '',
                  lastname: response.data.lastname || '',
                  documentType: response.data.type_doc || '',
                  document: response.data.num_doc || '',
                  position: response.data.position || '',
                  departament: response.data.id_department || '',
                  email: response.data.email || '',
                  photo: response.data.photo || '',
                },
              })
            }
          } catch (error) {
            console.error('Error fetching user info:', error)
          } finally {
            set({ isLoading: false })
          }
        }
      },
      updatePhoto: (photo: string) => {
        set((state) => ({
          account: {
            ...state.account,
            photo,
          },
        }))
      },
      clearStore: () => {
        set({
          account: {
            id: '',
            name: '',
            lastname: '',
            documentType: '',
            document: '',
            position: '',
            departament: '',
            email: '',
            photo: '',
          },
        })
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

interface ShiftsState {
    shifts: Shift[]
    loading: boolean
    fetchShifts: () => Promise<void>
    clearShifts: () => void
  }
  
  export const useShiftsStore = create<ShiftsState>()(
    persist(
      (set,get) => ({
        shifts: [],
        loading: false,
        fetchShifts: async () => {
          if (get().shifts.length === 0) {
            set({ loading: true })
            try {
              const response = await getAssigments()
              if (response?.success) {
                set({ 
                  shifts: response.data ?? [],
                  loading: false 
                })
              }
            } catch (error) {
              console.error("Error al obtener turnos", error)
              set({ loading: false })
            }
          }
        },
        clearShifts: () => set({ shifts: [], loading: false })
      }),
      {
        name: 'shifts-storage',
        storage: createJSONStorage(() => AsyncStorage)
      }
    )
  )

  interface TicketsState {
    tickets: Ticket[]
    loading: boolean
    error: string | null
    fetchTickets: () => Promise<void>
    clearTickets: () => void
    addTicket: (ticket: Ticket) => void
  }
  
  export const useTicketsStore = create<TicketsState>()(
    persist(
      (set, get) => ({
        tickets: [],
        loading: false,
        error: null,
        fetchTickets: async () => {
          set({ loading: true, error: null });
          try {
            const response = await getTickets();
            if (response?.success) {
              set({ tickets: response.data, loading: false, error: null });
            } else {
              set({ loading: false, error: "No se pudieron cargar los tickets" });
            }
          } catch (error) {
            console.warn("Fallo en la carga de datos:", error);
            set({ loading: false, error: "Error al cargar los tickets" });
          }
        },
        
        clearTickets: () => set({ 
          tickets: [],
          loading: false,
          error: null 
        }),
        addTicket: (ticket) => set((state) => ({
          tickets: [...state.tickets, ticket]
        }))
      }),
      {
        name: 'tickets-storage',
        storage: createJSONStorage(() => AsyncStorage)
      }
    )
  )