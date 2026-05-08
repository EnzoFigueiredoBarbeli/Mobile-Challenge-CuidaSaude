import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

export function TaskCard({ task, onPress }: TaskCardProps): React.ReactElement {
  const isCompleted = task.status === TaskStatus.Completed;

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{task.icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {task.title}
        </Text>
        <Text style={styles.description}>{task.description}</Text>
        <Text style={styles.time}>⏰ {task.time}</Text>
      </View>

      <View style={styles.statusWrapper}>
        {isCompleted ? (
          <Text style={styles.checkIcon}>✅</Text>
        ) : (
          <View style={styles.unchecked} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#E8F8F5',
    opacity: 0.85,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 26,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  description: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#95A5A6',
  },
  statusWrapper: {
    marginLeft: 12,
  },
  checkIcon: {
    fontSize: 26,
  },
  unchecked: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
});
