// React & Next.js
import React from "react";

// MUI
import { Box } from "@mui/material";

// バリデーションメッセージの型
interface ErrorMessageListProps {
  messages: string[];
}

const ErrorMessageList: React.FC<ErrorMessageListProps> = ({ messages }) => {
  // メッセージがない場合、表示なし
  if (messages.length === 0) {
    return null;
  }
  return (
    <Box style={{ color: "red" }}>
      <ul>
        {messages.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </Box>
  );
};

export default ErrorMessageList;
