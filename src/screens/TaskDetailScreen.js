
import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../components/BackButton';
import FooterButtons from '../components/FooterButtons';
import { TextInput } from 'react-native-gesture-handler';

export default function TaskDetailScreen({ route, navigation }) {
  const { id } = route.params || {};


  const initialState = {
    title: '',
    status: 'Pending',
    dueDate: null,
  };
  const [localstate, setLocalstate] = useState([initialState]);
  const [title, setTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTaskArray, setNewTaskArray] = useState([]);

  // Handler for title changes
  const handleTitleChange = (text) => {
    setTitle(text);
    updateLocalState(text, selectedStatus, date);
  };

  // Handler for status changes
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    updateLocalState(title, value, date);
  };

  // Handler for date changes
  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    updateLocalState(title, selectedStatus, currentDate);
  };

  // Update localstate with all values
  const updateLocalState = (newTitle, newStatus, newDate) => {
    const newTask = {
      title: newTitle,
      status: newStatus,
      dueDate: formatDate(newDate),
    };
    setLocalstate([newTask]); // Replace the array with new task
  };

  const onClickSubmit = () => {
    setNewTaskArray([...newTaskArray, ...localstate]);
    setLocalstate([initialState]);
    setTitle('');
    setSelectedStatus('Pending');
    setDate(null);
  }

  const handleRemoveTask = (index) => {
    const updatedTasks = newTaskArray.filter((_, idx) => idx !== index);
    setNewTaskArray(updatedTasks);
  }
  return (
    <View style={styles.container}>
      {/* <BackButton /> */}
      {/* <Text style={styles.title}>Task Detail</Text> */}
      <Text style={styles.label}>ID: {id}</Text>
      <Text style={styles.content}>This is a placeholder for the task detail view. You can edit title, description, due date, and more.</Text>
      {/* <Button title="Edit" onPress={() => alert('Edit flow not implemented')} /> */}
      {/* <FooterButtons onAddTask={() => alert('Add Task pressed')} onRefresh={() => alert('Refresh pressed')} /> */}
      <View style={styles.content}>
        <View style={styles.outlineButton}>
          <TextInput 
            style={styles.outlineButtonTextInput} 
            placeholder="Title"
            value={title}
            onChangeText={handleTitleChange}
          />
        </View>
        <View style={styles.outlineButton}>
          <Text style={styles.pickerLabel}>Status:</Text>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={handleStatusChange}
            style={styles.picker}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Completed" value="Completed" />
          </Picker>
        </View>
        <View style={styles.outlineButton}>
          <Text style={styles.pickerLabel}>Due Date:</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {date ? formatDate(date) : 'Select Due Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => {
            // Here you can add logic to submit the task
            onClickSubmit();
            alert('Task submitted successfully!');
            // You can also navigate back or clear the form
            // navigation.goBack();
          }}
        >
          <Text style={styles.submitButtonText}>Add Task</Text>
        </TouchableOpacity>

        {/* Task Summary Table */}
        {newTaskArray  && newTaskArray.length > 0 ? (
          <View style={styles.tableContainer}>
            <Text style={styles.tableHeader}>Task Summary</Text>
            
            {/* Table Header */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.idCell]}>S.No</Text>
              <Text style={[styles.headerCell, styles.titleCell]}>Title</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Due Date</Text>
              <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
              <Text style={[styles.headerCell, styles.actionCell]}>Remove</Text>
            </View>

            {/* Table Body */}
            {newTaskArray.map((task, index) => (
              <View key={index} style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}>
                <Text style={[styles.tableCell, styles.idCell]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.titleCell]} numberOfLines={1} ellipsizeMode="tail">{task.title || '-'}</Text>
                <Text style={[styles.tableCell, styles.dateCell]}>{task.dueDate}</Text>
                <View style={[styles.tableCell, styles.statusCell]}>
                  <View style={[
                    styles.statusBadge,
                    task.status === 'Completed' ? styles.completedBadge :
                    task.status === 'In Progress' ? styles.inProgressBadge :
                    styles.pendingBadge
                  ]}>
                    <Text style={styles.statusText}>{task.status}</Text>
                  </View>
                </View>
                <View style={[styles.tableCell, styles.actionCell]}>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveTask(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

        ):null}
        
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { color: '#6b7280', marginBottom: 12 },
  content: { marginBottom: 20, alignContent:'space-around'},
  pickerLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#374151',
  },
  dateButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 12,
    alignContent:'space-around',
  },
  outlineButtonTextInput: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    width: '75%',
  },
  submitButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    paddingHorizontal: 8,
    width: '20%', // Adjust cell widths
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    fontSize: 15,
    color: '#374151',
    paddingHorizontal: 8,
    width: '20%', // Match header cell width
  },
  // Special width adjustments for specific columns
  idCell: {
    width: '10%',
  },
  titleCell: {
    width: '30%',
  },
  dateCell: {
    width: '20%',
  },
  statusCell: {
    width: '25%',
  },
  actionCell: {
    width: '15%',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  completedBadge: {
    backgroundColor: '#DCF7E3',
  },
  inProgressBadge: {
    backgroundColor: '#E5F2FF',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
