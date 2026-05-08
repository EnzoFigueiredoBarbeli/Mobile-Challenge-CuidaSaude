import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HistoryEntry, HistoryPeriod } from '../types';
import { loadHistory, saveHistory } from '../services/storage';
import { DEFAULT_HISTORY_DATA } from '../services/data';
import { LoadingOverlay } from '../components/LoadingOverlay';

const PERIOD_LABELS: Record<HistoryPeriod, string> = {
  [HistoryPeriod.Week]: 'Última Semana',
  [HistoryPeriod.Month]: 'Último Mês',
  [HistoryPeriod.Quarter]: 'Últimos 3 Meses',
};

export default function HistoryScreen(): React.ReactElement {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [period, setPeriod] = useState<HistoryPeriod>(HistoryPeriod.Week);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHistory(): Promise<void> {
      try {
        const saved = await loadHistory();
        if (saved && saved.length > 0) {
          setHistory(saved);
        } else {
          setHistory(DEFAULT_HISTORY_DATA);
          await saveHistory(DEFAULT_HISTORY_DATA);
        }
      } catch (error) {
        console.warn('Erro ao carregar histórico:', error);
        setHistory(DEFAULT_HISTORY_DATA);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const totalCompleted = history.reduce((sum: number, d: HistoryEntry) => sum + d.completedTasks, 0);
  const totalTasks = history.reduce((sum: number, d: HistoryEntry) => sum + d.totalTasks, 0);
  const avgPct = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  function renderHeader(): React.ReactElement {
    return (
      <>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>Seu Histórico</Text>
          <Text style={styles.subtitleText}>Acompanhe sua evolução</Text>
        </View>

        {/* Filtro de período */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Período:</Text>
          <View style={styles.pickerWrapper}>
            <Picker<HistoryPeriod>
              selectedValue={period}
              onValueChange={(value: HistoryPeriod) => setPeriod(value)}
              style={styles.picker}
            >
              {(Object.entries(PERIOD_LABELS) as [HistoryPeriod, string][]).map(
                ([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ),
              )}
            </Picker>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estatísticas do Período</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{avgPct}%</Text>
              <Text style={styles.statLabel}>Taxa de{'\n'}Conclusão</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Tarefas{'\n'}Completas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>Dias{'\n'}Ativos</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Histórico Detalhado</Text>
      </>
    );
  }

  function renderEntry({ item }: ListRenderItemInfo<HistoryEntry>): React.ReactElement {
    const pct = item.totalTasks > 0
      ? (item.completedTasks / item.totalTasks) * 100
      : 0;

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyDate}>{item.date}</Text>
          <Text style={styles.historyMood}>{item.mood}</Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {item.completedTasks}/{item.totalTasks} tarefas
        </Text>

        {!!item.notes && (
          <Text style={styles.notes}>💬 {item.notes}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Carregando histórico..." />

      <FlatList<HistoryEntry>
        data={history}
        keyExtractor={(item: HistoryEntry) => item.id}
        renderItem={renderEntry}
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
  titleBlock: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  statsCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E8F4F8',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  historyMood: {
    fontSize: 24,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  notes: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
