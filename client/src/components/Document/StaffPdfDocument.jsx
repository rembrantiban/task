import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  heading: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  table: {
    display: "table",
    width: "auto",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: 'bold',
  },
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
    padding: 5,
    width: "35%",
      textAlign: "left", 
  },
});

const AssignedTasksPdf = ({ tasks }) => {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const safeText = (value, fallback = '') =>
    typeof value === 'string' ? value.trim() : fallback;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Assigned Tasks</Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Position</Text>
            <Text style={styles.cell}>Status</Text>
          </View>

          {safeTasks.map((task, index) => (
            <View key={task._id || index} style={styles.row}>
              <Text style={styles.cell}>
                {safeText(task.assign?.firstName) + ' ' + safeText(task.assign?.lastName)}
              </Text>
              <Text style={styles.cell}>{safeText(task.assign?.role, 'N/A')}</Text>
              <Text style={styles.cell}>{safeText(task.status, 'N/A')}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default AssignedTasksPdf;
