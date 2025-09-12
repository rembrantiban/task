import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 15, fontWeight: "bold" },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold" },
});

const AssignedTasksPdf = ({ tasks }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Staff List</Text>

      {tasks.map((user, index) => (
        <View key={user._id} style={styles.section}>
          <Text>
            <Text style={styles.label}>{index + 1}.</Text>{" "}
            {user.firstName} {user.lastName} — {user.role}
          </Text>
          <Text>Email: {user.email}</Text>
          <Text>Phone: {user.phone}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default AssignedTasksPdf;
