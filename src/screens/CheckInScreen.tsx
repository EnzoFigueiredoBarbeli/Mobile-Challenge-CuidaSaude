import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Task, TaskStatus, MoodValue } from '../types';
import { loadTasks, saveTasks } from '../services/storage';
import { DEFAULT_TASKS } from '../services/data';

type CheckInNavProp = NativeStackNavigationProp<RootStackParamList, 'CheckIn'>;
type CheckInRouteProp = RouteProp<RootStackParamList, 'CheckIn'>;

interface CheckInScreenProps {
  navigation: CheckInNavProp;
  route: CheckInRouteProp;
}

const MOOD_LABELS: Record<MoodValue, string> = {
  [MoodValue.VeryGood]: '😊 Muito Bem',
  [MoodValue.Good]: '🙂 Bem',
  [MoodValue.Neutral]: '😐 Neutro',
  [MoodValue.NotGood]: '😔 Não Muito Bem',
  [MoodValue.Bad]: '😢 Mal',
};

export default function CheckInScreen({ route, navigation }: CheckInScreenProps): React.ReactElement {
  const { task } = route.params;

  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [mood, setMood] = useState<MoodValue>(MoodValue.Neutral);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function handleConfirm(): Promise<void> {
    if (!selectedStatus) {
      Alert.alert('Atenção', 'Por favor, selecione se você completou a tarefa.');
      return;
    }

    if (selectedStatus === TaskStatus.NotCompleted && !feedback.trim()) {
      Alert.alert('Conte-nos mais', 'Gostaríamos de saber o que aconteceu.');
      return;
    }

    setIsSaving(true);

    try {
      const saved = await loadTasks();
      const tasks: Task[] = saved ?? DEFAULT_TASKS;

      const updated = tasks.map((t) =>
        t.id === task.id
          ? { ...t, status: selectedStatus, feedback: feedback.trim(), mood }
          : t,
      );

      await saveTasks(updated);

      const title =
        selectedStatus === TaskStatus.Completed
          ? '🎉 Muito bem!'
          : '💙 Tudo bem!';
      const message =
        selectedStatus === TaskStatus.Completed
          ? 'Parabéns por completar esta tarefa! Continue assim!'
          : 'Obrigado por compartilhar. Amanhã é um novo dia!';

      Alert.alert(title, message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.warn('Erro ao salvar check-in:', error);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header da tarefa */}
      <View style={styles.taskHeader}>
        <Text style={styles.taskIcon}>{task.icon}</Text>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
        <Text style={styles.taskTime}>⏰ Horário: {task.time}</Text>
      </View>

      {/* Seleção de status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como foi?</Text>
        <Text style={styles.cardSubtitle}>Conte-nos sobre esta tarefa</Text>

        <View style={styles.statusRow}>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              selectedStatus === TaskStatus.Completed && styles.statusBtnActive,
            ]}
            onPress={() => setSelectedStatus(TaskStatus.Completed)}
            activeOpacity={0.7}
          >
            <Text style={styles.statusIcon}>✅</Text>
            <Text
              style={[
                styles.statusLabel,
                selectedStatus === TaskStatus.Completed && styles.statusLabelActive,
              ]}
            >
              Feito!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusBtn,
              selectedStatus === TaskStatus.NotCompleted && styles.statusBtnActive,
            ]}
            onPress={() => setSelectedStatus(TaskStatus.NotCompleted)}
            activeOpacity={0.7}
          >
            <Text style={styles.statusIcon}>❌</Text>
            <Text
              style={[
                styles.statusLabel,
                selectedStatus === TaskStatus.NotCompleted && styles.statusLabelActive,
              ]}
            >
              Não Feito
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feedback textual */}
      {selectedStatus !== null && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {selectedStatus === TaskStatus.NotCompleted
              ? 'O que houve?'
              : 'Como você se sentiu?'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {selectedStatus === TaskStatus.NotCompleted
              ? 'Compartilhe para que possamos ajudá-lo melhor'
              : 'Sua opinião nos ajuda a melhorar'}
          </Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder={
              selectedStatus === TaskStatus.NotCompleted
                ? 'Ex: Estava cansado, esqueci o horário...'
                : 'Ex: Me senti bem, foi tranquilo...'
            }
            placeholderTextColor="#999"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      )}

      {/* Humor */}
      {selectedStatus !== null && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seu humor agora</Text>
          <View style={styles.pickerWrapper}>
            <Picker<MoodValue>
              selectedValue={mood}
              onValueChange={(value: MoodValue) => setMood(value)}
              style={styles.picker}
            >
              {(Object.entries(MOOD_LABELS) as [MoodValue, string][]).map(([value, label]) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Botão confirmar */}
      <TouchableOpacity
        style={[styles.submitBtn, isSaving && styles.submitBtnDisabled]}
        onPress={handleConfirm}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitBtnText}>Confirmar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  taskHeader: {
    backgroundColor: '#4A90E2',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  taskIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#E8F4F8',
    marginBottom: 8,
  },
  taskTime: {
    fontSize: 14,
    color: '#D5E8F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  statusBtnActive: {
    backgroundColor: '#E8F4F8',
    borderColor: '#4A90E2',
  },
  statusIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  statusLabelActive: {
    color: '#4A90E2',
  },
  feedbackInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerWrapper: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitBtn: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: '#A0C4F1',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 32,
  },
});
