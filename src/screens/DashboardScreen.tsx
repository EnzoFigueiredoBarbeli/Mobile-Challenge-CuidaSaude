import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Task, TaskStatus } from '../types';
import { DEFAULT_TASKS } from '../services/data';
import { loadTasks, saveTasks } from '../services/storage';
import { TaskCard } from '../components/TaskCard';
import { LoadingOverlay } from '../components/LoadingOverlay';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

interface DashboardScreenProps {
  navigation: DashboardNavProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps): React.ReactElement {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carrega tarefas do AsyncStorage ao montar e ao voltar do CheckIn
  useFocusEffect(
    useCallback(() => {
      async function fetchTasks(): Promise<void> {
        try {
          const saved = await loadTasks();
          setTasks(saved ?? DEFAULT_TASKS);
        } catch (error) {
          console.warn('Erro ao carregar tarefas:', error);
          setTasks(DEFAULT_TASKS);
        } finally {
          setIsLoading(false);
        }
      }
      fetchTasks();
    }, []),
  );

  // Persiste tarefas sempre que mudam
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks).catch((err: unknown) => console.warn('Erro ao salvar tarefas:', err));
    }
  }, [tasks]);

  const completedCount = tasks.filter((t: Task) => t.status === TaskStatus.Completed).length;
  const total = tasks.length;
  const progressPct = total > 0 ? (completedCount / total) * 100 : 0;

  function renderHeader(): React.ReactElement {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Seu Progresso Hoje</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} de {total} tarefas concluídas
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Suas Tarefas de Hoje</Text>
      </>
    );
  }

  function renderTask({ item }: ListRenderItemInfo<Task>): React.ReactElement {
    return (
      <TaskCard
        task={item}
        onPress={() => navigation.navigate('CheckIn', { task: item })}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Carregando tarefas..." />

      <FlatList<Task>
        data={tasks}
        keyExtractor={(item: Task) => String(item.id)}
        renderItem={renderTask}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  list: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
});
