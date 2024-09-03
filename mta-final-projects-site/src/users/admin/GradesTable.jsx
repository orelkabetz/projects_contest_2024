import React from 'react';
import styled from 'styled-components';

// Sample data and styling for the GradesManager table
const TableContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #0e3f6d;
  padding: 10px;
  border: 1px solid #ddd;
  color:#ddd
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

const GradesManager = ({ grades }) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Judge</TableHeader>
            <TableHeader>Project</TableHeader>
            <TableHeader>Grade</TableHeader>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <TableCell>{grade.judge}</TableCell>
              <TableCell>{grade.project}</TableCell>
              <TableCell>{grade.grade}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default GradesManager;
