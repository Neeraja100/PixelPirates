import TransactionTable from "./TransactionTable.jsx";

export default function LedgerView({ transactions, loading, onSaveTransactions }) {
  return (
    <div className="fade-up">
      <div style={{ marginBottom: "2rem" }}>
        <p className="overline mb-2">Immutable Record</p>
        <h1 className="font-manrope" style={{ fontSize: "2.25rem", fontWeight: 700, color: "#e5e2e1", letterSpacing: "0.01em" }}>
          The <span className="gradient-text">Ledger</span>
        </h1>
        <p className="font-inter mt-2" style={{ color: "#988ca0", fontSize: "0.9375rem" }}>
          Raw transactional history. Edits to this ledger instantly reshape your reflection.
        </p>
      </div>
      
      <TransactionTable 
         transactions={transactions} 
         onSave={onSaveTransactions} 
         loading={loading} 
      />
    </div>
  );
}
