export const groupMessagesByDate = (messages) => {
  const messageGroups = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    if (!messageGroups[formattedDate]) {
      messageGroups[formattedDate] = [];
    }

    messageGroups[formattedDate].push(message);
  });

  const groupedMessages = Object.values(messageGroups);
  return groupedMessages;
};
