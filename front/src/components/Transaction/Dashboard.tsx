import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import TransactionsTable from './TransactionTable';
import SavingsTable from './SavingsTable';
import FixedPaymentsTable from './FixedPaymentsTable';
import Graphs from './Graphs';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Finance Dashboard</h1>
      <div className={styles.tables}>
        <TransactionsTable />
        <div className={styles.sideTables}>
          <Graphs />
          <SavingsTable />
          <FixedPaymentsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
