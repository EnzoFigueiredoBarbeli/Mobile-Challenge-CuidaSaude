import { Task, TaskStatus } from '../types';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 1,
    title: 'Tomar Medicamento',
    time: '08:00',
    icon: '💊',
    description: 'Tomar remédio para pressão',
    status: TaskStatus.Pending,
  },
  {
    id: 2,
    title: 'Beber Água',
    time: '10:00',
    icon: '💧',
    description: 'Beber 2 copos de água',
    status: TaskStatus.Pending,
  },
  {
    id: 3,
    title: 'Exercício Físico',
    time: '14:00',
    icon: '🏃',
    description: 'Caminhada de 30 minutos',
    status: TaskStatus.Pending,
  },
  {
    id: 4,
    title: 'Medir Pressão',
    time: '18:00',
    icon: '🩺',
    description: 'Verificar pressão arterial',
    status: TaskStatus.Pending,
  },
  {
    id: 5,
    title: 'Jantar Saudável',
    time: '19:00',
    icon: '🥗',
    description: 'Refeição balanceada',
    status: TaskStatus.Pending,
  },
];

export const DEFAULT_HISTORY_DATA = [
  {
    id: '1',
    date: '27 Nov 2025',
    completedTasks: 4,
    totalTasks: 5,
    mood: '😊',
    notes: 'Dia produtivo!',
  },
  {
    id: '2',
    date: '26 Nov 2025',
    completedTasks: 5,
    totalTasks: 5,
    mood: '🎉',
    notes: 'Completei tudo!',
  },
  {
    id: '3',
    date: '25 Nov 2025',
    completedTasks: 3,
    totalTasks: 5,
    mood: '😐',
    notes: 'Dia difícil',
  },
  {
    id: '4',
    date: '24 Nov 2025',
    completedTasks: 4,
    totalTasks: 5,
    mood: '🙂',
    notes: 'Bom progresso',
  },
  {
    id: '5',
    date: '23 Nov 2025',
    completedTasks: 5,
    totalTasks: 5,
    mood: '😊',
    notes: 'Excelente!',
  },
];
